document.writeln('<scrip'+'t language="javascript">var aid=17316</s'+'cript>');
document.writeln('<scrip'+'t language="javascript" src=" http://c.91wan.com/qq270x200_3.js"></s'+'cript>');

//document.writeln('<scrip'+'t src="http://c.pee.cn/show.aspx?tid=2&webid=13913"></s'+'cript>');

var s = [];
s.push('<scrip'+'t type="text/javascript">');
s.push('  u_a_client="30256";');
s.push('  u_a_width="256"; ');
s.push('  u_a_height="159"; ');
s.push('  u_a_zones="9096"; ');
s.push('  u_a_type="1"; ');
s.push('</s'+'cript>');
s.push('<scrip'+'t src="http://i.egooad.cn/i.js"></s'+'cript>');
if(window.location.href.indexOf(',')>-1)
document.write(s.join('\n'));