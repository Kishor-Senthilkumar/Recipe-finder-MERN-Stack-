import mongoose from "mongoose";
const recipeSchema = new mongoose.Schema({
    publisher: String,
    image_url: String,
    title: String,
    id: String
  });
  
export const Recipe = mongoose.model('Recipe', recipeSchema);