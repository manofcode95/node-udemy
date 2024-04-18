const net = require('net');
const fs = require('fs/promises');

const HOST = '::1';
const PORT = '5050';

const server = net.createServer();

server.on('connection', (socket) => {
  let fileHandle;
  let writeStream;

  const getFileHandle = (() => {
    let promise;

    return (path) => {
      if (!promise) {
        promise = new Promise(async (resolve) => {
          resolve(fs.open(path, 'a'));
        }); // return the existing promise
      }

      return promise;
    };
  })();

  socket.on('data', async (buff) => {
    if (!fileHandle) {
      const fileName = buff.subarray(9, buff.indexOf('------'));

      fileHandle = await getFileHandle(`storage/${fileName}`);
      writeStream = fileHandle.createWriteStream();

      writeStream.on('drain', () => {
        socket.resume();
      });
    } else if (!writeStream.write(buff)) {
      socket.pause();
    }
  });

  socket.on('end', () => {
    console.log('Socket ended');
    fileHandle.close();
  });
});

server.listen(PORT, HOST, () => {
  console.log('opened server on', server.address());
});
