// move-src.js
const fs = require('fs');
const path = require('path');

function moveDirectory(source, destination) {
  // Create destination if it doesn't exist
  if (!fs.existsSync(destination)) {
    fs.mkdirSync(destination, { recursive: true });
  }

  // Read all items in source directory
  const items = fs.readdirSync(source);

  items.forEach(item => {
    const sourcePath = path.join(source, item);
    const destPath = path.join(destination, item);

    if (fs.lstatSync(sourcePath).isDirectory()) {
      // If it's a directory, recursively move its contents
      moveDirectory(sourcePath, destPath);
      // Remove the now-empty source directory
      fs.rmdirSync(sourcePath);
    } else {
      // If it's a file, move it
      fs.renameSync(sourcePath, destPath);
    }
  });
}

try {
  // Define source and root directories
  const sourceDir = path.join(process.cwd(), 'src');
  const rootDir = process.cwd();

  // Get list of directories to move
  const directories = ['app', 'components', 'hooks', 'lib', 'types', 'utils'];

  // Move each directory
  directories.forEach(dir => {
    const sourcePath = path.join(sourceDir, dir);
    const destPath = path.join(rootDir, dir);
    
    if (fs.existsSync(sourcePath)) {
      console.log(`Moving ${dir} directory...`);
      moveDirectory(sourcePath, destPath);
    }
  });

  // Remove src directory if it's empty
  if (fs.readdirSync(sourceDir).length === 0) {
    fs.rmdirSync(sourceDir);
  }

  console.log('Successfully moved all directories from src to root');
} catch (error) {
  console.error('Error moving directories:', error);
}