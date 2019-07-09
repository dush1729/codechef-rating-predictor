var createCookie = function (name, value) {
    document.cookie = name + "=" + value + "; path=/";
}

function getCookie(c_name) {
    if (document.cookie.length > 0) {
        c_start = document.cookie.indexOf(c_name + "=");
        if (c_start != -1) {
            c_start = c_start + c_name.length + 1;
            c_end = document.cookie.indexOf(";", c_start);
            if (c_end == -1) {
                c_end = document.cookie.length;
            }
            return unescape(document.cookie.substring(c_start, c_end));
        }
    }
    return 0;
}

const longCode = [
    "JAN", "FEB", "MARCH", "APRIL", "MAY", "JUNE",
    "JULY", "AUG", "SEPT", "OCT", "NOV", "DEC"];
const ratingTypes = ["", "long", "short", "ltime"];

var contestType = document.getElementById("contestType");
var contestDivision = document.getElementById("contestDivision");
var ratingType = document.getElementById("ratingType");
contestType.selectedIndex = getCookie("contestType")
contestDivision.selectedIndex = getCookie("contestDivision")
ratingType.selectedIndex = getCookie("ratingType")

document.getElementById("predictButton").onclick = function () {
    var url = "http://ccpredict.herokuapp.com/contest/";

    var contestType = document.getElementById("contestType").value;
    var contestDivision = document.getElementById("contestDivision").value;
    var ratingType = document.getElementById("ratingType").value;

    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth();

    if (contestType == 1) {
        url += longCode[month] + year.toString().substring(2);
    } else if (contestType == 2) {
        url += "COOK" + (102 + (2019 - year) * 12 + month);
    } else {
        url += "LTIME" + (68 + (2019 - year) * 12 + month);
    }

    if (contestDivision == 1) {
        url += "A";
    }
    else {
        url += "B";
    }

    if (ratingType == 1) {
        url += "/all";
    } else {
        url += "/" + ratingTypes[contestType];
    }

    createCookie("contestType", document.getElementById("contestType").selectedIndex)
    createCookie("contestDivision", document.getElementById("contestDivision").selectedIndex)
    createCookie("ratingType", document.getElementById("ratingType").selectedIndex)
    window.location = url
}

document.onkeydown = function (evt) {
    var keyCode = evt ? (evt.which ? evt.which : evt.keyCode) : event.keyCode;
    if (keyCode == 13) {
        $("#predictButton").trigger("click");
    }
}