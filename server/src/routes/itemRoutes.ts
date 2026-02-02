import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import { authenticateJWT } from '../middleware/authMiddleware';
import { createItem, getItems, getItemById } from '../controllers/itemController';

const router = Router();

// Configure local storage for images
// Configure local storage for images
const storage = multer.diskStorage({
    destination: (req: any, file: any, cb: any) => {
        cb(null, path.join(process.cwd(), 'uploads'));
    },
    filename: (req: any, file: any, cb: any) => {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});

const upload = multer({ storage });

router.post('/', authenticateJWT, createItem);
router.get('/', getItems);
router.get('/:id', getItemById);

// Upload endpoint
router.post('/upload', authenticateJWT, upload.array('images', 5), (req: any, res: any) => {
    console.log('Upload Request Headers:', req.headers);
    console.log('Upload Request Files:', req.files);
    const files = req.files as Express.Multer.File[];
    if (!files) return res.status(400).json({ error: 'No files uploaded' });

    // Return URLs (assuming server serves /uploads statically)
    const urls = files.map(file => `/uploads/${file.filename}`);
    res.json({ urls });
});

export default router;
