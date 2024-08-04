import { redisClient } from "../config/redis";


const set = async (key, value) => {
    await redisClient.set(key, value, { EX: 86400 });
};

const hSet = async (key, value) => {
    await redisClient.hSet(key, value);
    await redisClient.expire(key, 86400);
};

const get = async (key) => {
    await redisClient.get(key);
};

const hGet = async (key) => {
    await redisClient.hGetAll(key);
};

const deleteKey = async (key) => {
    await redisClient.del(key);
};

const deleteKeys = async (keys) => {
    await redisClient.del(keys);
};

const deleteAll = async () => redisClient.del("*");


export default {
    set,
    hSet,
    get,
    hGet,
    deleteKey,
    deleteKeys,
    deleteAll
};