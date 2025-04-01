import { createServer } from "http";
import express, {Express } from "express";
import { readHandler } from "./readHandler";
import cors from "cors";
import httpProxy from "http-proxy";

const port = 5000;

const expressApp: Express = express();
const proxy = httpProxy.createProxyServer({
    target: "http://localhost:5100", ws: true
});
expressApp.use(cors({
    origin: "http://localhost:5100"
}));
// The CORS package contains an Express middleware package
// that is applied with the use method. We currently have it
// setup here to use the origin config setting to specify
// requests are allowed from http://localhost:5100, which will
// allow reqs from js code loaded from the webpack dev server
expressApp.use(express.json());

expressApp.post("/read", readHandler);
expressApp.use(express.static("static"));

expressApp.use(express.static("node_modules/bootstrap/dist"));
//expressApp.use(express.static("dist/client")); // this route will be used to get bundle
expressApp.use((req, resp) => proxy.web(req, resp));
const server = createServer(expressApp);

server.on('upgrade', (req, socket, head) =>
    proxy.ws(req, socket, head)
);

server.listen(port, () =>
    console.log(`HTTP Server listening on port ${port}`)
);