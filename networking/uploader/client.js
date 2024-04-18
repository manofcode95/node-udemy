const net = require('net');
const fs = require('fs/promises');
const path = require('path');

const HOST = '::1';
const PORT = '5050';

const clearLine = (dir) => {
  return new Promise((resolve, reject) => {
    process.stdout.clearLine(dir, () => {
      resolve();
    });
  });
};

const moveCursor = (dx, dy) => {
  return new Promise((resolve, reject) => {
    process.stdout.moveCursor(dx, dy, () => {
      resolve();
    });
  });
};

const socket = net.createConnection({ host: HOST, port: PORT }, async () => {
  const filePath = process.argv[2];
  const fileName = path.basename(filePath);
  socket.write(`fileName:${fileName}------`);

  const fileHandle = await fs.open(filePath, 'r');
  const fileSize = (await fileHandle.stat()).size;
  let uploadedPercentage = 0;
  let uploadedBytes = 0;

  const readStream = fileHandle.createReadStream();

  console.log()
  readStream.on('data', async (buff) => {
    if (!socket.write(buff)) {
      readStream.pause();
    }

    uploadedBytes += buff.length;
    const newPercentage = Math.floor((uploadedBytes / fileSize) * 100);
    if (newPercentage !== uploadedPercentage) {
      uploadedPercentage = newPercentage;
      await moveCursor(0, -1);
      await clearLine(0);
      console.log(`Uploading ... ${uploadedPercentage}%`);
    }
  });

  socket.on('drain', () => {
    readStream.resume();
  });

  readStream.on('end', () => {
    socket.end();
    fileHandle.close();
  });
});
