/*!
 * x2tv Video Player
 * fisker Cheung
 */
(function($,so,window,undefined) {
$.fn.x2video = function(video,autoplay){
return this.each(function(){ 

	var objPlayer = $(this),
		
	//�Զ�����
	AUTO_PLAY = autoplay || true,

	//flash vars
	flashvars = {},

	//flash params
	params = { allowFullScreen : true , allowScriptAccess : 'always' },

	//flash attributes
	attributes = {},
	//attributes = { wmode : 'opaque' }, //�˲���������fps����

	//flash url
	swf,
	
	//player html
	html,

	data,

	file = video['file'],

	format = video['format'],
	
	nextLink = $('#next'),

	prevLink = $('#prev'),

	playComplete = function(){
		if( $.now() - window['__vs__'] < 60000 ){
			return ;
		}
		if(nextLink.length){
			window.location.href = nextLink.attr('href');
		}
	},
	
	playNext = function(){
		if(!nextLink.length){
			alert('�Ѿ������һ��');
		}else{
			window['__vs__'] = 0;
			playComplete();
		}
	},

	playPreview = function(){
		if(!prevLink.length){
			alert('�Ѿ��ǵ�һ��');
		}else{
			window.location.href = prevLink.attr('href');
		}
	};

	$.extend( window , {
		//��ʼʱ��
		'__vs__' : $.now() ,

		//qq 
		//vp_playNextVideo = vp_playNext = vp_anotherPlay = 
		'nextplay' : playComplete ,
		
		//sina
		'playCompleted' : playComplete ,

		//youku
		'onPlayerComplete' : playComplete ,

		// tudou
		'onStopHandler' : playNext ,

		// qiyi
		'nextVideo' : playComplete ,

		//cntv
		'video_play_over' : playComplete ,
		
		//56 ?
		'j2s_onPlayOver' : playComplete ,

		// youku playnext button
		'PlayerPlayNext' : playNext ,

		// youku playpreview button
		'PlayerPlayPre' : playPreview ,

		//flv
		'vcastrEvent' : function(type,state,playHeadTime,loadPersent){
			if(state=='complete')playComplete();
		} 
	});

	if(format=='rbc' || format=='boosj'){
		format = 'flv';
		file = file.split(',')[1];
	}

	switch(format){
		case 'youku' :
			swf = '//static.youku.com/v1.0.0143/v/swf/qplayer.swf';
			flashvars = {
				winType : 'interior',  //interior,index,exterior,adshow,BDskin
				//titlebar : 0 ,  // titlebar 0 ��ʾlogo
				//partnerid : 'XODMy' ,  //cctv ����id
				//ShowId : "fisker",
				show_pre : prevLink.length ,
				show_next : nextLink.length ,
				//Type : 'Folder',
				//Fid : 'fisker',
				//Pt : 'fisker',
				//Ob : 'fisker',
				//Cp : 0,
				//tid : 0,
				isShowRelatedVideo : false ,
				VideoIDS : file ,
				Version : '/v1.0.0652' ,
				isAutoPlay : AUTO_PLAY ,
				//isDebug : false ,
				//playMovie: true ,
				showAd : 0 ,
				ikuison : 0 ,
				iku_num : 99999
			};
			break;
		case 'tudou' :
			data = file.split(',');
			file = data[1] || data[0];
			//��ϸ�������� http://api.tudou.com/wiki/index.php/%E7%AB%99%E5%A4%96%E6%92%AD%E6%94%BE%E5%99%A8%E8%AF%B4%E6%98%8E
			flashvars = {
				autoPlay : AUTO_PLAY,
				videoClickNavigate : false,
				withAD : false ,
				//snap_pic : '',
				withSearchBar : false,
				//withFirstFrame : true,
				withRecommendList : false,
				withLogo : false
			};
			if(/^\d*$/.test(file)){
				/*
				swf = '//marketing.tudou.com/global/SPlayer/w/SPlayer_w_1.10.08.05.swf';
				flashvars = {
					'playList' : [file] ,
					autoPlay : AUTO_PLAY,
					vTitle : false,
					funcStop : 'onStopHandler'
				};
				*/
				//swf = STATIC_SERVER+'player/tudou.swf' ;
				//swf = '//marketing.tudou.com/global/dwPlayer/DiggPlayer.swf';
				//swf = '//ui.tudou.com/bin/events/player/tudou_player_beta2.1_0.swf';
				//swf = '//js.tudouui.com/bin/douwan/douwanPlayer_1.swf';
				//swf = '//www.tudou.com/player/outside/beta_player.swf';

				swf = '//www.tudou.com/player/outside/player_outside.swf';
				flashvars = $.extend(flashvars,{
					iid : file ,
					default_skin : '//js.tudouui.com/bin/player2/outside/Skin_outside_66.swf'
				});
				swf+='?'+$.param(flashvars); //IE �»���ֵس��� flash���ܴ���flashvars ��һ��Ҫ����
			}else{
				swf = '//www.tudou.com/v/'+file+'/&'+$.param(flashvars)+'/v.swf';
			}
			break;
		case 'pptv' :
			//delete attributes['wmode'];
			data = file.split(',');
			//player.pptv.com/cid/TkoJPJRqg2Rkg.swf
			//swf = '//player.pplive.cn/b2b/v0.4/p.swf?cid='+vid;
			////swf = '//player.pplive.cn/b2b/1.0.2.6/player4player2.swf?v=97&?cid='+vid;
			/*swf = '//player.pptv.com/cid/'+vid+'.swf';
			swf = '//player.pplive.cn/player/v0.74/p.swf';
			flashvars = {
				cid : vid,
				from : 0
			};*/
			swf = '//player.pptv.com/cid/'+( data[1] || data[0] )+'.swf';
			break;	
		case 'openvhd' :
			swf = '//hd.openv.com/swf/hd_player.swf';
			flashvars = {
				pid : file ,
				autostart : AUTO_PLAY,
				showLRmenu : false,
				playNowTitle :  encodeURIComponent(video['name'])
			};
			break;
		case 'qiyi' :
			//swf = '//www.qiyi.com/player/20110402164641/player.swf';
			swf = '//www.qiyi.com/player/20110331232030/qiyi_player.swf';
			// '//*'Ϊ��ѹ��js,ע�͵��������õĲ���
			flashvars = {
				vid : file,
				//pid : 0,
				//ptype : 2,
				//albumId : 0,
				//tvId : 0,
				//preLoaderUrl : 'http://www.qiyi.com/player/20110323181221/preloader.swf',
				//preLoaderUrl : STATIC_SERVER+'player/loading.swf',
				//*isPopout : 0,
				//*isSpecial : 1,
				//isAuto : +AUTO_PLAY,  //�������ƺ��Ѿ����ڣ�����ʹ��
				
				//*hideCakepanel : 0,  //���½����ȡ�ͷβ����
				//*hideBrightpanel : 0,//���ȵ��ڰ�ť
				//*hideHeadpanel : 0,  //ƬͷƬβ��ť

				//*hideSrtpanel : 0,

				//*hideRightpanel : 0, //�Ҳఴť
				//*hideClearpanel : 0, //�����ȣ��� δ֪
				hideSharepanel : 1, //����ť
				hideLightpanel : 1, //�صư�ť
				hideZoomBtn : 1,    //��ʾ�Ŵ���С��ť
				hideNewWindowpanel : 1 //�´��ڴ򿪰�ť
			};
			break;
		case 'cctvnew' : case 'cctvvod' :
			data = file.split(',');
			data[1] = data[1] || ( format==='cctvnew' ? 'space.dianshiju.cctv.com' : 'vod.cctv.com');
			swf = '//'+data[1]+'/playcfg/CCTVvideoplayer.swf';//?method=http&site=http://'+data[1]+'&id=VIDE'+data[0]+'&autoStart='+AUTO_PLAY;
			flashvars = {
				method : 'http' ,
				site : 'http://'+data[1],
				id : 'VIDE'+data[0],
				autoStart : AUTO_PLAY
			};
			break;
		case "sohutv":
/*
			var sohu_on = document.cookie.indexOf('sohu_on=true') !== -1;
			var sohu_play = function(){
				swf='//tv.sohu.com/upload/swf/20101206/Main.swf';
				flashvars = {
					domain : 'inner',
					jump : 0,
					shareBtn : 0,
					commentBtn : 0,
					historyBtn : 0,
					cinemaBtn : 0,
					bfBtn : 0,
					autoplay : AUTO_PLAY,
					vid : file.split(',')[0],
				};
			}
			if(sohu_on){
				sohu_play();
			}else{
				objPlayer.html('�����Ѻ��İ棬������ܲ��ţ����<a href="file://C:\\windows\\system32\\drivers\\etc\\" target="_blank">C:\\windows\\system32\\drivers\\etc\\</a>�ļ��������hosts�ļ���˫��ѡ�񡰼��±��������һ�С�96.44.140.84 x2ds.sohu.com��(��������)��ˢ�±�ҳ���������������ٲ���');
				$.getJSON(
					'//x2ds.sohu.com/teleplay/sohu.php?action=test&callback=?',
					function(data){
						if(data.sohu_on){
							var exp = new Date( $.now() + 24*60*60*1000 );
							document.cookie = 'sohu_on=true;expires=' + exp.toGMTString();
							sohu_play();
						}
					});
			}
*/
			html = '<iframe style="width:100%;height:100%;" marginWidth="0" marginHeight="0" scrolling="no" frameBorder="0" src="'+STATIC_SERVER+'player/sohutvplayer.html?'+encodeURI(file)+'"></iframe>';
			var sohupage = '//tv.sohu.com/'+file.slice(1).split(',').slice(1).join('/n')+'.shtml';
			$('#player-notice').html('<a href="'+sohupage+'" target="_blank">����޷��������ţ�����������Ѻ���ҳ����</a>').show();
			break;
		case 'tieba' :
			var bd_on = document.cookie.indexOf('bd_on=true') !== -1;
			var bd_play = function(){
				objPlayer.html('<iframe style="width:100%;height:100%;" marginWidth="0" marginHeight="0" scrolling="no" frameBorder="0" src="//x2ds.baidu.com/teleplay/tieba.php?title='+encodeURIComponent(video['name'])+'&vid='+encodeURIComponent(file)+'&w='+objPlayer.width()+'&h='+objPlayer.height()+'"></iframe>');
			}
			if(bd_on){
				bd_play();
			}else{
				objPlayer.html('���ڰٶȸİ棬������ܲ��ţ����<a href="file://C:\\windows\\system32\\drivers\\etc\\" target="_blank">C:\\windows\\system32\\drivers\\etc\\</a>�ļ��������hosts�ļ���˫��ѡ�񡰼��±��������һ�С�96.44.140.84 x2ds.baidu.com��(��������)��ˢ�±�ҳ���������������ٲ��š�<br/>�ο���Ƶ��<a href="//www.tudou.com/programs/view/UHsEGArzBig/" rel="how-to-edit-hosts" onclike="javascript:return false;">http://www.tudou.com/programs/view/UHsEGArzBig/</a>');
				$('a[rel=how-to-edit-hosts]').click(function(){objPlayer.x2video({"file":"49494936,UHsEGArzBig","format":"tudou"})});
				$.getJSON(
					'//x2ds.baidu.com/teleplay/tieba.php?action=test&callback=?',
					function(data){
						if(data.bd_on){
							var exp = new Date( $.now() + 24*60*60*1000 );
							document.cookie = 'bd_on=true;expires=' + exp.toGMTString();
							bd_play();
						}
					});
			}
			return; //javascript:alert(document.cookie);
			//swf = '//mv.baidu.com/export/theme/tieba.swf';
			//swf = '//mv.baidu.com/export/flashplayer.swf';
			//swf = STATIC_SERVER + 'player/tieba.swf';
			//flashvars = {
			//	vid : file ,
			//	autoplay : AUTO_PLAY
			//};
			//html = '<iframe style="width:100%;height:100%;" marginWidth="0" marginHeight="0" scrolling="no" frameBorder="0" src="//x2ds.baidu.com/teleplay/tieba.php?title='+encodeURIComponent(video['name'])+'&vid='+encodeURI(file)+'"></iframe>';
			break;
		case 'joy' :
			swf = '//client.joy.cn/flvplayer/v20081022.swf';
			//swf = '//client.joy.cn/flvplayer/163player.swf';
			////client.joy.cn/flvplayer/BagPlayer_V3.swf
			var strvid = file.split(',')[2];
			if(strvid.length<8){
				strvid = '4'+('00000000'+strvid).slice(-7);
			}
			flashvars = {
				playermode : 1,
				playstatus : 1,
				isshare : 0,
				strvid : strvid ,
				autoplay : AUTO_PLAY
			};
			if( parseInt(file.split(',')[0],10) ){
				//��Ƶ
				flashvars = $.extend(flashvars,{
					channelid : file.split(',')[0] ,
					programid : file.split(',')[1] ,
					type : 'vod',
					vid : file
				});
			}
			break;
/*
		case 'rbc' :
			//�Ѿ�ת��Ϊflv��ʽ
			swf = '//v.rbc.cn/swf/player.swf';
			flashvars = {
				id : f.split(',')[0]
			};
			break;
*/
		case 'letv' :
			swf = '//www.letv.com/player/x'+file+'.swf';
			//��swf��ʱ�����ܲ��ţ�swf = '//img1.c0.letv.com/ptv/player/swfPlayer.swf';
			flashvars = {
				id : file,
				vstatus : 1,
				AP : +AUTO_PLAY,
				logoMask : 0,
				isShowP2p : 0,
				autoplay : +AUTO_PLAY
			};
			break;
		case 'qq' :
			data = file.split(',');
			swf = data.length>1 ? 
				'//static.video.qq.com/TencentPlayer.swf' :
				'//cache.tv.qq.com/QQPlayer.swf'
				//'//static.video.qq.com/v1/res/QQPlayer.swf'
				;

			flashvars = {
				vid : data[0] , 
				autoplay : +AUTO_PLAY,
				adplay : 0,
				loadingswf : STATIC_SERVER+'player/loading.swf',
				//title : '',
				list : 2
			};
			if(data[1]){
				flashvars['duration'] = data[1];
				if(data[2]){
					var arr = data[1].split('|');
					var dur = 0;
					for(var i=0;i<arr.length;i++){
						dur += parseInt(arr[i],10);
					}
					arr = data[2].split('|');
					var pianTou = parseInt(arr[0],10);
					var pianWei = parseInt(arr[1],10);
					flashvars['vstart'] = pianTou;
					flashvars['vend'] = dur - pianWei;
				}
			}
			break;
		case 'sina' :
			//swf = '//p.you.video.sina.com.cn/swf/BokerPlayerV3_1_1_090930.swf';	
			//swf = '//p.you.video.sina.com.cn/swf/svplayer.swf';
			swf = '//p.you.video.sina.com.cn/swf/bokePlayer20101118_V4_1_40_8.swf';  //��ת����ť
			//swf = '//p.you.video.sina.com.cn/swf/quotePlayer20101117_V4_4_39_3.swf';
			//swf = '//p.you.video.sina.com.cn/swf/tvPlayer20101028_V4_2_39_9.swf';
			flashvars = {
				container: objPlayer.attr('id'),//Div������id
				playerWidth: objPlayer.width(),	//��
				playerHeight: objPlayer.height(),//��
				autoLoad: 1,					//�Զ�����
				autoPlay: +AUTO_PLAY,			//�Զ�����
				as: 0,							//���
				tjAD: 0,						//��ʾ���������
				tj: 0,							//Ƭβ�Ƽ�
				//!!//�����continuePlayer : 1,  //��������
				casualPlay: 1,					//�����϶���Ƶ
				head: 0,						//����Ƭͷ����
				logo: 0,						//��ʾlogo
				vid: file,
				realfull: 1,
				stopBtn : 1,					//ֹͣ��ť����
				share : 0						//����ť����
				//vname:'',
				//movietvid:0,
				//programId:0,
				//episode:0,
				//sid:0,
				//pid:2000,
				//tid:334,
				//vblog:2
			};
			if($('#next').length){
				flashvars.next_url = $('#next').attr('href');
			}
			break;
		case '56dotcom' :
			//swf = '//www.56.com/flashApp/56_cpm.10.07.06.swf';
			//swf = '//www.56.com/flashApp/56_cooperate.10.06.22.swf';
			//swf = '//www.56.com/flashApp/56_cooperate.10.07.09.swf';
			swf = '//www.56.com/flashApp/56_cooperate.11.03.17.swf';
			data = file.indexOf('/')==-1 ? file : file.split('_/').pop().split('.').shift();
			data = data.split(',');
			flashvars = {
				//ui : 'out_2009_v2_fast', //Ĭ��ui,��ȫ����ť
				ui : 'out_2009_qzone',
				//ui : 'out_2010_cooperate_earthhour', //��ȫ����ť
				//ui : 'out_2011.e', //���ui̫С
				//ui : 'out_2010_hipgame', //���ui�Ǵ������ҵ��ģ�ò�Ʋ���ui
				vid : (data[0] || data[1]),
				over_status : 'on', //�����£�Ӧ�û��Զ���ת
				auto_start : +AUTO_PLAY
			};
			break;
		case '6dotcn' :
			objPlayer.css('height',360);
			swf = '//6.cn/watch_newWidth.swf';
			//swf = '//6.cn/player.swf';
			flashvars = {
				vid : file , 
				flag : +AUTO_PLAY
			};
			break;
		case 'ku6' :
			//swf = '//img.ku6.com/common/V2.0.1.swf';
			////img.ku6.com/common/blog/pV1.2.swf?vid=g_S5MeKeDUvCfDo6
			////img.ku6.com/common/V2.0.1.swf?vid=rYfomSKsaHga7nDU
			////img1.c0.ku6.cn/player/pV2.5.6.swf?ver=108&vid=UfIi93_uXSY13ujA&type=v&referer=
			////img.ku6.com/common/cctv6/cctvV2.7.swf?vid=g_S5MeKeDUvCfDo6
			//swf = '//player.ku6.com/refer/'+f+'/v.swf';
			//swf = '//img.ku6.com/common/soV1.1.swf';

			//swf = '//player.ku6cdn.com/default/out/pv201009102105.swf';
			//swf = '//player.ku6cdn.com/default/out/pv201103312130.swf';
			swf = '//player.ku6cdn.com/default/out/pv201010111630.swf';

			//swf = '//img1.c0.ku6.cn/player/pV2.8.3.swf';

//auto=1&color=ffffff&adss=1&jump=0&recommend=1&so=0&d=3&fu=1

			flashvars = {
				//ver : 108,
				fu : 1,					//����ȫ��
				jump : 0 ,				//��(1��δ����)��(0)�ڵ����Ļ��ͣʱ����KU6��վ
				vid : file,
				auto : +AUTO_PLAY ,
				type : 'v',
				adss : 0 ,
				color : 'ffffff',
				deflogo : 0//,			//��(1)��(0)��ʾKU6Ĭ��LOGO,(����)
				//logo : STATIC_SERVER+'player/vcastr3/flv_logo.png',	//��������KU6 LOGO Flash��ַ.����ò�����Ϊ����deflogo������������Ч!
				//api : 1 ,
				//flag : hd
			};
			break;
		case 'hntv' :
			data = file.split(',');
			//swf = '//tv.hunantv.com/player/refhunantv.swf';
			swf = '//www.imgo.tv/player/ref_imgo_player.swf';
			flashvars = {
				tid : data[0],
				cid : data[1],
				fid : data[2],
				auto : +AUTO_PLAY,
				ishidpanel : 1,
				isplayad : 0//,
				//snd : 1,
				//fst : 2,
				//pic : 0
			};
			break;
		case 'wmv' :
			if(!$.browser.msie){
				alert('�������Ҫʹ��windows IE����������Ÿ���Ƶ.\n��������������������Ƶ����Դ���ʾ.');
			}
			params = {
				url : file,
				rate : 1,
				balance : 0,
				currentPosition : 0,
				playCount : 1,
				autoStart : -1,
				currentMarker : 0,
				invokeURLs :-1,
				stretchToFit : -1,
				windowlessVideo : 0,
				enabled : -1,
				enableContextMenu : 0,
				fullScreen : 0,
				enableErrorDialogs : 0
			}
			var arr = [];
			arr.push('<object classid="clsid:6BF52A52-394A-11D3-B153-00C04F79FAA6" id="flashplayer" height="100%" width="100%">');
			for(var i in params){
				arr.push('<param name="'+i+'" value="'+params[i]+'"> ');
			}
			arr.push('</object>');
			html = arr.join('\n');
			break;
		case 'gvod' :
			$.getScript(STATIC_SERVER+'js/gvod-min.js',function(){
				//over write a function in gvod
				window['genDivStr'] = function(src){
					var iframe_proxy = $('#iframe_proxy');
					if(!iframe_proxy.length){
						objPlayer.html('<div id="gvod_div" style="width:'+GVOD_PLAYER.div_width+'px; height:'+GVOD_PLAYER.div_height+'px"><iframe id="iframe_proxy" name="iframe_proxy" scrolling="no" frameborder="0" style="margin:0; width:100%; height:100%" src=""></iframe></div>');
					}
					/*
					if(src.indexOf('install.htm')>-1){
						alert('����Ƶ��ҪGvod��Ѹ����������ܲ��ţ����ǲ������鰲װ�˲��\n�Ժ����Ƶ������Ϊ��Ƶ��վƬԴ');
					}
					*/
					$('#iframe_proxy').attr('src',src);
				}
				GVOD_PLAYER.width = objPlayer.width();
				GVOD_PLAYER.height = objPlayer.height();
				if($('#next').length){
					GVOD_PLAYER.nextPage = window.location.href.split('?')[0] + $('#next').attr('href');
				}
				GVOD_PLAYER.play(file);
				objPlayer.append($('#gvod_div'));
			});
			break;
		case 'qvod' :
			if(!$.browser.msie){
				alert('qVOD��Դ��֧��IE���š�\n��������������������Ƶ����Դ���ʾ')
			}
			window.qvodError = function(){
				//alert('����Ƶ��ҪQvod���첥��������ܲ��ţ����ǲ������鰲װ�˲��\n�Ժ����Ƶ������Ϊ��Ƶ��վƬԴ');
				var objPlayer = $('#player');
				objPlayer.html("<div id='gvod_div' style='width: "+objPlayer.width()+"px; height: "+objPlayer.height()+"px'><iframe scrolling='no' frameborder='0' style='margin:0; width:100%; height:100%' src='"+STATIC_SERVER+"html/install_qvod.html'></iframe></div>");
			}
			html = '<object classid="clsid:F3D0D36F-23F8-4682-A195-74C92B03D4AF" ';
			html += 'width="'+objPlayer.width()+'" height="'+objPlayer.height()+'" id="qvodPlayer" name="qvodPlayer" ';
			html += 'onError="javascript:qvodError()">';
			html += '<param name="URL" value="'+file+'" />';
			html += '<param name="Autoplay" value="1" />';
			html += '</object>';
			break;
		case 'flv' :
			swf = STATIC_SERVER+'player/vcastr3/vcastr3.swf';
			function encodeXml( o ){
				if(typeof o != 'object')
					return encodeURIComponent(o);
				var s = '';
				for(var i in o){
					s += '{' + i + '}' + encodeXml( o[i] ) + '{/' + i + '}';
				}
				return s;
			}
			flashvars = {
				xml : encodeXml({
					vcastr : {
						channel : {
							item : {
								source : file,
								duration : 0,
								title : video['name']
							}
						},
						config : {
							isShowAbout : false,
							controlPanelMode : 'normal'
						},
						plugIns : {
							logoPlugIn : {
								url : STATIC_SERVER+'player/vcastr3/logoPlugIn.swf',
								logoText : 'X2DSJ.COM',
								logoTextAlpha : .75,
								logoTextFontSize : 30,
								logoTextLink : 'http://x2dsj.com',
								logoClipUrl : STATIC_SERVER+'player/vcastr3/flv_logo.png',
								logoTextColor : '0x00a9fa',
								textMargin : '10 20 auto auto'
							},
							javaScriptPlugIn :{
								url : STATIC_SERVER+'player/vcastr3/javaScriptPlugIn.swf'
							}
						}
					}
				})
			};
			break;
		case 'bugu' : case 'cntv' :
			data = file.split(',');
			var domainConfig = {
				'bugu.cntv.cn' :{
					configPath : 'http://bugu.cntv.cn/nettv/Library/ibugu/player/config.xml',
					widgetsConfig : 'http://bugu.cntv.cn/nettv/Library/ibugu/player/widgetsConfig.xml',
					languageConfig : 'http://bugu.cntv.cn/nettv/Library/ibugu/player/zh_cn.xml',
					sysSource : 'aibugu'			
				},
				'ent.cntv.cn' :{
					configPath : 'http://ent.cntv.cn/nettv/Library/enttv/player/config.xml',
					widgetsConfig : 'http://ent.cntv.cn/nettv/Library/enttv/player/widgetsConfig.xml',
					languageConfig : 'http://ent.cntv.cn/nettv/Library/enttv/player/zh_cn.xml',
					sysSource : 'zongyi'
				},
				'dianshiju.cntv.cn' :{
					configPath : 'http://dianshiju.cntv.cn/nettv/Library/teleplay/player/config.xml',
					widgetsConfig : 'http://dianshiju.cntv.cn/nettv/Library/teleplay/player/widgetsConfig.xml',
					languageConfig : 'http://dianshiju.cntv.cn/nettv/Library/teleplay/player/zh_cn.xml',
					sysSource : 'teleplay'
				},
				'sports.cntv.cn' :{
					configPath : 'http://sports.cntv.cn/player/config.xml',
					widgetsConfig : 'http://sports.cntv.cn/player/widgetsConfig.xml',
					languageConfig : '',
					sysSource : ''
				},
				'baidu.cntv.cn' :{
					configPath : 'http://baidu.cntv.cn/player/config.xml',
					widgetsConfig : 'http://baidu.cntv.cn/player/widgetsConfig.xml',
					languageConfig : 'http://baidu.cntv.cn/player/zh_cn.xml',
					sysSource : ''
				}
			};
			//swf = '//'+data[2]+'/nettv/Library/ibugu/player/OutSidePlayer.swf';
			swf = '//player.cntv.cn/standard/cntvOutSidePlayer.swf?v=0.171.5';
			//swf = STATIC_SERVER+'player/cntvOutSidePlayer.swf?v=0.170.9.5.8.6';
			flashvars = $.extend(domainConfig[data[2]],{
				videoId : data[0],
				//isLogin : 'y',
				//userId : '001',
				//articleId : 'VIDE'+file,
				//scheduleId : 'C10911000001',
				filePath : data[1],
				//sorts : ',,,����,C10911000001',
				//url :'http://bugu.cntv.cn/tvdrama/other/bienadoubaobudangganliang/classpage/video/20091127/100230.shtml',
				//snd : 1,
				//fst : 2,
				//pic : 0,
				isAutoPlay : AUTO_PLAY,
				videoCenterId : data[3],
				logoURL : 'http://'+window.location.host+'/'//,
				//logoImageURL : "http://bugu.cntv.cn/nettv/Library/ibugu/css/image/share.jpg",
			});
			break;
		case '163open' :
			swf = '//swf.ws.126.net/movieplayer/'+file+'.swf';
			break;	
		case 'url' :
			html = '<div style="margin:50px auto;line-height:200%;">��ƬԴ������������վ����������򿪲�����<a href="'+file+'" target="_blank">'+file+'</a></div>';
			break;
		case 'swf' :
			swf = file;
			break;
		default :
			break;
	}

	if(!swf){
		if(html){
			objPlayer.html(html);
		}
		return ;
	}


	if(!so.getFlashPlayerVersion().major){
		var flashplaterurl = $.browser.msie ? 
			'//fpdownload.adobe.com/get/flashplayer/current/licensing/win/install_flash_player_10_active_x.exe' :
			'//fpdownload.adobe.com/get/flashplayer/current/install_flash_player.exe';
		objPlayer.html('<span align="center" valign="middle"><a href="'+flashplaterurl+'" target="_blank"><img src="//www.youku.com/v/img/download.jpg" alt="���ز�����" /></a></span>');
		return;
	}

	so.switchOffAutoHideShow();
	if(!objPlayer.attr('id')){
		objPlayer.attr('id','__player__'+ $.now() )
	}
/*
	if( navigator.userAgent.toLowerCase().indexOf('maxthon') !== -1 ){
		delete attributes['wmode'];
	}
*/
	so.embedSWF(
		swf, 
		objPlayer.attr('id'),
		'100%', 
		'100%', 
		'10.0.0',
		STATIC_SERVER+'player/expressInstall.swf',
		flashvars,
		params,
		attributes//,
		//function(){objPlayer.x2video(video,autoplay)}
	);


	/*
	flashvars = $.param(flashvars);
	*/


	/*
	swf += (swf.indexOf('?')==-1 ? '?' : '&') + flashvars;
	objPlayer.html('<iframe style="width:100%;height:100%;" marginWidth="0" marginHeight="0" scrolling="no" frameBorder="0" src="'+swf+'"></iframe>');
	*/

	/*
	objPlayer.html('<embed src="'+swf+'" quality="high" width="100%" height="100%" align="middle" wmode="transparent" allowFullScreen="true" allowScriptAccess="always" flashvars="'+flashvars+'" type="application/x-shockwave-flash"></embed>');
	*/

});
}

})(jQuery,swfobject,window);
