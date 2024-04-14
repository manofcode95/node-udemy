const fs = require('node:fs/promises');
const {pipeline } = require('node:stream');
// File Size Copied: 1 GB
// Memory Usage: 1 GB
// Execution Time: 900 ms
// Maximum File Size Able to Copy: 2 GB
// (async () => {
//   console.time("copy");
//   const destFile = await fs.open("text-copy.txt", "w");
//   const result = await fs.readFile("test.txt");

//   await destFile.write(result);

//   console.timeEnd("copy");
// })();

// File Size Copied: 1 GB
// Memory Usage: 30 MB
// Execution Time: 1.3 s
// Maximum File Size Able to Copy: No Limit
// (async () => {
//   console.time('copy');

//   const srcFile = await fs.open('test.txt', 'r');
//   const destFile = await fs.open('text-copy.txt', 'w');

//   let bytesRead = -1;

//   while (bytesRead !== 0) {
//     const readResult = await srcFile.read();
//     bytesRead = readResult.bytesRead;

//     if (bytesRead !== readResult.buffer.length) {
//       // we have some null bytes, remove them at the end of the returned buffer
//       // and then write to our file
//       const indexOfNotFilled = readResult.buffer.indexOf(0);
//       const newBuffer = Buffer.alloc(indexOfNotFilled);
//       readResult.buffer.copy(newBuffer, 0, 0, indexOfNotFilled);
//       destFile.write(newBuffer);
//     } else {
//       destFile.write(readResult.buffer);
//     }
//   }

//   console.timeEnd('copy');
// })();

// File Size Copied: 1 GB
// Memory Usage: 30 MB
// Execution Time: 1.3 s

// (async () => {
//   console.time('readBig');
//   const fileHandleRead = await fs.open('test.txt', 'r');
//   const fileHandleWrite = await fs.open('text-copy.txt', 'w');

//   const streamRead = fileHandleRead.createReadStream({
//     highWaterMark: 128 * 1024,
//   });
//   const streamWrite = fileHandleWrite.createWriteStream();

//   streamRead.on('data', (chunk) => {
//     streamRead.pause();

//     streamWrite.write(chunk);
//   });

//   streamWrite.on('drain', () => {
//     streamRead.resume();
//   });

//   streamRead.on('end', () => {
//     streamWrite.end();
//     console.timeEnd('readBig');
//   });
// })();

// (async () => {
//   console.time('readBig');
//   const fileHandleRead = await fs.open('test.txt', 'r');
//   const fileHandleWrite = await fs.open('text-copy.txt', 'w');

//   const streamRead = fileHandleRead.createReadStream({
//     highWaterMark: 64 * 1024,
//   });
//   const streamWrite = fileHandleWrite.createWriteStream();

//   streamRead.pipe(streamWrite);

//   console.timeEnd('readBig');
// })();

(async () => {
  console.time('readBig');
  const fileHandleRead = await fs.open('test.txt', 'r');
  const fileHandleWrite = await fs.open('text-copy.txt', 'w');

  const streamRead = fileHandleRead.createReadStream({
    highWaterMark: 64 * 1024,
  });
  const streamWrite = fileHandleWrite.createWriteStream();

  pipeline(streamRead, streamWrite, (err) => {
    console.log(err);
    console.timeEnd('readBig');
  });
})();
