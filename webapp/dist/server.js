"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = require("http");
const express_1 = __importDefault(require("express"));
const readHandler_1 = require("./readHandler");
const cors_1 = __importDefault(require("cors"));
const http_proxy_1 = __importDefault(require("http-proxy"));
const helmet_1 = __importDefault(require("helmet"));
const port = 5000;
const expressApp = (0, express_1.default)();
const proxy = http_proxy_1.default.createProxyServer({
    target: "http://localhost:5100", ws: true
});
// expressApp.use((req, resp, next) => {
//     resp.setHeader(
//         "Content-Security-Policy",
//         "img-src 'self'"
//     );
//     next();
// })
expressApp.use((0, helmet_1.default)({
    contentSecurityPolicy: {
        directives: {
            imgSrc: "'self'",
            scriptSrcAttr: "'none'",
            scriptSrc: "'self'",
            connectSrc: "'self' ws://localhost:5000"
        }
    }
}));
expressApp.use((0, cors_1.default)({
    origin: "http://localhost:5100"
}));
// The CORS package contains an Express middleware package
// that is applied with the use method. We currently have it
// setup here to use the origin config setting to specify
// requests are allowed from http://localhost:5100, which will
// allow reqs from js code loaded from the webpack dev server
expressApp.use(express_1.default.json());
expressApp.post("/read", readHandler_1.readHandler);
expressApp.use(express_1.default.static("static"));
expressApp.use(express_1.default.static("node_modules/bootstrap/dist"));
//expressApp.use(express.static("dist/client")); // this route will be used to get bundle
expressApp.use((req, resp) => proxy.web(req, resp));
const server = (0, http_1.createServer)(expressApp);
server.on('upgrade', (req, socket, head) => proxy.ws(req, socket, head));
server.listen(port, () => console.log(`HTTP Server listening on port ${port}`));
