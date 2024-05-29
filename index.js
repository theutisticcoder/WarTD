const express = require('express');
const { createServer } = require('node:http');
const { Server } = require('socket.io');
var rooms = [];
const app = express();
const server = createServer(app);
const io = new Server(server);
app.use(express.static(__dirname));
io.on('connection', (socket) => {
  socket.on("join", r=> {
    if(rooms.includes(r)){
        socket.join(r);
        io.to(r).emit("opengame");
    }
    else{
        socket.emit("no");
    }
  })
  socket.on("damage", (da)=> {
    socket.to(Array.from(socket.rooms)[1]).emit("dam", da);
  })
  socket.on("alt", ()=> {
    socket.to(Array.from(socket.rooms)[1]).emit("alt");
  })
  socket.on("tower2", t=>{
    socket.to(Array.from(socket.rooms)[1]).emit("tow2", t);
  })
  socket.on("start", r=> {
    if(rooms.includes(r)){
       
        socket.emit("taken");
    }
    else{
        rooms.push(r);
        socket.emit("success");
        socket.join(r);
    }
  })
  socket.on("et1", (t)=> {
    socket.to(Array.from(socket.rooms)[1]).emit("recieve", t);
  })
  socket.on("fire", ()=> {
    socket.to(Array.from(socket.rooms)[1]).emit("fire");
  })
  socket.on("defend", (d)=> {
    socket.to(Array.from(socket.rooms)[1]).emit("def", d);
  })
});

server.listen(3000, () => {
  console.log('server running at 3000');
});
