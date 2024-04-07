import colors from "./colors.mjs"

const canvas = document.querySelector("canvas")
const context = canvas.getContext("2d")
const image = new Image(350, 250)
let ws_credentials = await (await fetch("/api/wsCredentials")).json()
let socket = io(ws_credentials.url, {
    auth: {
        token: ws_credentials.token,
    }
})
let selected_color = "black"
let last_element_selected

context.imageSmoothingEnabled = false

async function putPixel(x, y, workerid, color) {
    socket.emit("updatePixel", {
        "canvasId": "canvas_epreuve",
        "workerId": workerid,
        "x": x,
        "y": y,
        "color": color
    });
}

canvas.addEventListener('click', async function (event) {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;    // la relation scaleX entre les dimensions CSS et les dimensions réelles
    const scaleY = canvas.height / rect.height;  // la relation scaleY entre les dimensions CSS et les dimensions réelles

    const x = Math.round((event.clientX - rect.left) * scaleX);   // ajuster les coordonnées du clic en fonction de l'échelle
    const y = Math.round((event.clientY - rect.top) * scaleY);    // ajuster les coordonnées du clic en fonction de l'échelle
    const worker = await (await fetch("/api/getWorkerTiming")).json()

    putPixel(x, y, worker.indexOf(0) + 351, selected_color);
});

socket.on('connect', () => {
    console.log('WebSocket connecter.')
})
socket.on('pixelUpdated', data => {
    context.fillStyle = `rgb(${data.rgb[0]}, ${data.rgb[1]}, ${data.rgb[2]})`
    context.fillRect(data.x, data.y, 1, 1)
})
socket.on('disconnect', async () => {
    console.log('WebSocket déconnecter.');
    ws_credentials = await (await fetch("/api/wsCredentials")).json()
    socket = io(ws_credentials.url, {
        auth: {
            token: ws_credentials.token,
        }
    })
})

image.src = "/api/getCanvaDataPixels"
image.addEventListener("load", () => {
    context.drawImage(image, 0, 0);
})

const colors_element = document.querySelector("#colors div")

for (const key in colors) {
    const color = colors[key]
    const color_element = document.createElement("a")

    if (selected_color == key) {
        last_element_selected = color_element
        last_element_selected.classList.add("selected")
    }

    color_element.href = "#"
    color_element.title = key.split("_").map(string => {
        string = string.split("")
        string[0] = string[0].toUpperCase()

        return string.join("")
    }).join(" ")
    color_element.style.backgroundColor = `rgb(${color[0]}, ${color[1]}, ${color[2]})`
    color_element.classList.add("color")

    color_element.addEventListener("click", () => {
        selected_color = key
        last_element_selected.classList.remove("selected")
        last_element_selected = color_element
        color_element.classList.add("selected")
    })

    colors_element.append(color_element)
}