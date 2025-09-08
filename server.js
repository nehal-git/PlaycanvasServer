const http = require("http");
const { Server } = require("socket.io");

const server = http.createServer();

const io = new Server(server, {
  cors: {
    origin: "*",             // allow all origins
    methods: ["GET", "POST"],
    allowedHeaders: ["*"],
    credentials: true
  }
});



var Player = require('./Player.js');
var players = [];
var sockets = [];
io.on('connection', function (socket) {
    socket.emit('open');
    console.log("A Player Connected");

    var thisPlayerID;
    var player = new Player();

    socket.on('create', function () {
        thisPlayerID = socket.id;
        player.id = thisPlayerID;
       
        players[thisPlayerID] = player;
        sockets[thisPlayerID] = socket;
        socket.emit('register', { id: thisPlayerID });

    });

    socket.on('spawn', function (data) {
        console.log(data.id)
        var playerID = data.id
        player.username = data.name
        console.log(data.name)
        players[playerID] = player;
        socket.emit('spawn', players[playerID]);
        socket.broadcast.emit('spawn', players[playerID])
    })

    socket.on('spawnOther', function () {
        for (var playerID in players) {
            if (playerID != thisPlayerID) {
                socket.emit('spawn', players[playerID])
            }
        }
    })
    

    socket.on('anim', function (data) {
        console.log(data)
        socket.broadcast.emit('anim', {
            id: data.id,
            direction: data.direction
        })
    })

    socket.on("anim", function (data) {
        // console.log(data);
        socket.broadcast.emit("anim", {
        id: data.id,
        direction: data.direction,
        });
    });
    
    socket.on('transform', function (data) {
        var id = data.id;
        var pos = data.pos;
        var rot= data.rot;
      // console.log(pos);
        socket.broadcast.emit('transform', {
            id: id,
            pos: pos,
            rot: rot
        })
    })

    socket.on("onsendmsg",function(data){
     //console.log(data);
    var uname = data.username;
    var ctext = data.chatText;
    // console.log(pos);
    socket.broadcast.emit("recmsg", {
    username: data.username,
    text: data.chatText,
    });
    socket.emit("recmsg", {
    username: data.username,
    text: data.chatText,
    });
    });


    socket.on('disconnect', function () {
        console.log("Player DisConnected");
        if (thisPlayerID != undefined) {
            delete players[thisPlayerID];
            delete sockets[thisPlayerID];
            socket.broadcast.emit('disconnected', { id: thisPlayerID })
        }
    });
});

console.log('Server started');
server.listen(3000);