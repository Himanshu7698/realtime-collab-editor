require('dotenv').config();
const express = require('express');
const app = express();
const Http = require('http');
const { Server } = require("socket.io");
const cors = require('cors');
const bodyParser = require('express').json;
const connectDB = require('./src/config/db');

connectDB();

//Create Server
const server = Http.createServer(app);
const port = process.env.PORT || 5000;

global.io = new Server(server, {
    path: "/api/socket.io",
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
        credentials: true
    },
});

app.use(cors({ origin: "*" }));
app.use(express.json());
app.use(bodyParser());

//API
app.use('/api', require('./src/routes/routes'));

//Not Found
app.use((req, res) => {
    res.status(404).json({ message: "Not Found" });
});

require('./src/socket')(global.io);

//Handle Crash
process.on("uncaughtException", (e) => console.error(e));

//Server Listen
server.listen(port, () => {
    console.log(`Server is running on port : ${port}`);
    console.log("Date : ", new Date().toLocaleString());
});