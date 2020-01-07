// Run at 09:00 GMT every Friday (0 9 * * 0)
exports = function () {
    var date = new Date();
    date.setHours(date.getHours() + 5);
    date.setMinutes(date.getMinutes() + 30);
    const currentMonth = date.getMonth();
    var fridaysPassed = 0;
    while (date.getMonth() == currentMonth) {
        fridaysPassed++;
        date.setDate(date.getDate() - 7);
    }
    if (fridaysPassed != 1) return;

    date = new Date();
    date.setHours(date.getHours() + 5);
    date.setMinutes(date.getMinutes() + 30);
    const year = date.getFullYear();
    const month = date.getMonth();

    console.log("Adding: Long at " + new Date());
    const db = context.services.get("codechef-rating-predictor").db("test");
    db.collection("cache").deleteMany({});
    db.collection("checklist").deleteMany({});
    db.collection("data").deleteMany({});
    db.collection("lastupdate").deleteMany({});
    db.collection("status").deleteMany({});
    db.collection("user").deleteMany({});

    const longCode = [
        "JAN", "FEB", "MARCH", "APRIL", "MAY", "JUNE",
        "JULY", "AUG", "SEPT", "OCT", "NOV", "DEC"
    ];
    db.collection("checklist").insertMany([
        {
            "contest": longCode[month] + year.toString().substring(2) + "A",
            "parse": ["all", "long"]
        },
        {
            "contest": longCode[month] + year.toString().substring(2) + "B",
            "parse": ["all", "long"]
        }]);

    console.log("Added: Long at " + new Date());
};