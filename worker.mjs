import { Api } from "./api.mjs"
import io from "socket.io-client"
import output from "./output.mjs"
import colors from "./colors.mjs"

const api = new Api()

await api.init()

const socket = io("ws://" + process.env.API_URL + "socket", { auth: { token: api.access_token } })

const pos_x = 0
const pos_y = 100
const starting_worker = 351
const nb_worker = 50
const timeout = 10500

let pixel = []
let index = 0

const width = output.length
const height = output[0].length

for (let i = 0; i < width; i++) {
    for (let j = 0; j < height; j++) {
        if (output[i] && output[i][j])
            pixel.push([i, j, output[i][j]])
    }
}

let waiting_list = []

console.log("x:", pos_x, "y:", pos_y, "w:", width, "h:", height)

socket.on('pixelUpdated', data => {
    const {x, y, rgb} = data
    const color = output[x - pos_x][y - pos_y]
    let equal = true
    
    for (let i = 0; i < 3; i++)
        if (colors[color][i] != rgb[i])
            equal = false
        
    if (!equal)
        waiting_list.push([x - pos_x, y - pos_y, color])
})

let last_console_write = "\r"

function update() {
    while (waiting_list.length < nb_worker) {
        waiting_list.push(pixel[index++])

        if (index == pixel.length)
            index = 0
    }

    for (let i = starting_worker; i < starting_worker + nb_worker; i++) {
        setTimeout(() => {
            const [x, y, color] = waiting_list.pop()

            process.stdout.write("\r" + " ".repeat(last_console_write.length) + "\r")
            process.stdout.write(last_console_write = `x: \x1b[33m${x}\x1b[37m y: \x1b[33m${y}\x1b[37m id: \x1b[33m${i}\x1b[37m c: \x1b[33m${color}\x1b[37m`);

            api.setWorkerPosition(i, 35, color, x + pos_x - 300, y + pos_y - 200).catch(() => waiting_list.push([x, y, color]))
        }, (timeout / nb_worker) * (i - starting_worker))
    }
}

setInterval(update, timeout)
update()