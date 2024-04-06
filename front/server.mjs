import { Api } from './api.mjs'; // Vérifiez le chemin pour être sûr qu'il est correct
import express from "express";
import cors from "cors";
import 'dotenv/config';



const app = express();
const port = 3000;

app.use(cors());
app.use(express.static('.')); // Serve files from the current directory

const api = new Api();
await api.init();

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
        const buffer = await api.getCanvaDataPixels();
        res.writeHead(200, {
            'Content-Type': 'image/jpeg',
            'Content-Length': buffer.byteLength
        });
        res.end(Buffer.from(buffer));
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