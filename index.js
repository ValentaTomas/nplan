const fs = require('fs');
const sh = require('shelljs');
const path = require('path');
const Configstore = require('configstore');

const config = new Configstore('nplan.config');

function openJournal(filename) {
    sh.exec(`open -a TextEdit ${filename}`, { async: true });
}

function createToday(dir, filename, lastDay) {
    const todaypath = path.join(dir, filename);
    if (lastDay) {
        const lastpath = path.join(dir, lastDay);
        sh.cp(lastpath, todaypath);
    } else {
        sh.exec(`:> ${todaypath}`, { async: true });
    }
    config.set('last', filename);
}

function getLastDay(dir) {
    const lastDay = config.get('last');
    if (lastDay) {
        const filepath = path.join(dir, lastDay);
        if (fs.existsSync(filepath)) {
            return lastDay;
        }
    }
}

function checkoutToday(dir, filename) {
    const filepath = path.join(dir, filename);
    const today = fs.existsSync(filepath);
    if (today) {
        openJournal(filepath);
    } else {
        const lastDay = getLastDay(dir);
        createToday(dir, filename, lastDay);
        openJournal(filepath);
    }
}

function getFilename(day, month, year) {
    const name = `${year}_${month}_${day}`;
    return name;
}

function main() {
    let dir = process.argv[2];
    if (dir) {
        config.set('dir', dir);
    } else {
        dir = config.get('dir');
    }
    if (!dir) {
        throw new Error('You need to specify directory for saving entries.');
    }
    const datetime = new Date();
    const day = datetime.getUTCDate();
    const month = datetime.getMonth() + 1;
    const year = datetime.getUTCFullYear();
    const filename = getFilename(day, month, year);
    checkoutToday(dir, filename);
}


main();