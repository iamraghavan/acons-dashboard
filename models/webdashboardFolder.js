const db = require('../config/db'); // Importing the MySQL database connection

const saveImage = async (imageName, filePath, firebaseUrl, folderId) => {
    try {
        const [result] = await db.execute(
            'INSERT INTO webdashboard_image (name, file, firebase_url, folder_id) VALUES (?, ?, ?, ?)', 
            [imageName, filePath, firebaseUrl, folderId]
        );
        return result;
    } catch (error) {
        console.error('Error saving image data:', error);
        throw error;
    }
};


// Function to get all folders from the webdashboard_folder table
const getAllFolders = async () => {
    try {
        const [rows] = await db.execute('SELECT id, name, slug, created_at FROM webdashboard_folder');
        return rows; // Return the result from the query
    } catch (error) {
        console.error('Error fetching folders from database:', error);
        throw error;
    }
};

const getImagesByFolderId = async (folderId) => {
    try {
        const [rows] = await db.execute('SELECT id, name, file, firebase_url, created_at FROM webdashboard_image WHERE folder_id = ?', [folderId]);
        return rows; // Return the result from the query
    } catch (error) {
        console.error('Error fetching images from database:', error);
        throw error;
    }
};

async function findFolderBySlug(slug) {
    console.log("Received slug:", slug); // Debugging line

    if (!slug) {
        throw new Error("Invalid slug provided");
    }

    const sql = 'SELECT id, name, slug, created_at FROM webdashboard_folder WHERE slug = ?';

    try {
        const [rows] = await db.execute(sql, [slug]); // Corrected `db.execute()` instead of `db.pool.execute()`
        
        console.log("Query result:", rows); // Debugging
        return rows.length ? rows[0] : null;
    } catch (error) {
        console.error("Error in findFolderBySlug:", error);
        throw error;
    }
}

const getImageById = async (imageId) => {
    try {
        const [rows] = await db.execute('SELECT firebase_url FROM webdashboard_image WHERE id = ?', [imageId]);
        return rows.length ? rows[0] : null; // Return the image data or null if not found
    } catch (error) {
        console.error('Error fetching image:', error);
        throw error;
    }
};

// Function to delete the image from the database by image ID
const deleteImageById = async (imageId) => {
    try {
        const result = await db.execute('DELETE FROM webdashboard_image WHERE id = ?', [imageId]);
        return result; // Return the result of the delete operation
    } catch (error) {
        console.error('Error deleting image from database:', error);
        throw error;
    }
};



module.exports = {
    getAllFolders, getImagesByFolderId, saveImage, findFolderBySlug, getImageById, deleteImageById
};
