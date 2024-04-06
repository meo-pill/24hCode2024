// Importer la bibliothèque
const io = require('socket.io-client');

// Créer une nouvelle connexion WebSocket
const socket = io('ws://149.202.79.34:8085/api/socket', {
    auth: {
        token: '%K7%%GG,2U5g-k9'
    }
});

socket.emit('connexion-8', e => {
    console.log(e);
});

socket.on('connect', () => {
    console.log('connecté');
});

socket.on('pixelUpdate', data => {
    console.log(data);
});