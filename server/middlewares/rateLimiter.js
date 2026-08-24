import redisClient from "../utils/redis.js";

export const rateLimit = async (req, res, next) => {
  try {
    const ip = req.ip;

    const key = `limit:${ip}`;

    const count = await redisClient.incr(key);

    if (count == 1) {
      await redisClient.expire(key, 60);
    }

    if (count > 5) {
      return res.status(429).json({
        success: false,
        message: "too many requests, try later",
      });
    }

    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Interal server error",
    });
  }
};
