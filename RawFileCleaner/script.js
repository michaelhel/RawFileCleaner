function selectSource() {}

function includeSubfolder() {}

function cleanFiles() {}

function deleteFile(path, filename) {
    const trash = require('trash');
    var filenames = path + "\\" + filename;

    trash([filenames, null]).then(() => {
        console.log('deletet ' + filename);
    });
}