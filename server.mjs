import { Api } from './api.mjs'; // Vérifiez le chemin pour être sûr qu'il est correct
import express from "express";
import cors from "cors";
import 'dotenv/config';
import fs from "fs";


const app = express();
const port = 3000;

app.use(cors());
app.use(express.static('front')); // Serve files from the current directory

const api = new Api();
await api.init();

app.get("/socket-io.js", (req, res) => {
    res.set({
        'Content-Type': 'application/javascript'
    });
    res.send(fs.readFileSync("./node_modules/socket.io-client/dist/socket.io.min.js"))
});

app.get("/api/wsCredentials", async (req, res) => { await api.init();
    res.send({
        url: "ws://" + process.env.API_URL + "socket",
        token: api.access_token
    })
})

// Exemple d'endpoint qui utilise `Api` pour lister les équipes
app.get('/api/listEquipe', async (req, res) => {
    try {
        const data = await api.listEquipe();
        res.json(data);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

// Appel à infoChunk avec un paramètre
app.get('/api/infoChunk/:id_chunk', async (req, res) => {
    try {
        const data = await api.infoChunk(req.params.id_chunk);
        res.json(data);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/api/getCanvaData', async (req, res) => {
    try {
        const data = await api.getCanvaData();
        res.json(data);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/api/getCanvaDataPixels', async (req, res) => {
    try {
        const buffer = Buffer.from((await api.getCanvaDataPixels()).split(",")[1], "base64");

        res.set({
            'Content-Type': 'text/plain',
            'Content-Length': buffer.byteLength
        });
        res.end(buffer);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});


app.get('/api/getCanvaSettings', async (req, res) => {
    try {
        const data = await api.getCanvaSettings();
        res.json(data);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/api/statChunk/:id_chunk', async (req, res) => {
    try {
        const data = await api.statChunk(req.params.id_chunk);
        res.json(data);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});