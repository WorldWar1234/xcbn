const sharp = require('sharp');
const shouldCompress = require('./shouldCompress');

async function proxy(req, res) {
  try {
    const { url, webp, grayscale, quality } = req.params;

    // Check if image should be compressed
    if (!shouldCompress(req)) {
      return res.send(await sharp(url).toBuffer()); // Send original image
    }

    // Process image using sharp
    const image = await sharp(url)
      .grayscale(grayscale)
      .toFormat(webp ? 'webp' : 'jpeg', { quality })
      .toBuffer();

    const originalSize = await sharp(url).toBuffer().length;
    const compressedSize = image.length;

    if (compressedSize >= originalSize) {
      return res.send(await sharp(url).toBuffer()); // Send original image if compression doesn't reduce size
    }

    res.send(image);
  } catch (error) {
    console.error('Error processing image:', error);
    // Send the original image if processing fails
    res.send(await sharp(req.params.url).toBuffer());
  }
}

module.exports = proxy;
