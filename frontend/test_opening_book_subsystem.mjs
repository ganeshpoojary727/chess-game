import { Chess } from 'chess.js';
import { readFileSync } from 'fs';
import {
  normalizeFen,
  getOpeningMove,
  getCoachComment,
  OPENINGS_DATA
} from './src/ai/openingBookEngine.js';

console.log('================================================================');
console.log('🧪 TESTING INTELLIGENT OPENING BOOK & PRACTICE BOT SUBSYSTEM');
console.log('================================================================\n');

let passCount = 0;
let failCount = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  ✅ PASS: ${message}`);
    passCount++;
  } else {
    console.error(`  ❌ FAIL: ${message}`);
    failCount++;
  }
}

// -------------------------------------------------------------
// 1. Validate openings dataset
// -------------------------------------------------------------
console.log('--- 1. Testing Openings Dataset Completeness & Sanity ---');

const requiredOpenings = [
  'scotch-game',
  'scholars-mate',
  'italian-game',
  'ruy-lopez',
  'sicilian-defense',
  'french-defense',
  'caro-kann',
  'queens-gambit',
  'kings-indian',
  'london-system',
  'scandinavian-defense',
  'fried-liver'
];

assert(OPENINGS_DATA.length >= 12, `Dataset contains at least 12 openings (found ${OPENINGS_DATA.length})`);

for (const id of requiredOpenings) {
  const found = OPENINGS_DATA.find((o) => o.id === id);
  assert(!!found, `Opening '${id}' exists in database`);
}

// Check that all SAN moves in all variations are strictly legal chess moves
let totalVariationsChecked = 0;
for (const opening of OPENINGS_DATA) {
  for (const variation of opening.variations) {
    totalVariationsChecked++;
    const testChess = new Chess();
    for (const move of variation.moves) {
      const result = testChess.move(move.san);
      if (!result) {
        assert(false, `Opening ${opening.id} / ${variation.name} has invalid move: ${move.san}`);
        break;
      }
    }
  }
}
assert(totalVariationsChecked >= 20, `Validated ${totalVariationsChecked} variations with 100% legal moves in chess.js`);

// -------------------------------------------------------------
// 2. FEN Normalization
// -------------------------------------------------------------
console.log('\n--- 2. Testing FEN Normalization for Transpositions ---');
const fen1 = 'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1';
const fen2 = 'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 5 42';

const norm1 = normalizeFen(fen1);
const norm2 = normalizeFen(fen2);

assert(norm1 === norm2, `FEN normalization ignores halfmove clock and fullmove number: "${norm1}"`);
assert(norm1 === 'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3', 'Normalized FEN has exact 4 invariant fields');

// -------------------------------------------------------------
// 3. Scotch Game - Playing as Black (Bot is White)
// -------------------------------------------------------------
console.log('\n--- 3. Testing Scotch Game (Player is Black, Bot is White) ---');
{
  const game = new Chess();

  // Move 1: Bot (White) plays first move
  const botMove1 = getOpeningMove({
    openingId: 'scotch-game',
    fen: game.fen(),
    playerColor: 'b',
    historySans: game.history()
  });

  assert(botMove1.isBookMove === true, 'Move 1: Bot identifies book move as White');
  assert(botMove1.san === 'e4', `Move 1: Bot plays 1. e4 (got ${botMove1.san})`);
  game.move(botMove1.san);

  // Player responds 1... e5
  game.move('e5');

  // Move 2: Bot (White)
  const botMove2 = getOpeningMove({
    openingId: 'scotch-game',
    fen: game.fen(),
    playerColor: 'b',
    historySans: game.history()
  });

  assert(botMove2.isBookMove === true, 'Move 2: Bot identifies book move for 2. Nf3');
  assert(botMove2.san === 'Nf3', `Move 2: Bot plays 2. Nf3 (got ${botMove2.san})`);
  game.move(botMove2.san);

  // Player responds 2... Nc6
  game.move('Nc6');

  // Move 3: Bot (White)
  const botMove3 = getOpeningMove({
    openingId: 'scotch-game',
    fen: game.fen(),
    playerColor: 'b',
    historySans: game.history()
  });

  assert(botMove3.isBookMove === true, 'Move 3: Bot identifies book move for 3. d4 (Scotch)');
  assert(botMove3.san === 'd4', `Move 3: Bot plays 3. d4 (got ${botMove3.san})`);
  game.move(botMove3.san);
}

// -------------------------------------------------------------
// 4. Scotch Game - Playing as White (Bot is Black)
// -------------------------------------------------------------
console.log('\n--- 4. Testing Scotch Game (Player is White, Bot is Black) ---');
{
  const game = new Chess();

  // Move 1: Player plays 1. e4
  game.move('e4');

  // Bot (Black) responds
  const botMove1 = getOpeningMove({
    openingId: 'scotch-game',
    fen: game.fen(),
    playerColor: 'w',
    historySans: game.history()
  });

  assert(botMove1.isBookMove === true, 'Move 1: Bot identifies book reply for Black');
  assert(botMove1.san === 'e5', `Move 1: Bot plays 1... e5 (got ${botMove1.san})`);
  game.move(botMove1.san);

  // Move 2: Player plays 2. Nf3
  game.move('Nf3');

  // Bot (Black) responds
  const botMove2 = getOpeningMove({
    openingId: 'scotch-game',
    fen: game.fen(),
    playerColor: 'w',
    historySans: game.history()
  });

  assert(botMove2.isBookMove === true, 'Move 2: Bot identifies 2... Nc6 reply');
  assert(botMove2.san === 'Nc6', `Move 2: Bot plays 2... Nc6 (got ${botMove2.san})`);
  game.move(botMove2.san);

  // Move 3: Player plays 3. d4
  game.move('d4');

  // Bot (Black) responds
  const botMove3 = getOpeningMove({
    openingId: 'scotch-game',
    fen: game.fen(),
    playerColor: 'w',
    historySans: game.history()
  });

  assert(botMove3.isBookMove === true, 'Move 3: Bot identifies 3... exd4 reply');
  assert(botMove3.san === 'exd4', `Move 3: Bot plays 3... exd4 (got ${botMove3.san})`);
  game.move(botMove3.san);
}

// -------------------------------------------------------------
// 5. Player Deviation & Seamless Stockfish Handoff Detection
// -------------------------------------------------------------
console.log('\n--- 5. Testing Player Deviation & Off-Book State ---');
{
  const game = new Chess();
  game.move('e4'); // 1. e4
  game.move('e5'); // 1... e5
  game.move('Nf3'); // 2. Nf3

  // Player deviates from 2... Nc6 with Damiano Defense 2... f6
  game.move('f6');

  const botMove = getOpeningMove({
    openingId: 'scotch-game',
    fen: game.fen(),
    playerColor: 'w', // Bot is Black? Wait: game is at move 3 White (White to move)
    historySans: game.history()
  });

  // Let's check when it's bot's turn:
  // Player is Black, Bot is White: 1. e4 e5 2. Nf3 - now Black plays f6! Next is Bot (White)'s turn
  const game2 = new Chess();
  game2.move('e4'); // Bot (White)
  game2.move('e5'); // Player (Black)
  game2.move('Nf3'); // Bot (White)
  game2.move('f6'); // Player (Black deviates)

  const botMoveAfterDeviation = getOpeningMove({
    openingId: 'scotch-game',
    fen: game2.fen(),
    playerColor: 'b', // Player is Black, Bot is White
    historySans: game2.history()
  });

  assert(botMoveAfterDeviation.isBookMove === false, 'Bot marks move as not in book');
  assert(botMoveAfterDeviation.isOffBook === true, 'Bot flags isOffBook === true');
  assert(
    botMoveAfterDeviation.reason && botMoveAfterDeviation.reason.toLowerCase().includes('deviated'),
    `Reason indicates departure from book: ${botMoveAfterDeviation.reason}`
  );

  const comment = getCoachComment(botMoveAfterDeviation, 'Damiano Variation', 'b');
  assert(
    comment.includes('deviated') || comment.includes('Off-book') || comment.includes('Stockfish'),
    `Coach commentary alerts player: "${comment}"`
  );
}

// -------------------------------------------------------------
// 6. Transposition Handling
// -------------------------------------------------------------
console.log('\n--- 6. Testing Transpositions ---');
{
  // English Opening / Reti transposition into Queen's Gambit Declined or Sicilian
  // Open Sicilian: 1. e4 c5 2. Nf3 d6 3. d4 cxd4 4. Nxd4
  // Transposed move order: 1. Nf3 c5 2. e4 d6 3. d4 cxd4 4. Nxd4
  const c1 = new Chess();
  c1.move('e4');
  c1.move('c5');
  c1.move('Nf3');
  c1.move('d6');

  const c2 = new Chess();
  c2.move('Nf3');
  c2.move('d6');
  c2.move('e4');
  c2.move('c5');

  assert(normalizeFen(c1.fen()) === normalizeFen(c2.fen()), 'Transposed order yields identical normalized FEN');

  const botMoveTransposed = getOpeningMove({
    openingId: 'sicilian-defense',
    fen: c2.fen(),
    playerColor: 'b', // Bot is White
    historySans: c2.history()
  });

  assert(botMoveTransposed.isBookMove === true, 'Bot correctly recognizes book position reached via transposition');
  assert(botMoveTransposed.san === 'd4', `Bot plays 3. d4 in Sicilian position: got ${botMoveTransposed.san}`);
}

// -------------------------------------------------------------
// Summary
// -------------------------------------------------------------
console.log('\n================================================================');
console.log(`🏁 TEST RESULTS: ${passCount} PASSED, ${failCount} FAILED`);
console.log('================================================================');

if (failCount > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
