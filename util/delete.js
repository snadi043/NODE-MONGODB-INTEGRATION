// This is an utility method which can be used anywhere in the entire application whenever 
// there is an requirement to remove a particular file from the fileSystem of the project. 

const fs = require('fs');

const deleteFile = (filepath) => {
    fs.unlink(filepath, (err) => {
        if(err){
            throw (err);
        }
    });
}

exports.deleteFile = deleteFile;