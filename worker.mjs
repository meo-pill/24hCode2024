import { Api } from "./api.mjs"
import output from "./output.mjs"

const api = new Api()

await api.init()

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

function update() {
    for (let i = 0; i < nb_worker; i++) {
        setTimeout(() => {
            let [x, y, color] = pixel[index++]

            if (index == pixel.length)
                index = 0

            x += pos_x
            y += pos_y

            const chunk_id = (Math.floor(y / 50) + 1) + 5 * Math.floor(x / 50)
            x %= 50
            y %= 50

            api.setWorkerPosition(351 + i, chunk_id, color, x, y)
            console.log(351 + i, chunk_id, color, x, y)
        }, (timeout / nb_worker) * i)
    }
}

setInterval(update, timeout)
update()