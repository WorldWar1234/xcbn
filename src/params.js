const DEFAULT_QUALITY = 40;

function params(req, res, next) {
  const url = req.url;
  const cleanedUrl = url.replace(/^\/+|\/+$/g, '');
  const [l, w, bw, jpeg] = cleanedUrl.split('/');

  req.params = {
    url: cleanedUrl,
    webp: !jpeg,
    grayscale: bw !== '0',
    quality: parseInt(l, 10) || DEFAULT_QUALITY,
    originType: req.headers['content-type'] || '', // Default to empty string if header is missing
    originSize: parseInt(req.headers['content-length'], 10) || 0, // Default to 0 if header is missing or invalid
  };

  next();
}

module.exports = params;
