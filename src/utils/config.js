const fs = require("fs");
const path = require("path");

const configPath = path.join(path.resolve(__dirname, '..'), 'config.json');

function configInit() {
    const configCheck = fs.existsSync(configPath)
    const configDefault = {
        "token": "",
        "conversations": {
            "delete": {
                "count": 1000,
                "parallelRequests": 10,
                "delay": {
                    "min": 500,
                    "max": 1000
                }
            }
        }
    }

    if (!configCheck) fs.writeFileSync(configPath, JSON.stringify(configDefault, null, '\t'))
}

function configEdit(option, value) {
    return new Promise((resolve, reject) => {
        const configCheck = fs.existsSync(configPath);
        let configGet = configCheck ? JSON.parse(fs.readFileSync(configPath)) : {};

        const keys = option.split('.');
        const lastKey = keys.pop();

        let currentObj = configGet;
        for (let key of keys) {
            if (currentObj[key] && typeof currentObj[key] === 'object') {
                currentObj = currentObj[key];
            } else {
                reject(new Error('Invalid option'));
                return undefined;
            }
        }

        if (currentObj[lastKey] !== undefined) {
            currentObj[lastKey] = value;
        } else {
            reject(new Error('Invalid option'))
            return;
        }

        fs.writeFileSync(configPath, JSON.stringify(configGet, null, '\t'));
        resolve();
    });
}

function configRead() {
    const configCheck = fs.existsSync(configPath);
    let configGet = configCheck ? JSON.parse(fs.readFileSync(configPath)) : {};
    if (!configCheck) configInit()
    return configGet


}

module.exports = {
    configRead, configEdit, configInit
}