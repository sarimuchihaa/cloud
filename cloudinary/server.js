// IMPORTS.
import express from 'express';
import path from "path";
import dotenv from "dotenv";
import dbConnection from './db/dbConnection.js';
import cors from 'cors';
import { uploadPhoto } from './middlewares/imageUploadMiddleware.js';
import { resizeAndUploadImage } from './middlewares/imageUploadMiddleware.js';
import { Image } from './model/image.model.js';


// Configs.
dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;


// Middleware.
app.use(cors({
  origin: "*",
  credentials: true
}));
app.set('view engine', 'ejs');
app.set("views", path.resolve("./views"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


// IMAGE.
// POST.
app.post('/upload', uploadPhoto.single('image'), resizeAndUploadImage, async (req, res) => {
  try {
    if (req.imageUrl) {
      // Save imageUrl to database.
      const newImage = new Image({ imageUrl: req.imageUrl });
      await newImage.save();

      console.log("Image saved to database:", newImage);

      res.json({
        message: "Image uploaded successfully and saved to the database",
        imageUrl: req.imageUrl, // Send URL of uploaded image.
      });
    } else {
      res.status(400).json({
        message: "No image uploaded",
      });
    }
  } catch (error) {
    console.error("Error saving image to database:", error);
    res.status(500).json({
      message: "Error saving image to database",
      error: error.message,
    });
  }
});


// GET
app.get('/images', async (req, res) => {
  try {
    const images = await Image.find(); // Fetch all images.
    res.json({
      message: "Images fetched successfully",
      images,
    });
  } catch (error) {
    console.error("Error fetching images:", error);
    res.status(500).json({
      message: "Error fetching images",
      error: error.message,
    });
  }
});


// GET BY ID
app.get('/images/:id', async (req, res) => {
  const { id } = req.params; // Get image _id from request params.

  try {
    const image = await Image.findById(id); // Find image by _id.

    if (!image) {
      return res.status(404).json({
        message: "Image not found",
      });
    }

    res.json({
      message: "Image fetched successfully",
      image,
    });
  } catch (error) {
    console.error("Error fetching image:", error);
    res.status(500).json({
      message: "Error fetching image",
      error: error.message,
    });
  }
});
app.listen(PORT, () => {
  dbConnection();
  console.log(`Server Running on port ${PORT} 😃`)
});
