exports = function () {
	/*
	A Scheduled Trigger will always call a function without arguments.
	Documentation on Triggers: https://docs.mongodb.com/stitch/triggers/overview/

	Functions run by Triggers are run as System users and have full access to Services, Functions, and MongoDB Data.

	Access a mongodb service:
	const collection = context.services.get(<SERVICE_NAME>).db("db_name").collection("coll_name");
	const doc = collection.findOne({ name: "mongodb" });
    
	Note: In Atlas Triggers, the service name is defaulted to the cluster name.

	Call other named functions if they are defined in your application:
	const result = context.functions.execute("function_name", arg1, arg2);

	Access the default http client and execute a GET request:
	const response = context.http.get({ url: <URL> })

	Learn more about http client here: https://docs.mongodb.com/stitch/functions/context/#context-http
	*/

    const db = context.services.get("codechef-rating-predictor").db("test2");

    db.collection("cache").deleteMany({});
    db.collection("checklist").deleteMany({});
    db.collection("data").deleteMany({});
    db.collection("lastupdate").deleteMany({});
    db.collection("status").deleteMany({});
    db.collection("user").deleteMany({});

    const checklist = db.collection("checklist");
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth();

    const cookOffCode = 102 + (2019 - year) * 12 + month;
    checklist.insertMany([
        {
            "contest": "COOK" + cookOffCode + "A",
            "parse": ["all", "short"]
        },
        {
            "contest": "COOK" + cookOffCode + "B",
            "parse": ["all", "short"]
        }]);

    const lunchtimeCode = 68 + (2019 - year) * 12 + month;
    checklist.insertMany([
        {
            "contest": "LTIME" + lunchtimeCode + "A",
            "parse": ["all", "ltime"]
        },
        {
            "contest": "LTIME" + lunchtimeCode + "B",
            "parse": ["all", "ltime"]
        }]);

    const longCode = [
        "JAN", "FEB", "MARCH", "APRIL", "MAY", "JUNE",
        "JULY", "AUG", "SEPT", "OCT", "NOV", "DEC"
    ];
    checklist.insertMany([
        {
            "contest": longCode[month] + year.toString().substring(2) + "A",
            "parse": ["all", "long"]
        },
        {
            "contest": longCode[month] + year.toString().substring(2) + "B",
            "parse": ["all", "long"]
        }]);
};