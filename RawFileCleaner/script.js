var remote = require('electron').remote;
var electronFs = remote.require('fs');
const trash = require('trash');
storage = require('electron-json-storage');
var includeSubfolders = false;

var allRawFormats = ["K25", "RAW", "NRW", "CR2", "ARW", "RAF", "RWZ", "NEF", "FFF", "DNG", "DCR", "RW2", "3FR", "CRW", "ARI", "ORF",
    "SRF", "MOS", "BAY", "MFW", "EIP", "KDC", "SRW", "MEF", "MRW", "ERF", "J6I", "SR2", "X3F", "RWL", "PEF", "IIQ", "CXI", "CS1"
];
var allCompressedFormats = ["JPG", "JPEG", "TIFF"];

var allRawFiles = [];
var allCompressedFiles = [];

function includeSubfolder() {
    if (includeSubfolders) {
        document.getElementById("imgIncludeSubfolders").src = "img/notIncludeSubfolders.svg";
        includeSubfolders = false;
    } else {
        document.getElementById("imgIncludeSubfolders").src = "img/includeSubfolders.svg";
        includeSubfolders = true;
    }
}

function cleanFiles() {
    console.log(allCompressedFiles.length);
    getAllFileNames();
    console.log(allCompressedFiles.length);
    while (allCompressedFiles.length != 0) {
        deleteExistingNames();
    }
    console.log("testafterwhile");
}

function deleteExistingNames() {
    for (var i = 0; i < allCompressedFiles.length; i++) {
        for (var j = 0; i < allRawFiles.length; j++) {
            if (allRawFiles[j] === allCompressedFiles[i]) {
                allRawFiles.splice(j, 1);
                allCompressedFiles.splice(i, 1);
                return;
            }
        }
    }
}

function getAllFileNames() {
    console.log("getAll");
    storage.get('path', function(error, path) {
        if (error) throw error;
        console.log("storage get");
        electronFs.readdir(path, (err, dir) => {
            console.log("readdir");
            for (var i = 0; i < dir.length; i++) {
                fileName = dir[i];
                if (endsWithRawFormat(fileName)) {
                    console.log("push Raw");
                    allRawFiles.push(fileName);
                } else if (endsWithCompressedFormat(fileName)) {
                    console.log("push Compressed");
                    allCompressedFiles.push(fileName);
                }
            }
        });
    });
    printAllFileNames();
}

function printAllFileNames() {
    console.log("printAll");
    console.log("All " + allRawFiles.length + ": ");
    for (var i = 0; i < allRawFiles.length; i++) {
        console.log(allRawFiles[i]);
    }
    console.log("All " + allCompressedFiles.length + ": ");
    for (var i = 0; i < allCompressedFiles.length; i++) {
        console.log(allCompressedFiles[i]);
    }
}

function endsWithRawFormat(fileName) {
    for (var i = 0; i < allRawFormats.length; i++) {
        if (fileName.endsWith(allRawFormats[i])) {
            return true;
        }
    }
    return false;
}


function endsWithCompressedFormat(fileName) {
    for (var i = 0; i < allCompressedFormats.length; i++) {
        if (fileName.endsWith(allCompressedFormats[i])) {
            return true;
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