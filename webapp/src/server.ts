import { createServer } from "http";
import express, {Express } from "express";
import { readHandler } from "./readHandler";
import cors from "cors";

const port = 5000;

const expressApp: Express = express();
expressApp.use(cors({
    origin: "http://localhost:5100"
}));
// The CORS package contains an Express middleware package
// that is applied with the use method. We currently have it
// setup here to use the origin config setting to specify
// requests are allowed from http://localhost:5100
expressApp.use(express.json());

expressApp.post("/read", readHandler);
expressApp.use(express.static("static"));

expressApp.use(express.static("node_modules/bootstrap/dist"));
expressApp.use(express.static("dist/client")); // this route will be used to get bundle

const server = createServer(expressApp);

server.listen(port, () =>
    console.log(`HTTP Server listening on port ${port}`)
);