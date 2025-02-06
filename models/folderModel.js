const db = require("../config/db");
const slugify = require("slugify");

class FolderModel {
    static async createFolder(folderName) {
        const slug = slugify(folderName, { lower: true });

        // Ensure MySQL table exists
        const sql = "INSERT INTO webdashboard_folder (name, slug) VALUES (?, ?)";
        const values = [folderName, slug];

        const [result] = await db.execute(sql, values);
        return { id: result.insertId, name: folderName, slug };
    }

    static async getFolderById(id) {
        const [rows] = await db.query("SELECT * FROM webdashboard_folder WHERE id = ?", [id]);
        return rows[0];
    }

    static async deleteFolder(id) {
        await db.query("DELETE FROM webdashboard_folder WHERE id = ?", [id]);
    }
}

module.exports = FolderModel;
