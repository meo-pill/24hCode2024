import { Api } from "./api.mjs"
import io from "socket.io-client"
import output from "./output.mjs"
import colors from "./colors.mjs"

const api = new Api()

await api.init()

const socket = io("ws://" + process.env.API_URL + "socket", { auth: { token: api.access_token } })

const pos_x = 300
const pos_y = 50
const starting_worker = 351
const nb_worker = 50
const timeout = 10500

let pixel = []

const width = output.length
const height = output[0].length

for (let i = 0; i < width; i++) {
    for (let j = 0; j < height; j++) {
        if (output[i] && output[i][j]) {
            let [x, y] = [i + pos_x, j + pos_y]

            if (x < 0 || y < 0 || x >= 350 || y >= 250)
                continue;

            pixel.push([i, j, output[i][j]])
        }
    }
}

let waiting_list = []

console.log("x:", pos_x, "y:", pos_y, "w:", width, "h:", height)

socket.on('pixelUpdated', data => {
    let {x, y, rgb} = data

    x -= pos_x
    y -= pos_y

    if (x < 0 || y < 0 || x >= width || y >= height)
        return;

    const color = output[x][y]
    let equal = true
    
    for (let i = 0; i < 3; i++)
        if (colors[color][i] != rgb[i])
            equal = false
        
    if (!equal)
        waiting_list.push([x, y, color])
})

let last_console_write = "\r"

function update() {
    while (pixel.length && waiting_list.length < nb_worker)
        waiting_list.push(pixel.pop())

    for (let i = starting_worker; i < starting_worker + nb_worker; i++) {
        setTimeout(() => {
            if (waiting_list.length) {
                const [x, y, color] = waiting_list.pop()

                process.stdout.write("\r" + " ".repeat(last_console_write.length) + "\r")
                process.stdout.write(last_console_write = `x: \x1b[33m${x}\x1b[37m y: \x1b[33m${y}\x1b[37m id: \x1b[33m${i}\x1b[37m c: \x1b[33m${color}\x1b[37m`);

                api.setWorkerPosition(i, 35, color, x + pos_x - 300, y + pos_y - 200).catch(() => waiting_list.push([x, y, color]))
            }
        }, (timeout / nb_worker) * (i - starting_worker))
    }
}

setInterval(update, timeout)
update()