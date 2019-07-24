function createCookie(name, value, days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
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

function getUrl() {
    const longCode = [
        "JAN", "FEB", "MARCH", "APRIL", "MAY", "JUNE",
        "JULY", "AUG", "SEPT", "OCT", "NOV", "DEC"];
    const ratingTypes = ["", "long", "short", "ltime"];

    var url = "http://ccpredict.herokuapp.com/contest/";

    var contestType = document.getElementById("contestType").value;
    var contestDivision = document.getElementById("contestDivision").value;
    var ratingType = document.getElementById("ratingType").value;

    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth();
    const monthsPassed = (2019 - year) * 12 + month;

    if (contestType == 1) {
        url += longCode[month] + year.toString().substring(2);
    } else if (contestType == 2) {
        url += "COOK" + (monthsPassed + 102);
    } else {
        url += "LTIME" + (monthsPassed + 68);
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

    return url;
}

document.getElementById("contestType").selectedIndex = getCookie("contestType");
document.getElementById("contestDivision").selectedIndex = getCookie("contestDivision");
document.getElementById("ratingType").selectedIndex = getCookie("ratingType");
document.getElementById("predictButton").setAttribute("href", getUrl());

function predictButtonClick() {
    createCookie("contestType", document.getElementById("contestType").selectedIndex, 30)
    createCookie("contestDivision", document.getElementById("contestDivision").selectedIndex, 30)
    createCookie("ratingType", document.getElementById("ratingType").selectedIndex, 30)
    document.getElementById("predictButton").setAttribute("href", getUrl())
}

document.getElementById("predictButton").onclick = function () {
    predictButtonClick()
}

//for middle button click
document.getElementById("predictButton").addEventListener('auxclick', function (event) {
    predictButtonClick()
})

document.getElementById("fetchButton").onclick = function () {
    createCookie("user", document.getElementById("user").value, 365)
    window.location.reload()
}