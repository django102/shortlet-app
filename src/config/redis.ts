import { createClient, RedisClientType } from "redis";
import { env } from "../env";

const { caching } = env;
const { redis } = caching;

export const redisConfig = {
    url: `redis://${[
        redis.username && redis.username,
        redis.password && `:${redis.password}`,
        redis.host && `@${redis.host}`,
        redis.port && `:${redis.port}`
    ].filter(Boolean).join("")}`
};


export const redisClient: RedisClientType = createClient(redisConfig);


redisClient.on("ready", () => {
    console.log("Redis client is ready!");
});

redisClient.on("end", () => {
    console.log("Disonnected from redis!");
});