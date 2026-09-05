import fs from 'fs';
import path from 'path';
import zlib from 'zlib';

function createPNG(width, height, colorHex, symbolFn) {
  // Parse hex
  const r = parseInt(colorHex.slice(1, 3), 16);
  const g = parseInt(colorHex.slice(3, 5), 16);
  const b = parseInt(colorHex.slice(5, 7), 16);

  // Raw pixel buffer with 1 filter byte per scanline
  const rowBytes = 1 + width * 4;
  const rawData = Buffer.alloc(height * rowBytes);

  for (let y = 0; y < height; y++) {
    const rowOffset = y * rowBytes;
    rawData[rowOffset] = 0; // Filter type 0 (None)
    for (let x = 0; x < width; x++) {
      const pxOffset = rowOffset + 1 + x * 4;
      const pixel = symbolFn(x, y, width, height, r, g, b);
      rawData[pxOffset] = pixel[0];
      rawData[pxOffset + 1] = pixel[1];
      rawData[pxOffset + 2] = pixel[2];
      rawData[pxOffset + 3] = pixel[3];
    }
  }

  const deflated = zlib.deflateSync(rawData);

  // PNG Header
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  function makeChunk(type, data) {
    const len = Buffer.alloc(4);
    len.writeUInt32BE(data.length, 0);
    const typeBuf = Buffer.from(type, 'ascii');
    const crcBuf = Buffer.alloc(4);
    
    // Calculate CRC32 over type + data
    const toCrc = Buffer.concat([typeBuf, data]);
    const crc = crc32(toCrc);
    crcBuf.writeUInt32BE(crc >>> 0, 0);

    return Buffer.concat([len, typeBuf, data, crcBuf]);
  }

  // CRC32 table
  const crcTable = new Int32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) {
      if (c & 1) c = 0xedb88320 ^ (c >>> 1);
      else c = c >>> 1;
    }
    crcTable[n] = c;
  }
  function crc32(buf) {
    let c = 0 ^ -1;
    for (let i = 0; i < buf.length; i++) {
      c = (c >>> 8) ^ crcTable[(c ^ buf[i]) & 0xff];
    }
    return (c ^ -1) >>> 0;
  }

  // IHDR
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // Bit depth
  ihdr[9] = 6; // Color type (RGBA)
  ihdr[10] = 0; // Compression
  ihdr[11] = 0; // Filter
  ihdr[12] = 0; // Interlace

  const ihdrChunk = makeChunk('IHDR', ihdr);
  const idatChunk = makeChunk('IDAT', deflated);
  const iendChunk = makeChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

// Light gaming aesthetic: crisp background with electric indigo/cyan somatic pulse icon
function drawSomaIcon(x, y, w, h, bgR, bgG, bgB) {
  const cx = w / 2;
  const cy = h / 2;
  const dx = x - cx;
  const dy = y - cy;
  const dist = Math.sqrt(dx * dx + dy * dy);
  const radius = w * 0.44;

  // Background circle / rounded squircle
  if (dist > radius) {
    return [bgR, bgG, bgB, 255];
  }

  // Soft gradient inside
  const normDist = dist / radius;
  // Center lightning / chevron / pulse
  // Check if inside upward chevron / energy bolt
  const scale = w / 100;
  const lx = dx / scale;
  const ly = dy / scale;

  // Bolt/Chevron shape
  const inPulse = (Math.abs(lx) < 22 && Math.abs(ly + lx * 0.4) < 7) ||
                  (Math.abs(lx - 2) < 20 && Math.abs(ly - 6 - lx * 0.3) < 6) ||
                  (dist < radius * 0.28 && normDist < 0.25);

  if (inPulse) {
    return [79, 70, 229, 255]; // Electric Indigo #4F46E5
  }

  // Ring around
  if (dist > radius * 0.82 && dist < radius * 0.94) {
    return [99, 102, 241, 220];
  }

  // Card background
  const bgLight = Math.floor(242 - normDist * 8);
  return [bgLight, bgLight, bgLight + 4, 255];
}

const publicDir = path.resolve(process.cwd(), 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Generate PNGs
const png192 = createPNG(192, 192, '#F2F2F7', drawSomaIcon);
const png512 = createPNG(512, 512, '#F2F2F7', drawSomaIcon);
const appleIcon = createPNG(180, 180, '#F2F2F7', drawSomaIcon);

fs.writeFileSync(path.join(publicDir, 'pwa-192x192.png'), png192);
fs.writeFileSync(path.join(publicDir, 'pwa-512x512.png'), png512);
fs.writeFileSync(path.join(publicDir, 'pwa-maskable-512x512.png'), png512);
fs.writeFileSync(path.join(publicDir, 'apple-touch-icon.png'), appleIcon);

// Generate crisp SVG
const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="none">
  <rect width="512" height="512" rx="128" fill="#F2F2F7"/>
  <rect x="24" y="24" width="464" height="464" rx="104" fill="#FFFFFF" stroke="#E5E5EA" stroke-width="4"/>
  <circle cx="256" cy="256" r="160" stroke="#4F46E5" stroke-width="16" stroke-dasharray="16 12" opacity="0.4"/>
  <circle cx="256" cy="256" r="120" fill="#EEF2FF" stroke="#6366F1" stroke-width="6"/>
  <!-- Somatic Energy Upward Pulse Bolt -->
  <path d="M268 150 L204 268 H276 L244 362 L324 236 H252 L268 150 Z" fill="#4F46E5" stroke="#4338CA" stroke-width="6" stroke-linejoin="round"/>
</svg>`;
fs.writeFileSync(path.join(publicDir, 'icon.svg'), svgContent);

console.log('PWA icons created successfully');
