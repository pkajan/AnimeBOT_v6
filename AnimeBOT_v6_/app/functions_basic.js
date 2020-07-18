const fs = require('fs-extra');
const util = require('util');
const request = require('node-fetch');
const date = require('date-and-time');


module.exports = {
    name: 'fwASYNC',
    description: 'ASYNC write into file',
    execute(filepath, data) {
        fs.appendFile(filepath, data, null,
            // callback function
            function (err) {
                if (err) { throw err; }
            });
    },

    name: 'deunicode',
    description: 'remove accents/diacritics',
    execute(any_string) {
        return any_string.normalize('NFD').replace(/[\u0300-\u036f]/g, "");
    },

    name: 'JSON_file_remove_element',
    description: 'remove given element from JSON object',
    execute(filename, elem) {
        var obj = this.JSON_file_read(filename); //read data
        delete obj[`${elem}`]; // remove element
        fs.writeFileSync(filename, JSON.stringify(obj)); // write back to file
    },

    name: 'JSON_file_add_edit_element',
    description: 'add or edit given element in JSON object',
    execute(filename, elem) {
        var obj = this.JSON_file_read(filename); //read data
        obj[`${elem}`] = data; // add/edit element
        fs.writeFileSync(filename, JSON.stringify(obj)); // write back to file
    },

    name: 'download',
    description: 'Download url content',
    execute(url, destination) {
        request(url)
            .pipe(fs.createWriteStream(destination))
    },




};