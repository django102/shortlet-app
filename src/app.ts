import express from "express";
import expressConfig from "./config/express";
import mongoose from "mongoose";

import { mongoUri } from "./config/mongodb";
import { redisClient } from "./config/redis";


const app: express.Application = express();
const PORT = process.env.PORT || 80;

expressConfig(app);

mongoose.connect(mongoUri)
    .then((connection) => {
        console.log('Connected to MongoDB')
    })
    .catch((err) => console.error('Could not connect to MongoDB...', err));

redisClient.connect()
    .then(() => {
        console.log('Connected to Redis')
    })
    .catch((err) => console.error('Could not connect to Redis...', err));


app.listen(PORT, () => {
    console.log(`Application started on ${PORT}`)
});