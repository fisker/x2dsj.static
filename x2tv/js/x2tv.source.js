/*!
 * x2tv common functions
 * fisker Cheung
 */

(function($,window,undefined){
	
	var X2 = window['X2'] = {};

	X2.shareLink = function(e){
		e = $(e).parent();
		var u = e.find('input[type=text]');
		function copy(){
			if(window.clipboardData){
				var text = e.find('label').html() + '\n\r' + u.val();
				window.clipboardData.setData( "Text" , text );
				alert('已经成功复制以下内容到剪贴板，你可以通过Ctrl+V粘贴到QQ/MSN/论坛签名档：\n--------\n' + text );
			}else{
				e.find('input[type=text]')[0].select();
				alert("您使用的浏览器不支持此复制功能，请使用Ctrl+C或鼠标右键。");
			}
		}
		if(u.val().match(/^http:\/\/t\.cn\/(.*?)/)){
			copy();
			return ;
		}
		$.getJSON('//api.weibo.com/short_url/shorten.json?url_long='+encodeURIComponent(u.val())+'&source=3564068769&callback=?',function( o ){
			if(o[0] && o[0].url_short){u.val(o[0].url_short);}
			copy();
		});
	}
	X2.ping = function(u){
		(new Image).src=u;
	}

	X2.openYY = function(yid){
		var yyUrl = '';
		try{
			new ActiveXObject('yy_checker.Checker.1');
			yyUrl = 'yy://join:room_id='+yid;
		}catch(e){
			yyUrl = '//yy.duowan.com/go.html#'+yid;
		}
		window.open(yyUrl);
		return false;
	}

	X2.search = function(q){
		google.load('search', '1', {language : 'zh-CN',nocss:true}); 
		google.setOnLoadCallback(function(){ 
			var customSearchControl = new google.search.CustomSearchControl('004737766081905067025:yabscsqa4cc'); 
			customSearchControl.setResultSetSize(google.search.Search.FILTERED_CSE_RESULTSET); 
			var options = new google.search.DrawOptions(); 
			//options.setSearchFormRoot('cse-search-form'); 
			customSearchControl.draw('cse', options); 
			//customSearchControl.setSearchStartingCallback(null,function(){$('#cse').html('搜索结果加载中...');});
			customSearchControl.setSearchCompleteCallback(null, function(){
				var host = window.location.host;
				$.each($('.gs-result'),function(){
					var thost = $(this).find('.gs-visibleUrl-short').html();
					if( thost && thost!==host){
						$(this).html($(this).html().replace(new RegExp(thost,'ig'),host));
					}
				});
			});
			customSearchControl.execute(q);
		}, true);
	}

	var localhost = window.location.host == 'localhost' ,  initFunc = [],initFuncOndomready = [] , initFuncOnload = [];

	initFunc.push(function(){
		window.onerror = function(){return true}
	});

	initFunc.push(function(){
		document.execCommand('BackgroundImageCache', false, true);
	});

/*
	initFunc.push(function(){
		if(window.top!==window.self){
			window.top.location = window.self.location;
		}
	});
*/
	// search functions
	initFuncOndomready.push(function(){
		var q = $('#q').attr('disabled',false);
		var defaultText = '请输入电视剧名';
		if( !$.trim(q.val()) ){
			q.val(defaultText);
		}
		$('#search').submit(function(){
			var v = $.trim(q.val());
			if( v.length<1 || v==defaultText ){
				q.focus();
				alert('请输入电视剧名');
				return false;
			}
			window.location = root + 'search/?' + encodeURIComponent(v) + '.html';
			return false;
		});
		q.focus(function(){
			if( q.val()== defaultText ){
				q.val('');
			}
			q.css('color','#000');
		}).blur(function(){
			if( !q.val() ){
				q.val(defaultText);
				q.css('color','#D8D8D8');
			}
		});
	});

	// playlist functions
	initFuncOndomready.push(function(){
		var btn = $('#pl-ctrl-btn');
		//not in a video play page
		if(!btn.length) return ;
		var pl = $('#playlist'), next = $('#next');

		var bgFrame = $('#playlist iframe');
		if(!bgFrame.length){
			bgFrame = $('<iframe frameborder="0" src="" tabindex="-1"></iframe>').css({
						opacity : 0,
						display : 'block',
						position : 'absolute',
						'z-index' : -1,
						height : pl.height(),
						width : pl.width()
				}).insertBefore(pl.find('ul'));
		}

		function show(){ 
			next.hide(); 
			btn.attr('class','open');
			//pl.show(); 
			pl.slideDown('fast');
			window['__playlistshow__'] = true;
		}

		function hide(){
			//pl.hide(); btn.attr('class','close'); next.show();
			pl.slideUp('slow',function(){btn.attr('class','close');next.show();});
			window['__playlistshow__'] = false;
		}

		function resize(){
			pl.css({top:btn.offset().top+btn.height(),left:btn.offset().left-pl.outerWidth()+btn.width()})
		}

		btn.click( function( e ){
			if(window['__playlistshow__']){hide()}else{show()}e.stopPropagation();
		} );

		pl.click( function( e ){e.stopPropagation();});
		$( document ).click( hide );
		resize(); //i'm not sure window.onload will excute
		$( window ).load( resize ).resize( resize );  //don't remove onload
		if( window.location.hash=='#pl' ){
		//if( window.location.hash=='#pl' && !($('#player iframe').length && $.browser.msie) ){
			show();
		}
	});

	// initial functions
	initFuncOndomready.push(function(){
		var idx = $('.idx');
		//not in a category list page
		if(!idx.length) return ;
		var allLis = $('.link-list li');
		var lis = [];
		$('a',idx).click(function(){$(this).blur()});
		$('a.enable',idx).click(function(){
			var _this = $(this);
			var initial = _this.html();
			var on = $('a.on',idx).removeClass('on');
			if(initial=='全部'){
				if(on.length)
					allLis.show();
				return;
			}
			(on.length ? lis[on.html()] : allLis).css({display:'none'}); //比hide()快，css('display','none')差不多快
			if(!lis[initial]){
				lis[initial] = $('.link-list li:has(a[rel='+initial+'])');
			}
			_this.addClass('on');
			lis[initial].css({display:''});
		}).mouseover(function(){
			var initial = $(this).html();
			if(!lis[initial]){
				lis[initial] = $('.link-list li:has(a[rel='+initial+'])');
			}
		});

	});

	// track
	initFunc.push(function(){
		if(localhost)
			return ;

		// track 51la
		window['lainframe'] = function(){};
		(function(c){var a=1,e=1;try{var b=document.cookie+"",d=b.match(/(^| )AJSTAT_ok_pages=([^;]*)(;|$)/);a=d?parseInt(unescape(d[2]),10)+1:1;var f=(new Date(+new Date+36E5)).toGMTString();document.cookie="AJSTAT_ok_pages="+a+";path=/;expires="+f;e=(d=b.match(/(^| )AJSTAT_ok_times=([^;]*)(;|$)/))?parseInt(unescape(d[2]),10)+(a==1?1:0):1;document.cookie="AJSTAT_ok_times="+e+";path=/;expires="+f}catch(h){}b=document.referrer;try{b=window.parent.document.referrer}catch(i){}try{b=window.top.document.referrer}catch(j){}c={svid:7,id:c,tcolor:screen.pixelDepth||screen.colorDepth,sSize:screen.width+","+screen.height,tzone:-(new Date).getTimezoneOffset()/60,itpages:a,ttimes:e,referrer:escape(b),vpage:escape(window.location.href)};a=[];for(var g in c)a.push(g+"="+c[g]);(new Image).src="//web2.51.la:82/go.asp?"+a.join("&")})(2347960);

		// track Sitebot
		//(function(e,f){var c=[],a=navigator,b=document;a={url:location.href,agent:a.userAgent.toLowerCase(),version:a.appVersion.toLowerCase(),cpu:a.cpuClass||a.oscpu,platform:a.platform,language:"zh_CN",appname:a.appName,timezone:(new Date).getTimezoneOffset()*-1,resolution:[screen.width,screen.height],colordepth:screen.colorDepth,title:b.title,location:b.location,referrer:b.referrer,product:a.product,productsub:a.productSub,vendor:a.vendor,vendorsub:a.vendorSub,userid:e,websiteid:f,from_sitebot:b.referrer,_:+new Date};for(var d in a)c.push(d+"="+encodeURIComponent(a[d]));(new Image).src="//tracking.sitebro.cn/track.php?"+c.join("&")})("NDExNQ==","NzY5OTA5");

		// track Google
		//(_gat._getTracker("UA-286341-3"))._trackPageview();

	});


	// loadWeather
	initFuncOndomready.push(function(){
		var weatherHandler = window['weatherHandler'] = function( d ){
			d = d.split(';');
			$('#weather-text').html(d[0]+'&nbsp;'+d[1]+'~'+d[2]);
			$('#weather-icon').attr('src',d[3]);
			if($.browser.msie)
				$('#weather-icon')[0].outerHTML = "<span style=\"width:16px; height:16px;line-height:16px;" + "display:inline-block;"+ "filter:progid:DXImageTransform.Microsoft.AlphaImageLoader(src='" + d[3] + "', sizingMethod='scale');\"></span>";
			$('#weather-button').show();
		}
		$.getScript('//www.soso.com/tb.q?fn=weatherHandler',function(){
			var btn = $('#weather-button') , 
				weatherBoard = $('<div id="weather-board">请稍候...</div>')
					.insertAfter($('#weather-button'))
					.mouseout(function(){$(this).hide()})
				;
			if(!btn.length) return ;
			btn.mouseover(function(){ 
				if(!$('iframe',weatherBoard).length){
					weatherBoard.html('<iframe class="weather-more-iframe" src="//www.soso.com/tb.q?cid=webq.wea" frameborder="0" scrolling="no"></iframe>');
				}
				weatherBoard.show();
			});
			$( document ).click( function(){weatherBoard.hide()} );
			function resize(){ weatherBoard.css({top:btn.offset().top+btn.height(),left:btn.offset().left-262+btn.width()})}
			resize();
			$( window ).resize( resize ); 
		});
	});

	//other stuff
	initFuncOndomready.push(function(){
		$('.close-icon').click(function(){
			$(this).parent().hide();
		})
	});


	$.each( initFunc, function( i, fn ){
		try{
			fn();
		}catch(ex){}
	});

	// excute all domready functions when domready
	$( document ).ready(function(){
		$.each( initFuncOndomready, function( i, fn ){
			try{
				fn();
			}catch(ex){}
		});
	});

	//delay load
	$( window ).load(function(){
		$.each( initFuncOnload, function( i, fn ){
			try{
				fn();
			}catch(ex){}
		});
	});

})(jQuery,window);


