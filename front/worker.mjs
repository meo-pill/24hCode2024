import { Api } from "./api.mjs"
import colors from "./colors.mjs"
import output from "./output.mjs"

const api = new Api()

await api.init()

const timeout = 11000
const size = 50
const line = 2
const pixel = []

for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
        setTimeout(() => {
            api.setWorkerPosition(351 + j, 5, output[i][j], i, j - 50 * -(line - 4))
            console.log(351 + j, output[i][j], i, j - 50 * -(line - 4))
        }, timeout * i + j * (timeout / size))
    }
}