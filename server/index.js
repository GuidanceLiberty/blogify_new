import express from 'express';
import dotenv from 'dotenv';
import authRoute from './routes/auth.route.js';
import categoryRoute from './routes/category.route.js';
import postRoute from './routes/post.route.js';
import commentRoute from './routes/comments.route.js';
import tagRoute from './routes/tag.route.js';
import connectDB from './db/connectDB.js';
import multer from 'multer';
import { fileURLToPath } from 'url';
import path from 'path';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import notificationRoutes from "./routes/notification.route.js";

dotenv.config();

const app = express();
app.use(cors({origin: process.env.CLIENT_URL, credentials: false}));
app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRoute);
app.use('/api/categories', categoryRoute);
app.use('/api/tag', tagRoute);
app.use('/api/posts', postRoute)
app.use('/api/comments', commentRoute)
app.use('/api/notifications', notificationRoutes);

const __filename = fileURLToPath(import.meta.url);
const __dirname =  path.dirname(__filename);
//STORAGE ENGIN
const storage = multer.diskStorage({
    destination: path.join(__dirname, 'uploads'),
    limits: { fileSize: 2 * 1024 * 1024}, //2mb
    filename: (req, file, cb) => {cb(null, `${file.originalname}`);},
});

const upload = multer({ storage });

app.post(`/api/upload`, upload.single('file'), (req, res) => {
    if(!req.file){
    return res.status(400).json({error: 'No file uploaded', path: req.file.path});
    }

    return res.json({message: 'File was uploaded', path: req.file.path});
});

app.use((err, req, res, next) => {
    if(err.code === 'LIMIT_FILE_SIZE') {
        return res.status(413).json({
            success: false, message: "File too large, Max size set at 2mb"
        });
    }

    next();
});

app.use(`/uploads`, express.static(path.join(__dirname, 'uploads')));

const port = process.env.PORT || 6000;
app.listen(port, () => {
    connectDB();
    console.log(`server running on port http://localhost:${port}`);
})