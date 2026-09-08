import { Chess } from 'chess.js';
import openingsData from './data/openings.json' with { type: 'json' };

/**
 * Strips halfmove clock and fullmove number from a FEN string
 * to enable transposition matching across different move orders.
 */
export function normalizeFen(fen) {
  if (!fen) return '';
  const parts = fen.trim().split(' ');
  // parts[0] = piece placement
  // parts[1] = active color
  // parts[2] = castling availability
  // parts[3] = en passant square
  return parts.slice(0, 4).join(' ');
}

export class OpeningBookEngine {
  constructor() {
    this.openings = openingsData.openings || [];
    this.openingsMap = new Map();
    this.positionMap = new Map(); // normalizedFen -> Array of book move descriptors

    this.initBook();
  }

  /**
   * Pre-compute normalized FENs for all opening variations
   */
  initBook() {
    for (const opening of this.openings) {
      this.openingsMap.set(opening.id, opening);

      for (const variation of opening.variations) {
        const tempChess = new Chess();

        for (let i = 0; i < variation.moves.length; i++) {
          const moveObj = variation.moves[i];
          const beforeFen = normalizeFen(tempChess.fen());

          try {
            const moveRes = tempChess.move(moveObj.san);
            if (!moveRes) {
              console.warn(`[OpeningBook] Invalid SAN move "${moveObj.san}" in ${opening.name} - ${variation.name}`);
              break;
            }

            const afterFen = normalizeFen(tempChess.fen());

            // Index position before move -> next move candidate
            if (!this.positionMap.has(beforeFen)) {
              this.positionMap.set(beforeFen, []);
            }

            this.positionMap.get(beforeFen).push({
              openingId: opening.id,
              openingName: opening.name,
              eco: opening.eco,
              variationId: variation.id,
              variationName: variation.name,
              moveIndex: i,
              san: moveObj.san,
              comment: moveObj.comment,
              color: i % 2 === 0 ? 'w' : 'b',
              afterFen,
            });
          } catch (err) {
            console.warn(`[OpeningBook] Error parsing move "${moveObj.san}"`, err);
            break;
          }
        }
      }
    }
  }

  /**
   * Get list of all available openings grouped by category
   */
  getAllOpenings() {
    return this.openings;
  }

  /**
   * Get an opening by its ID
   */
  getOpeningById(id) {
    return this.openingsMap.get(id) || null;
  }

  /**
   * Determine whether the board state matches the chosen opening line,
   * check if the bot is on move, and retrieve the next book move or deviation reason.
   *
   * @param {string} openingKey - ID of the selected opening (e.g. 'scotch-game')
   * @param {string[]} historySAN - Array of moves played so far in SAN format (e.g. ['e4', 'e5', 'Nf3'])
   * @param {string} currentFen - Full current FEN of the board
   * @param {'w' | 'b'} botColor - Color the practice bot is playing
   * @returns {{ isOffBook: boolean, move: string | null, comment: string | null, reason?: string, variationName?: string, openingName?: string, eco?: string }}
   */
  getOpeningMove(openingKey, historySAN = [], currentFen, botColor) {
    const opening = this.openingsMap.get(openingKey);
    if (!opening) {
      return {
        isOffBook: true,
        move: null,
        reason: `Opening "${openingKey}" not found in book`,
      };
    }

    const currentTurn = currentFen.trim().split(' ')[1] || 'w';
    const isBotTurn = currentTurn === botColor;

    // Check matching variations for the history
    const matchedVariations = [];

    for (const variation of opening.variations) {
      let isMatch = true;
      for (let i = 0; i < historySAN.length; i++) {
        if (i >= variation.moves.length || variation.moves[i].san !== historySAN[i]) {
          isMatch = false;
          break;
        }
      }
      if (isMatch) {
        matchedVariations.push(variation);
      }
    }

    // 1. If player deviated from all variations of this opening
    if (matchedVariations.length === 0) {
      // Check transposition match as fallback
      const normFen = normalizeFen(currentFen);
      const candidates = (this.positionMap.get(normFen) || []).filter(
        (c) => c.openingId === openingKey
      );

      if (candidates.length > 0 && isBotTurn) {
        const pick = candidates[0];
        return {
          isOffBook: false,
          move: pick.san,
          comment: pick.comment,
          variationName: pick.variationName,
          openingName: opening.name,
          eco: opening.eco,
          transposition: true,
        };
      }

      return {
        isOffBook: true,
        move: null,
        reason: 'Player deviated from line',
      };
    }

    // 2. Pick the most specific matching variation
    const activeVariation = matchedVariations[0];
    const nextMoveIndex = historySAN.length;

    // 3. If line has concluded
    if (nextMoveIndex >= activeVariation.moves.length) {
      return {
        isOffBook: true,
        move: null,
        reason: 'Opening line completed - Entering middlegame',
        variationName: activeVariation.name,
      };
    }

    // 4. If it's the bot's turn, return the next move
    if (isBotTurn) {
      const nextMoveObj = activeVariation.moves[nextMoveIndex];
      return {
        isOffBook: false,
        move: nextMoveObj.san,
        comment: nextMoveObj.comment,
        variationName: activeVariation.name,
        openingName: opening.name,
        eco: opening.eco,
        moveNumber: Math.floor(nextMoveIndex / 2) + 1,
        color: nextMoveIndex % 2 === 0 ? 'w' : 'b',
      };
    }

    // Bot is waiting for player's move
    return {
      isOffBook: false,
      move: null,
      isPlayerTurn: true,
      variationName: activeVariation.name,
    };
  }

  /**
   * Retrieve educational commentary for the last played move
   */
  getCoachComment(openingKey, historySAN = [], currentFen) {
    if (historySAN.length === 0) {
      const opening = this.openingsMap.get(openingKey);
      return opening ? opening.description : null;
    }

    const opening = this.openingsMap.get(openingKey);
    if (!opening) return null;

    const lastMoveIndex = historySAN.length - 1;
    const lastMoveSAN = historySAN[lastMoveIndex];

    for (const variation of opening.variations) {
      if (lastMoveIndex < variation.moves.length && variation.moves[lastMoveIndex].san === lastMoveSAN) {
        let isMatch = true;
        for (let i = 0; i < lastMoveIndex; i++) {
          if (variation.moves[i].san !== historySAN[i]) {
            isMatch = false;
            break;
          }
        }
        if (isMatch) {
          return {
            san: lastMoveSAN,
            comment: variation.moves[lastMoveIndex].comment,
            variationName: variation.name,
            openingName: opening.name,
            eco: opening.eco,
          };
        }
      }
    }

    return null;
  }
}

// Export singleton instance
export const openingBook = new OpeningBookEngine();

// Export raw openings list
export const OPENINGS_DATA = openingsData.openings || [];

/**
 * Functional wrapper for getOpeningMove supporting both positional arguments and option objects
 */
export function getOpeningMove(openingKeyOrOptions, historySAN = [], currentFen, botColor) {
  if (typeof openingKeyOrOptions === 'object' && openingKeyOrOptions !== null) {
    const { openingId, historySans = [], fen, playerColor, botColor: explicitBotColor } = openingKeyOrOptions;
    const computedBotColor = explicitBotColor || (playerColor === 'w' ? 'b' : 'w');
    const res = openingBook.getOpeningMove(openingId, historySans, fen, computedBotColor);
    return {
      isBookMove: !res.isOffBook,
      isOffBook: res.isOffBook,
      san: res.move,
      comment: res.comment,
      reason: res.reason,
      variationName: res.variationName,
      openingName: res.openingName,
      eco: res.eco,
      transposition: res.transposition,
    };
  }
  return openingBook.getOpeningMove(openingKeyOrOptions, historySAN, currentFen, botColor);
}

/**
 * Functional wrapper for getCoachComment
 */
export function getCoachComment(openingKeyOrResult, historySAN = [], currentFen) {
  if (typeof openingKeyOrResult === 'object' && openingKeyOrResult !== null) {
    if (openingKeyOrResult.isOffBook) {
      return `Off-book: ${openingKeyOrResult.reason || 'Player deviated'}. Stockfish taking over calculations.`;
    }
    if (openingKeyOrResult.comment) {
      return openingKeyOrResult.comment;
    }
  }
  const commentObj = openingBook.getCoachComment(openingKeyOrResult, historySAN, currentFen);
  return typeof commentObj === 'object' && commentObj !== null ? commentObj.comment : commentObj;
}
