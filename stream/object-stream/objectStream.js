const { Readable } = require('stream');

class ObjectReadableStream extends Readable {
  constructor(objects) {
    super({ objectMode: true }); // Set object mode to true
    this.objects = objects;
    this.index = 0;
  }

  _read() {
    if (this.index < this.objects.length) {
      // Push the next object into the stream
      this.push(this.objects[this.index]);
      this.index++;
    } else {
      // No more objects to push, end the stream
      this.push(null);
    }
  }
}

// Create an array of objects
const objects = [
  { name: 'John', age: 30 },
  { name: 'Alice', age: 25 },
  { name: 'Bob', age: 35 },
];

// Create an instance of the object stream
const objectStream = new ObjectReadableStream(objects);

// Consume the stream
objectStream.on('data', (data) => {
  console.log(data);
});

objectStream.on('end', () => {
  console.log('Stream ended');
});
