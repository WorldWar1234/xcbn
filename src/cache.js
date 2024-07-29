const sharp = require('sharp');
const cache = require('./cache');
const shouldCompress = require('./shouldCompress');

async function proxy(req, res) {
  try {
    const { url, webp, grayscale, quality } = req.params;
    const cacheKey = `${url}-${webp}-${grayscale}-${quality}`;

    // Check if image should be compressed
    if (!shouldCompress(req)) {
      return res.send(await sharp(url).toBuffer());
    }

    // Check if image is cached
    const cachedImage = await cache.get(cacheKey);
    if (cachedImage) {
      return res.send(cachedImage);
    }

    // Process image using sharp
    const image = await sharp(url)
      .grayscale(grayscale)
      .toFormat(webp ? 'webp' : 'jpeg', { quality })
      .toBuffer();

    // Cache the processed image
    await cache.set(cacheKey, image);

    res.send(image);
  } catch (error) {
    console.error(error);
    // Send the original image if processing fails
    res.send(await sharp(req.params.url).toBuffer());
  }
}

module.exports = proxy;
