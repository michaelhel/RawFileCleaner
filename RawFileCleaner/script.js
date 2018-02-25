var remote = require('electron').remote;
var electronFs = remote.require('fs');
const trash = require('trash');
storage = require('electron-json-storage');

function includeSubfolder() {
    storage.get('includeSubfolders', function (error, includeSubfolders) {
        if (error) throw error;
        if(!includeSubfolders){
            storage.set('includeSubfolders', true, (err) => {
                if (err) {
                    console.log(err);
                }
            });
            document.getElementById("imgIncludeSubfolders").src = "img/includeSubfolders.svg";
        }
        else{
            storage.set('includeSubfolders', false, (err) => {
                if (err) {
                    console.log(err);
                }
            });
            document.getElementById("imgIncludeSubfolders").src = "img/notIncludeSubfolders.svg";
        }
    });
}

function cleanFilesButtonHandler() {
    storage.get('path', function (error, path) {
        if (error) throw error;
        storage.get('includeSubfolders', function (error, includeSubfolders) {
            if (error) throw error;
            cleanFiles(path, includeSubfolders);
        });
    });
}

function cleanFiles(path, includeSubfolders) {
    electronFs.readdir(path, (err, dir) => {
        for (var i = 0; i < dir.length; i++) {
            fileName = dir[i];
            if (includeSubfolders) {
                if (electronFs.lstatSync(path + "/" + fileName).isDirectory()) {
                    cleanFiles(path + "/" + fileName, includeSubfolders);
                }
            }
            var rawFormatOrFalse = endsWithRawFormat(fileName);
            if (rawFormatOrFalse && !compressedFormatExists(path + "/" + fileName, rawFormatOrFalse)) {
                deleteFile(path + "/" + fileName);
            }
        }
    })
}

function compressedFormatExists(fileName, rawFormat) {
    var allCompressedFormats = ["JPG", "JPEG", "TIFF"];
    for (var i = 0; i < allCompressedFormats.length; i++) {
        if (electronFs.existsSync(fileName.replace(rawFormat, allCompressedFormats[i].toLocaleLowerCase()))
            || electronFs.existsSync(fileName.replace(rawFormat, allCompressedFormats[i]))) {
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

function deleteFile(fileLocation) {
    electronFs.unlinkSync(fileLocation, (err) => {
        if (err) {
            console.log(err);
        }
    });
    /*
    trash([file, null]).then(() => {
        console.log('deleted ' + filename);
    });
    */
}