import { Api } from "./api.mjs"
import colors from "./colors.mjs"
import output from "./output.mjs"

const api = new Api()

await api.init()

const chunk_id = 5
const nb_worker = 50
const timeout = 11000
const size = 50
const line = 2
const pixel = []

for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
        if (output[i][j])
            pixel.push([i, j, output[i][j]])
    }
}

function update() {
    for (let i = 0; i < nb_worker; i++) {
        setTimeout(() => {
            const [x, y, color] = pixel[Math.round(Math.random() * (pixel.length - 1))]

            api.setWorkerPosition(351 + i, chunk_id, color, x, y - 50 * -(line - 4))
            console.log(351 + i, chunk_id, color, x, y - 50 * -(line - 4))
        }, (timeout / nb_worker) * i)
    }
}

setInterval(update, timeout)
update()