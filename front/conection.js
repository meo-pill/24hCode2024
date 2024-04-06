// Importer la bibliothèque
const io = require('socket.io-client');
require('dotenv').config();

// Créer une nouvelle connexion WebSocket
const socket = io('ws://149.202.79.34:8085/api/socket', {
    auth: {
        token: process.env.ID_TOKEN,
    }
});

socket.on('connect', () => {
    console.log('connecté');
});


socket.on('connexion-1', data => {
    console.log(data);
});
socket.on('resultat-pose-1', data => {
    console.log('equipe 1');
    console.log(data);
});
socket.on('connexion-2', data => {
    console.log(data);
});
socket.on('resultat-pose-2', data => {
    console.log('equipe 2');
    console.log(data);
});
socket.on('connexion-3', data => {
    console.log(data);
});
socket.on('resultat-pose-3', data => {
    console.log('equipe 3');
    console.log(data);
});
socket.on('connexion-4', data => {
    console.log(data);
});
socket.on('resultat-pose-4', data => {
    console.log('equipe 4')
    console.log(data);
});
socket.on('connexion-5', data => {
    console.log(data);
});
socket.on('resultat-pose-5', data => {
    console.log('equipe 5');
    console.log(data);
});
socket.on('connexion-6', data => {
    console.log(data);
});
socket.on('resultat-pose-6', data => {
    console.log('equipe 6');
    console.log(data);
});
socket.on('connexion-7', data => {
    console.log(data);
});
socket.on('resultat-pose-7', data => {
    console.log('equipe 7');
    console.log(data);
});
socket.on('connexion-8', data => {
    console.log(data);
});
socket.on('resultat-pose-8', data => {
    console.log('equipe 8')
    console.log(data);
});
socket.on('connexion-9', data => {
    console.log(data);
});
socket.on('resultat-pose-9', data => {
    console.log('equipe 9')
    console.log(data);
});
socket.on('connexion-10', data => {
    console.log(data);
});
socket.on('resultat-pose-10', data => {
    console.log('equipe 10');
    console.log(data);
});
socket.on('connexion-11', data => {
    console.log(data);
});
socket.on('resultat-pose-11', data => {
    console.log('equipe 11');
    console.log(data);
});
socket.on('connexion-12', data => {
    console.log(data);
});
socket.on('resultat-pose-12', data => {
    console.log('equipe 12');
    console.log(data);
});
socket.on('connexion-13', data => {
    console.log(data);
});
socket.on('resultat-pose-13', data => {
    console.log('equipe 13');
    console.log(data);
});
socket.on('connexion-14', data => {
    console.log(data);
});
socket.on('resultat-pose-14', data => {
    console.log('equipe 14');
    console.log(data);
});
socket.on('connexion-15', data => {
    console.log(data);
});
socket.on('resultat-pose-15', data => {
    console.log('equipe 15');
    console.log(data);
});

socket.on('pixelUpdate', data => {
    console.log(data);
});

socket.on('disconnect', () => {
    console.log('déconnecté');
});

