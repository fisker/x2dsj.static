(function(){
var tj_view_pages = 1;
var tj_view_times = 1;
try {
    tj_view_pages = document.cookie.match(new RegExp("(^| )AJSTAT_ok_pages=([^;]*)(;|$)"));
    tj_view_pages = (tj_view_pages == null) ? 1: (parseInt(unescape((tj_view_pages)[2])) + 1);
    var tj_now = new Date();
    tj_now.setTime(tj_now.getTime() + 60 * 60 * 1000);
    document.cookie = "AJSTAT_ok_pages=" + tj_view_pages + ";path=/;expires=" + tj_now.toGMTString();
    tj_view_times = document.cookie.match(new RegExp("(^| )AJSTAT_ok_times=([^;]*)(;|$)"));
    if (tj_view_times == null) {
        tj_view_times = 1;
    } else {
        tj_view_times = parseInt(unescape((tj_view_times)[2]));
        tj_view_times = (tj_view_pages == 1) ? (tj_view_times + 1) : (tj_view_times);
    }
    tj_now.setTime(tj_now.getTime() + 365 * 24 * 60 * 60 * 1000);
    document.cookie = "AJSTAT_ok_times=" + tj_view_times + ";path=/;expires=" + tj_now.toGMTString();
} catch(e) {}
new Image().src = '//web.51.la/go.asp?svid=15&id=2347960&tpages=' + tj_view_pages + '&ttimes=' + tj_view_times + '&tzone=' + (0 - new Date().getTimezoneOffset() / 60) + '&tcolor=' + (navigator.appName == "Netscape" ? screen.pixelDepth : screen.colorDepth) + '&sSize=' + screen.width + ',' + screen.height + '&referrer=' + escape(document.referrer) + '&vpage=' + escape(window.location) + '';
})();