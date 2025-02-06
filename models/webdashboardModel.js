const db = require("../config/db");

class FolderModel {
    // Get total count of webdashboard_folder
    static async getTotalFolders() {
        const [rows] = await db.query("SELECT COUNT(*) AS totalFolders FROM webdashboard_folder");
        return rows[0].totalFolders;
    }

    // Get total count of webdashboard_image
    static async getTotalImages() {
        const [rows] = await db.query("SELECT COUNT(*) AS totalImages FROM webdashboard_image");
        return rows[0].totalImages;
    }
}

module.exports = FolderModel;