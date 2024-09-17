const express = require('express');
const next = require('next');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

const http = require('http');
const socketIO = require('socket.io');

app.prepare().then(async () => {
    const server = express();
    const httpServer = http.createServer(server);
    const io = socketIO(httpServer);

    io.on('connection', (socket) => {
        console.log('Client connected');

        socket.on('message1', (opt) => {
            console.log('Recieved from API ::',opt.data,opt.socketid)
            if(opt.socketid){
                socket.to(opt.socketid).emit('message2',opt.data);
            }else{
                io.emit('message2', opt.data);
            }
    
            
        })
    });
   

    server.all('*', (req, res) => {
        return handle(req, res);
    });


    const PORT = process.env.PORT || 3000;
    httpServer.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
});