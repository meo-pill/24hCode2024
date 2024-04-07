const canvas = document.querySelector("canvas")
const context = canvas.getContext("2d")
const image = new Image(350, 250)
const ws_credentials = await (await fetch("/api/wsCredentials")).json()
const socket = io(ws_credentials.url, {
    auth: {
        token: ws_credentials.token,
    }
})

context.imageSmoothingEnabled = false

socket.on('connect', () => {
    console.log('WebSocket connecter.')
})
socket.on('pixelUpdated', data => {
    context.fillStyle = `rgb(${data.rgb[0]}, ${data.rgb[1]}, ${data.rgb[2]})`
    context.fillRect(data.x, data.y, 1, 1)
})
socket.on('disconnect', () => {
    console.log('WebSocket déconnecter.')
})

image.src = "/api/getCanvaDataPixels"
image.addEventListener("load", () => {
    context.drawImage(image, 0, 0);
})