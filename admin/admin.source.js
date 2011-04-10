var input = (function(){
	var q = window.location.search;
	q = q.slice(1);
	var arr = q.split("&");
	var qArr = {};
	for(var i=0;i<arr.length;i++){
		var p = arr[i].split("=");
		qArr[p[0].toLowerCase()] = arr[i].slice(p[0].length+1);
	}
	return qArr;
})();

var playlistUrl = ""
	,playlistArr = []
	,chineseI = ["��","һ","��","��","��","��","��","��","��","��","ʮ","ʮһ","ʮ��","ʮ��","ʮ��","ʮ��","ʮ��","ʮ��","ʮ��","ʮ��","��ʮ"]
	,englishI = "0abcdefghijklmnopqrstuvwxyz".toUpperCase().split('');

function secToTime(sec){
  var str = "";
  sec = parseInt(sec,10);
  if(sec==0){
    return "δ֪ʱ��";
  }
  if(sec>=24*60*60){
    var day = parseInt(sec/24/60/60,10);
	str += day+"��";
	sec = sec - day*24*60*60;
  }
  if(sec>=60*60){
    var hour = parseInt(sec/60/60,10);
	str += hour+"Сʱ";
	sec = sec - hour*60*60;
  }
  if(sec>=60){
    var min = parseInt(sec/60,10);
	str += min+"��";
	sec = sec - min*60;
  }
  if(sec>=0){
    var sec = parseInt(sec,10);
	str += sec+"";
  }
  if(str!="") return str;
  return "δ֪ʱ��";
}

function goAutoPut(){
	var tInput = {
		'tv' : input['tv'],
		'u' : $.trim($('#u').val())
	};
	window.open('autoput.php?'+$.param(tInput));
}


var JSON = {
	chars : {'\b': '\\b', '\t': '\\t', '\n': '\\n', '\f': '\\f', '\r': '\\r', '"' : '\\"', '\\': '\\\\'},
	type : function(obj)
	{
		if(typeof obj === "undefined") return "undefined";
		if(obj === null) return "null";
		return Object.prototype.toString.call(obj).match(/\s(.+)]$/)[1].toLowerCase();
	},

	replaceChars : function(chr)
	{
		this.chars[chr] = this.chars[chr] || '\\u00' + Math.floor(chr.charCodeAt() / 16).toString(16) + (chr.charCodeAt() % 16).toString(16);
		return this.chars[chr];
	},

/*	encode : function(obj)
	{
		switch (this.type(obj))
		{
			case 'string':
				return '"' + obj.replace(/[\x00-\x1f\\"]/g, this.replaceChars) + '"';
			case 'number': case 'boolean': 
				return String(obj);
			case 'date':
				return 'new Date('+(+obj)+')';
			case 'array':
				var str = [];
				for(var i=0,length=obj.length;i<length;i++)
				{
					str.push(this.encode(obj[i]))
				}
				return '[' + str.join(',') + ']';
			case 'object':
				var str = [];
				for(var i in obj)
				{
					str.push(this.encode(i) + ":" + this.encode(obj[i]))
				}
				return '{' + str.join(',') + '}';
		}
		return 'null';
	},*/

	encode : $.parseJSON,

	decode: function(string, secure){
		if (this.type(string) != 'string' || !string.length){
			return null;
		}
		if (secure && 
				!(/^[,:{}\[\]0-9.\-+Eaeflnr-u \n\r\t]*$/)
				.test(
					string.replace(/\\./g, '@')
						.replace(/"[^"\\\n\r]*"/g, '')
				)
			) 
			return null;
		try
		{
			return eval('(' + string + ')');
		}
		catch (ex)
		{
			return null;
		}
			
	}
}








function enableSubmit(o){
	$('#submit').attr('disabled',o ? !o.checked : false);
	if(!$('#submit').attr('disabled')){
		$('#submit').focus();
	}
}

function addPart(){
  var t =$("#ep_name")[0].value;
  if(t.indexOf("(")==-1){
	  alert("����û�ּ�");
	  return;
  }
  var x = t.substring(t.indexOf("(")+1);
  x = x.substring(0,x.length-1);
  $("#ep_filename").val("P"+x);
} 

function setStatus(){
  var t =$("#status")[0].value;
  if(t.length<1){
    alert("ûд״̬");
	return ;
  }
  $.get("api.php?method=setstatus&tv="+tv_id+'&tvfilename='+tv_filename+"&sta="+encodeURI(t)+'&_='+(+new Date()),function(a,b){alert(a)})
}

function fillsep(notitle){
	var epname = $("#ep_name").val()
		,t = ""
		,f = ""
		,season = $('#q_session').val()
		,ep = $('#q_episode').val()
		,part = $('#q_part').val()
		,nosubtitle = !!$('#q_sub').attr('checked')
		,lang = $('#q_lang').val();
	if(season){
		t+="��"+season+"��";
		f+="S"+season;
	}
	if(ep.indexOf("-")!=-1){
		var s = parseInt(ep.split("-")[0]),e = parseInt(ep.split("-")[ep.split("-").length-1]),a=[];
		for(var i=s;i<=e;i++){
			a.push(i);
		}
		t += " ��"+ s +"-"+ e +"��";
		f += "E"+a.join("E");
		if( epname && (epname.indexOf(s)==-1 || epname.indexOf(e)==-1)){
			alert('�缯��������û'+ep+",С��Ū��Ŷ");
		}
	}else if(ep){
	  t+=" ��"+ep+"��";
	  f+="E"+ep;
	  if( epname && epname.indexOf(ep)==-1)
		alert('�缯��������û'+ep+",С��Ū��Ŷ");
	}

	if(part){
		t+=""+englishI[part]+"";
		f+="P"+part;
		if( epname && epname.indexOf(part)==-1 &&  epname.indexOf(englishI[part])==-1)
			alert('�缯��������û��'+englishI[part]+"����,С��Ū��Ŷ");
	}
	if(nosubtitle){
		t+=' ����Ļ';
	}
	t = $.trim(t);
	if(ep_name && t!= ep_name){
		$('#ep_newdate').attr('checked','checked');
	}
	if(t==ep_name){
		$('#ep_newdate').attr('checked',false);
	}

	f = f.replace(/\-/g,"E");
	if(lang){
		t = lang + ' ' + t;
		if(lang=='����'){
			f = 'CN-'+f;
		}
	}
	if(!notitle){
		$("#ep_name").val(t);
	}
	$("#ep_filename").val(f);
	enableSubmit();
}



var OS = {};//OTHERSITE
OS.get = function()
{
  var u = $("#othersite-url")[0].value;
  if(!u){
    alert('д�ϵ�ַ����');
	return;
  }
  $("othersite-loading").innerHTML = "���ڼ���...";
  $.get("getJson.php?act=tv&u="+escape(u),this.handler);
}

OS.handler = function(tv,errCode){
  var tv = JSON.decode(tv);


  if(!tv){
	  $("#othersite-loading").html("");
	  alert("�޷����ķ�����������Ϣ");
	  return;
  }
  for(var i in tv){
    $("#"+i).val(tv[i]);
  }
  this.pic();
  $("#othersite-loading").html("");

}
OS.pic = function(){
  var img = $("#tv_image")[0].value;
  if(img.indexOf("://")==-1)img="../"+img;
  if(img.length>3){
    $("#pic").html("<img src='"+img+"' />");
  }
  $("#upload").hide();
  $("#pic").show();
}

OS.uploadImage = function(where)
{
	  $("#pic").hide();
	  $("#upload").show().html([
			"<div class='float-list'>"
			,'<iframe height="350" src="'
			,(where == 'xroom' ? STATIC_SERVER+'admin/file/uploadXroom.html' : '../xxxxx_upload.php')
			,'" width="250"></iframe>'
			,"</div>"
			].join(''));
}

var CAT = {};
CAT.get = function(action){	
  var tv=input["tv"];
  $("#selectCAT").html("���ڼ���...");
  if(action=='del')
    $.get("api.php?method=getcat",this.delhandeler); 
  else
    $.get("api.php?method=getcat",this.handeler);
}

CAT.go = function(cat_id){
  window.location.href = "?cat="+cat_id;
};
CAT.del = function(){
  alert('����������');
}
CAT.delAll = function(){
  alert('����������');
}
CAT.handeler = function(cats,errCode){
	  var cats = JSON.decode(cats) || [];
	  if(!cats.length){
	  $("#selectCAT").html('');
	  alert("û�κη���");return;
  }
	var catLinks = "<select onchange='javascript:CAT.go(this.value)'>";
	catLinks+="<option value='0'>-------"+cats.length+"������-------</option>";
	for (var i=0;i<cats.length ;i++ )
	{
      catLinks+="<option value='"+cats[i].cat_id+"'>"+cats[i].cat_name+"</option>";
	}
    catLinks += "</select>";
	$("#selectCAT").html(catLinks);
}
CAT.delhandeler = function(cats,errCode){
	  var cats = JSON.decode(cats) || [];
	  if(!cats.length){
		  $("#selectCAT").html('');
		  alert("û�ҵ��缯");return;
	  }
	var catLinks = "<div class='float-list'>";
	for (var i=0;i<cats.length ;i++ )
	{
      catLinks+="<input type='checkbox' name='willdel' value='"+cats[i].cat_id+"' title='"+cats[i].cat_name+"'/>"+cats[i].cat_name+"<br />";
	}
	catLinks += '<input type="button" class="button" value="ɾ��ѡ�еķ���" onclick="javascript:CAT.del();" />';
    catLinks += "</div>";
	$("#selectCAT").html(catLinks);
}

var VIDEO = {};
VIDEO.preview = function(obj){
	for(var i in obj){
		if(obj[i]){
			$("#"+i).val(obj[i]);
		}
	}
  $("#testImg").html ("<img src='"+obj.ep_image+"' />");
  var sep = getSEP(obj.ep_name);
  var season = sep.s
	  ,episode = sep.e
	  ,part = sep.p;
  if(season){ $('#q_session').val(season);}
  if(episode){ $('#q_episode').val(episode);}
  if(part){ $('#q_part').val(part);}
  if(sep.nosub){
		$('#q_sub').attr('checked','checked');
  }
  if(sep.lang){
		$('#q_lang').val(sep.lang);
  }
}


var EP = {};
EP.sort = function(){
  var tv=input["tv"];
  window.open("ep_sort.php?tv="+tv);
}
EP.get = function(action)
{
  var tv=input["tv"];
  $("#selectEP").html("���ڼ���...");
  if(action=='del'){
	$.getScript("api.php?method=getep&tv="+tv_filename,this.delhandeler); 
  }else{
	$.getScript("api.php?method=getep&tv="+tv_filename,this.handeler);
  }
}
EP.del = function(){
  var tv=input["tv"];
  var epCheck = $("#selectEP input");
  var willdel = [];
  var willdelName = [];
  for(var i=0;i<epCheck.length;i++){
	if((epCheck[i].checked)&&(epCheck[i].name=="willdel")&&(epCheck[i].type=="checkbox")){
		willdel.push(epCheck[i].value);
		willdelName.push(epCheck[i].title);
	}
  }
  if(willdel.length<1){
	alert('δѡ���κξ缯');
    return;
  }
  if(!confirm('ȷ��Ҫɾ�����¾缯��\n'+willdelName.join('\n')+''))return;
  $.get("api.php?method=delep&tv="+tv+"&id="+willdel.join(","),function(a,b){alert(a);EP.get('del')});
}
EP.delAll = function(){
  if(!confirm('ȷ��Ҫɾ��ȫ����'))return;
  var tv=input["tv"];
  $.get("api.php?method=delep&tv="+tv+"&id=all",function(a,b){alert(a)});
}
EP.handeler = function(eps,errCode){
  var eps = JSON.decode(eps) || [];
  if(!eps.length){
	  $("#selectEP")[0].innerHTML = ""
	  alert("û�ҵ��缯");
	  return;
  }
	var epLinks = "<select onchange='javascript:EP.go(this.value)'>";
	epLinks+="<option value='0'>-----"+eps.length+"����Ƶ-------</option>";
	for (var i=0;i<eps.length ;i++ ){
      epLinks+="<option value='"+eps[i].id+"'>"+eps[i].name+"</option>";
	}
    epLinks += "</select>";
	$("#selectEP").html( epLinks);
}
EP.delhandeler = function(eps,errCode){
  var eps = JSON.decode(eps) || [];
  if(!eps||eps.length<1){
	 $("#selectEP")[0].innerHTML = ""
	  alert("û�ҵ��缯");return;
  }
	var epLinks = "<div class='float-list'>";
	for (var i=0;i<eps.length ;i++ )
	{
      epLinks+="<input type='checkbox' name='willdel' value='"+eps[i].ep_id+"' title='"+eps[i].ep_name+"'/>"+eps[i].ep_name+"<br />";
	}
	epLinks += '<input type="button" class="button" value="ɾ��ѡ�еľ缯" onclick="javascript:EP.del();" />';
    epLinks += "</div>";
	$("#selectEP").html( epLinks);
}
EP.go = function(ep_id){
  if(input["tv"]==0||ep_id==0)return;
  window.location.href = "?tv="+input["tv"]+"&ep="+ep_id;
};
var TV = {};
TV.get = function(){
	var q=$.trim($("#q").val());
	if(q.indexOf("://")!=-1){
		$('#u').val(q);
		PLAYLIST.get();
		return;
	}
	q = q.replace(/��(\d+)[��|��|��|��]/g, ' ')
		.replace(/��[һ|��|��|��|��|��|��|��|��|ʮ]{1,}[��|��|��]/g, ' ')
		.replace(/��|��/g, ' ')
		.replace(/��|��|��|��/g, ' ')
		.replace(/\(|\)/g, ' ')
		.replace(/��|��/g, ' ')
		.replace(/\[|\]/g, ' ')
		.replace(/-|��/g, ' ')
		.replace(/_/g, ' ')
		.replace(/\./g, ' ')
		;
	q = (function(q){
		var s = $.trim($.trim(q).split(' ').shift());
		if(s.match(/^\d+$/)){
			return q;
		}
		var s1 = s.replace(/(\D+)\d+/g, '$1 ');
		if(s1.match(/^\d+\D+$/)){
			return s1;
		}
		s = s.replace(/\d+/g, ' ');
		if(s.length<3){
			return q;
		}
		return s;
	})(q);
	q = $.trim($.trim(q).split(' ').shift());
	if(!q){
	  alert("���Ӿ�����ûд");
	  return ;
	}
	$("#selectTV").html("���ڼ���...");
	$.getJSON('api.php?method=gettv&q='+encodeURIComponent(q)+'&callback=?',function(o){
		$("#selectTV").html('');
		var tvs = o ? o : [];
		if(!tvs.length){
			alert("û�ҵ����Ӿ�");
			return;
		}
		var tvLinks = [
			'<select onchange="javascript:TV.go(this.value)">',
			'<option value="0">-----'+tvs.length+'������--------</option>'
		];
		for (var i=0;i<tvs.length ;i++ ){
			tvLinks.push('<option value="'+tvs[i].id+'">['+tvs[i].status+']'+tvs[i].name+'</option>');
		}
		tvLinks.push('</select>');
		$("#selectTV").html(tvLinks.join(''));
	});
}

TV.del = function(){
  if(!tv_filename || !tv_id){
	alert('��ѡ����Ҫɾ���ĵ��Ӿ�');
    return;
  }
  if(!confirm('ȷ��Ҫɾ��['+$("#tv_name").val()+']��'))return;
  $.get("api.php?method=deltv&tvfilename="+tv_filename+'&tv='+tv_id,function(a,b){alert(a);});
  window.location.href="?";
}
TV.showEp = function()
{
	$("#input-ep").toggle();
};
TV.go = function(tv_id){
  if(tv_id==0)return;
  window.location.href = "?tv="+tv_id;
};
var PLAYLIST = {};
PLAYLIST.focus = function(){
 var u = $("playlist-url").value;
  if(u==input["u"]||u=="�ſ��������KU6�����б�")$("playlist-url").value="";
}

PLAYLIST.blur = function(){
  var u = $("#playlist-url")[0].value;
  var defaultStr = input["u"]?input["u"]:"�ſ��������KU6�����б�";
  if(u.length<1)$("#playlist-url").val(defaultStr);
}

PLAYLIST.get = function(index){
	var u = $.trim($("#u").val());
	if(!u){
		alert("��ַûд");
		return ;
	}
	if(u.indexOf("://")==-1){
		$('#q').val(u);
		TV.get();
		return;
	}
	$("#selectVideo").html("���ڼ���...");
	$.getJSON('getJson.php?u='+encodeURIComponent(u)+'&callback=?',function(o){
		$("#selectVideo").html('');
		window['playlistArr'] = o ? o : [];
		if(!playlistArr.length){
			return ;
		};
		$("#selectVideo").html('<select id="playlist-selector" onchange="javascript:PLAYLIST.select(this.value)"><option value="-1">---- 0 ----</option></select>');
		var selector = $('#playlist-selector');
		var min=99999;
		var max=0;
		html = ['<option value="-1">---- '+ playlistArr.length +' ----</option>'];
		for(var i=0;i<playlistArr.length;i++){
			if(playlistArr[i].ep_duration>max)max = playlistArr[i].ep_duration;
			if(playlistArr[i].ep_duration<min)min = playlistArr[i].ep_duration;
			html.push('<option value="'+i+'">'+playlistArr[i].ep_name+' ['+secToTime(playlistArr[i].ep_duration)+']</option>');
			//html += "<option value='"+i+"'>"+playlistArr[i].ep_name+" ["+secToTime(playlistArr[i].ep_duration)+"]</option>"
		}
		selector.html(html.join(''));
		if(index!==undefined){
			PLAYLIST.select(parseInt(index,10));
			return;
		}
		if(playlistArr.length==1){
			PLAYLIST.select(0)
		}
	});
}


PLAYLIST.jump = function(pl){
  var q = window.location.search;
  if((input["u"]==pl)||(input["u"]==encodeURI(pl))) return;
  var newQ = [];
  for(var i in input){
	if(i!="u")newQ.push(i + "=" + input[i]) 
  }
  newQ.push("u="+encodeURI(pl));
  window.location.href = "?"+(newQ.join("&"));
}


PLAYLIST.select = function(index){
  if(!playlistArr.length){alert('...zzzZZZ');return false;}
  if(index<0){return false;}
  index = parseInt(index);
  var theVideo = playlistArr[index];
  VIDEO.preview(theVideo);
	setTimeout(function(){ 
	$('#playlist-selector').val(index);
	},0);
	if(!$('#ep_filename').val() && input['u']){
		fillsep(true);
	}
}

function toInt(s)
{
	if(!s)
		return 0;
	if(s=='��') return 1;
	if(s=='��') return 2;
	if(s=='��') return 2;

	s = s.replace(/^ʮ/,'һʮ')
		.replace(/ʮ$/,'0')
		.replace(/��$/,'00')
		.replace(/ǧ$/,'000')
		.replace(/��$/,'000')
		.replace(/[ʮ|��|ǧ|��]/,'')
		.replace(/ix/ig,'9')
		.replace(/viii/ig,'8')
		.replace(/vii/ig,'7')
		.replace(/vi/ig,'6')
		.replace(/iv/ig,'4')
		.replace(/iii/ig,'3')
		.replace(/ii/ig,'2')		
		;
	s = s+'';
	var theI = [
			'���٢ڢۢܢݢޢߢ���',
			'��������������������',
			'��һ�����������߰˾�',
			'abcdefghijklmnopqrstuvwxyz',
			'���������������������'
		]
	for(var i=0;i<theI.length;i++){
		var b = theI[i].split('');
		for(var j=0;j<b.length;j++){
			s = s.replace(new RegExp(b[j],"g"),j);
		}
	}
	return parseInt(s,10);



		/*.replace(/^ʮ/,s.slice(-1)=='ʮ' ? '10' : '1')
		.replace(/ʮ/g,s.slice(-1)=='ʮ' ? '0' : '')
		.replace(/��/g,s.slice(-1)=='��' ? '00' : '')
		.replace(/ǧ/g,s.slice(-1)=='ǧ' ? '000' : '')
	var quanquanI = '�٢ڢۢܢݢޢߢ���'.split('')
		,quanjiaoI = '��������������������'.split('')
		,chineseI = "��һ�����������߰˾�".split('')
		,englishI = "abcdefghijklmnopqrstuvwxyz".split('')
		,romaI = "���������������������".split('')
		;
	s = String(s);
	for(var i=0;i<quanquanI.length;i++)
		s = s.replace(new RegExp(quanquanI[i],"g"),i+1);
	for(var i=0;i<quanjiaoI.length;i++)
		s = s.replace(new RegExp(quanjiaoI[i],"g"),i);
	for(var i=0;i<chineseI.length;i++)
		s = s.replace(new RegExp(chineseI[i],"g"),i);
	for(var i=0;i<romaI.length;i++)
		s = s.replace(new RegExp(romaI[i],"g"),i);
	for(var i=0;i<englishI.length;i++)
		s = s.replace(new RegExp(englishI[i],"ig"),i+1);
	if(/^\d*$/.test(s)) 
		return parseInt(s,10);
		*/
}

function getSEP(title)
{
	title = title
		.replace(/\d{2,4}����/g, "")  //ɾ�����
		.replace(/(19|20)\d{2,2}/g, "")  //ɾ�����
		.replace(/\d{6,}/g, "")  //ɾ������
		.replace(/\d{2,2}\.\d{2,2}\.\d{2,2}/g, "")  //ɾ������
		.replace(/\d{4,}/g, "")  //����3λ��������һ��ûʲô��
		.replace(/DVD/g, "")
		.replace(/TV/g, "")
		.replace(/ȫ��/g,'')
		.replace(/��/g,'��1��')
		.replace(/��/g,'��2��')
		.replace(/��/g,'��3��')
		.replace(/��/g,'��4��')
		.replace(/iv/ig,'��4��')
		.replace(/iii/ig,'��3��')
		.replace(/ii/ig,'��2��')
		.replace(/��/g,'��')
		.replace(/��/g,'��')
		.replace(/��/g,'��')
		.replace(/(^\s*)|(\s*$)/g, "");
	var season = function(){
		if(title.match(/S(\d+)E(\d+)/ig))
			return (/S(\d+)E(\d+)/ig).exec(title)[1];
		if(title.match(/��(.*?)��/ig))
			return (/��(.*?)��/ig).exec(title)[1];
		if(title.match(/Season(\d+)/ig))
			return (/Season(\d+)/ig).exec(title)[1];
		if(title.match(/(\d+)\s/ig))
			return (/(\d+)\s/ig).exec(title)[1];
		return 0;
	}()
	,episode = function(){
		title = title.replace(new RegExp('��'+season+'��'),'');
		if(title.match(/S(\d+)E(\d+)/ig))
			return (/S(\d+)E(\d+)/ig).exec(title)[2];
		if(title.match(/��(.*?)��/ig))
			return (/��(.*?)��/ig).exec(title)[1];
		if(title.match(/Episode(\d+)/ig))
			return (/Episode(\d+)/ig).exec(title)[1];
		if(title.match(/(\d+)��/ig))
			return (/(\d+)��/ig).exec(title)[1];
		if(title.match(/Ep(\d+)/ig))
			return (/Ep(\d+)/ig).exec(title)[1];
		if(title.match(/(\d+)(\.|\-)/ig))
			return (/(\d+)(\.|\-)/ig).exec(title)[1];
		if(title.match(/(\d+)$/ig))
			return (/(\d+)$/ig).exec(title)[1];
		if(title.match(/\s(\d+)/ig))
			return (/\s(\d+)/ig).exec(title)[1];
		if(title.match(/(\d+)/ig))
			return (/(\d+)/ig).exec(title)[1];
	}()
	,part = function(){
		if(title.match(/(��|��|��)$/g))
			return (/(��|��|��)$/g).exec(title)[1];
		if(title.match(/([a-z])$/ig))
			return (/([a-z])$/ig).exec(title)[1];
		if(title.match(/��([a-z]|\d+)/ig))
			return (/��([a-z]|\d+)/ig).exec(title)[1];
		return 0;
	}();
	var data = {s:0,e:0,p:0,f:''};
	season = toInt(season);
	if(season && season<25 ){
		data.s = season;
		data.f += 'S'+season;
	}
	if(episode.indexOf('-')!=-1){
		var arr = episode.split('-'),
			s = toInt(arr[0]),
			e = toInt(arr[1]);
		data.e =  s + "-" + e ;
		for(;s<=e;s++)
		{
			data.f += 'E'+s;
		}
		part = 0;
	}
	else{
		episode = toInt(episode);
		data.e = episode;
		data.f += 'E'+episode;
	}
	part = toInt(part);
	if(part && part<10 ){
		data.p = part;
		part = "abcdefghijklmnopqrstuvwxyz".split('')[part-1]
		data.f += 'P'+part;
	}
	if(title.indexOf('����')!==-1){
		data.nosub = true;
	}
	if(title.indexOf('����')!==-1){
		data.lang = '����';
	}
	if(title.indexOf('����')!==-1){
		data.lang = '����';
	}
	return data;
}


function selectPlayList(index){
  if(!youku){alert('�Ȼ��ٵ�');return false;}
  if(index<0){ alert('��ѡ��缯');return false;}
  index = parseInt(index,10);
  var tYouku = youku[index];
  for(var i in tYouku){
    try{$(i).value = tYouku[i];}catch(e){alert(i);}
  }
  $("testImg").innerHTML = "<img src='"+tYouku.ep_image+"' />";
  if(tYouku.ep_name.indexOf("��һ��")>-1){
    $('q_session').value = 1;
  }
  $('q_ji').value = parseInt(index+offset,10)+1;
  if(index+1==youku.length)alert("ר����");
  $('youku_pl_sel').value=index;
  return true;
}


function delCache()
{
	$.get("api.php?method=delcache",function(a){alert(a)})
}



function checkActor(e){
	var v = $(e).val();
	if(!v)
		return;

	var s = v.replace(/��|��|\/|��|\,|\|/g,' ');
	s = $.trim(s);
	s = s.replace(/\s+/g,' ');

	var a = s.split(' ');
	for(var i=0;i<a.length;i++){
		if(a[i].length<2){
			alert('��Ա�в�Ӧ�ð���ֻ��һ���ֵ����֡�');
			$(e).val(s).select();
			return;
		}
	}

	if(s!=v){
		$(e).val(s);
	}
}

function doEP(){
	var v = $('#doEP').val();
	var ep_name = $('#ep_name');
	var ep_filename = $('#ep_filename');
	var s = ep_name.val();
	switch(v){
		case '����':case '������':
			s = s.replace('('+v+')','')+'('+v+')';
			break;
		case 'Ԥ��Ƭ':case '����Ļ':
			s = s.replace(' '+v,'')+' '+v;
			break;
		case '����':
			s = '���� '+s.replace('���� ','').replace('���� ','');
			ep_filename.val(ep_filename.val().replace('CN-',''));
			break;
		case '����':
			s = '���� '+s.replace('���� ','').replace('���� ','');
			ep_filename.val('CN-'+ep_filename.val().replace('CN-',''));
			break;
		case '��X��':
			s = s.replace('��','��');
			break;
	}
	s = $.trim(s).replace(/\s+/,' ',s);
	if(s!=v){
		ep_name.val(s);
	}
	$($('#doEP option')[0]).attr('selected','selected');
}

$(document).ready(function(){
	$('*[readonly]').addClass('readonly');
	epOP = '����,����,����,������,Ԥ��Ƭ,����Ļ,��X��'.split(',');
	for(var i=0;i<epOP.length;i++){
		$('#doEP').append($('<option>'+epOP[i]+'</option>'));
	}

	$('#doEP').change(doEP);
	$('#doEP option').click(doEP);

	$('input[type=text]')
		.addClass('text')
		.focus(function(){$(this).addClass('focus')})
		.blur(function(){$(this).removeClass('focus')});
	$('input[type=text][readonly!=readonly]')
		.dblclick(function(){$(this).val('')});

	function checkNameChanged(){
		var newname=$.trim($('#ep_name').val());
		if(!newname || !ep_name){
			return;
		}
		$('#ep_newdate').attr('checked',newname==ep_name?false:'checked');
	}
	$('#ep_name').change(checkNameChanged).keyup(checkNameChanged);

});