const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const morgan = require('morgan');
const { Recipe } = require('./RecipeModel');


// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err.message);
  });


// Default route
app.get('/api', (req, res) => {
  res.json({ message: 'Welcome to the Express MongoDB API' });
});

app.post('/api/favorites', async (req, res) => {
    try {
      const { publisher, image_url, title, id } = req.body;
      
      // Check if recipe already exists
      const existingRecipe = await Recipe.findOne({ id });
      if (existingRecipe) {
        return res.status(400).json({ message: 'Recipe already in favorites' });
      }
      
      // Create new recipe
      const recipe = new Recipe({
        publisher,
        image_url,
        title,
        id
      });
      
      // Save to database
      const savedRecipe = await recipe.save();
      res.status(201).json(savedRecipe);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });
  
  // 2. GET request to retrieve all favorite recipes
  app.get('/api/favorites', async (req, res) => {
    try {
      const recipes = await Recipe.find();
      res.json(recipes);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });
  


// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'production' ? {} : err
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});