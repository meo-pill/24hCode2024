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

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});