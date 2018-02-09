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
                var rawFormatOrFalse = endsWithRawFormat(fileName);
                if (rawFormatOrFalse && !JpgExists(path + "\\" + fileName, rawFormatOrFalse)) {
                    deleteFile(path, fileName);
                }
            }
        })
    });
}

function JpgExists(fileName, rawFormat) {
    var alljpgFormats = ["JPG", "JPEG"];
    for (var i = 0; i < alljpgFormats.length; i++) {
        if (electronFs.existsSync(fileName.replace(rawFormat, alljpgFormats[i].toLocaleLowerCase()))
            || electronFs.existsSync(fileName.replace(rawFormat, alljpgFormats[i]))) {
            return true;
        }
    }
    return false;
}

function endsWithRawFormat(fileName) {
    var allRawFormats = ["K25", "RAW", "NRW", "CR2", "ARW", "RAF", "RWZ", "NEF", "FFF", "DNG", "DCR", "RW2", "3FR", "CRW", "ARI", "ORF",
        "SRF", "MOS", "BAY", "MFW", "EIP", "KDC", "SRW", "MEF", "MRW", "ERF", "J6I", "SR2", "X3F", "RWL", "PEF", "IIQ", "CXI", "CS1"];
    for (var i = 0; i < allRawFormats.length; i++) {
        if (fileName.endsWith(allRawFormats[i])) {
            return allRawFormats[i];
        }
        else if (fileName.endsWith(allRawFormats[i].toLocaleLowerCase())) {
            return allRawFormats[i].toLocaleLowerCase();
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