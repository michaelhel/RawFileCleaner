# RawFileCleaner

## Project Status
RawFileCleaner is currently in progress.

## What can it do?
The tool can be used to delete all RAW files without a matching compressed file so you don't have to manually delete them after you have sorted out the compressed files.

It supports all common RAW image formats such as CR2, CRW, NEF, ARW, ORF, DNG and so on.

## Problems
**No app icon on macOS?**
Unfortunately there's a problem loading the icon on macOS.<br>
In order to show the icon: 
- right click on the app
- "show package content"
- navigate to "/Contents/Resources"
- open the "electron.icns" in Preview
- copy the app icon with CMD+C
- return to the app and right click to show information
- click on the wrong icon and press CMD+V to paste the correct icon

**Can't extract files on Windows?**<br>
If nothing happens when you try to extract the zip file, please use a third party tool such as 7-Zip.

## Authors
Hannes Gerstmayr, Michael Helcig, Christian Straßmayr

## Licence
The project is licensed under the MIT license.

## Credits

Framework: <br>
*Electron*

Node Modules: <br>
*electron-json-storage by jviotti <br>
electron-packager by malept <br>
is-online by silverwind <br>
jquery by JS Foundation <br>
progressbar.js by kimmobrunfeldt <br>
trash by sindresorhus <br>*

Terminal Animation at the beginning: <br>
*"Terminal Text Effect" by Captain Anonymous from CodePen*

Delete Button: <br>
*"Delete Button (Incl. Confirmation)" by Danny Iovane from CodePen*
