const request = require('request-promise')
const params = require('./params')
const headers = require('./headers')
const fs = require('fs')
const log = require('log-to-file')

const getMainpage = (page = 1, callback) => {
    const options = {
        method: 'POST',
        uri: 'https://elibrary.ru/org_items.asp',
        headers: headers,
        jar: {
            SUserID: "329618373",
            SCookieID: "795007256",
        },
        body: `itembox_name=&pagenum=95&add_all=&paysum=&orgsid=2179&show_refs=1&hide_doubles=1&items_all=&orgdepid=0&rubric_order=0&title_order=0&org_order=0&author_order=0&year_order=1&type_order=0&role_order=0&show_option=0&show_sotr=0&check_show_refs=on&check_hide_doubles=on&sortorder=0&order=1&itemboxid=0`,
        timeout: 0
    }
    request(options)
        .then(html => fs.writeFile(`./output/search/95.html`, html, err => {
            log(html)
            callback(err)
            })
        )
        .catch(err => log(err, './req-err.log'))
}

(async () => {
    for (i = 95; i < 96; i++){
        await new Promise((rs, rj) => getMainpage(i, (err) => {
            if (err) {
                --i
                rj(log(`${err} in  ${i}`, './fs-err.log'))
            } else {
                rs()
            }
        }))
    }

})()

