const request = require('request-promise')
const params = require('./params')
const headers = require('./headers')

const getMainpage = (page = 1) => {
    const options = {
        method: 'GET',
        uri: 'https://elibrary.ru/org_items.asp?orgsid=2179',
        headers: headers,
        jar: {
            UserID: "329557183",
        SCookieID: "792542980",
        },
        body: JSON.stringify(params),
    

    }
    request(options)
        .then(html => console.log(html))
        .catch(err => console.log(err))
}
getMainpage()