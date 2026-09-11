// Refresh the local photo manifest after adding family photos to public/.
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { createRequire } from 'node:module';
import { dirname, resolve, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const require = createRequire(import.meta.url);
// Reuse Next.js's existing image decoder; no additional dependency.
const sharp = require(require.resolve('sharp', { paths: [dirname(require.resolve('next/package.json'))] }));
const publicDir = resolve(root, 'public');
async function scan(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = await Promise.all(entries.map(entry => entry.isDirectory()
    ? scan(resolve(directory, entry.name))
    : /\.(jpe?g|png|webp)$/i.test(entry.name) ? [resolve(directory, entry.name)] : []));
  return files.flat().sort();
}
const captions = ['Little smile', 'Tiny steps', 'Our little prince', 'Birthday joy', 'Sweet memories', 'Wrapped in love', 'Tiny wonders', 'Together is lovely', 'Little adventures'];
const photos = [];
const hashes = new Map();
for (const file of await scan(publicDir)) {
  const data = await readFile(file);
  // Decode the complete file, not just its header, to reject corrupt images.
  await sharp(data).stats();
  const metadata = await sharp(data).metadata();
  const filename = relative(publicDir, file).split(sep).join('/');
  const hash = createHash('sha256').update(data).digest('hex');
  if (hashes.has(hash)) {
    hashes.get(hash).duplicateFiles.push(filename);
    continue;
  }
  const rotated = [5, 6, 7, 8].includes(metadata.orientation);
  const photo = {
    src: '/' + filename.split('/').map(encodeURIComponent).join('/'),
    width: rotated ? metadata.height : metadata.width,
    height: rotated ? metadata.width : metadata.height,
    caption: captions[photos.length % captions.length],
    alt: `Hridyansh Babu’s family photo ${photos.length + 1}`,
    duplicateFiles: [],
  };
  hashes.set(hash, photo);
  photos.push(photo);
}
await writeFile(resolve(root, 'lib/baby-photos.json'), JSON.stringify(photos, null, 2) + '\n');
console.log(`${photos.length} unique photos included; ${photos.reduce((sum, photo) => sum + photo.duplicateFiles.length, 0)} duplicate file(s) represented by their original.`);
