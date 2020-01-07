// Run at 13:30 GMT every Saturday (30 13 * * 6)
exports = function () {
    var date = new Date();
    date.setHours(date.getHours() + 5);
    date.setMinutes(date.getMinutes() + 30);
    const currentMonth = date.getMonth();
    var saturdayRemaining = 0;
    while (date.getMonth() == currentMonth) {
        saturdayRemaining++;
        date.setDate(date.getDate() + 7);
    }
    if (saturdayRemaining != 1) return;

    date = new Date();
    date.setHours(date.getHours() + 5);
    date.setMinutes(date.getMinutes() + 30);
    const year = date.getFullYear();
    const month = date.getMonth();
    const monthsPassed = (2019 - year) * 12 + month;

    console.log("Adding: Lunchtime at " + new Date());
    const db = context.services.get("codechef-rating-predictor").db("test");
    db.collection("cache").deleteMany({});
    db.collection("checklist").deleteMany({});
    db.collection("data").deleteMany({});
    db.collection("lastupdate").deleteMany({});
    db.collection("status").deleteMany({});
    db.collection("user").deleteMany({});

    const lunchtimeCode = monthsPassed + 68;
    db.collection("checklist").insertMany([
        {
            "contest": "LTIME" + lunchtimeCode + "A",
            "parse": ["all", "ltime"]
        },
        {
            "contest": "LTIME" + lunchtimeCode + "B",
            "parse": ["all", "ltime"]
        }]);

    console.log("Added: Lunchtime at " + new Date());
};