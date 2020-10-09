const webSocketServerPort = 8000;
const webSocketServer = require('websocket').server;
const http = require('http');
const { request } = require('https');

const server = http.createServer();
server.listen(webSocketServerPort);
console.log('listening on port 8000');

const wsServer = new webSocketServer({
    httpServer:server
}) ;

const clients = {};

const getUniqueId = () =>{
    const s4 = () => Math.floor((1+ Math.random()) * 0x10000).toString(16).substring(1);
    return s4() + s4() + '- ' + s4();
};
wsServer.on('request',function(request){
    var userId = getUniqueId();
    console.log(userId);
    console.log((new Date()) + ' received a new connecton from origin ' + request.origin + '.');

    const connection = request.accept(null, request.origin);
   clients[userId] = connection;
   console.log('connected: ' + userId + ' in ' + Object.getOwnPropertyNames(clients));

   connection.on('message',function(message){
    if (message.type === 'utf8') {
        console.log('Received Message: ', message.utf8Data);


        for(key in clients) {
            clients[key].sendUTF(message.utf8Data);
            console.log('sent message to: ', clients[key]);
        }
        
    }
   })
});
