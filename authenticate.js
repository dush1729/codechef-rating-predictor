var request = require('request');
var data = null
var lastFetched = null

module.exports.getBearer = function (callback) {
    var time = new Date().getTime() / 1000
    if (!lastFetched || time - lastFetched >= data["result"]["data"]["expires in"]) {
        request.post(
            "https://api.codechef.com/oauth/token",
            { json: { "grant_type": "client_credentials", "scope": "public", "client_id": process.env.CLIEND_ID, "client_secret": process.env.CLIENT_SECRET } },
            function (error, response, body) {
                if (error) {
                    callback(error, null)
                }
                else if (response.statusCode == 200) {
                    data = body
                    lastFetched = new Date().getTime() / 1000
                    callback(null, body)
                }
                else {
                    callback(new Error("API error: " + response.statusCode), null)
                }
            }
        );
    } else {
        callback(data, null)
    }
}