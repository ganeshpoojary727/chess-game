/**
 * Stockfish WebAssembly & Web Worker Controller
 * Manages official single-threaded Stockfish engine lifecycle,
 * UCI handshake, difficulty mapping, evaluation streaming, and timeout protection.
 */

export const DIFFICULTY_PRESETS = {
  beginner: {
    name: 'Beginner',
    elo: 1350,
    skillLevel: 2,
    limitStrength: true,
    movetime: 400,
    description: 'Casual play with occasional human-like inaccuracies',
  },
  intermediate: {
    name: 'Intermediate',
    elo: 1600,
    skillLevel: 8,
    limitStrength: true,
    movetime: 800,
    description: 'Solid club player strength with sound positional awareness',
  },
  advanced: {
    name: 'Advanced',
    elo: 2000,
    skillLevel: 15,
    limitStrength: true,
    movetime: 1200,
    description: 'Expert candidate master with sharp tactical calculation',
  },
  master: {
    name: 'Master',
    elo: 2850,
    skillLevel: 20,
    limitStrength: false,
    movetime: 1500,
    description: 'Uncapped grandmaster calculation and evaluation',
  },
};

export class StockfishEngine {
  constructor(options = {}) {
    this.workerPath = options.workerPath || '/stockfish/stockfish.js';
    this.worker = null;
    this.isReady = false;
    this.isThinking = false;
    this.currentDifficulty = 'intermediate';

    // Callbacks & listeners
    this.onEvaluationCallback = null;
    this.onLogCallback = null;

    // Search state
    this.activeSearchPromise = null;
    this.activeSearchResolve = null;
    this.activeSearchReject = null;
    this.searchTimeoutTimer = null;

    // Active position side-to-move for perspective calculation
    this.currentSideToMove = 'w';
    this.latestEvaluation = null;

    // Pending ready listeners
    this.readyResolvers = [];
  }

  /**
   * Initialize Web Worker and execute UCI handshake
   */
  async init() {
    if (this.worker) {
      if (this.isReady) return true;
      return this.waitForReady();
    }

    return new Promise((resolve, reject) => {
      try {
        if (typeof window === 'undefined' || typeof window.Worker === 'undefined') {
          return reject(new Error('Web Workers are not supported in this environment'));
        }

        this.worker = new Worker(this.workerPath);

        this.worker.onerror = (err) => {
          console.error('[Stockfish Worker Error]', err);
          if (!this.isReady) {
            reject(new Error(`Failed to initialize Stockfish worker: ${err.message || 'Worker load error'}`));
          }
        };

        this.worker.onmessageerror = (err) => {
          console.error('[Stockfish Worker Message Error]', err);
        };

        // Handle incoming UCI lines
        this.worker.onmessage = (event) => {
          const line = typeof event.data === 'string' ? event.data.trim() : '';
          this.handleUciOutput(line);
        };

        // Handshake Step 1: Send 'uci'
        let uciOkReceived = false;

        const onUciOk = () => {
          uciOkReceived = true;
          // Handshake Step 2: Send 'isready'
          this.waitForReady().then(() => {
            this.setDifficulty(this.currentDifficulty);
            resolve(true);
          }).catch(reject);
        };

        // Temporary listener for uciok
        const tempListener = (event) => {
          const line = typeof event.data === 'string' ? event.data.trim() : '';
          if (line === 'uciok') {
            this.worker.removeEventListener('message', tempListener);
            onUciOk();
          }
        };
        this.worker.addEventListener('message', tempListener);

        // Send 'uci' command to initiate protocol
        this.sendCommand('uci');

        // Initial handshake safety timeout (8s)
        setTimeout(() => {
          if (!uciOkReceived && !this.isReady) {
            reject(new Error('Stockfish UCI handshake timed out'));
          }
        }, 8000);
      } catch (e) {
        reject(e);
      }
    });
  }

  /**
   * Await 'readyok' from engine
   */
  waitForReady() {
    return new Promise((resolve) => {
      this.readyResolvers.push(resolve);
      this.sendCommand('isready');
    });
  }

  /**
   * Internal UCI message processor
   */
  handleUciOutput(line) {
    if (!line) return;

    if (this.onLogCallback) {
      this.onLogCallback(line);
    }

    // 1. Ready acknowledgement
    if (line === 'readyok') {
      this.isReady = true;
      while (this.readyResolvers.length > 0) {
        const resolve = this.readyResolvers.shift();
        if (resolve) resolve(true);
      }
      return;
    }

    // 2. Evaluation line (info depth ... score cp/mate ...)
    if (line.startsWith('info') && line.includes('score')) {
      this.parseEvaluationLine(line);
      return;
    }

    // 3. Search Completion (bestmove ...)
    if (line.startsWith('bestmove')) {
      this.handleBestMoveLine(line);
      return;
    }
  }

  /**
   * Parse UCI info evaluation stream
   */
  parseEvaluationLine(line) {
    try {
      const depthMatch = line.match(/\bdepth (\d+)/);
      const cpMatch = line.match(/\bscore cp (-?\d+)/);
      const mateMatch = line.match(/\bscore mate (-?\d+)/);
      const pvMatch = line.match(/\bpv (.+)$/);

      const depth = depthMatch ? parseInt(depthMatch[1], 10) : 0;
      let score = null;
      let centipawns = 0;
      let isMate = false;
      let mateIn = null;

      if (mateMatch) {
        isMate = true;
        mateIn = parseInt(mateMatch[1], 10);
        // Normalize mate from White perspective
        const whitePerspectiveMate = this.currentSideToMove === 'b' ? -mateIn : mateIn;
        score = whitePerspectiveMate > 0 ? `M${whitePerspectiveMate}` : `-M${Math.abs(whitePerspectiveMate)}`;
        centipawns = whitePerspectiveMate > 0 ? 10000 : -10000;
      } else if (cpMatch) {
        const rawCp = parseInt(cpMatch[1], 10);
        // UCI reports cp relative to side to move. Convert to White's perspective (+ = White advantage)
        centipawns = this.currentSideToMove === 'b' ? -rawCp : rawCp;
        const scoreDecimal = (centipawns / 100).toFixed(1);
        score = centipawns >= 0 ? `+${scoreDecimal}` : scoreDecimal;
      }

      // Calculate winning chances % (-1 to +1 -> 0% to 100%)
      const winChance = Math.round(50 + 50 * (2 / (1 + Math.exp(-0.00368208 * centipawns)) - 1));

      const evalData = {
        depth,
        score,
        centipawns,
        isMate,
        mateIn,
        winChance: Math.min(100, Math.max(0, winChance)),
        pv: pvMatch ? pvMatch[1] : '',
      };

      this.latestEvaluation = evalData;

      if (this.onEvaluationCallback) {
        this.onEvaluationCallback(evalData);
      }
    } catch (err) {
      console.warn('Failed to parse Stockfish evaluation line:', err);
    }
  }

  /**
   * Handle 'bestmove <move>' response from engine
   */
  handleBestMoveLine(line) {
    this.isThinking = false;
    if (this.searchTimeoutTimer) {
      clearTimeout(this.searchTimeoutTimer);
      this.searchTimeoutTimer = null;
    }

    const parts = line.split(' ');
    const rawMove = parts[1];

    if (this.activeSearchResolve) {
      if (!rawMove || rawMove === '(none)') {
        this.activeSearchResolve(null);
      } else {
        const parsed = {
          from: rawMove.substring(0, 2),
          to: rawMove.substring(2, 4),
          promotion: rawMove.length > 4 ? rawMove[4] : undefined,
          raw: rawMove,
          evaluation: this.latestEvaluation,
        };
        this.activeSearchResolve(parsed);
      }
      this.activeSearchResolve = null;
      this.activeSearchReject = null;
    }
  }

  /**
   * Configure Engine Difficulty
   * @param {'beginner' | 'intermediate' | 'advanced' | 'master'} level
   */
  setDifficulty(level = 'intermediate') {
    const key = String(level).toLowerCase();
    const preset = DIFFICULTY_PRESETS[key] || DIFFICULTY_PRESETS.intermediate;
    this.currentDifficulty = key;

    this.sendCommand(`setoption name Skill Level value ${preset.skillLevel}`);
    if (preset.limitStrength) {
      this.sendCommand('setoption name UCI_LimitStrength value true');
      this.sendCommand(`setoption name UCI_Elo value ${preset.elo}`);
    } else {
      this.sendCommand('setoption name UCI_LimitStrength value false');
    }
    this.sendCommand('isready');
  }

  /**
   * Search and return the best move for a given FEN position
   * @param {string} fen
   * @param {object} options { movetime, depth, timeoutMs }
   * @returns {Promise<{ from: string, to: string, promotion?: string, raw: string, evaluation?: object }>}
   */
  async getBestMove(fen, options = {}) {
    await this.init();

    // Abort previous search if still calculating
    if (this.isThinking) {
      this.stop();
    }

    const preset = DIFFICULTY_PRESETS[this.currentDifficulty] || DIFFICULTY_PRESETS.intermediate;
    const movetime = options.movetime !== undefined ? options.movetime : preset.movetime;
    const depth = options.depth;
    const timeoutMs = options.timeoutMs || 5000;

    // Track active side to move from FEN (token 1: 'w' or 'b')
    if (fen) {
      const parts = fen.trim().split(' ');
      this.currentSideToMove = parts[1] === 'b' ? 'b' : 'w';
    }

    return new Promise((resolve, reject) => {
      this.isThinking = true;
      this.activeSearchResolve = resolve;
      this.activeSearchReject = reject;

      // Timeout safety fallback: never freeze the UI
      this.searchTimeoutTimer = setTimeout(() => {
        if (this.isThinking) {
          console.warn('[Stockfish] Search timeout exceeded; halting engine.');
          this.stop();
          if (this.activeSearchReject) {
            this.activeSearchReject(new Error('Stockfish search timed out'));
            this.activeSearchResolve = null;
            this.activeSearchReject = null;
          }
        }
      }, timeoutMs);

      // Issue UCI Position and Go
      this.sendCommand(`position fen ${fen}`);
      if (depth !== undefined) {
        this.sendCommand(`go depth ${depth}`);
      } else {
        this.sendCommand(`go movetime ${movetime}`);
      }
    });
  }

  /**
   * Evaluate a position without making a move
   */
  async evaluatePosition(fen, depth = 12) {
    await this.init();
    if (this.isThinking) {
      this.stop();
    }

    if (fen) {
      const parts = fen.trim().split(' ');
      this.currentSideToMove = parts[1] === 'b' ? 'b' : 'w';
    }

    return new Promise((resolve) => {
      const onDone = (res) => {
        resolve(res?.evaluation || this.latestEvaluation);
      };

      this.isThinking = true;
      this.activeSearchResolve = onDone;
      this.activeSearchReject = () => resolve(this.latestEvaluation);

      this.sendCommand(`position fen ${fen}`);
      this.sendCommand(`go depth ${depth}`);
    });
  }

  /**
   * Stop current calculation
   */
  stop() {
    if (this.worker) {
      this.sendCommand('stop');
    }
    this.isThinking = false;
    if (this.searchTimeoutTimer) {
      clearTimeout(this.searchTimeoutTimer);
      this.searchTimeoutTimer = null;
    }
  }

  /**
   * Send raw string command to worker
   */
  sendCommand(command) {
    if (this.worker) {
      this.worker.postMessage(command);
    }
  }

  /**
   * Subscribe to live evaluation updates
   */
  onEvaluation(callback) {
    this.onEvaluationCallback = callback;
  }

  /**
   * Clean termination of worker thread
   */
  terminate() {
    this.stop();
    if (this.worker) {
      this.sendCommand('quit');
      this.worker.terminate();
      this.worker = null;
    }
    this.isReady = false;
    this.isThinking = false;
    this.activeSearchResolve = null;
    this.activeSearchReject = null;
    this.readyResolvers = [];
  }
}
