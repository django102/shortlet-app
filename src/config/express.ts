import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";
import compression from 'compression';

import { Application, json, urlencoded, Request, Response } from 'express';
import router from "../api/routes";


const corsOptions = {
    origin(origin, callback) {
        callback(null, true);
    },
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};

const limiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minutes
    max: 50 // limit each IP to 50 requests per windowMs
});


const expressConfig = (app: Application): void => {
    app.use(cors(corsOptions));
    app.use(limiter);
    app.use(compression());
    app.use(
        urlencoded({
            extended: true,
        }),
    );
    app.use(json());
    app.use(helmet());
    app.use(helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'"]
        }
    }));

    app.get('/', (req: Request, res: Response) => res.send({ message: 'Welcome' }));
    app.use("/api", router);
}

export default expressConfig;