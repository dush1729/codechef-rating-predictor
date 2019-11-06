var axios = require('axios');
var data = null
var lastFetched = null

module.exports.getBearer = function (callback) {
    var time = new Date().getTime() / 1000
    if (!lastFetched || time - lastFetched >= data["result"]["data"]["expires in"]) {
        axios.post("https://api.codechef.com/oauth/token",
            { "grant_type": "client_credentials", "scope": "public", "client_id": process.env.CLIEND_ID, "client_secret": process.env.CLIENT_SECRET })
            .then(function (response) {
                data = response.data
                lastFetched = new Date().getTime() / 1000
                callback(null, response.data)
            })
            .catch(function (error) {
                callback(error, null)
            });
    } else {
        callback(data, null)
    }
}