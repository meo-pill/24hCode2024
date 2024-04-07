import { Api } from "./api.mjs"
import output from "./output.mjs"
import colors from "./colors.mjs"
import io from "socket.io-client"


const api = new Api()

await api.init()

const socket_url = "ws://" + process.env.API_URL + "socket"
let socket = io(socket_url, {
    auth: {
        token: api.access_token,
    }
})

// Fonction pour trouver la couleur la plus proche
function findColor(r, g, b) {
    for (let color in colors) {
        let [r2, g2, b2] = colors[color];
        if (r == r2 && g == g2 && b == b2) {
            return color;
        }
    }
}

socket.on('disconnect', async () => {
    console.log('WebSocket déconnecter.');
    await api.init()

    socket = io(socket_url, {
        auth: {
            token: api.access_token,
        }
    })
})

const pos_x = 0
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

async function updateWorkerList() {
    let workers = new Array(50)
    let currentTime = Date.now();
    const data = await Promise.all(Array.from(workers.keys()).map(i => api.getWorkerDetails(i + 1)))

    for (const index in data) {
        let dateDernierPixelPose = new Date(data[index].dateDernierPixelPose).getTime(); // Convertir en millisecondes
        let timeElapsed = currentTime - dateDernierPixelPose; // Temps écoulé depuis dateDernierPixelPose
        let timeRemaining = Math.max(0, 10000 - timeElapsed); // Temps restant avant que 10 secondes ne se soient écoulées, ou 0 si ce temps est déjà écoulé

        workers[index] = timeRemaining;
    }

    return workers
}

socket.on('pixelUpdated', data => {
    if (data.x >= pos_x && data.x < pos_x + width && data.y >= pos_y && data.y < pos_y + height) { // Si le pixel n'est pas dans la zone de protection
        if (pixel[data.x - pos_x][data.y - pos_y]) { // Si le pixel n'est pas dans une zone vide
            if (pixel[data.x - pos_x][data.y - pos_y] != findColor(data.rgb[0], data.rgb[1], data.rgb[2])) { // Si la couleur du pixel est différente de la couleur attendue
                (async () => { // Trouver un worker disponible
                    let worker = await updateWorkerList()
                    let bestworker = worker.indexOf(0)
                    while (bestworker == -1) { // Si aucun worker n'est disponible
                        await new Promise(resolve => setTimeout(resolve, 1000))
                        worker = await updateWorkerList()
                        bestworker = worker.indexOf(0)
                    }
                    // Envoyer le pixel au worker

                    console.log(bestworker + 351, data.x, data.y)
                    const chunk_id = (Math.floor(y / 50) + 1) + 5 * Math.floor(x / 50)
                    x = data.x % 50
                    y = data.y % 50
                    console.log(351 + bestworker, chunk_id, pixel[data.x - pos_x][data.y - pos_y], x, y)
                    api.setWorkerPosition(bestworker + 351, chunk_id, pixel[data.x - pos_x][data.y - pos_y], x, y)
                })();
            }
        }
    }
});