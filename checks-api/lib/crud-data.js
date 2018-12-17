const fs = require('fs');
const path = require('path');
const parseJsonToObject = require('./helpers').parseJsonToObject;

let lib = {};

// base directory of the data folder
lib.baseDir = path.join(__dirname, '/../.data/');

// write data to a file
lib.create = (dir, file, data, cb) => {
  fs.open(`${lib.baseDir}${dir}/${file}.json`, 'wx', (err, fileDescriptor) => {
    if(!err && fileDescriptor) {
      const stringData = JSON.stringify(data);

      // write to file and close it
      fs.writeFile(fileDescriptor, stringData, err => {
        if(!err) {
          fs.close(fileDescriptor, err => {
            if(!err) {
              cb(false);
            } else {
              cb('Error closing new file');
            }
          });
        } else {
          cb('Error writing to new file');
        }
      })
    } else {
      cb('Could not create new file, it may already exist');
    }
  });
};

// read data from a file
lib.read = (dir, file, cb) => {
  fs.readFile(`${lib.baseDir}${dir}/${file}.json`, 'utf8', (err, data) => {
    if(!err && data) {
      const parsedData = parseJsonToObject(data);

      cb(false, parsedData);
    } else {
      cb(err, data);
    }
  });
};

// update the file
lib.update = (dir, file, data, cb) => {
  fs.open(`${lib.baseDir}${dir}/${file}.json`, 'r+', (err, fileDescriptor) => {
    if(!err && fileDescriptor) {
      const stringData = JSON.stringify(data);

      fs.truncate(fileDescriptor, err => {
        if(!err) {
          fs.writeFile(fileDescriptor, stringData, err => {
            if(!err) {
              fs.close(fileDescriptor, err => {
                if(!err) {
                  cb(false);
                } else {
                  cb('Error closing existing file');
                }
              });
            } else {
              cb('Error writing to existing file');
            }
          });
        } else {
          cb('Error truncating file');
        }
      });
    } else {
      cb('Could not open the file for updating, it may not existe yet');
    }
  });
};

// delete a file
lib.delete = (dir, file, cb) => {
  fs.unlink(`${lib.baseDir}${dir}/${file}.json`, err => {
    if(!err) {
      cb(false);
    } else {
      cb('Error deleting file');
    }
  });
};

module.exports = lib;
