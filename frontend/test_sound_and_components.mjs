import { readFileSync, existsSync } from 'fs';
import { ChessStompClient } from './src/services/stompClient.js';
import * as soundEffects from './src/utils/soundEffects.js';

console.log('================================================================');
console.log('🧪 TESTING PRODUCTION POLISH: AUDIO, COMPONENTS & CONFIGS');
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
// 1. Audio Effects Synthesis Module
// -------------------------------------------------------------
console.log('--- 1. Testing soundEffects.js ---');
assert(typeof soundEffects.playMoveSound === 'function', 'playMoveSound is exported as a function');
assert(typeof soundEffects.playCaptureSound === 'function', 'playCaptureSound is exported as a function');
assert(typeof soundEffects.playCheckSound === 'function', 'playCheckSound is exported as a function');
assert(typeof soundEffects.playGameEndSound === 'function', 'playGameEndSound is exported as a function');
assert(typeof soundEffects.isMuted === 'function', 'isMuted is exported as a function');
assert(typeof soundEffects.toggleMute === 'function', 'toggleMute is exported as a function');
assert(typeof soundEffects.setMuted === 'function', 'setMuted is exported as a function');

// Test mute toggling
const initialMute = soundEffects.isMuted();
const toggled = soundEffects.toggleMute();
assert(toggled === !initialMute, 'toggleMute correctly flips mute boolean state');
soundEffects.setMuted(initialMute);
assert(soundEffects.isMuted() === initialMute, 'setMuted restores initial mute state');

// -------------------------------------------------------------
// 2. STOMP 25-second Heartbeat
// -------------------------------------------------------------
console.log('\n--- 2. Testing STOMP Client 25s Heartbeat ---');
const stomp = new ChessStompClient();
assert(stomp !== null, 'ChessStompClient instantiates cleanly');

// Check source code of stompClient.js for 25000ms heartbeats
const stompCode = readFileSync('./src/services/stompClient.js', 'utf-8');
assert(stompCode.includes('heartbeatIncoming: 25000'), 'STOMP client has heartbeatIncoming: 25000');
assert(stompCode.includes('heartbeatOutgoing: 25000'), 'STOMP client has heartbeatOutgoing: 25000');
assert(stompCode.includes('heartbeatTimer'), 'STOMP client includes heartbeatTimer for active proxy keep-alive');

// -------------------------------------------------------------
// 3. Components Presence & Exports
// -------------------------------------------------------------
console.log('\n--- 3. Testing Game Components ---');
assert(existsSync('./src/components/game/MoveHistoryTable.jsx'), 'MoveHistoryTable.jsx exists');
assert(existsSync('./src/components/game/CapturedPieces.jsx'), 'CapturedPieces.jsx exists');
assert(existsSync('./src/components/game/ResignConfirmModal.jsx'), 'ResignConfirmModal.jsx exists');
assert(existsSync('./src/components/game/DrawOfferModal.jsx'), 'DrawOfferModal.jsx exists');
assert(existsSync('./src/components/game/index.js'), 'components/game/index.js barrel export exists');

// -------------------------------------------------------------
// 4. Cloud Deployment Configurations
// -------------------------------------------------------------
console.log('\n--- 4. Testing Cloud Deployment Configs ---');
assert(existsSync('../backend/Dockerfile'), 'backend/Dockerfile exists');
const dockerfile = readFileSync('../backend/Dockerfile', 'utf-8');
assert(dockerfile.includes('FROM maven:3.9.8-eclipse-temurin-21-alpine AS builder'), 'Dockerfile uses multi-stage Maven Temurin 21');
assert(dockerfile.includes('FROM eclipse-temurin:21-jre-alpine AS runner'), 'Dockerfile uses slim JRE Alpine runner stage');
assert(dockerfile.includes('USER spring:spring'), 'Dockerfile enforces unprivileged non-root user');
assert(dockerfile.includes('EXPOSE 8085'), 'Dockerfile exposes port 8085');

assert(existsSync('../render.yaml'), 'Root render.yaml exists');
assert(existsSync('../backend/render.yaml'), 'backend/render.yaml exists');
const renderYaml = readFileSync('../render.yaml', 'utf-8');
assert(renderYaml.includes('type: web'), 'render.yaml configures web service');
assert(renderYaml.includes('runtime: docker'), 'render.yaml uses Docker runtime');

assert(existsSync('./vercel.json'), 'frontend/vercel.json exists');
const vercelConfig = JSON.parse(readFileSync('./vercel.json', 'utf-8'));
assert(Array.isArray(vercelConfig.rewrites) && vercelConfig.rewrites.length > 0, 'vercel.json has SPA rewrites to index.html');
assert(Array.isArray(vercelConfig.headers) && vercelConfig.headers.length >= 2, 'vercel.json has security and caching headers');

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
