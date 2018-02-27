var remote = require('electron').remote;
var electronFs = remote.require('fs');
storage = require('electron-json-storage');


var allRawFormats = ["K25", "RAW", "NRW", "CR2", "ARW", "RAF", "RWZ", "NEF", "FFF", "DNG", "DCR", "RW2", "3FR", "CRW", "ARI", "ORF",
    "SRF", "MOS", "BAY", "MFW", "EIP", "KDC", "SRW", "MEF", "MRW", "ERF", "J6I", "SR2", "X3F", "RWL", "PEF", "IIQ", "CXI", "CS1"
];
var allCompressedFormats = ["JPG", "JPEG", "TIFF"];
var includeSubfolders = false;

/** 
 * Changes boolean on click.
 * Also changes the picture whether subfolders are included or not.
 */
function includeSubfolder() {
    if (includeSubfolders) {
        document.getElementById("imgIncludeSubfolders").src = "img/notIncludeSubfolders.svg";
        document.getElementById("textIncludeSubfolders").innerHTML = "Subfolders not included";
        includeSubfolders = false;
    }
    else {
        document.getElementById("imgIncludeSubfolders").src = "img/includeSubfolders.svg";
        document.getElementById("textIncludeSubfolders").innerHTML = "Subfolders included";
        includeSubfolders = true;
    }

}


/**
 * Starts the cleaning process.
 */
function cleanFiles() {
    readFileNamesInFolder();
    window.location.href = 'conclusion.html';
    return;
}

/**
 * Returns true if the fileName ends with existing raw format.
 * @param fileName
 * @returns {boolean}
 */
function endsWithRawFormat(fileName) {
    for (var i = 0; i < allRawFormats.length; i++) {
        if (fileName.endsWith(allRawFormats[i])) {
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
        if (fileName.endsWith(allCompressedFormats[i])) {
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
 * Reads all filenames from the folder.
 */
function readFileNamesInFolder() {
    var foundMatch = false;
    storage.get('path', function(error, path) {
        if (error) throw error;
        electronFs.readdir(path, (err, dir) => {
            for (var i = 0; i < dir.length; i++) {
                foundMatch = false;
                if (endsWithRawFormat(dir[i])) {
                    for (var j = 0; j < dir.length && !foundMatch; j++) {
                        if (endsWithCompressedFormat(dir[j]) && hasSameName(dir[i], dir[j])) {
                            foundMatch = true;
                        }
                    }
                    if (!foundMatch) {
                        deleteFile(path, dir[i]);
                    }
                }
            }
        });
    });
}

/**
 * Deletes file.
 * @param path
 * @param fileName
 */
function deleteFile(path, filename) {
    var file;
    if (platform = 'darwin') {
        file = path + "/" + filename;
    } else {
        file = path + "\\" + filename;
    }
    const trash = require('trash');
    trash([file, null]).then(() => {
        console.log('deleted ' + filename);
    });
}