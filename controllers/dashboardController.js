const FolderModel = require("../models/webdashboardModel");

const getDashboardData = async (req, res) => {
    try {
        // Fetch total folders and images
        const totalFolders = await FolderModel.getTotalFolders();
        const totalImages = await FolderModel.getTotalImages();

        // Send the data to the frontend
        res.status(200).json({
            success: true,
            data: {
                galleryFolders: totalFolders,
                photos: totalImages,
            },
        });
    } catch (error) {
        console.error("Error fetching dashboard data:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
};

module.exports = { getDashboardData };