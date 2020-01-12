/**
 * Author: Thibault Lenclos
 * Github: https://github.com/tlenclos
 *
 * Edited by: Etienne CRESPI
 * Github: https://github.com/Lorddistrict
 *
 * This file isn't required to make this app running
 * It allows you to run a node server and test your app
 */

const webSocket = require('ws').Server;
const wss = new webSocket({
    port: 8080
});

console.log('Starting websocket server');

// Memory database
const actions = [];
wss.on('connection', function connection(ws) {
    console.log(`new connection, ${wss.clients.size} clients`);

    // Send saved actions to new client
    actions.forEach(action => {
        ws.send(action);
    });

    ws.on('message', function incoming(data) {
        console.log('new message', JSON.stringify(data));

        // Save action
        actions.push(data);

        // Broadcast to all clients
        wss.clients.forEach(function each(client) {
            if (client !== ws && client.readyState === webSocket.OPEN) {
                client.send(data);
            }
        });
    });
});