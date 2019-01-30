const request = require('request-promise')
const params = require('./params')
const headers = require('./headers')
const fs = require('fs')
const log = require('log-to-file')
const jsons = require('./out.json')


regex1 = /Из-за нарушения правил пользования сайтом eLIBRARY.RU/g
regex2 = /<img src="\/images\/(sorry|stop)\.(jpg|gif)" border=0/g

var tr = require('tor-request');
tr.TorControlPort.password = 'beforerain';

// const getMainpage =  async (id, name, callback) => {
//     const options = {
//         method: 'GET',
//         uri: `https://elibrary.ru/item.asp?id=${id}`,
//         jar: {
//             SUserID: "329618373",
//             SCookieID: "795007256",
//         },
//         timeout: 0
//     }
//     tr.request(options, (err, response, html) => {
//         if (regex1.test(html) || regex2.test(html)){
//             tr.renewTorSession((err, msg) => {
//                 console.log('session renewed')
//                 if (msg) {
//                     getMainpage(id, name, (err) => {
//                         if (err) console.log(err)
//                     })
//                  } else {
//                      console.log(err)
//                  }
//            });         
//         } else {
//             console.log
//             fs.writeFile(`./output/pages/${id}.html`, html, err => {
//                 log(html)
//                 callback(err)
//                 })
//         }    
                    
//     })
    
  
    
// }


tr.asyncRequest = function(options) {
    return new Promise((rs, rj) => {
        this.request(options, (err, res) => {
            if (err) return rj(err);
            rs(res);
        });
    });
}

tr.asyncRenew = function() {
    return new Promise((rs, rj) => {
        this.renewTorSession((err, msg) => {
            if (err) return rj(err);
            rs(msg);
        })
    })
}

const getMainpage =  async (id, name, callback) => {
    const options = {
        method: 'GET',
        uri: `https://elibrary.ru/item.asp?id=${id}`,
        jar: {
            SUserID: "329618373",
            SCookieID: "795007256",
        },
        timeout: 0
    }
    try {
        var res, html;
        while (true) {
            res = await tr.asyncRequest(options);
            html = res.body;
            if (html.length >= 1024) break;
            console.log(html)
            console.log('session renewed', await tr.asyncRenew());
        }
        console.log('saving file', id);
        fs.writeFileSync(`./output/pages/${id}.html`, html);
    } catch(err) {
        console.log(err);
        throw err;
    }
}
(async () => {
    for (i = 0, len = jsons.length; i < len; i++){
        try {
            if (fs.statSync(`./output/pages/${jsons[i].id}.html`).size >= 1024) continue;
        } catch(err) { }

        console.log(`${jsons[i].id} ${i+1}/${len} (${((i+1)/len*100).toFixed(2)})`);
        try {
            await getMainpage(jsons[i].id, jsons[i].name);
        } catch(err) {
            i--;
            log(`${err} in  ${i}`, './fs-err.log');
        }
        // await new Promise((rs, rj) => getMainpage(jsons[i].id, jsons[i].name, (err) => {
        //     if (err) {
        //         --i
        //         rj(log(`${err} in  ${i}`, './fs-err.log'))
        //     } else {
        //         rs()
        //     }
        // }))
    }

})()

