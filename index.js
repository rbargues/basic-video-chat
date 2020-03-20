const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const path = require("path");
const http = require("http").createServer(app);
const io = require("socket.io")(http);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(path.resolve(__dirname, "./")));

app.use((req, res, next) => {
  req.io = io;
  return next();
})

io.on("connection", socket => {
  socket.on("peer", id => {
    console.log(id);
    io.emit("peer-from-server", id);
  })
})

app.get("/", (req, res) => {
  return res.sendFile(path.resolve(__dirname, "./index.html"));
})

http.listen(3000, () => console.log("server is listening on port 3000"));
