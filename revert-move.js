// revert-move.js
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
  const rootDir = process.cwd();
  const srcDir = path.join(rootDir, 'src');

  // Create src directory if it doesn't exist
  if (!fs.existsSync(srcDir)) {
    fs.mkdirSync(srcDir);
  }

  // Get list of directories to move
  const directories = ['app', 'components', 'hooks', 'lib', 'types', 'utils'];

  // Move each directory
  directories.forEach(dir => {
    const sourcePath = path.join(rootDir, dir);
    const destPath = path.join(srcDir, dir);
    
    if (fs.existsSync(sourcePath)) {
      console.log(`Moving ${dir} directory back to src...`);
      moveDirectory(sourcePath, destPath);
    }
  });

  console.log('Successfully moved all directories back to src');
} catch (error) {
  console.error('Error moving directories:', error);
}