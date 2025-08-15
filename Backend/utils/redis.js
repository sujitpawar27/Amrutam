const Redis = require("ioredis");
require("dotenv").config();

const redis = new Redis(process.env.REDIS_URL);

const lockKey = (doctorId, slotISO) => `lock:${doctorId}:${slotISO}`;

// Acquire lock: set key to lockToken with NX and TTL seconds
async function acquireLock(doctorId, slotISO, lockToken, ttlSeconds) {
  return await redis.set(
    lockKey(doctorId, slotISO),
    lockToken,
    "NX",
    "EX",
    ttlSeconds
  );
}

// Check lock
async function getLock(doctorId, slotISO) {
  return await redis.get(lockKey(doctorId, slotISO));
}

// Release lock only if matches token (safe release)
async function releaseLockIfMatch(doctorId, slotISO, lockToken) {
  const script = `
    if redis.call("get", KEYS[1]) == ARGV[1] then
      return redis.call("del", KEYS[1])
    else
      return 0
    end
  `;
  return await redis.eval(script, 1, lockKey(doctorId, slotISO), lockToken);
}

module.exports = { redis, acquireLock, getLock, releaseLockIfMatch, lockKey };
