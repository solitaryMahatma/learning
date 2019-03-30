(function (doc, win) {
    var docEl = doc.documentElement,
        resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize',
        recalc = function () {
            var clientWidth = docEl.clientWidth;
            if (!clientWidth) return;
            	html=doc.getElementsByTagName("html")[0];
            
            	console.log(clientWidth);
                html.style.fontSize = clientWidth / 10 +"px";
                //pieces 当然是你在插件中设置的参数了
                //console.log(typeof (html))
        };
        if (!doc.addEventListener) return;
        win.addEventListener(resizeEvt, recalc, false);
        doc.addEventListener('DOMContentLoaded', recalc, false);
        //console.log("111")
})(document, window);