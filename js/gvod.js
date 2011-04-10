// track gougou
var vod_referer = document.referrer ;
var first_from_gougou = false ;
var referer_patt = new RegExp("^http:\/\/125\.90\.93\.150\/");
var referer_patt2 = new RegExp("^http:\/\/221\.5\.43\.150\/");
var referer_patt3 = new RegExp("^http:\/\/[^\.]+\.gougou\.com\/");
if (referer_patt.test(vod_referer) || referer_patt2.test(vod_referer) || referer_patt3.test(vod_referer)) {
	setCookie("track_from_gougou","1") ;
	first_from_gougou = true ;
}
if (getCookie("track_from_gougou") == "1") {
	var track_str = "#GV" ;
}
else {
	var track_str = "" ;
}

// track end


var GVOD_PLAYER = {
	moviename:'',
	MIN_WIDTH:480,
	MIN_HEIGHT:300,
	div_width:0,
	div_height:0,
	installPage:'//js.getgvod.com/player/install.htm',
	stickPage:'',
	pausePage:'',
	marquee:'',
	textlink:'',
	bufferEntry:5,
	bufferLeave:30,
	nextUrl:'',
	nextPage:'',
	title:'',
	play:function(suburl,playType){
		this.div_width = this.width>this.MIN_WIDTH?this.width:this.MIN_WIDTH;
		this.div_height = this.height>this.MIN_HEIGHT?this.height:this.MIN_HEIGHT;
		if(!document.all){
			 notIE();
			 return;
		}
		suburl = suburl.lTrim().rTrim();

		suburl = suburl.replace(/\.null$/gm , ".rmvb") ;

		
		try{
			var splitArr = suburl.split("/");
			this.moviename = decodeURIComponent(splitArr[splitArr.length-1].split("?")[0]);
			//alert('this.moviename:'+this.moviename);
		}catch(E){}

		// check isbt

		var btcheck_patt = new RegExp("\.torrent$");
		var bttype = 0 ;
		if (playType == 'bt' || btcheck_patt.test(suburl) || suburl.indexOf("|") > 0) {
			var bttype = 1 ;
		}
	
		try{
			//检测有没有GVODPlayer.VersionDetector，new失败则没有，提示全新安装
			var versionDetector = new ActiveXObject("GVODPlayer.VersionDetector");
			var v_dapctrl = versionDetector.GetVersion("GVODS", "DapCtrl.dll");
			var v_gvods = versionDetector.GetVersion("GVODS", "GVODS.exe");
			var v_stream = versionDetector.GetVersion("GVODS", "Stream.dll");
			var v_canfinstall = false;
			var VDAPCTRL_1_0 = 146;
			var VGVODS_1_0 = 53;
			var VSTREAM_1_0 = 2001;
			var VDAPCTRL_1_1 = 165;
			var VGVODS_1_1 = 57;
			var VSTREAM_1_1 = 2012;
			var VDAPCTRL_1_2 = 174;
			var VGVODS_1_2 = 57;
			var VSTREAM_1_2 = 2016;
			var VDAPCTRL_1_2_1 = 178;
			var VGVODS_1_2_1 = 58;
			var VSTREAM_1_2_1 = 2016;
			var VDAPCTRL_1_3 = 187;
			var VGVODS_1_3 = 62;
			var VGVODS_1_5 = 77;
			var VSTREAM_1_3 = 2019;
			//alert("iVersion:"+v_dapctrl);
			//alert("GVODS:"+v_gvods); 
		
			if (suburl.substr(0,10) == "thunder://" && v_dapctrl > 149)
			{
				//是专用链，则调用DapCtrl接口解专用链后继续
				var dapCtrl = new ActiveXObject("DapCtrl.DapCtrl");
				suburl = dapCtrl.DecodeThunderLink(suburl);
				suburl = (suburl.lTrim()).rTrim();
				dapCtrl = null;
				try{
					var splitArr = suburl.split("/");
					this.moviename = decodeURIComponent(splitArr[splitArr.length-1].split("?")[0]);
				}catch(E){}
			}
			
			var queryStr='movie_name='+(this.moviename)+'&suburl='+(suburl)+'&vodurl='+getSuburlDomain(location.href)+'&stickPage='+(this.stickPage)+'&pausePage='+(this.pausePage)+'&bufferEntry='+this.bufferEntry +'&bufferLeave='+this.bufferLeave+'&nextUrl='+(this.nextUrl)+'&nextPage='+encodeURIComponent(this.nextPage)+'&divHeight='+this.div_height+'&divWidth='+this.div_width+'&marquee='+(this.marquee)+'&textlink='+(this.textlink)+'&ref='+(document.referrer)+track_str;
			//alert(queryStr) ;
			
			if(0 == bttype && suburl)
			{
				var subUrlext = getFileExt(suburl);
				
				if(subUrlext == ".avi" || subUrlext == ".mkv" || subUrlext == ".mp4")
				{
					if ( v_gvods > 0 && ( v_gvods < VGVODS_1_5 ) )
					{
						//装的不是最新版，又不能F安装，提示升级安装
						
						hint_stat(1);
						genDivStr("//js.getgvod.com/player/enforceupdate.htm");
//						updateGVOD(queryStr);
						pgvByImg("//analytics-union.sandai.net/TPV?gs=gvodplayer&ul="+encodeURIComponent(document.URL)+"&rf="+encodeURIComponent(document.referrer)+"&tt=UP*"+v_dapctrl+"*"+v_gvods+"*"+v_canfinstall);
						return;
					}
				}
			}			
			
			
			try{
				if (versionDetector.IsDeployed() == 1)
					v_canfinstall = true;
			}catch(E){
				v_canfinstall = false;
			}
			try{
				if(v_canfinstall == false && versionDetector.CanInstallGVOD()==1 && (versionDetector.GetVersion('Thunder5', 'Thunder5.exe') >=662 || (versionDetector.GetVersion('Thunder6', 'Thunder.exe') >= 173 && versionDetector.GetVersion('Thunder6', 'Thunder.exe') <= 990)) ){
					v_canfinstall = true;
				}
			}catch(E){
				v_canfinstall = false;
			}
			
			if ( v_canfinstall && (v_dapctrl < VDAPCTRL_1_3 || v_gvods < VGVODS_1_3 || v_stream < VSTREAM_1_3) )
			{
				fInstallGVOD(versionDetector);
				pgvByImg("//analytics-union.sandai.net/TPV?gs=gvodplayer&ul="+encodeURIComponent(document.URL)+"&rf="+encodeURIComponent(document.referrer)+"&tt=FI*"+v_dapctrl+"*"+v_gvods+"*"+v_canfinstall);
				return;
			}
			else 
			if ( v_gvods > 0 && (v_dapctrl < VDAPCTRL_1_2 || v_gvods < VGVODS_1_2 || v_stream < VSTREAM_1_2) )
			{
				//装的不是最新版，又不能F安装，提示升级安装
				if (v_gvods <= VGVODS_1_2_1)
				{
					updateGVOD(queryStr);
					pgvByImg("//analytics-union.sandai.net/TPV?gs=gvodplayer&ul="+encodeURIComponent(document.URL)+"&rf="+encodeURIComponent(document.referrer)+"&tt=UP*"+v_dapctrl+"*"+v_gvods+"*"+v_canfinstall);
					return;
				}
			}
			else if ( v_dapctrl < VDAPCTRL_1_2 || v_gvods < VGVODS_1_2 || v_stream < VSTREAM_1_2)
			{
				//不能进行F安装，则提示全新安装
				noGVOD();

				// 是否进入过安装页面
				//var installed = (getCookie("GvodInstallView") == "1" ) ? true : false ;
				pgvByImg("//analytics-union.sandai.net/TPV?gs=gvodplayer&ul="+encodeURIComponent(document.URL)+"&rf="+encodeURIComponent(document.referrer)+"&tt=NI*"+v_dapctrl+"*"+v_gvods+"*"+v_canfinstall);
				return;
			}
			
			if ( v_dapctrl >= VDAPCTRL_1_2 && v_gvods >= VGVODS_1_2 )
			{
				try{
					var md5suburl = hex_md5(suburl);
					var dapCtrl = new ActiveXObject("DapCtrl.DapCtrl");

					//加在这是因为BaseAD.js依赖md5suburl+.dat来取数据
					dapCtrl.Put("SCOOKIEFILENAME", "GVODSetting.txt");
					dapCtrl.Put("SCOOKIE", "[Settings]\r\nADServerUseAPI=0");
					queryStr='movie_name='+encodeURIComponent(this.moviename)+'&suburl='+encodeURIComponent(suburl)+'&vodurl='+getSuburlDomain(location.href)+'&stickPage='+'&stickPage='+encodeURIComponent(this.stickPage)+'&pausePage='+encodeURIComponent(this.pausePage)+'&bufferEntry='+this.bufferEntry +'&bufferLeave='+this.bufferLeave+'&nextUrl='+encodeURIComponent(this.nextUrl)+'&nextPage='+encodeURIComponent(this.nextPage)+'&divHeight='+this.div_height+'&divWidth='+this.div_width+'&marquee='+(this.marquee)+'&textlink='+(this.textlink)+'&playType='+(playType?playType:'default')+'&title='+encodeURIComponent(this.title)+'&ref='+encodeURIComponent(document.referrer)+track_str;
					
					
					dapCtrl.Put("SCOOKIEFILENAME" ,md5suburl+".dat") ;
					dapCtrl.Put("SCOOKIE" ,queryStr) ;
					
					queryStr= 'divHeight='+this.div_height+'&divWidth='+this.div_width+'&md5suburl='+(md5suburl)+'&title='+encodeURIComponent(this.title);
				}catch(E){}
			}

			// 是否进入过安装页面
			var installed = (getCookie("GvodInstallView") == "1" ) ? true : false ;
			
			// 用户入口统计
			if (installed) {
				pgvByImg("//analytics-union.sandai.net/UPV?cf=1&gs=gvodenter&tt=2&rf="+encodeURIComponent(document.referrer)+"&ul="+encodeURIComponent(document.URL)) ; // 安装后访问
			}
			else if (first_from_gougou) {
				pgvByImg("//analytics-union.sandai.net/UPV?cf=1&gs=gvodenter&tt=0&rf="+encodeURIComponent(document.referrer)+"&ul="+encodeURIComponent(document.URL)) ; // 狗狗初次进入
			}
			else {
				pgvByImg("//analytics-union.sandai.net/UPV?cf=1&gs=gvodenter&tt=1&rf="+encodeURIComponent(document.referrer)+"&ul="+encodeURIComponent(document.URL)) ; // 非狗狗初次进入
			}

			// 用户行为统计
			sendUserActionPvState(2 , installed) ; // 播放行为统计

			//start(queryStr);

			start(queryStr);
			pgvByImg("//analytics-union.sandai.net/TPV?gs=gvodplayer&ul="+encodeURIComponent(document.URL)+"&rf="+encodeURIComponent(document.referrer)+"&tt=PL*"+v_dapctrl+"*"+v_gvods+"*"+v_canfinstall+"*"+bttype);
		}
		catch(E){
			noGVOD();
		}
	}
}
function sendUserActionPvState(type , installed) {
	if (installed) { // 安装后访问
		pgvByImg("//analytics-union.sandai.net/UPV?cf=1&gs=gvoduseract&tt=2*"+type+"&ul="+encodeURIComponent(document.URL)+"&rf="+encodeURIComponent(document.referrer));
	}
	else { // 非安装后访问
		if (first_from_gougou) { // 第一次来自狗狗
			pgvByImg("//analytics-union.sandai.net/UPV?cf=1&gs=gvoduseract&tt=0*"+type+"&ul="+encodeURIComponent(document.URL)+"&rf="+encodeURIComponent(document.referrer));
		}
		else { // 非第一次来自狗狗
			pgvByImg("//analytics-union.sandai.net/UPV?cf=1&gs=gvoduseract&tt=1*"+type+"&ul="+encodeURIComponent(document.URL)+"&rf="+encodeURIComponent(document.referrer));
		}
	}
	
}
String.prototype.lTrim = function(){
    return this.replace(/^[\s,%20]+/gm,"");
}
String.prototype.rTrim = function(){
    return this.replace(/[\s,%20]+$/gm,"");
}
function setCookie(name,value,hours){
    if(arguments.length>2){
        var expireDate=new Date(new Date().getTime()+hours*3600000);
        document.cookie = name + "=" + encodeURIComponent(value) + "; path=/; expires=" + expireDate.toGMTString();
    }else{
        document.cookie = name + "=" + encodeURIComponent(value) + "; path=/; ";
    }
}
function getCookie(name){
    var search = name + "=";
    var offset = document.cookie.indexOf(search);
    if (offset != -1) {
        offset += search.length;
        var end = document.cookie.indexOf(";", offset);
        if (end == -1){
            end = document.cookie.length;
        }
        return decodeURIComponent(document.cookie.substring(offset, end));
    }else {
        return "";
    }
}
function updateGVOD(queryStr){
	hint_stat(1);
	
	genDivStr("//js.getgvod.com/player/update.htm?"+queryStr+"&hostname="+location.hostname);
}
function fInstallGVOD(versionDetector){
	hint_stat(11);
	var pLctn = document.URL;
	genDivStr("//js.getgvod.com/player/finstall.htm");
}
function gvod_player(){
	return GVOD_PLAYER;
}

function hint_stat(stat_value){
	var URL = "//stat.getgvod.com/fcg-bin/fcgi_gvod_stat.fcg?stat_key=1&stat_value="+stat_value+"&domain="+location.hostname;
	pgvByImg(URL);
}
function genDivStr(src){  
	var iframe_proxy = document.getElementById('iframe_proxy');
	if(iframe_proxy){
		iframe_proxy.src = src;
		return;
	}
	var insertStr = "\
		<DIV id='gvod_div' style='WIDTH: "+GVOD_PLAYER.div_width+"px; HEIGHT: "+GVOD_PLAYER.div_height+"px'>\
		<iframe id = 'iframe_proxy' name='iframe_proxy' scrolling='no' frameborder='0' style='margin:0; width:100%; height:100%' src='' ></iframe>\
		</DIV>\
	"; 
	document.write(insertStr);
	var iframe_proxy = document.getElementById('iframe_proxy');
	if(iframe_proxy) iframe_proxy.src=src;
}
function noGVOD(){
	var first_from_gougou_str = first_from_gougou ? 1 : 0 ;
	genDivStr(GVOD_PLAYER.installPage+"?hostname="+location.hostname+"&first_from_gougou="+first_from_gougou_str+"&ul="+encodeURIComponent(document.URL)+"&rf="+encodeURIComponent(document.referrer));
	hint_stat(1);
	if(GVOD_PLAYER.nogvod){GVOD_PLAYER.nogvod()}
	sendUserActionPvState(0 , false) ; // 提示安装行为统计
	// 记录用户进入过安装页面
	setCookie("GvodInstallView","1") ;
}
function notIE(){
	var ieWarnPage = '//js.getgvod.com/player/ie_warn.htm';
	hint_stat(0);
	genDivStr(ieWarnPage);
}
function showEInstall(){
	genDivStr("//js.getgvod.com/player/einstall.htm");
}
function start(queryStr){
			hint_stat(0);
			try{
				var versionDetector = new ActiveXObject("GVODPlayer.VersionDetector");
				var dapCtrl = new ActiveXObject("DapCtrl.DapCtrl");
				var v_gvods = versionDetector.GetVersion("GVODS", "GVODS.exe");
				var v_runDapCtrl = dapCtrl.Get("iVersion");
				if (v_gvods > 74 && v_runDapCtrl > 203219 && v_gvods != 457 && v_runDapCtrl != 203574)
				{
					dapCtrl.Put("iAlwaysUseGVODS", 1);
					var playport = dapCtrl.Get("iGVODSWebPort");
					if (playport != 0)
					{
						var godsrc = "//127.0.0.1:" + playport + "/local_play.html?"+queryStr;
						genDivStr(godsrc);
						dapCtrl = null;
						versionDetector = null;
						return;
					}
				}

				dapCtrl.Put("iAlwaysUseGVODS", 1);
				if (dapCtrl.GetThunderVer("GVODS", "Running") == 0)
				{
					dapCtrl.Put("sRunThunder", "GVODS");
				}
				dapCtrl.Put("iOpenPort", 0);
				var playport = dapCtrl.Get("iPlayPort");
				if (playport == 0)
				{
					showEInstall();
					//alert("播放器加载失败");
				}
				else
				{
					var godsrc = "//127.0.0.1:" + playport + "/local_play.html?"+queryStr;
					genDivStr(godsrc);
				}
				dapCtrl = null;
				versionDetector = null;
			}
		catch (E)
		{
			noGVOD();
		}
	}
	/*
	String.prototype.lTrim = function(){
    return this.replace(/^\s+/gm,"");
	}
	String.prototype.rTrim = function(){
	    return this.replace(/\s+$/gm,"");
	}
	*/
	function pgvByImg(u) {
		var  statImg = new Image();
		statImg.src = u+"&lasttime="+(new Date().getTime());
}
/*
 * Configurable variables. You may need to tweak these to be compatible with
 * the server-side, but the defaults work in most cases.
 */
var hexcase = 0;  /* hex output format. 0 - lowercase; 1 - uppercase        */
var b64pad  = ""; /* base-64 pad character. "=" for strict RFC compliance   */
var chrsz   = 8;  /* bits per input character. 8 - ASCII; 16 - Unicode      */

/*
 * These are the functions you'll usually want to call
 * They take string arguments and return either hex or base-64 encoded strings
 */
function hex_sha1(s){return binb2hex(core_sha1(str2binb(s),s.length * chrsz));}
function b64_sha1(s){return binb2b64(core_sha1(str2binb(s),s.length * chrsz));}
function str_sha1(s){return binb2str(core_sha1(str2binb(s),s.length * chrsz));}
function hex_hmac_sha1(key, data){ return binb2hex(core_hmac_sha1(key, data));}
function b64_hmac_sha1(key, data){ return binb2b64(core_hmac_sha1(key, data));}
function str_hmac_sha1(key, data){ return binb2str(core_hmac_sha1(key, data));}

/*
 * Perform a simple self-test to see if the VM is working
 */
function sha1_vm_test()
{
  return hex_sha1("abc") == "a9993e364706816aba3e25717850c26c9cd0d89d";
}

/*
 * Calculate the SHA-1 of an array of big-endian words, and a bit length
 */
function core_sha1(x, len)
{
  /* append padding */
  x[len >> 5] |= 0x80 << (24 - len % 32);
  x[((len + 64 >> 9) << 4) + 15] = len;

  var w = Array(80);
  var a =  1732584193;
  var b = -271733879;
  var c = -1732584194;
  var d =  271733878;
  var e = -1009589776;

  for(var i = 0; i < x.length; i += 16)
  {
    var olda = a;
    var oldb = b;
    var oldc = c;
    var oldd = d;
    var olde = e;

    for(var j = 0; j < 80; j++)
    {
      if(j < 16) w[j] = x[i + j];
      else w[j] = rol(w[j-3] ^ w[j-8] ^ w[j-14] ^ w[j-16], 1);
      var t = safe_add(safe_add(rol(a, 5), sha1_ft(j, b, c, d)),
                       safe_add(safe_add(e, w[j]), sha1_kt(j)));
      e = d;
      d = c;
      c = rol(b, 30);
      b = a;
      a = t;
    }

    a = safe_add(a, olda);
    b = safe_add(b, oldb);
    c = safe_add(c, oldc);
    d = safe_add(d, oldd);
    e = safe_add(e, olde);
  }
  return Array(a, b, c, d, e);

}

/*
 * Perform the appropriate triplet combination function for the current
 * iteration
 */
function sha1_ft(t, b, c, d)
{
  if(t < 20) return (b & c) | ((~b) & d);
  if(t < 40) return b ^ c ^ d;
  if(t < 60) return (b & c) | (b & d) | (c & d);
  return b ^ c ^ d;
}

/*
 * Determine the appropriate additive constant for the current iteration
 */
function sha1_kt(t)
{
  return (t < 20) ?  1518500249 : (t < 40) ?  1859775393 :
         (t < 60) ? -1894007588 : -899497514;
}

/*
 * Calculate the HMAC-SHA1 of a key and some data
 */
function core_hmac_sha1(key, data)
{
  var bkey = str2binb(key);
  if(bkey.length > 16) bkey = core_sha1(bkey, key.length * chrsz);

  var ipad = Array(16), opad = Array(16);
  for(var i = 0; i < 16; i++)
  {
    ipad[i] = bkey[i] ^ 0x36363636;
    opad[i] = bkey[i] ^ 0x5C5C5C5C;
  }

  var hash = core_sha1(ipad.concat(str2binb(data)), 512 + data.length * chrsz);
  return core_sha1(opad.concat(hash), 512 + 160);
}

/*
 * Add integers, wrapping at 2^32. This uses 16-bit operations internally
 * to work around bugs in some JS interpreters.
 */
function safe_add(x, y)
{
  var lsw = (x & 0xFFFF) + (y & 0xFFFF);
  var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
  return (msw << 16) | (lsw & 0xFFFF);
}

/*
 * Bitwise rotate a 32-bit number to the left.
 */
function rol(num, cnt)
{
  return (num << cnt) | (num >>> (32 - cnt));
}

/*
 * Convert an 8-bit or 16-bit string to an array of big-endian words
 * In 8-bit function, characters >255 have their hi-byte silently ignored.
 */
function str2binb(str)
{
  var bin = Array();
  var mask = (1 << chrsz) - 1;
  for(var i = 0; i < str.length * chrsz; i += chrsz)
    bin[i>>5] |= (str.charCodeAt(i / chrsz) & mask) << (32 - chrsz - i%32);
  return bin;
}

/*
 * Convert an array of big-endian words to a string
 */
function binb2str(bin)
{
  var str = "";
  var mask = (1 << chrsz) - 1;
  for(var i = 0; i < bin.length * 32; i += chrsz)
    str += String.fromCharCode((bin[i>>5] >>> (32 - chrsz - i%32)) & mask);
  return str;
}

/*
 * Convert an array of big-endian words to a hex string.
 */
function binb2hex(binarray)
{
  var hex_tab = hexcase ? "0123456789ABCDEF" : "0123456789abcdef";
  var str = "";
  for(var i = 0; i < binarray.length * 4; i++)
  {
    str += hex_tab.charAt((binarray[i>>2] >> ((3 - i%4)*8+4)) & 0xF) +
           hex_tab.charAt((binarray[i>>2] >> ((3 - i%4)*8  )) & 0xF);
  }
  return str;
}

/*
 * Convert an array of big-endian words to a base-64 string
 */
function binb2b64(binarray)
{
  var tab = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
  var str = "";
  for(var i = 0; i < binarray.length * 4; i += 3)
  {
    var triplet = (((binarray[i   >> 2] >> 8 * (3 -  i   %4)) & 0xFF) << 16)
                | (((binarray[i+1 >> 2] >> 8 * (3 - (i+1)%4)) & 0xFF) << 8 )
                |  ((binarray[i+2 >> 2] >> 8 * (3 - (i+2)%4)) & 0xFF);
    for(var j = 0; j < 4; j++)
    {
      if(i * 8 + j * 6 > binarray.length * 32) str += b64pad;
      else str += tab.charAt((triplet >> 6*(3-j)) & 0x3F);
    }
  }
  return str;
}

var hexcase = 0;  /* hex output format. 0 - lowercase; 1 - uppercase        */
var b64pad  = ""; /* base-64 pad character. "=" for strict RFC compliance   */
var chrsz   = 8;  /* bits per input character. 8 - ASCII; 16 - Unicode      */

/*
 * These are the functions you'll usually want to call
 * They take string arguments and return either hex or base-64 encoded strings
 */
function hex_md5(s){ return binl2hex(core_md5(str2binl(s), s.length * chrsz));}
function b64_md5(s){ return binl2b64(core_md5(str2binl(s), s.length * chrsz));}
function str_md5(s){ return binl2str(core_md5(str2binl(s), s.length * chrsz));}
function hex_hmac_md5(key, data) { return binl2hex(core_hmac_md5(key, data)); }
function b64_hmac_md5(key, data) { return binl2b64(core_hmac_md5(key, data)); }
function str_hmac_md5(key, data) { return binl2str(core_hmac_md5(key, data)); }

/*
 * Perform a simple self-test to see if the VM is working
 */
function md5_vm_test()
{
  return hex_md5("abc") == "900150983cd24fb0d6963f7d28e17f72";
}

/*
 * Calculate the MD5 of an array of little-endian words, and a bit length
 */
function core_md5(x, len)
{
  /* append padding */
  x[len >> 5] |= 0x80 << ((len) % 32);
  x[(((len + 64) >>> 9) << 4) + 14] = len;

  var a =  1732584193;
  var b = -271733879;
  var c = -1732584194;
  var d =  271733878;

  for(var i = 0; i < x.length; i += 16)
  {
    var olda = a;
    var oldb = b;
    var oldc = c;
    var oldd = d;

    a = md5_ff(a, b, c, d, x[i+ 0], 7 , -680876936);
    d = md5_ff(d, a, b, c, x[i+ 1], 12, -389564586);
    c = md5_ff(c, d, a, b, x[i+ 2], 17,  606105819);
    b = md5_ff(b, c, d, a, x[i+ 3], 22, -1044525330);
    a = md5_ff(a, b, c, d, x[i+ 4], 7 , -176418897);
    d = md5_ff(d, a, b, c, x[i+ 5], 12,  1200080426);
    c = md5_ff(c, d, a, b, x[i+ 6], 17, -1473231341);
    b = md5_ff(b, c, d, a, x[i+ 7], 22, -45705983);
    a = md5_ff(a, b, c, d, x[i+ 8], 7 ,  1770035416);
    d = md5_ff(d, a, b, c, x[i+ 9], 12, -1958414417);
    c = md5_ff(c, d, a, b, x[i+10], 17, -42063);
    b = md5_ff(b, c, d, a, x[i+11], 22, -1990404162);
    a = md5_ff(a, b, c, d, x[i+12], 7 ,  1804603682);
    d = md5_ff(d, a, b, c, x[i+13], 12, -40341101);
    c = md5_ff(c, d, a, b, x[i+14], 17, -1502002290);
    b = md5_ff(b, c, d, a, x[i+15], 22,  1236535329);

    a = md5_gg(a, b, c, d, x[i+ 1], 5 , -165796510);
    d = md5_gg(d, a, b, c, x[i+ 6], 9 , -1069501632);
    c = md5_gg(c, d, a, b, x[i+11], 14,  643717713);
    b = md5_gg(b, c, d, a, x[i+ 0], 20, -373897302);
    a = md5_gg(a, b, c, d, x[i+ 5], 5 , -701558691);
    d = md5_gg(d, a, b, c, x[i+10], 9 ,  38016083);
    c = md5_gg(c, d, a, b, x[i+15], 14, -660478335);
    b = md5_gg(b, c, d, a, x[i+ 4], 20, -405537848);
    a = md5_gg(a, b, c, d, x[i+ 9], 5 ,  568446438);
    d = md5_gg(d, a, b, c, x[i+14], 9 , -1019803690);
    c = md5_gg(c, d, a, b, x[i+ 3], 14, -187363961);
    b = md5_gg(b, c, d, a, x[i+ 8], 20,  1163531501);
    a = md5_gg(a, b, c, d, x[i+13], 5 , -1444681467);
    d = md5_gg(d, a, b, c, x[i+ 2], 9 , -51403784);
    c = md5_gg(c, d, a, b, x[i+ 7], 14,  1735328473);
    b = md5_gg(b, c, d, a, x[i+12], 20, -1926607734);

    a = md5_hh(a, b, c, d, x[i+ 5], 4 , -378558);
    d = md5_hh(d, a, b, c, x[i+ 8], 11, -2022574463);
    c = md5_hh(c, d, a, b, x[i+11], 16,  1839030562);
    b = md5_hh(b, c, d, a, x[i+14], 23, -35309556);
    a = md5_hh(a, b, c, d, x[i+ 1], 4 , -1530992060);
    d = md5_hh(d, a, b, c, x[i+ 4], 11,  1272893353);
    c = md5_hh(c, d, a, b, x[i+ 7], 16, -155497632);
    b = md5_hh(b, c, d, a, x[i+10], 23, -1094730640);
    a = md5_hh(a, b, c, d, x[i+13], 4 ,  681279174);
    d = md5_hh(d, a, b, c, x[i+ 0], 11, -358537222);
    c = md5_hh(c, d, a, b, x[i+ 3], 16, -722521979);
    b = md5_hh(b, c, d, a, x[i+ 6], 23,  76029189);
    a = md5_hh(a, b, c, d, x[i+ 9], 4 , -640364487);
    d = md5_hh(d, a, b, c, x[i+12], 11, -421815835);
    c = md5_hh(c, d, a, b, x[i+15], 16,  530742520);
    b = md5_hh(b, c, d, a, x[i+ 2], 23, -995338651);

    a = md5_ii(a, b, c, d, x[i+ 0], 6 , -198630844);
    d = md5_ii(d, a, b, c, x[i+ 7], 10,  1126891415);
    c = md5_ii(c, d, a, b, x[i+14], 15, -1416354905);
    b = md5_ii(b, c, d, a, x[i+ 5], 21, -57434055);
    a = md5_ii(a, b, c, d, x[i+12], 6 ,  1700485571);
    d = md5_ii(d, a, b, c, x[i+ 3], 10, -1894986606);
    c = md5_ii(c, d, a, b, x[i+10], 15, -1051523);
    b = md5_ii(b, c, d, a, x[i+ 1], 21, -2054922799);
    a = md5_ii(a, b, c, d, x[i+ 8], 6 ,  1873313359);
    d = md5_ii(d, a, b, c, x[i+15], 10, -30611744);
    c = md5_ii(c, d, a, b, x[i+ 6], 15, -1560198380);
    b = md5_ii(b, c, d, a, x[i+13], 21,  1309151649);
    a = md5_ii(a, b, c, d, x[i+ 4], 6 , -145523070);
    d = md5_ii(d, a, b, c, x[i+11], 10, -1120210379);
    c = md5_ii(c, d, a, b, x[i+ 2], 15,  718787259);
    b = md5_ii(b, c, d, a, x[i+ 9], 21, -343485551);

    a = safe_add(a, olda);
    b = safe_add(b, oldb);
    c = safe_add(c, oldc);
    d = safe_add(d, oldd);
  }
  return Array(a, b, c, d);

}

/*
 * These functions implement the four basic operations the algorithm uses.
 */
function md5_cmn(q, a, b, x, s, t)
{
  return safe_add(bit_rol(safe_add(safe_add(a, q), safe_add(x, t)), s),b);
}
function md5_ff(a, b, c, d, x, s, t)
{
  return md5_cmn((b & c) | ((~b) & d), a, b, x, s, t);
}
function md5_gg(a, b, c, d, x, s, t)
{
  return md5_cmn((b & d) | (c & (~d)), a, b, x, s, t);
}
function md5_hh(a, b, c, d, x, s, t)
{
  return md5_cmn(b ^ c ^ d, a, b, x, s, t);
}
function md5_ii(a, b, c, d, x, s, t)
{
  return md5_cmn(c ^ (b | (~d)), a, b, x, s, t);
}

/*
 * Calculate the HMAC-MD5, of a key and some data
 */
function core_hmac_md5(key, data)
{
  var bkey = str2binl(key);
  if(bkey.length > 16) bkey = core_md5(bkey, key.length * chrsz);

  var ipad = Array(16), opad = Array(16);
  for(var i = 0; i < 16; i++)
  {
    ipad[i] = bkey[i] ^ 0x36363636;
    opad[i] = bkey[i] ^ 0x5C5C5C5C;
  }

  var hash = core_md5(ipad.concat(str2binl(data)), 512 + data.length * chrsz);
  return core_md5(opad.concat(hash), 512 + 128);
}

/*
 * Add integers, wrapping at 2^32. This uses 16-bit operations internally
 * to work around bugs in some JS interpreters.
 */
function safe_add(x, y)
{
  var lsw = (x & 0xFFFF) + (y & 0xFFFF);
  var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
  return (msw << 16) | (lsw & 0xFFFF);
}

/*
 * Bitwise rotate a 32-bit number to the left.
 */
function bit_rol(num, cnt)
{
  return (num << cnt) | (num >>> (32 - cnt));
}

/*
 * Convert a string to an array of little-endian words
 * If chrsz is ASCII, characters >255 have their hi-byte silently ignored.
 */
function str2binl(str)
{
  var bin = Array();
  var mask = (1 << chrsz) - 1;
  for(var i = 0; i < str.length * chrsz; i += chrsz)
    bin[i>>5] |= (str.charCodeAt(i / chrsz) & mask) << (i%32);
  return bin;
}

/*
 * Convert an array of little-endian words to a string
 */
function binl2str(bin)
{
  var str = "";
  var mask = (1 << chrsz) - 1;
  for(var i = 0; i < bin.length * 32; i += chrsz)
    str += String.fromCharCode((bin[i>>5] >>> (i % 32)) & mask);
  return str;
}

/*
 * Convert an array of little-endian words to a hex string.
 */
function binl2hex(binarray)
{
  var hex_tab = hexcase ? "0123456789ABCDEF" : "0123456789abcdef";
  var str = "";
  for(var i = 0; i < binarray.length * 4; i++)
  {
    str += hex_tab.charAt((binarray[i>>2] >> ((i%4)*8+4)) & 0xF) +
           hex_tab.charAt((binarray[i>>2] >> ((i%4)*8  )) & 0xF);
  }
  return str;
}

/*
 * Convert an array of little-endian words to a base-64 string
 */
function binl2b64(binarray)
{
  var tab = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
  var str = "";
  for(var i = 0; i < binarray.length * 4; i += 3)
  {
    var triplet = (((binarray[i   >> 2] >> 8 * ( i   %4)) & 0xFF) << 16)
                | (((binarray[i+1 >> 2] >> 8 * ((i+1)%4)) & 0xFF) << 8 )
                |  ((binarray[i+2 >> 2] >> 8 * ((i+2)%4)) & 0xFF);
    for(var j = 0; j < 4; j++)
    {
      if(i * 8 + j * 6 > binarray.length * 32) str += b64pad;
      else str += tab.charAt((triplet >> 6*(3-j)) & 0x3F);
    }
  }
  return str;
}

function getSuburlDomain(suburl) {
	
	var hostpattern = new RegExp("^((?:http:\/\/)|(?:ftp:\/\/(?:[^:]+:[^@]+@)?)|(?:gvod:\/\/))?([^\/:]+)", "g");
	var hostmatcher = hostpattern.exec(suburl);
	if(null != hostmatcher){
		var subhost = decodeURIComponent(hostmatcher[2]) ;
		return subhost ;
		/*这段代码原文中有，但是应该无效，为避免压缩时警告，注释掉
		var domainpatt = new RegExp("[0-9a-z-]+\.(com|cn|org)$", "g");
		var domainmatcher = domainpatt.exec(subhost);
		if(null != domainmatcher){
			return domainmatcher[0] ;
		}
		else {
			return subhost ;
		}
		*/
	}
}

function getFileExt(suburl)
{
	return suburl.substring(suburl.lastIndexOf(".")).toLowerCase();
}