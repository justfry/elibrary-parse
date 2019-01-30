var tr = require('tor-request');
tr.TorControlPort.password = 'beforerain';

var printTOR_IP = function () {

  tr.request('https://api.ipify.org', function (err, res, body) {
  if (!err && res.statusCode == 200) {
      console.log("Your public (through Tor) IP is: " + body);
   }
});
};

//print current ip

 printTOR_IP();

//renew to new ip
tr.renewTorSession(function (err, msg) {
     if (msg) {
         printTOR_IP();
      }
});

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
        const res = await tr.asyncRequest(options);
        const html = res.body;
        if (regex1.test(html) || regex2.test(html)) {
            console.log('session renewed', await tr.asyncRenew());
        } else {
            console.log('saving file', id);
            fs.writeFileSync(`./output/pages/${id}.html`, html);
        }
    } catch(err) {
        console.log(err);
        throw err;
    }
}