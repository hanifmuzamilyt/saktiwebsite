const express = require('express');
const multer = require('multer');
const { Storage } = require('@google-cloud/storage');
const { Firestore } = require('@google-cloud/firestore');
const path = require('path');

const app = express();

// Setup Multer for file uploads
const upload = multer({ dest: 'uploads/' }); // Temporary folder to store uploaded files

// Initialize Google Cloud Storage and Firestore
const storage = new Storage();
const firestore = new Firestore();
const bucketName = 'sakti-web-app-2024'; // Change to your bucket name

// Endpoint to handle file upload
app.post('/upload', upload.single('file'), async (req, res) => {
    const filePath = path.join(__dirname, req.file.path);
    const filename = req.file.originalname;

    // Upload file to Google Cloud Storage
    await storage.bucket(bucketName).upload(filePath, {
        gzip: true,
        metadata: {
            cacheControl: 'public, max-age=31536000',
        },
    });

    console.log(`${filename} uploaded to ${bucketName}.`);

    // Store file metadata in Firestore
    const fileUrl = `https://storage.googleapis.com/${bucketName}/${filename}`;
    const docRef = firestore.collection('files').doc();
    await docRef.set({
        filename: filename,
        url: fileUrl,
    });

    console.log('File metadata saved to Firestore.');

    // Send response back to client
    res.status(200).json({ message: 'File uploaded successfully', url: fileUrl });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});