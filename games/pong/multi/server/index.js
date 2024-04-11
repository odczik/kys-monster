const http = require('http');
const ws = require('ws');
require("dotenv").config()

let server = http.createServer((req, res) => {
    switch(req.url){
        case "/":
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end();
            break;
    }
    
});

server.addListener('upgrade', (req) => console.log('UPGRADE:', req.url, "FROM:", `${req.socket.remoteAddress}:${req.socket.remotePort}`));
server.on('error', (err) => console.error(err));
server.listen(process.env.PORT, () => console.log('Https running on port', process.env.PORT));

let rooms = {};
let clients = {};

const wss = new ws.Server({server, path: '/'});
wss.on('connection', function connection(ws) { 
    console.log('A new connection has been established. Total clients: ', wss.clients.size);
    ws.send(JSON.stringify({ type: "msg", value: "Connection established." }));

    ws.id = Math.random().toString(36).substring(7);
    clients[ws.id] = ws;
    clients[ws.id].room = null;


    ws.addEventListener("message", (msg) => {
        try {
            msg = JSON.parse(msg.data)
        } catch(e) {
            console.error("Error parsing JSON, terminating connection.")
            return ws.close(1003, "Invalid JSON");
        }
        switch(msg.type){
            case "create":
                create(ws);
                break;
            case "join":
                join(ws, msg.params);
                break;
            case "leave":
                leave(msg.params);
                break;    
            case "rooms":
                ws.send(JSON.stringify({type: "rooms", value: getRooms()}));
                break;
            case "update":
                handleGameUpdate(ws, msg);
                break;
            default:
                console.warn(`Type: ${type} unknown`);
                break;
        }
    })
    ws.on("close", (socket) => {
        console.log("A connection has been closed.", socket, ws.id)
        if(clients[ws.id].room){
            console.log("Removing player from room.")
            let room = rooms[clients[ws.id].room];
            room.players = room.players.filter(player => player !== ws);
            if(room.players.length === 0){
                delete rooms[clients[ws.id].room];
            } else {
                room.players[0].send(JSON.stringify({type: "error", value: "Player has left the room."}));
            }
        }
        delete clients[ws.id];
        updateRooms();
    })
});

const getRooms = () => {
    return Object.values(rooms).map(room => ({id: room.id, players: room.players.length}));
}
const updateRooms = () => {
    wss.clients.forEach(client => {
        client.send(JSON.stringify({type: "rooms", value: getRooms()}));
    })
}

const create = (ws) => {
    let id = Math.random().toString(36).substring(7);
    rooms[id] = { id, players: [ws] };

    clients[ws.id].room = id;
    clients[ws.id].host = true;

    ws.send(JSON.stringify({type: "room", value: id}));
    updateRooms();
}

const join = (ws, id) => {
    if(clients[ws.id].room) return ws.send(JSON.stringify({type: "error", value: "You are already in a room.", client: clients[ws.id]}));
    if(!rooms[id]) return ws.send(JSON.stringify({type: "error", value: "Room not found."}));
    if(rooms[id].players.length >= 2) return ws.send(JSON.stringify({type: "error", value: "Room is full."}));
    
    rooms[id].players.push(ws);

    clients[ws.id].room = id;
    clients[ws.id].host = false;

    ws.send(JSON.stringify({type: "room", value: id}));
    rooms[id].players.forEach(player => {
        player.send(JSON.stringify({type: "start"}));
    })
    
    updateRooms();
}

const handleGameUpdate = (ws, msg) => {
    rooms[clients[ws.id].room].players.forEach(player => {
        player.send(JSON.stringify({type: "update", value: msg.value}));
    })
}