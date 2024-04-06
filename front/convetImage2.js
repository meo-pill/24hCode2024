const sharp = require('sharp');
const fs = require('fs');

// Lire le fichier Colors.json
let rawdata = fs.readFileSync('../Colors.json');
let colors = JSON.parse(rawdata);

// Fonction pour trouver la couleur la plus proche
function findClosestColor(r, g, b) {
    let minDist = Infinity;
    let closestColor = null;

    for (let color in colors) {
        let [r2, g2, b2] = colors[color];
        let dist = Math.sqrt(Math.pow(r-r2, 2) + Math.pow(g-g2, 2) + Math.pow(b-b2, 2));

        if (dist < minDist) {
            minDist = dist;
            closestColor = [r2, g2, b2];
        }
    }

    return closestColor;
}

// Redimensionner l'image et changer les couleurs
sharp('input.png') // Changer le nom du fichier en input.png
    .resize(50, 50)
    .raw()
    .toBuffer()
    .then(data => {
        let matrix = [];
        for (let i = 0; i < data.length; i += 3) {
            let r = data[i];
            let g = data[i + 1];
            let b = data[i + 2];

            let x = (i / 3) % 50;
            let y = Math.floor((i / 3) / 50);

            let closestColor = findClosestColor(r, g, b);
            if (!matrix[x]) {
                matrix[x] = [];
            }
            matrix[x][y] = closestColor;
        }
        fs.writeFileSync('output.json', JSON.stringify(matrix));
    })
    .catch(err => {
        console.error(err);
    });
