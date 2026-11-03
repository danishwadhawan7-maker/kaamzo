const fs = require('fs');
const path = require('path');

const wwwDir = path.join(__dirname, '..', 'www');
const png48 = fs.readFileSync(path.join(wwwDir, 'favicon-48x48.png'));

// Build standard ICO file containing the 48x48 PNG image data
const header = Buffer.alloc(6);
header.writeUInt16LE(0, 0); // Reserved
header.writeUInt16LE(1, 2); // Type 1 = ICO
header.writeUInt16LE(1, 4); // 1 Image

const dirEntry = Buffer.alloc(16);
dirEntry.writeUInt8(48, 0); // Width
dirEntry.writeUInt8(48, 1); // Height
dirEntry.writeUInt8(0, 2);  // Palette
dirEntry.writeUInt8(0, 3);  // Reserved
dirEntry.writeUInt16LE(1, 4); // Color planes
dirEntry.writeUInt16LE(32, 6); // Bits per pixel
dirEntry.writeUInt32LE(png48.length, 8); // Image size in bytes
dirEntry.writeUInt32LE(22, 12); // Offset (6 + 16 = 22)

const icoBuffer = Buffer.concat([header, dirEntry, png48]);

fs.writeFileSync(path.join(wwwDir, 'favicon.ico'), icoBuffer);
console.log('Successfully generated favicon.ico (' + icoBuffer.length + ' bytes)');
