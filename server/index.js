import express from 'express';
import dotenv from 'dotenv';
import authRoute from './routes/auth.route.js';
import categoryRoute from './routes/category.route.js';
import postRoute from './routes/post.route.js';
import commentRoute from './routes/comments.route.js';
import tagRoute from './routes/tag.route.js';
import notificationRoutes from "./routes/notification.route.js";
import connectDB from './db/connectDB.js';
import multer from 'multer';
import { fileURLToPath } from 'url';
import path from 'path';
import cookieParser from 'cookie-parser';
import cors from 'cors';

dotenv.config();
const app = express();

// ✅ Enable CORS for frontend domain
const allowedOrigins = [
  process.env.CLIENT_URL || 'http://localhost:3000',
  'https://blogify-frontend-5flp.onrender.com'
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));

// ✅ Parse JSON + cookies
app.use(express.json());
app.use(cookieParser());

// ✅ Serve frontend static files like logo192.png if needed (optional)
app.use(express.static(path.join(path.resolve(), 'public')));

// ✅ Test route
app.get('/', (req, res) => {
  res.send('✅ API is working');
});

// ✅ API Routes
app.use('/api/auth', authRoute);
app.use('/api/categories', categoryRoute);
app.use('/api/tag', tagRoute);
app.use('/api/posts', postRoute);
app.use('/api/comments', commentRoute);
app.use('/api/notifications', notificationRoutes);

// ✅ File upload setup
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
  destination: path.join(__dirname, 'uploads'),
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB max
});

app.post('/api/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'No file uploaded' });
  }

  return res.status(200).json({
    success: true,
    message: 'File uploaded successfully',
    path: `/uploads/${req.file.filename}`,
  });
});

// ✅ Serve uploaded images
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ✅ Error handler for large files
app.use((err, req, res, next) => {
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(413).json({
      success: false,
      message: "File too large. Max size is 2MB",
    });
  }
  next(err);
});

// ✅ Start server after DB connection
const port = process.env.PORT || 6000;

const startServer = async () => {
  try {
    await connectDB();
    console.log("✅ MongoDB connected");

    app.listen(port, () => {
      console.log(`🚀 Server running at http://localhost:${port}`);
    });
  } catch (err) {
    console.error("❌ Failed to connect to MongoDB:", err.message);
    process.exit(1);
  }
};

startServer();
