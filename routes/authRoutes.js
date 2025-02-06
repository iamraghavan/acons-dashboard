const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const galleryController = require('../controllers/galleryController');

const multer = require('multer');
const folderController = require('../controllers/folderController');
const dashboardController = require('../controllers/dashboardController');
const storage = multer.memoryStorage();


router.get('/', authController.preventLoginAccess, (req, res) => {
    res.render('index', { title: 'Login' });
});

router.post('/login', authController.loginUser);
router.get('/dashboard', authController.ensureAuthenticated, authController.dashboardPage);
router.get('/logout', authController.logoutUser);


 // Store file in memory (for Firebase upload)
 const upload = multer({
    storage: storage,
    limits: { fileSize: 2 * 1024 * 1024 }, // Limit to 2MB per file
    fileFilter: (req, file, cb) => {
        if (file.mimetype !== 'image/webp') {
            return cb(new Error('Only .webp files are allowed'), false);
        }
        cb(null, true);
    }
});



// Route to display the gallery of folders
router.get('/gallery', authController.ensureAuthenticated, galleryController.getGallery);

// Route to view images in a specific folder
router.get('/folder/:folderId/view', authController.ensureAuthenticated, galleryController.getFolderImages);

// Route to handle image uploads for a specific folder based on slug
router.post('/folder/:slug/upload', authController.ensureAuthenticated, upload.array('files', 10), galleryController.uploadImages);


router.delete('/delete-image/:id', authController.ensureAuthenticated, galleryController.deleteImage);

router.post("/create-folder", authController.ensureAuthenticated, folderController.createFolder);

router.delete("/folders/:id", authController.ensureAuthenticated, folderController.deleteFolder);


router.get("/dashboard-data", dashboardController.getDashboardData);



module.exports = router;
