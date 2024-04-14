const { Transform, pipeline } = require('node:stream');
const fs = require('node:fs/promises');

class Encrypt extends Transform {
  _transform(chunk, encoding, callback) {
    for (let i = 0; i < chunk.length; i++) {
      if (chunk[i] !== 255) {
        chunk[i]++;
      }
    }

    callback(null, chunk);
  }
}

(async () => {
  console.time('encrypt');
  const fileHandleRead = await fs.open('original.txt', 'r');
  const fileHandleWrite = await fs.open('encrypted.txt', 'w');
  const encrypt = new Encrypt();

  const streamRead = fileHandleRead.createReadStream({
    highWaterMark: 64 * 1024,
  });
  const streamWrite = fileHandleWrite.createWriteStream();

  pipeline(streamRead, encrypt, streamWrite, (err) => {
    console.timeEnd('encrypt');
  });
})();
