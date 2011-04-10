(function trackSitebot(u,s){
	var a = [],n=navigator,d=document,p = {
		'url' : location.href,
		'agent' : n.userAgent.toLowerCase(),
		'version' : n.appVersion.toLowerCase(),
		'cpu': n.cpuClass || n.oscpu,
		'platform':n.platform,
		'language':'zh_CN',
		'appname':n.appName,
		'timezone':(new Date()).getTimezoneOffset()*(-1),
		'resolution':[screen.width,screen.height],
		'colordepth':screen.colorDepth,
		'title':d.title,
		'location':d.location,
		'referrer':d.referrer,
		'product':n.product,
		'productsub':n.productSub,
		'vendor':n.vendor,
		'vendorsub':n.vendorSub,
		'userid':u, //USER ID
		'websiteid':s,//website ID
		'from_sitebot':d.referrer,
		'_':+new Date
	}
	for(var i in p){
		a.push( i + '=' + encodeURIComponent(p[i]) );
	}
	(new Image).src = '//tracking.sitebro.cn/track.php?' + a.join('&');
})('NDExNQ==','NzY5OTA5'); //NzU4MTMy


