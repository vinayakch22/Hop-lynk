/**
 * Redis Verification Script
 * Tests: connection, SET/GET, TTL, DELETE, pattern DELETE, live key inspection.
 *
 * Usage:  node scripts/testRedis.js
 */
import 'dotenv/config';
import Redis from 'ioredis';
import { getCache, setCache, deleteCache, deletePatternCache, redisClient, isRedisReady } from '../config/redis.js';

const DIVIDER = '─'.repeat(55);
let passed = 0;
let failed = 0;

const ok = (msg) => { passed++; console.log(`  ✅ ${msg}`); };
const fail = (msg) => { failed++; console.log(`  ❌ ${msg}`); };

// Wait for Redis to be ready (or timeout)
const waitForReady = () =>
  new Promise((resolve) => {
    if (isRedisReady) return resolve(true);
    const timeout = setTimeout(() => resolve(false), 5000);
    if (redisClient) {
      redisClient.once('ready', () => { clearTimeout(timeout); resolve(true); });
    } else {
      clearTimeout(timeout);
      resolve(false);
    }
  });

async function run() {
  console.log('\n' + DIVIDER);
  console.log(' 🔧 Redis Verification Script — Hop Lynk');
  console.log(DIVIDER);
  console.log(`\n REDIS_URL: ${process.env.REDIS_URL ? '***configured***' : '⚠️  NOT SET (using default)'}`);

  // ─── Test 1: Connection ──────────────────────────────
  console.log('\n📡 Test 1 — Redis Connection');
  const ready = await waitForReady();
  if (!ready) {
    fail('Redis did not become ready within 5 seconds');
    console.log('\n⚠️  Cannot continue without a Redis connection.');
    console.log('   Check REDIS_URL in .env and ensure the Redis server is reachable.\n');
    process.exit(1);
  }
  ok('Redis is connected and ready');

  try {
    const pong = await redisClient.ping();
    pong === 'PONG' ? ok(`PING → ${pong}`) : fail(`PING → unexpected: ${pong}`);
  } catch (err) {
    fail(`PING failed: ${err.message}`);
  }

  // ─── Test 2: SET / GET / TTL ─────────────────────────
  console.log('\n💾 Test 2 — SET / GET / TTL');
  const testKey = 'test:redis:verification';
  const testData = { message: 'Redis is working', timestamp: Date.now() };
  const ttl = 60; // 60 seconds

  const setResult = await setCache(testKey, testData, ttl);
  setResult ? ok(`SET ${testKey} → success`) : fail(`SET ${testKey} → failed`);

  const getResult = await getCache(testKey);
  if (getResult && getResult.message === testData.message) {
    ok(`GET ${testKey} → ${JSON.stringify(getResult)}`);
  } else {
    fail(`GET ${testKey} → unexpected: ${JSON.stringify(getResult)}`);
  }

  const remainingTTL = await redisClient.ttl(testKey);
  if (remainingTTL > 0 && remainingTTL <= ttl) {
    ok(`TTL ${testKey} → ${remainingTTL}s (expected ≤${ttl}s)`);
  } else {
    fail(`TTL ${testKey} → ${remainingTTL}s (unexpected)`);
  }

  // ─── Test 3: DELETE ──────────────────────────────────
  console.log('\n🗑️  Test 3 — DELETE');
  const delResult = await deleteCache(testKey);
  delResult ? ok(`DEL ${testKey} → success`) : fail(`DEL ${testKey} → failed`);

  const afterDel = await getCache(testKey);
  afterDel === null ? ok(`GET after DEL → null (correct)`) : fail(`GET after DEL → ${JSON.stringify(afterDel)} (should be null)`);

  // ─── Test 4: Pattern DELETE ──────────────────────────
  console.log('\n🧹 Test 4 — Pattern DELETE');
  await setCache('test:pattern:a', { v: 1 }, 60);
  await setCache('test:pattern:b', { v: 2 }, 60);
  await setCache('test:pattern:c', { v: 3 }, 60);
  ok('Created 3 keys: test:pattern:{a,b,c}');

  const patternDel = await deletePatternCache('test:pattern:*');
  patternDel ? ok(`Pattern DEL test:pattern:* → success`) : fail(`Pattern DEL → failed`);

  const afterPattern = await getCache('test:pattern:a');
  afterPattern === null ? ok('Keys cleaned up correctly') : fail(`Key still exists after pattern delete`);

  // ─── Test 5: Inspect Live Redirect Cache ─────────────
  console.log('\n🔍 Test 5 — Live Redirect Cache Inspection');
  try {
    let cursor = '0';
    const foundKeys = [];
    do {
      const [newCursor, keys] = await redisClient.scan(cursor, 'MATCH', 'url:redirect:*', 'COUNT', 100);
      cursor = newCursor;
      foundKeys.push(...keys);
    } while (cursor !== '0');

    if (foundKeys.length === 0) {
      console.log('  ℹ️  No url:redirect:* keys found (normal if no redirects have been cached yet)');
    } else {
      console.log(`  Found ${foundKeys.length} redirect cache key(s):\n`);
      for (const key of foundKeys.slice(0, 10)) {
        const value = await redisClient.get(key);
        const keyTTL = await redisClient.ttl(key);
        const parsed = JSON.parse(value);
        console.log(`  📌 ${key}`);
        console.log(`     shortCode   : ${parsed.shortCode}`);
        console.log(`     originalUrl : ${parsed.originalUrl}`);
        console.log(`     isActive    : ${parsed.isActive}`);
        console.log(`     TTL         : ${keyTTL}s (${Math.round(keyTTL / 3600)}h ${Math.round((keyTTL % 3600) / 60)}m)`);
        console.log();
      }
      if (foundKeys.length > 10) {
        console.log(`  ... and ${foundKeys.length - 10} more`);
      }
    }
  } catch (err) {
    fail(`Scan failed: ${err.message}`);
  }

  // ─── Summary ─────────────────────────────────────────
  console.log(DIVIDER);
  console.log(` Results: ${passed} passed, ${failed} failed`);
  console.log(DIVIDER + '\n');

  await redisClient.quit();
  process.exit(failed > 0 ? 1 : 0);
}

run().catch((err) => {
  console.error('Script error:', err);
  process.exit(1);
});
