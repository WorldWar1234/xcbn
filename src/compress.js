const sharp = require('sharp');
const shouldCompress = require('./shouldCompress');

async function proxy(req, res) {
  try {
    const { url, webp, grayscale, quality } = req.params;

    // Check if image should be compressed
    if (!shouldCompress(req)) {
      return res.send(await sharp(url).toBuffer());
    }

    // Process image using sharp
    const image = await sharp(url)
      .grayscale(grayscale)
      .toFormat(webp ? 'webp' : 'jpeg', { quality })
      .toBuffer();

    const originalSize = await sharp(url).toBuffer().length;
    const compressedSize = image.length;

    if (compressedSize >= originalSize) {
      throw new Error('Image compression failed');
    }

    res.send(image);
  } catch (error) {
    console.error('Error processing image:', error);
    res.status(500).send(`Error processing image: ${error.message}`);
  }
}

module.exports = proxy;
