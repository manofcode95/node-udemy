const { ReadStream } = require('node:fs');
const fs = require('node:fs/promises');

(async () => {
  console.time('readBig');
  const fileHandleRead = await fs.open('test.txt', 'r');
  const fileHandleWrite = await fs.open('dest.txt', 'w');

  const streamRead = fileHandleRead.createReadStream({
    highWaterMark: 64 * 1024,
  });
  const streamWrite = fileHandleWrite.createWriteStream();

  let split = '';

  streamRead.on('data', (chunk) => {
    streamRead.pause();

    let numbers = chunk.toString('utf-8').trim().split('  ');

    if (Number(numbers[0]) + 1 !== Number(numbers[1])) {
      numbers[0] = split.trim() + numbers[0];
      split = '';
    }

    if (
      Number(numbers[numbers.length - 2]) + 1 !==
      Number(numbers[numbers.length - 1])
    ) {
      split = numbers.pop();
    }

    // numbers = numbers.filter((n) => Number(n) % 2 === 0);
    // console.log(numbers);
    numbers.forEach((n) => {
      if (Number(n) % 2 === 0) {
        streamWrite.write(Buffer.from(` ${n} `, 'utf-8'));
      }
    });
  });

  streamWrite.on('drain', () => {
    streamRead.resume();
  });

  streamRead.on('end', () => streamWrite.end());
})();
