const {API} = require("vk-io");
const {configRead} = require("./config");

let api = new API({
    token: configRead().token
});

module.exports = api;