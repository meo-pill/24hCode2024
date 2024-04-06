const sharp = require('sharp');
const Jimp = require('jimp');
const fs = require('fs');

// Lire le fichier Colors.json
let rawdata = fs.readFileSync('../Colors.json');
let colors = JSON.parse(rawdata);

// Fonction pour trouver la couleur la plus proche
function findClosestColor(r, g, b, a) {
    if (a === 0) { // Si le pixel est complètement transparent, retourne null
        return null;
    }
    
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
sharp('input.png')
    .resize(50, 50)
    .toBuffer()
    .then(data => {
        Jimp.read(data)
            .then(image => {
                let matrix = [];
                image.scan(0, 0, image.bitmap.width, image.bitmap.height, function(x, y, idx) {
                    let r = this.bitmap.data[idx + 0];
                    let g = this.bitmap.data[idx + 1];
                    let b = this.bitmap.data[idx + 2];
                    let a = this.bitmap.data[idx + 3]; // Valeur de l'opacité

                    let closestColor = findClosestColor(r, g, b, a);
                    if (closestColor === null) {
                        // Ignorer les pixels transparents
                        return;
                    }

                    if (!matrix[x]) {
                        matrix[x] = [];
                    }
                    matrix[x][y] = closestColor;

                    if (x === image.bitmap.width-1 && y === image.bitmap.height-1) {
                        fs.writeFileSync('output.json', JSON.stringify(matrix));
                    }
                });
            })
            .catch(err => {
                console.error(err);
            });
    })
    .catch(err => {
        console.error(err);
    });
