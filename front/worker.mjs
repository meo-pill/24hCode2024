import { Api } from "./api.mjs"

const api = new Api()

for (let i = 0; i < 50; i++) {
    setTimeout(() => {
        for (let j = 0; j < 50; j++) {
            api.setWorkerPosition(351 + j, 5, "golden_yellow", i, j)
            console.log(351 + j, "golden_yellow", i, j)
        }
    }, 11000 * i)
}