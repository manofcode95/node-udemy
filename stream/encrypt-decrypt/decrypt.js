const { Transform, pipeline } = require('node:stream');
const fs = require('node:fs/promises');

class Decrypt extends Transform {
  _transform(chunk, encoding, callback) {
    for (let i = 0; i < chunk.length; i++) {
      if (chunk[i] !== 255) {
        chunk[i]--;
      }
    }

    callback(null, chunk);
  }
}

(async () => {
  console.time('decrypt');
  const fileHandleRead = await fs.open('encrypted.txt', 'r');
  const fileHandleWrite = await fs.open('decrypted.txt', 'w');
  const decrypt = new Decrypt();

  const streamRead = fileHandleRead.createReadStream({
    highWaterMark: 64 * 1024,
  });
  const streamWrite = fileHandleWrite.createWriteStream();

  pipeline(streamRead, decrypt, streamWrite, (err) => {
    console.timeEnd('decrypt');
  });
})();
