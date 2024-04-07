import { Api } from "./api.mjs"
import output from "./output.mjs"
let ws_credentials = await (await fetch("/api/wsCredentials")).json()
let socket = io(ws_credentials.url, {
    auth: {
        token: ws_credentials.token,
    }
})

const fs = require('fs');

// Lire le fichier Colors.json
let rawdata = fs.readFileSync('./Colors.json');
let colors = JSON.parse(rawdata);

// Fonction pour trouver la couleur la plus proche
function findClosestColor(r, g, b, a) {
    if (a === 0) { // Si le pixel est complètement transparent, retourne null
        return null;
    }

    let minDist = Infinity;
    let closestColor = null;

    for (let color in colors) {
        let [r2, g2, b2] = colors[color];
        let dist = Math.sqrt(Math.pow(r - r2, 2) + Math.pow(g - g2, 2) + Math.pow(b - b2, 2));

        if (dist < minDist) {
            minDist = dist;
            closestColor = color;
        }
    }

    return closestColor;
}

socket.on('disconnect', async () => {
    console.log('WebSocket déconnecter.');
    ws_credentials = await (await fetch("/api/wsCredentials")).json()
    socket = io(ws_credentials.url, {
        auth: {
            token: ws_credentials.token,
        }
    })
})

const api = new Api()

await api.init()

const pos_x = 50
const pos_y = 50
const width = 100
const height = 150

const nb_worker = 50
const timeout = 10500
let pixel = []
let index = 150 * 6

for (let i = 0; i < width; i++) {
    for (let j = 0; j < height; j++) {
        if (output[i] && output[i][j])
            pixel.push([i, j, output[i][j]])
    }
}

socket.on('pixelUpdated', data => {
    if (data.x < pos_x || data.x >= pos_x + width || data.y < pos_y || data.y >= pos_y + height) { // Si le pixel n'est pas dans la zone de protection
        if (output[data.x - pos_x][data.y - pos_y] != []) { // Si le pixel n'est pas dans une zone vide
            if (output[data.x - pos_x][data.y - pos_y] != findClosestColor(data.rgb[0], data.rgb[1], data.rgb[2], 255)) { // Si la couleur du pixel est différente de la couleur attendue
                (async () => { // Trouver un worker disponible
                    let worker = await (await fetch("/api/getWorkerTiming")).json()
                    let bestworker = worker.indexOf(0)
                    while (bestworker == -1) { // Si aucun worker n'est disponible
                        await new Promise(resolve => setTimeout(resolve, 1000))
                        worker = await (await fetch("/api/getWorkerTiming")).json()
                        bestworker = worker.indexOf(0)
                    }
                    // Envoyer le pixel au worker
                    api.setWorkerPosition(bestworker + 1, chunk_id, color, x, y)
                })();
            }
        }
    }
});


async function update() {
    let [x, y, color] = pixel[index++]
    
    if (index == pixel.length)
        index = 0

    x += pos_x
    y += pos_y

    const chunk_id = (Math.floor(y / 50) + 1) + 5 * Math.floor(x / 50)
    x %= 50
    y %= 50
    // Trouver un worker disponible
    worker = await (await fetch("/api/getWorkerTiming")).json()
    let bestworker = worker.indexOf(0)
    while (bestworker == -1) { // Si aucun worker n'est disponible
        await new Promise(resolve => setTimeout(resolve, 1000))
        worker = await (await fetch("/api/getWorkerTiming")).json()
        bestworker = worker.indexOf(0)
    }
    // Envoyer le pixel au worker
    api.setWorkerPosition(bestworker + 1, chunk_id, color, x, y)
    console.log(351 + i, chunk_id, color, x, y)
}

setInterval(update, timeout)
update()