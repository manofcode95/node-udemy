const { Readable } = require('node:stream');
const fs = require('node:fs');

class FileReadStream extends Readable {
  constructor({ highWaterMark, fileName }) {
    super({ highWaterMark });
    this.fileName = fileName;
    this.fd = null;
  }

  _construct(callback) {
    fs.open(this.fileName, 'r', (err, fd) => {
      if (err) return callback(err);
      this.fd = fd;
      callback();
    });
  }

  _read(size) {
    const buff = Buffer.alloc(size);
    fs.read(this.fd, buff, 0, size, null, (err, byteRead) => {
      if (err) return this.destroy(err);

      // data will be sent downstream, clear the occupied memory
      this.push(byteRead > 0 ? buff.subarray(0, byteRead) : null);
    });
  }

  _destroy(error, callback) {
    if (this.fd) {
      fs.close(this.fd, (err) => callback(err || error));
    } else {
      callback();
    }
  }
}

const stream = new FileReadStream({ fileName: 'test.txt' });
stream.read();
stream.on('data', (chunk) => {});

stream.on('end', () => {
  console.log('Stream is done');
});
