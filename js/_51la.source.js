(function track51la( countId ){

	var pageViews=1;
	var visterBacktimes=1;


	try{
		var cookies = document.cookie + '';

		var arr = cookies.match(new RegExp("(^| )AJSTAT_ok_pages=([^;]*)(;|$)"));
		pageViews= arr ? (parseInt(unescape(arr[2]),10)+1) : 1 ;
		var tDate = new Date( (+new Date) + 60*60*1000 ).toGMTString();
		document.cookie="AJSTAT_ok_pages="+pageViews+ ";path=/;expires="+ tDate;

		arr = cookies.match(new RegExp("(^| )AJSTAT_ok_times=([^;]*)(;|$)"));
		visterBacktimes = arr ? 
			( parseInt(unescape(arr[2]),10) + (pageViews == 1 ?  1 : 0) )  :
			1;
		document.cookie="AJSTAT_ok_times="+visterBacktimes+";path=/;expires="+tDate;
	}catch(e){}

	var referrer = document.referrer;
	try{
		referrer=window.parent.document.referrer;
	}catch(e){}
	try{
		referrer=window.top.document.referrer;
	}catch(e){}

	var p = {
		svid : 7,
		id : countId,
		tcolor : ( screen['pixelDepth'] || screen['colorDepth'] ) ,
		sSize : screen.width + ',' + screen.height ,
		tzone : (-(new Date).getTimezoneOffset()/60) ,
		itpages : pageViews ,
		ttimes : visterBacktimes ,
		referrer : escape(referrer) ,
		vpage : escape(window.location.href)
	};
	var ps = [];
	for(var i in p){ ps.push( i + '=' + p[i] ); }
	(new Image).src= '//web2.51.la:82/go.asp?' + ps.join('&');

})(2347960);