import "reflect-metadata";
import { createConnection } from "typeorm";
import * as express from "express";
import { Request, Response } from "express";
import * as cors from "cors";
import helmet from "helmet";
import routes from "./routes";

const PORT = process.env.PORT || 3000;

createConnection().then(async () => {
    const app = express();
    app.use(cors());
    app.use(helmet());
    app.use(express.json());
    app.use("/", routes)

    app.listen(PORT, () => console.log(`SERVER CORRIENDO EN EL PUERTO ${PORT}`));
}).catch(error => console.log(error));
