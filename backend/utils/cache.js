const redisClient = require("../config/redis");
module.exports = {
  get: async (key) => {
    const data = await redisClient.get(key);
    return data ? JSON.parse(data) : null;
  },
  set: async (key, value, ttl = 3600) => {
    await redisClient.set(key, JSON.stringify(value), { EX: ttl });
  },
  del: async (key) => {
    await redisClient.del(key);
  },
};
