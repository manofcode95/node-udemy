const { Writable } = require('node:stream');
const fs = require('node:fs');

class FileWriteStream extends Writable {
  constructor({ fileName, highWaterMark }) {
    super({ highWaterMark });

    this.fileName = fileName;
    this.fd = null;
    this.chunks = [];
    this.chunkSize = 0;
    this.writeCounts = 0;
  }

  _construct(callback) {
    fs.open(this.fileName, 'w', (err, fd) => {
      if (err) {
        // so if we call the callback with an argument, it means that we have an error
        // and we should not proceed
        callback(err);
      } else {
        this.fd = fd;
        callback();
      }
    });
  }

  _write(chunk, encoding, callback) {
    this.chunks.push(chunk);
    this.chunkSize += chunk.length;

    if (this.chunkSize > this.highWaterMark) {
      fs.write(fd, Buffer.concat(this.chunks), (err) => {
        if (err) return callback(err);

        this.chunks = [];
        this.chunkSize = 0;
        ++this.writeCounts;
        callback();
      });
    } else {
      callback();
    }
  }

  _final(callback) {
    fs.write(this.fd, Buffer.concat(this.chunks), (err) => {
      if (err) return callback(err);

      ++this.writesCount;
      this.chunks = [];
      callback();
    });
  }

  _destroy(error, callback) {
    if (this.fd) {
      fs.close(this.fd, (err) => {
        callback(err || error);
      });
    } else {
      callback();
    }
  }
}

(async () => {
  console.time('writeMany');

  const stream = new FileWriteStream({ fileName: 'test.txt' });

  const drain = () =>
    new Promise((resolve) => {
      stream.once('drain', () => {
        resolve();
      });
    });

  stream.on('finish', () => {});

  for (let i = 0; i < 50000000; i++) {
    const buff = Buffer.from(` ${i} `, 'utf-8');
    const writeable = stream.write(buff);

    if (!writeable) {
      await drain();
    }
  }

  stream.end();

  console.timeEnd('writeMany');
})();
