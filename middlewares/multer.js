import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';

// Convert the current module URL to a file path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../public/multer/'));
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

const uploadMiddleware = (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }
        
        upload.single('image')(req, res, (err) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            next();
        });
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

export { uploadMiddleware, upload };