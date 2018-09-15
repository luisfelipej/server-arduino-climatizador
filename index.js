//SERVIDOR EXPRESS
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO.listen(server);


server.listen(4001, ()=>console.log(`Server on port ${4001}`));

// const ngrok = require('ngrok');
// (async function () {
//     const urlAPI = await ngrok.connect(4001);
//     io.emit('ngrok', urlAPI);
//     console.log(urlAPI)
// })();


//COMUNICACION CON ARDUINO
const Serialport = require('serialport');
const Readline = Serialport.parsers.Readline;

const port = new Serialport('COM3',{
    baudRate: 9600
});



const parser = port.pipe(new Readline({ delimiter: '\r\n' }));

port.on('open',()=>{
    console.log('connection open');
    io.emit('open');
});

parser.on('data',(data)=>{
    if(Number(data)){
        console.log(`${Number(data).toFixed(1)}°C`);
        io.emit('temp',Number(data).toFixed(1));
        io.emit('connect');
    }
    else{
        console.log(data);
        [primeraLetra, ...resto] = data;
        if(primeraLetra === 't'){
            io.emit('tempUsuario', Number(resto.join('')));
        }
        if(primeraLetra === 'c'){
            switch (resto.join('')) {
                case 'ON':
                    io.emit('cON');
                    break;
                case 'OFF':
                    io.emit('cOFF');           
                default:
                    break;
            }
        }
        if(primeraLetra === 'v'){
            switch (resto.join('')) {
                case 'ON':
                    io.emit('vON');
                    break;
                case 'OFF':
                    io.emit('vOFF');
                    break;          
                default:
                    break;
            }
        }
    }
    
});
port.on('error',(err)=>console.log(err));
port.on('close',()=>{
    console.log('Arduino desconectado');
    io.emit('close');
})

io.on('connection', (socket)=>{
    console.log('Usuario conectado');
    socket.on('disconnect',()=>console.log('Usuario desconectado'));

    //Reciviendo data
    socket.on('clientTemp', (temp)=>{
        port.write(temp);
        // port.emit(toString(temp));
        console.log('DATAUSUARIO')
    })
    //Cambiando potencias
    socket.on('conCa', consumoCal =>{
        io.emit('conCa', consumoCal);
    })
    socket.on('conVe', consumoVen =>{
        io.emit('conVe', consumoVen);
    })
})
