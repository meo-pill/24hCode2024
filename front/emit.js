
// Importer la bibliothèque
const io = require('socket.io-client');
require('dotenv').config();

const fetch = require('node-fetch');
const url = 'http://149.202.79.34:8081/realms/codelemans/protocol/openid-connect/token';
const options = {
    method: 'POST',
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: new URLSearchParams({
        'grant_type': 'password',
        'client_id': `${process.env.CLIENT_ID}`,
        'username': `${process.env.USERNAME}`,
        'password': `${process.env.MDP}`,
    })
};

fetch(url, options)
    .then(res => res.json())
    .then(json => console.log(json.access_token))
    .catch(err => console.error('error:' + err));


