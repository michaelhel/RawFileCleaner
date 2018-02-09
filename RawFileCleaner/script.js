var remote = require('electron').remote;
var electronFs = remote.require('fs');
const trash = require('trash');
storage = require('electron-json-storage');
var includeSubfolders = false;

function includeSubfolder() {
    includeSubfolders = true;
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
    alert(path + " " + fileName);
    if (electronFs.existsSync(fileNames)) {
        electronFs.unlink(fileNames, (err) => {
            if (err) {
                alert("An error ocurred updating the file" + err.message);
                console.log(err);
                return;
            }
            console.log("File succesfully deleted");
    });
    } else {
        alert("This file doesn't exist, cannot delete");
    }
}