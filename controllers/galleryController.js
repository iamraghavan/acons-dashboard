const webdashboardFolder = require('../models/webdashboardFolder'); 
const webdashboardImage = require('../models/webdashboardFolder');
const multer = require('multer');
const { bucket } = require('../config/firebase');


// Function to fetch all gallery folders
const getGallery = async (req, res) => {
    try {
        const folders = await webdashboardFolder.getAllFolders();
        res.render('gallery', { title: 'Gallery', folders: folders, user: req.session.user });
    } catch (error) {
        console.error('Error fetching folders:', error);
        res.status(500).send('Error fetching folders');
    }
};

// Function to fetch all images in a specific folder
const getFolderImages = async (req, res) => {
    const folderId = req.params.folderId;
    try {
        const images = await webdashboardImage.getImagesByFolderId(folderId);
        res.render('folder-view', { title: 'Folder Images', images: images, folderId: folderId });
    } catch (error) {
        console.error('Error fetching folder images:', error);
        res.status(500).send('Error fetching images');
    }
};

// Route handler to upload images to Firebase Storage
const uploadImages = async (req, res) => {
    const { slug } = req.params;
    const imageFiles = req.files; // Use `req.files` instead of `req.file`

    console.log("Received slug in uploadImages:", slug);

    if (!imageFiles || imageFiles.length === 0) {
        return res.status(400).json({ message: "No file selected." });
    }

    try {
        const folder = await webdashboardFolder.findFolderBySlug(slug);

        if (!folder) {  
            return res.status(404).json({ message: "Folder not found." });
        }

        let uploadedImages = [];

        for (let file of imageFiles) {
            const filesName = `Andavar College of Nursing | ${new Date().getFullYear()} | Bumble Bees IT Solutions | Nagai | ${Math.floor(Math.random() * 1000)}`;
            const fileName = `Andavar College of Nursing_${new Date().getFullYear()}_${Math.floor(Math.random() * 1000)}.webp`;
            const filePath = `folders/${folder.slug}/${fileName}`;

            const fileUpload = bucket.file(filePath).createWriteStream();

            await new Promise((resolve, reject) => {
                fileUpload.on("finish", async () => {
                    const firebaseUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(filePath)}?alt=media`;

                    await webdashboardImage.saveImage(filesName, filePath, firebaseUrl, folder.id);
                    uploadedImages.push({ fileName, filePath, firebaseUrl, folderId: folder.id });

                    resolve();
                });

                fileUpload.on("error", (error) => reject(error));
                fileUpload.end(file.buffer);
            });
        }

        res.json({ message: "Images uploaded successfully.", images: uploadedImages });

    } catch (error) {
        console.error("Error uploading image:", error);
        res.status(500).json({ message: "Error uploading image." });
    }
};


const deleteImage = async (req, res) => {
    const imageId = req.params.id; // Extracting image ID from URL parameters

    try {
        // Fetch image details from database using image ID
        const image = await webdashboardImage.getImageById(imageId); // Using the model to get image details

        if (!image) {
            return res.status(404).json({ message: 'Image not found' });
        }

        const imageUrl = image.firebase_url;
        const filePath = imageUrl.split('/o/')[1].split('?')[0]; // Extract the file path from Firebase URL

        // Delete image from Firebase Storage
        await bucket.file(decodeURIComponent(filePath)).delete();

        // Delete image record from MySQL database using the model
        await webdashboardImage.deleteImageById(imageId);

        return res.json({ message: 'Image deleted successfully' });
    } catch (error) {
        console.error('Error deleting image:', error);
        return res.status(500).json({ message: 'Error deleting image', error });
    }
};


module.exports = { getGallery, getFolderImages, uploadImages, deleteImage };
