const sharp = require('sharp');
const fs = require('fs').promises;
const path = require('path');

async function optimizeImages() {
  const imagesDir = path.join(__dirname, '../public/images');
  const files = await fs.readdir(imagesDir);
  
  for (const file of files) {
    if (file.match(/\.(jpg|jpeg|png)$/i)) {
      const inputPath = path.join(imagesDir, file);
      const stats = await fs.stat(inputPath);
      const fileSizeInMB = stats.size / (1024 * 1024);
      
      if (fileSizeInMB > 0.5) { // Only optimize files larger than 500KB
        console.log(`Optimizing ${file} (${fileSizeInMB.toFixed(2)}MB)...`);
        
        try {
          // Create optimized version
          await sharp(inputPath)
            .resize(1920, null, { 
              withoutEnlargement: true,
              fit: 'inside'
            })
            .jpeg({ 
              quality: 85,
              progressive: true,
              mozjpeg: true
            })
            .toFile(inputPath.replace(/\.(jpg|jpeg|png)$/i, '.optimized.jpg'));
            
          // Replace original with optimized version
          await fs.rename(
            inputPath.replace(/\.(jpg|jpeg|png)$/i, '.optimized.jpg'),
            inputPath
          );
          
          const newStats = await fs.stat(inputPath);
          const newFileSizeInMB = newStats.size / (1024 * 1024);
          console.log(`  ✓ Reduced from ${fileSizeInMB.toFixed(2)}MB to ${newFileSizeInMB.toFixed(2)}MB`);
        } catch (error) {
          console.error(`  ✗ Error optimizing ${file}:`, error.message);
        }
      }
    }
  }
}

optimizeImages().then(() => {
  console.log('Image optimization complete!');
}).catch(console.error);