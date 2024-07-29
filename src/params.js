const DEFAULT_QUALITY = 40; // Default quality value

function params(req, res, next) {
  const { url, jpeg, bw, l } = req.query;

  if (!url) {
    return res.end('bandwidth-hero-proxy');
  }

  const urls = Array.isArray(url) ? url.join('&url=') : url;
  const cleanedUrl = urls.replace(/http:\/\/1\.1\.\d\.\d\/bmi\/(https?:\/\/)?/i, 'http://');

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
