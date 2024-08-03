import helmet from "helmet";
import cors from "cors";

import { Application, json, urlencoded, Request, Response } from 'express';
import router from "../routes";


const corsOptions = {
    origin(origin, callback) {
        callback(null, true);
    },
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};

const expressConfig = (app: Application): void => {
    app.use(cors(corsOptions));
    app.use(
        urlencoded({
            extended: true,
        }),
    );
    app.use(json());
    app.use(helmet());

    app.get('/', (req: Request, res: Response) => res.send({ message: 'Welcome' }));
    app.use("/api", router);
}

export default expressConfig;