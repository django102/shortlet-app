import { redisClient } from "../config/redis";

// const EX = 86400; // 24 hours expiry time, in seconds
const EX = 43200; // 12 hours expiry time, in seconds


const set = async (key, value) => {
    await redisClient.set(key, value, { EX });
};

const hSet = async (key, value) => {
    await redisClient.hSet(key, value);
    await redisClient.expire(key, EX);
};

const jsonSet = async (key, value) => {
    await redisClient.json.set(key, "$", value);
    await redisClient.expire(key, EX);
}

const get = async (key) => {
    return await redisClient.get(key);
};

const hGet = async (key) => {
    return await redisClient.hGetAll(key);
};

const jsonGet = async (key) => {
    return await redisClient.json.get(key, { path: "$" });
}

const deleteKey = async (key) => {
    await redisClient.del(key);
};

const deleteKeys = async (keys) => {
    await redisClient.del(keys);
};

const deleteAll = async () => redisClient.flushDb();


export default {
    set,
    hSet,
    get,
    hGet,
    deleteKey,
    deleteKeys,
    deleteAll,
    jsonSet,
    jsonGet
};