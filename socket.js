let sockets = []
let socketsRoom = []

const lunchSocket = (server) => {
    const io = require('socket.io')(server);
    
    io.sockets.on('connection', function (socket) {
        socket.userData = { x: 0, y: 0, z: 0, heading: 0 };
        //Default values;
        socket.join(socket.id);
        console.log(`${socket.id} connected`);
        socket.emit('setId', { id: socket.id });

        socket.on('disconnect', function () {
            console.log(`Player ${socket.id} disconnected`)
            socket.broadcast.emit('deletePlayer', { id: socket.id });

            if (sockets[socketsRoom[socket.id]] && sockets[socketsRoom[socket.id]].streams.length >= 1) {
                sockets[socketsRoom[socket.id]].streams = sockets[socketsRoom[socket.id]].streams.filter(stream => {
                    if (stream.broadcaster == socket.id) {
                        //todo
                        //console.log("Emit endVideoChat")
                        //socket.to(socketsRoom[socket.id]).emit('endVideoChat', { sender: socket.id });
                    } else {
                        return stream
                    }
                })
            }

            if (sockets[socketsRoom[socket.id]] && sockets[socketsRoom[socket.id]]["members"][socket.id]) {
                delete sockets[socketsRoom[socket.id]]["members"][socket.id]
                delete socketsRoom[socket.id]
            }
        });

        socket.on('changeRoom', function (data) {

            socket.broadcast.to(socketsRoom[socket.id]).emit('deletePlayer', { id: socket.id });
            socket.leave(socketsRoom[socket.id]);
            if (sockets[socketsRoom[socket.id]] && sockets[socketsRoom[socket.id]].streams.length >= 1) {
                sockets[socketsRoom[socket.id]].streams = sockets[socketsRoom[socket.id]].streams.filter(stream => {
                    if (stream.broadcaster == socket.id) {
                        //todo
                        //console.log("Emit endVideoChat")
                        //socket.to(socketsRoom[socket.id]).emit('endVideoChat', { sender: socket.id });
                    } else {
                        return stream
                    }
                })
            }
            if (sockets[socketsRoom[socket.id]] && sockets[socketsRoom[socket.id]]["members"][socket.id]) {
                delete sockets[socketsRoom[socket.id]]["members"][socket.id]
                delete socketsRoom[socket.id]
            }

            if (sockets[data.room] == undefined) {
                sockets[data.room] = {
                    members: [],
                    streams: []
                }
            }
            socketsRoom[socket.id] = data.room;
            sockets[data.room]["members"][socket.id] = {
                model: data.model,
                colour: data.colour,
                x: data.x,
                y: data.y,
                z: data.z,
                heading: data.h,
                pb: data.pb,
                action: "Idle",
            }

            socket.join(data.room);

            //check there is active stream in this room
            console.log(sockets[data.room].streams)
            if (sockets[data.room].streams.length >= 1) {
                sockets[data.room].streams.forEach(stream => {
                    //socket.to(stream.broadcaster).emit('acceptScreenSharing', { sender: socket.id });
                    console.log("Emit startScreenSharing")
                    console.log("stream", stream)
                    console.log("socket.id", socket.id)
                    console.log("stream.broadcaster", stream.broadcaster)
                    io.to(socket.id).emit('startScreenSharing', { sender: stream.broadcaster });
                });
            }

        });

        socket.on('init', function (data) {
            if (sockets[data.room] == undefined) {
                sockets[data.room] = {
                    members: [],
                    streams: []
                }
            }
            socketsRoom[socket.id] = data.room;
            sockets[data.room]["members"][socket.id] = {
                model: data.model,
                colour: data.colour,
                x: data.x,
                y: data.y,
                z: data.z,
                heading: data.h,
                pb: data.pb,
                action: "Idle",
            }

            socket.join(data.room);

            //check there is active stream in this room
            console.log(sockets[data.room].streams)
            if (sockets[data.room].streams.length >= 1) {
                sockets[data.room].streams.forEach(stream => {
                    //socket.to(stream.broadcaster).emit('acceptScreenSharing', { sender: socket.id });
                    console.log("Emit startScreenSharing")
                    console.log("stream", stream)
                    console.log("socket.id", socket.id)
                    console.log("stream.broadcaster", stream.broadcaster)
                    io.to(socket.id).emit('startScreenSharing', { sender: stream.broadcaster });
                });
            }

        });

        socket.on('update', function (data) {
            if (sockets[data.room] && sockets[data.room]["members"][socket.id]) {
                sockets[data.room]["members"][socket.id].x = data.x;
                sockets[data.room]["members"][socket.id].y = data.y;
                sockets[data.room]["members"][socket.id].z = data.z;
                sockets[data.room]["members"][socket.id].heading = data.h;
                sockets[data.room]["members"][socket.id].pb = data.pb;
                sockets[data.room]["members"][socket.id].action = data.action;
                if (typeof data.chair != "undefined") {
                    sockets[data.room]["members"][socket.id].chair = data.chair;
                }
            }
        });

        socket.on('chat message', function (data) {
            console.log(`chat message:${data.id} ${data.message}`);
            io.to(data.id).emit('chat message', { id: socket.id, message: data.message });
        })

        //screen sharing sockets
        socket.on('startScreenSharing', (data) => {
            sockets[socketsRoom[socket.id]].streams.push({
                broadcaster: data.sender,
                position: {}
            })
            console.log("startScreenSharing")
            if (data.to == "all") {
                socket.to(socketsRoom[socket.id]).emit('startScreenSharing', { sender: data.sender });
                //socket.to(data.to).emit('startScreenSharing', { sender: data.sender });
            } else {
                socket.to(data.to).emit('startScreenSharing', { sender: data.sender });
            }
        });

        socket.on('acceptScreenSharing', (data) => {
            console.log("acceptScreenSharing")
            socket.to(data.to).emit('acceptScreenSharing', { sender: data.sender });
        });

        //video chat - voice - webrtc
        socket.on('videochatRequest', (data) => {
            console.log("videochatRequest")
            socket.to(data.to).emit('videochatRequest', { sender: data.sender });
        });

        socket.on('voicechatRequest', (data) => {
            console.log("voicechatRequest")
            socket.to(data.to).emit('voicechatRequest', { sender: data.sender });
        });

        socket.on('newUserStart', (data) => {
            socket.to(data.to).emit('newUserStart', { sender: data.sender });
        });

        socket.on('newUserStartVoice', (data) => {
            socket.to(data.to).emit('newUserStartVoice', { sender: data.sender });
        });

        socket.on('videoSdp', (data) => {
            socket.to(data.to).emit('videoSdp', { description: data.description, sender: data.sender });
        });

        socket.on('voiceSdp', (data) => {
            socket.to(data.to).emit('voiceSdp', { description: data.description, sender: data.sender });
        });

        socket.on('ice candidates', (data) => {
            socket.to(data.to).emit('ice candidates', { candidate: data.candidate, sender: data.sender });
        });

        socket.on('endVideoChat', (data) => {
            console.log("endVideoChat")
            if (data.to == "all") {
                if (sockets[socketsRoom[socket.id]] && sockets[socketsRoom[socket.id]].streams.length >= 1) {
                    sockets[socketsRoom[socket.id]].streams = sockets[socketsRoom[socket.id]].streams.filter(stream => {
                        if (stream.broadcaster == socket.id) {
                            socket.to(socketsRoom[socket.id]).emit('endVideoChat', { sender: data.sender });
                        } else {
                            return stream
                        }
                    })
                }
            } else {
                socket.to(data.to).emit('endVideoChat', { sender: data.sender });
            }
        });

        socket.on('endVoiceChat', (data) => {
            socket.to(data.to).emit('endVoiceChat', { sender: data.sender });
        });

    });


    setInterval(function () {
        const nsp = io.of('/');
        for (const room in sockets) {
            let pack = [];
            for (const socketId in sockets[room]["members"]) {
                let data = {
                    id: socketId,
                    model: sockets[room]["members"][socketId].model,
                    colour: sockets[room]["members"][socketId].colour,
                    x: sockets[room]["members"][socketId].x,
                    y: sockets[room]["members"][socketId].y,
                    z: sockets[room]["members"][socketId].z,
                    heading: sockets[room]["members"][socketId].heading,
                    pb: sockets[room]["members"][socketId].pb,
                    action: sockets[room]["members"][socketId].action,
                }
                if (typeof sockets[room]["members"][socketId].chair != "undefined") {
                    data.chair = sockets[room]["members"][socketId].chair
                }
                pack.push(data);
            }
            if (pack.length > 0) io.to(room).emit('remoteData', pack);
        }
    }, 40);
}

module.exports = { socketsRoom, sockets , lunchSocket }