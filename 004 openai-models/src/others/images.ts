/** @format */

import OpenAI from "openai";
import { createReadStream } from "fs";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function generateImages() {
  try {
    const response = await openai.images.generate({
      model: "dall-e-2", // try "dall-e-3" for higher quality
      prompt:
        "Anime-style artwork of a man standing on a hilltop, feeling like he has lost everything. The scene should be dramatic, emotional, and artistic.",
      n: 1,
      size: "1024x1024",
    });

    console.log("Generated Image URL:", response.data[0].url);
  } catch (error) {
    console.error("Error generating image:", error);
  }
}

async function generateImageVariation() {
  try {
    const response = await openai.images.createVariation({
      model: "dall-e-2",
      image: createReadStream("image.jpg"), // your input image
      n: 1,
      size: "1024x1024",
    });

    console.log("Variation Image URL:", response.data[0].url);
  } catch (error) {
    console.error("Error generating variation:", error);
  }
}

async function editImage() {
  try {
    const response = await openai.images.edit({
      model: "dall-e-2",
      image: createReadStream("image.jpg"), // base image
      // Optional mask: transparent area in mask.png will be replaced
      // mask: createReadStream("mask.png"),
      prompt:
        "Turn the man into an anime-style warrior with glowing blue eyes and a sword, keeping the hilltop dramatic background.",
      n: 1,
      size: "1024x1024",
    });

    console.log("Edited Image URL:", response.data[0].url);
  } catch (error) {
    console.error("Error editing image:", error);
  }
}


// generateImages();
// generateImageVariation();
// editImage();
