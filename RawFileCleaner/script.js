var remote = require('electron').remote;
var electronFs = remote.require('fs');
storage = require('electron-json-storage');


var allRawFormats = ["K25", "RAW", "NRW", "CR2", "ARW", "RAF", "RWZ", "NEF", "FFF", "DNG", "DCR", "RW2", "3FR", "CRW", "ARI", "ORF",
    "SRF", "MOS", "BAY", "MFW", "EIP", "KDC", "SRW", "MEF", "MRW", "ERF", "J6I", "SR2", "X3F", "RWL", "PEF", "IIQ", "CXI", "CS1", "MOV"
]; //MOV for Apples Live Photos
var allCompressedFormats = ["JPG", "JPEG", "TIFF"];
var deletedFiles = [];

/**
 * Changes boolean on click.
 * Also changes the picture whether subfolders are included or not.
 */
function includeSubfolder() {
    storage.get('includeSubfolders', function(error, includeSubfolders) {
        if (error) throw error;
        if (!includeSubfolders) {
            storage.set('includeSubfolders', true, (err) => {
                if (err) {
                    console.log(err);
                }
            });
            document.getElementById("imgIncludeSubfolders").src = "img/includeSubfolders.svg";
            document.getElementById("textIncludeSubfolders").innerHTML = "Subfolders included";
        } else {
            storage.set('includeSubfolders', false, (err) => {
                if (err) {
                    console.log(err);
                }
            });
            document.getElementById("imgIncludeSubfolders").src = "img/notIncludeSubfolders.svg";
            document.getElementById("textIncludeSubfolders").innerHTML = "Subfolders not included";
        }
    });
}

/**
 * Gathers the path, checks whether the subfolders should get
 * included or not and continues with the cleaning process.
 */
function getPathAndCheckSubfolder() {
    return new Promise(function(resolve, reject) {
        storage.get('path', function(error, path) {
            if (error) throw error;
            storage.get('includeSubfolders', function(error, includeSubfolders) {
                if (error) reject(error);
                else {
                    readFileNamesInFolder(path, includeSubfolders);
                    resolve(includeSubfolders);
                }
            });
        });
    });
}

/**
 * Starts the cleaning process.
 */
function cleanFiles() {
    getPathAndCheckSubfolder()
        .then(function() {
            storage.set('deletedFiles', deletedFiles, (err) => {
                if (err) {
                    console.log(err);
                }
            });
            window.location.href = 'conclusion.html';
        })
        .catch(function(error) {
            throw error;
        });
}

/**
 * Returns true if the fileName ends with existing raw format.
 * @param fileName
 * @returns {boolean}
 */
function endsWithRawFormat(fileName) {
    for (var i = 0; i < allRawFormats.length; i++) {
        if (fileName.endsWith(allRawFormats[i]) || fileName.endsWith(allRawFormats[i].toLocaleLowerCase())) {
            return true;
        }
    }
    return false;
}

/**
 * Returns true if the fileName ends with existing compressed format.
 * @param fileName
 * @returns {boolean}
 */
function endsWithCompressedFormat(fileName) {
    for (var i = 0; i < allCompressedFormats.length; i++) {
        if (fileName.endsWith(allCompressedFormats[i]) || fileName.endsWith(allCompressedFormats[i].toLocaleLowerCase())) {
            return true;
        }
    }
    return false;
}

/**
 * Returns true if the two names are equal. (without the ending)
 * @param firstFileName
 * @param secondFileName
 */
function hasSameName(filename1, filename2) {
    do {
        filename1 = filename1.slice(0, -1);
    } while (filename1.charAt(filename1.length - 1) != '.');
    filename1 = filename1.slice(0, -1);
    do {
        filename2 = filename2.slice(0, -1);
    } while (filename2.charAt(filename2.length - 1) != '.');
    filename2 = filename2.slice(0, -1);
    return filename1 === filename2;
}

/**
 * Reads all filenames from the folder and deletes RAW files without matching compressed files
 */
function readFileNamesInFolder(path, includeSubfolders) {
    var foundMatch = false;
    const files = electronFs.readdirSync(path);
    var fileName;
    for (var i = 0; i < files.length; i++) {
        fileName = files[i];
        foundMatch = false;
        if (includeSubfolders) {
            if (electronFs.lstatSync(path + "/" + fileName).isDirectory()) {
                readFileNamesInFolder(path + "/" + fileName, includeSubfolders);
            }
        }
        if (endsWithRawFormat(fileName)) {
            for (var j = 0; j < files.length && !foundMatch; j++) {
                if (endsWithCompressedFormat(files[j]) && hasSameName(fileName, files[j])) {
                    foundMatch = true;
                }
            }
            if (!foundMatch) {
                deleteFile(path, fileName);
                document.getElementById("warning").innerHTML = fileName + "is being deleted";
                //in dev
                deletedFiles.push(
                    fileName
                );
                //end
            }
        }
    }
}

/**
 * Deletes file.
 * @param path
 * @param fileName
 */
function deleteFile(path, filename) {
    var file;
    file = path + "/" + filename;
    const trash = require('trash');
    trash([file, null]).then(() => {
        console.log('deleted ' + filename);
    });
}