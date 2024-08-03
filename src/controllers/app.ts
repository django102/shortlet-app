import express, {urlencoded, json, Request, Response} from "express";
import cors from "cors";

const app: express.Application = express();
const PORT = process.env.PORT || 80;

const corsOptions = {
    origin(origin, callback) {
        callback(null, true);
    },
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};

app.use(cors(corsOptions));
app.use(urlencoded({ extended: true }));
app.use(json());
app.get('/', (req: Request, res: Response) => res.send({ message: 'Welcome' }));

const server = app.listen(PORT, () => {
    console.log(`Server started on ${PORT}`)
    // logger.info(`Server started on ${PORT}`);
});


export default server;