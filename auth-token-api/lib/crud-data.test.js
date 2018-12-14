const crudData = require('./crud-data');

// testing

_data.create('test', 'newFile', {'foo': 'bar'}, err => {
  console.log('this was the error', err);
});

_data.read('test', 'newFile', (err, data) => {
  console.log('this was the data', data);
});
