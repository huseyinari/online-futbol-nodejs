const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const io = require('socket.io')(server , {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"],
      credentials: true
    }
  });

const cors = require('cors');
app.use(cors());

let players = [];
// oyuncuların başlangıç pozisyonları
const player1 = {
  x : 100,
  y : 100,
  r : 20
};
const player2 = {
  x : 800,
  y : 100,
  r : 20
};
const ball = {
  x : 450,
  y : 400,
  r : 15,
  vs : 0, // vertical speed
  hs : 0, // horizantal speed
  lhs : 0, // last horizantal speed - topa en son vurulan yatay hız
  lvs : 0, // last vertical speed - topa en son vurulan dikey hız
  color : 'gray'
};

io.on('connection', (socket) => {
    if(players.length === 0){
      players.push(socket);
    }else if(players.length === 1){
      players.push(socket);

      io.to(players[0].id).emit('playersConnected',{
        pos:player1,
        rivalPos:player2,
        ball:ball
      });

      io.to(players[1].id).emit('playersConnected',{
        pos:player2,
        rivalPos:player1,
        ball:ball
      });
    }else{ // ikiden fazla kişi varsa
      //
    }
    socket.on('moveRival',data => {
      socket.broadcast.emit('moveRival',data);
    });
    socket.on('moveBall',data => {
      socket.broadcast.emit('moveBall',data);
    });

    socket.on('disconnect',() => {
      players = players.filter(player => player.id !== socket.id);
    });
});

server.listen(8000,() => {
    console.log("sunucu başladı");
});
