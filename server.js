const express = require('express');
const bodyParser = require('body-parser');
const qrCode = require('qrcode');
const fs = require('fs');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/generateQR', async (req, res) => {
    const text = req.body.text;

    try {
        // Generate QR code
        const qrCodeImage = await qrCode.toBuffer(text);

        // Create a folder named after the timestamp
        const timestamp = Date.now();
        const folderPath = path.join(__dirname, 'public', 'QR-generator', timestamp.toString());
        console.log('folderPath:', folderPath);

        if (!fs.existsSync(folderPath)) {
            fs.mkdirSync(folderPath, { recursive: true });
            console.log('Folder created:', folderPath);
        }

        const fileName = 'qrcode.png';
        const filePath = path.join(folderPath, fileName);
        console.log('filePath:', filePath);

        fs.writeFileSync(filePath, qrCodeImage);

        // Send the path of the saved file back to the client
        res.send({ filePath: filePath });
    } catch (error) {
        console.error("Error generating QR code:", error);
        res.status(500).send("Internal Server Error");
    }
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
