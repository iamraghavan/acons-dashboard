const FolderModel = require("../models/folderModel");
const { bucket } = require("../config/firebase");
const slugify = require("slugify");

const createFolder = async (req, res) => {
    try {
        const { folderName } = req.body;

        if (!folderName) {
            return res.status(400).json({ error: "Folder name is required" });
        }

        // Slugify the folder name for consistency
        const slugifiedFolderName = slugify(folderName, { lower: true });

        console.log("Creating folder with name:", slugifiedFolderName);

        // Define the folder path
        const folderPath = `folders/${slugifiedFolderName}/placeholder.txt`;

        console.log("Folder path in Firebase Storage:", folderPath);

        // Create a placeholder file inside the folder
        const file = bucket.file(folderPath);
        await file.save("This is a placeholder file to create the folder.");

        console.log("Folder successfully created in Firebase Storage.");

        // Save folder data to MySQL
        const folder = await FolderModel.createFolder(folderName);
        console.log("Folder saved in MySQL:", folder);

        return res.status(201).json({ message: "Folder created successfully", folder });
    } catch (error) {
        console.error("Error creating folder:", error);
        return res.status(500).json({ error: "Internal server error", details: error.message });
    }
};

const deleteFolder = async (req, res) => {
    try {
        const { id } = req.params; // Get folder ID from URL params

        if (!id) {
            return res.status(400).json({ error: "Folder ID is required" });
        }

        // Get folder details from MySQL
        const folder = await FolderModel.getFolderById(id);
        if (!folder) {
            return res.status(404).json({ error: "Folder not found" });
        }

        const folderPath = `folders/${folder.slug}/`;

        console.log("Deleting folder from Firebase Storage:", folderPath);

        // List all files in the folder
        const [files] = await bucket.getFiles({ prefix: folderPath });

        // Delete each file inside the folder
        const deletePromises = files.map(file => file.delete());
        await Promise.all(deletePromises);

        console.log("Folder successfully deleted from Firebase Storage.");

        // Delete folder from MySQL database
        await FolderModel.deleteFolder(id);
        console.log("Folder deleted from MySQL:", folder.name);

        return res.status(200).json({ message: "Folder deleted successfully" });
    } catch (error) {
        console.error("Error deleting folder:", error);
        return res.status(500).json({ error: "Internal server error", details: error.message });
    }
};


module.exports = { createFolder, deleteFolder };
