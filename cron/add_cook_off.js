// Run at 15:30 GMT every Sunday (30 15 * * 0)
exports = function () {
    var date = new Date();
    date.setHours(date.getHours() + 5);
    date.setMinutes(date.getMinutes() + 30);
    const currentMonth = date.getMonth();
    date.setDate(date.getDate() - 2);
    var fridaysPassed = 0;
    while (date.getMonth() == currentMonth) {
        fridaysPassed++;
        date.setDate(date.getDate() - 7);
    }
    if (fridaysPassed != 3) return;

    date = new Date();
    date.setHours(date.getHours() + 5);
    date.setMinutes(date.getMinutes() + 30);
    const year = date.getFullYear();
    const month = date.getMonth();
    const monthsPassed = (2019 - year) * 12 + month;

    console.log("Adding: Cookoff at " + new Date());
    const db = context.services.get("codechef-rating-predictor").db("test");
    db.collection("cache").deleteMany({});
    db.collection("checklist").deleteMany({});
    db.collection("data").deleteMany({});
    db.collection("lastupdate").deleteMany({});
    db.collection("status").deleteMany({});
    db.collection("user").deleteMany({});

    const cookOffCode = monthsPassed + 102;
    db.collection("checklist").insertMany([
        {
            "contest": "COOK" + cookOffCode + "A",
            "parse": ["all", "short"]
        },
        {
            "contest": "COOK" + cookOffCode + "B",
            "parse": ["all", "short"]
        }]);

    console.log("Added: Cookoff at " + new Date());
};