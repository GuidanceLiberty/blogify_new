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

// ✅ Allow frontend origins
const allowedOrigins = [
  process.env.CLIENT_URL || 'http://localhost:3000',
  'https://blogify-frontend-5flp.onrender.com'
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
}));

// ✅ Middleware
app.use(express.json());
app.use(cookieParser());

// ✅ Resolve path for uploads & public
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Static folders
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ✅ Uploads config (max 2MB)
const storage = multer.diskStorage({
  destination: path.join(__dirname, 'uploads'),
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
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

// ✅ API routes
app.use('/api/auth', authRoute);
app.use('/api/categories', categoryRoute);
app.use('/api/tag', tagRoute);
app.use('/api/posts', postRoute);
app.use('/api/comments', commentRoute);
app.use('/api/notifications', notificationRoutes);

// ✅ Health check route
app.get('/', (req, res) => {
  res.send('✅ API is working');
});

// ✅ Error handler for large uploads
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
const port = process.env.PORT || 9000;
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
