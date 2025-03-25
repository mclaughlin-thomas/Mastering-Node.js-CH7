import path from "path";
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
export default {
    mode: "development",
    entry: "./static/client.js",
    output: {
        path: path.resolve(__dirname, "dist/client"),
        filename: "bundle.js"
    }
};
