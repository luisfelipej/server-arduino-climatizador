//SERVIDOR EXPRESS
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO.listen(server);

var port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

server.listen(port, ()=>console.log(`Server on port ${port}`));


//COMUNICACION CON ARDUINO
const Serialport = require('serialport');
const Readline = Serialport.parsers.Readline;

const port = new Serialport('COM3',{
    baudRate: 9600
});

const parser = port.pipe(new Readline({ delimiter: '\r\n' }));

parser.on('open',()=>{
    console.log('connection open');
    io.emit('open');
});
parser.on('data',(data)=>{
    console.log(`${Number(data).toFixed(1)}°C`);
    io.emit('temp',Number(data).toFixed(1));
    io.emit('connect');
});
port.on('error',(err)=>console.log(err));
port.on('close',()=>{
    console.log('Arduino desconectado');
    io.emit('close');
})

io.on('connection', (socket)=>{
    console.log('Usuario conectado');
    socket.on('disconnect',()=>console.log('Usuario desconectado'));
})
