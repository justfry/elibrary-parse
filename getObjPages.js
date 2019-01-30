const request = require('request-promise')
const headers = require('./headers')
const fs = require('fs')
const log = require('log-to-file')

const searchFolder = './output/search/'


fs.readdir(searchFolder, (err, files) => {
    getJsons(files)
})

const getJsons = (files) => {
    for (var i = 1, len = files.length; i < len; i++){
        fs.readFile(`./output/search/${files[i]}`, 'utf8', (err, data) => {
            if (err) console.log(err)
            else {
                fs.appendFile('out.json', findRedexp(data), err => {
                    console.log(err)
                })
            }
        })
    }
}

const findRedexp = (data) => {
    regexp = new RegExp(/\?id=(\d{3,})"><b>\r\n(.+?)<\/b>/g)
    match = regexp.exec(data)
    var papers = ""
    while (match != null) {
        papers += JSON.stringify({
            id: match[1],
            name: match[2]
        }) + ','
        match = regexp.exec(data)
    }
    return (papers)
}