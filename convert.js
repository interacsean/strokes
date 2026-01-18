#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Get filename from command line arguments
const filename = process.argv[2];

if (!filename) {
  console.error('Usage: node convert.js <filename.json>');
  process.exit(1);
}

if (!fs.existsSync(filename)) {
  console.error(`File ${filename} does not exist`);
  process.exit(1);
}

try {
  // Read and parse the JSON file
  const data = JSON.parse(fs.readFileSync(filename, 'utf8'));
  
  if (!data.holes || !Array.isArray(data.holes)) {
    console.error('JSON file must contain a "holes" array property');
    process.exit(1);
  }
  
  const originalHoles = data.holes;
  
  // Create new object with reordered holes
  const newObject = {
    ...data,
    holes: [
      ...originalHoles.slice(9, 17),  // holes 9-16
      ...originalHoles.slice(0, 8),  // holes 0-7
    ]
  };
  
  // Map through newObject.holes and replace strokes with original data
  newObject.holes = newObject.holes.map((hole, n) => ({
    ...hole,
    strokes: originalHoles[n].strokes,
    holeNum: originalHoles[n].holeNum
  }));
  
  // Output the transformed JSON
  console.log(JSON.stringify(newObject, null, 2));
  
} catch (error) {
  console.error('Error processing file:', error.message);
  process.exit(1);
}