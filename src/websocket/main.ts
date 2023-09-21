import { Server } from "socket.io"
import * as logger from "../utils/logger.js";

const port = 443;

const io = new Server();

io.on("connection", (socket) => {
    
});

export async function init() {
    io.listen(port);
    logger.info(`Running WebSocket at port ${port}...`);
}