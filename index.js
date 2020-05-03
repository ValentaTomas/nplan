const fs = require('fs');
const sh = require('shelljs');
const path = require('path');

function openJournal(filename) {
    const p = sh.exec(`open -a TextEdit ${filename}`, { async: true });
}


function createToday(filename) {
    sh.exec(`:> ${filename}`, { async: true });
}

function checkoutToday(filename) {
    const today = fs.existsSync(filename);
    if (today) {
        openJournal(filename);
    } else {
        createToday(filename);
        openJournal(filename);
    }

}

function getFilename(dir, day, month, year) {
    const name = `${year}_${month}_${day}`;
    return path.join(dir, name);
}

function main() {
    const dir = process.argv[2];
    const datetime = new Date();
    const day = datetime.getUTCDate();
    const month = datetime.getMonth();
    const year = datetime.getUTCFullYear();
    const filename = getFilename(dir, day, month, year);
    const today = checkoutToday(filename);

}


main();