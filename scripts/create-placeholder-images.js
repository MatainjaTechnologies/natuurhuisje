const fs = require('fs');
const path = require('path');
const { createCanvas } = require('canvas');
require('dotenv').config({ path: '.env.local' });

// Create temp_images directory if it doesn't exist
const tempImagesDir = path.join(__dirname, '..', 'temp_images');
if (!fs.existsSync(tempImagesDir)) {
  fs.mkdirSync(tempImagesDir, { recursive: true });
}

// Colors for different property types
const colors = {
  cabin: '#3E2723',      // dark brown
  treehouse: '#33691E',  // dark green
  glamping: '#BF360C',   // burnt orange  
  tinyhouse: '#0D47A1',  // dark blue
  farm: '#827717',       // olive green
  hero: '#1D331D'        // forest green (brand color)
};

// Function to create a placeholder image with text
function createPlaceholderImage(filename, width, height, bgColor, text) {
  console.log(`Creating ${filename}...`);
  
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');
  
  // Background
  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, width, height);
  
  // Add some shapes for visual interest
  ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
  ctx.beginPath();
  ctx.arc(width * 0.8, height * 0.2, width * 0.3, 0, 2 * Math.PI);
  ctx.fill();
  
  ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
  ctx.beginPath();
  ctx.arc(width * 0.3, height * 0.7, width * 0.25, 0, 2 * Math.PI);
  ctx.fill();
  
  // Text
  ctx.fillStyle = 'white';
  ctx.font = `bold ${Math.floor(width / 15)}px Arial`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, width / 2, height / 2);
  
  // Save to file
  const buffer = canvas.toBuffer('image/jpeg');
  fs.writeFileSync(path.join(tempImagesDir, filename), buffer);
}

// Main images
createPlaceholderImage('hero-nature-cabin.jpg', 1920, 1080, colors.hero, 'Natuurhuisje Hero Image');
createPlaceholderImage('cabin-type.jpg', 800, 600, colors.cabin, 'Cabins');
createPlaceholderImage('treehouse-type.jpg', 800, 600, colors.treehouse, 'Treehouses');
createPlaceholderImage('glamping-type.jpg', 800, 600, colors.glamping, 'Glamping');
createPlaceholderImage('tinyhouse-type.jpg', 800, 600, colors.tinyhouse, 'Tiny Houses');
createPlaceholderImage('farm-type.jpg', 800, 600, colors.farm, 'Farm Stays');

// Listing images
for (let i = 1; i <= 5; i++) {
  createPlaceholderImage(`cabin-${i}.jpg`, 800, 600, colors.cabin, `Cabin Image ${i}`);
  createPlaceholderImage(`treehouse-${i}.jpg`, 800, 600, colors.treehouse, `Treehouse Image ${i}`);
  createPlaceholderImage(`glamping-${i}.jpg`, 800, 600, colors.glamping, `Glamping Image ${i}`);
  createPlaceholderImage(`farm-${i}.jpg`, 800, 600, colors.farm, `Farm Image ${i}`);
  createPlaceholderImage(`tinyhouse-${i}.jpg`, 800, 600, colors.tinyhouse, `Tiny House Image ${i}`);
}

console.log(`\nCreated ${5 * 5 + 6} images in ${tempImagesDir}`);
console.log(`\nNext steps:`);
console.log(`1. Install the canvas package: npm install canvas`);
console.log(`2. Run this script: node scripts/create-placeholder-images.js`);
console.log(`3. Upload the generated images to your Supabase storage bucket`);
