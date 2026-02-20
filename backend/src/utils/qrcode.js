const QRCode = require('qrcode');

/**
 * Generate QR code as Data URL
 * @param {string} url - The URL to encode
 * @returns {Promise<string>} Base64 data URL
 */
async function generateQRCode(url) {
  try {
    const qrCodeDataURL = await QRCode.toDataURL(url, {
      errorCorrectionLevel: 'M',
      type: 'image/png',
      width: 300,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    });
    
    return qrCodeDataURL;
  } catch (error) {
    console.error('Error generating QR code:', error);
    return null;
  }
}

module.exports = { generateQRCode };