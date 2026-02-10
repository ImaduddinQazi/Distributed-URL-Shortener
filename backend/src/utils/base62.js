const CHARSET = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
const BASE = CHARSET.length; // 62

/**
 * Encode a number to Base62
 * @param {number} num - The number to encode
 * @returns {string} Base62 encoded string
 */
function encode(num) {
  if (num === 0) return CHARSET[0];
  
  let encoded = '';
  while (num > 0) {
    encoded = CHARSET[num % BASE] + encoded;
    num = Math.floor(num / BASE);
  }
  
  return encoded;
}

/**
 * Decode a Base62 string to number
 * @param {string} str - The Base62 string
 * @returns {number} Decoded number
 */
function decode(str) {
  let decoded = 0;
  
  for (let i = 0; i < str.length; i++) {
    decoded = decoded * BASE + CHARSET.indexOf(str[i]);
  }
  
  return decoded;
}

module.exports = { encode, decode };