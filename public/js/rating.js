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
    return dark;
}

const dark = "/css/rating.css";
const light = "https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css";

var link = document.getElementById("theme");
if (getCookie("theme") == dark) {
    link.setAttribute("href", dark);
} else {
    link.setAttribute("href", light);
}
document.getElementById("themeButton").onclick = function () {
    var newTheme;
    if (link.getAttribute("href") == dark) {
        newTheme = light;
    } else {
        newTheme = dark;
    }
    link.setAttribute("href", newTheme);
    createCookie("theme", newTheme, 365);
}