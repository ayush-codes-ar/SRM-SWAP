import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import { authenticateJWT } from '../middleware/authMiddleware';
import { createItem, getItems, getItemById } from '../controllers/itemController';

const router = Router();

import fs from 'fs';

const storage = multer.diskStorage({
    destination: (req: any, file: any, cb: any) => {
        const uploadDir = path.join(process.cwd(), 'uploads');
        // Ensure directory exists (lazy creation)
        if (!fs.existsSync(uploadDir)) {
            try {
                fs.mkdirSync(uploadDir, { recursive: true });
                console.log(`Created upload directory: ${uploadDir}`);
            } catch (err) {
                console.error(`Failed to create upload directory: ${uploadDir}`, err);
                return cb(err, uploadDir);
            }
        }
        cb(null, uploadDir);
    },
    filename: (req: any, file: any, cb: any) => {
        const name = Date.now() + path.extname(file.originalname);
        cb(null, name);
    },
});

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type. Only JPEG, PNG, and WebP are allowed.'));
        }
    }
});

router.post('/', authenticateJWT, createItem);
router.get('/', getItems);
router.get('/:id', getItemById);

// Upload endpoint with error handling
router.post('/upload', authenticateJWT, (req: any, res: any, next: any) => {
    upload.array('images', 5)(req, res, (err: any) => {
        if (err instanceof multer.MulterError) {
            // A Multer error occurred when uploading.
            console.error('Multer Error:', err);
            return res.status(400).json({ error: `Upload error: ${err.message}` });
        } else if (err) {
            // An unknown error occurred when uploading.
            console.error('Unknown Upload Error:', err);
            return res.status(400).json({ error: err.message });
        }
        // Everything went fine.
        next();
    });
}, (req: any, res: any) => {
    console.log('Upload Request Headers:', req.headers);
    console.log('Upload Request Files:', req.files);
    const files = req.files as Express.Multer.File[];
    if (!files || files.length === 0) return res.status(400).json({ error: 'No files uploaded' });

    // Return URLs (assuming server serves /uploads statically)
    const urls = files.map(file => `/uploads/${file.filename}`);
    res.json({ urls });
});

export default router;
