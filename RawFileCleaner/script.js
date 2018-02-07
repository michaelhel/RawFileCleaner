var remote = require('electron').remote;
var electronFs = remote.require('fs');
const trash = require('trash');
storage = require('electron-json-storage');
var includeSubfolders = false;

function includeSubfolder() {
    includeSubfolders = true;
    cleanFiles();
    /*
    window.onbeforeunload = function cleanFiles() {
        var message = "Your confirmation message goes here.",
        e = e || window.event;
        // For IE and Firefox
        if (e) {
            e.returnValue = message;
        }
        // For Safari
        return message;
    };
    window.location = "loading.html";
    */
}

function cleanFiles() {
    storage.get('path', function (error, path) {
        if (error) throw error;

        electronFs.readdir(path, (err, dir) => {
            for (var i = 0; i < dir.length; i++) {
                fileName = dir[i];

                if (fileName.endsWith(".raw") && !JpgExists(path + "\\" + fileName)) {
                    console.log(path);
                    console.log(fileName);

                    deleteFile(path, fileName);
                }
            }
        })
    });
}

function JpgExists(fileName) {
    var alljpgFormats = ["JPG", "JPEG"];
    for (var j = 0; j < alljpgFormats.length; j++) {
        if (electronFs.existsSync(fileName.replace(".raw", "." + alljpgFormats[j].toLocaleLowerCase()))
            || electronFs.existsSync(fileName.replace(".raw", "." + alljpgFormats[j]))) {
            return true;
        }
    }
    return false;
}

function deleteFile(path, fileName) {
    var fileNames = path + "\\" + fileName;
    trash([fileNames, null]).then(() => {
        console.log('deleted ' + fileName);
    });
}