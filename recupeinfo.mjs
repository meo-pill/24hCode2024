import fetch from 'node-fetch';
import dotenv from 'dotenv';

const canvasId = "1"; // Remplacez par l'ID de votre canvas
fetch(`http://149.202.79.34:8085/api/canvas/${canvasId}`, {
  method: "GET",
  headers: {
    Authorization:
      `Bearer ${process.env.ACCES_TOKEN}`, // Remplacez VOTRE_ACCESS_TOKEN par votre token d'accès
  },
})
  .then((response) => response.json())
  .then((data) => console.log(data))
  .catch((error) => console.error("Erreur:", error));
