function parseMarkTxt(str) {
 
/* 
主函数
1.position
2.time
3.bookname and writer(book,writer)
4.content （去掉空内容的笔记记录）
5.list(去重复)
6.输出笔记A
*/
//说明：原笔记共29条，第一条内容为空，删除，最后输出共28条；其中第27条为英文输出；时间均格式化


//position
var outposition = /#\s*(\d+)|#\s*(\d+)-(\d+)|\bLocation\b\s*(\d+)|您在第\s*(\d+)/g;
/*位置的几种情况：
1.仅有#ddd
2.标准情况#ddd-ddd
3.英文  location ddd
4.少数情况  您在第ddd页标注...
 */
var positionresult = str.match(outposition);
var position = [];
var r0 = /\d+/g ;
var i = 0;
while(positionresult[i]){
   
  position[i] = positionresult[i].match(r0);
  i++;
} 


//time
var outtime = /(添加于.*\d{1,2}:\d{1,2}:\d{1,2})|\bAdded on\b\s*(\w*.*)(?=[M])/g;
/*时间的两种情况
1.中文 添加于 年月日 时分秒
2.Added on ...
 */
var timeresult = str.match(outtime);
var r1=/((\d{4})年(\d{1,2})月(\d{1,2})日(.+)\s([^\d]+)(\d{1,2}):(\d{1,2}):(\d{1,2}))|(on\s(.+)\,\s(.+)\s(\d{1,2})\,\s(\d{4})\s(\d{1,2})\:(\d{1,2})\:(\d{1,2})\s(.+))/;
var t=/(?=\d)/;
//只取出年月日时分秒部分
/*分组:
中文情况，
组号:
0.1-时间字符串
2-年year
3-月month
4-日date
5-星期week
6-上下午m
789-时分秒

英文，
0.10-时间字符串
14-year
12-月month
11-星期week
15.16.17-时分秒
18-上下午m
*/
//定义数组
var time=[];
var year=[];
var month=[];
var date=[];
var hour=[];
var min=[];
var sec=[];
var week=[];
var ap=[];

//测试规范化时间模块是否正确
/*
var i=0;
while(timeresult[i]!=null){

    time[i]=timeresult[i].match(r1);
    i++;
};*/

var i = 0;
while (timeresult[i] != null) {
    //取出对应字符串
     time[i] = timeresult[i].match(r1);
 
  //取出无需改变的数字  先对应中文情况，若不对应，则为英文（if段）
   year[i] = timeresult[i].match(r1)[2];
    if (year[i] == null) {
      year[i] = timeresult[i].match(r1)[14];
    };

   min[i] = timeresult[i].match(r1)[8];
    if (min[i] == null){
      min[i] = timeresult[i].match(r1)[16];
    };

   sec[i] = timeresult[i].match(r1)[9];
    if (sec[i] == null) {
      sec[i] = timeresult[i].match(r1)[17];
    };

   week[i] = timeresult[i].match(r1)[5];
    if (week[i] == null) {
      week[i] = timeresult[i].match(r1)[11]
    };

   ap[i] = timeresult[i].match(r1)[6];
    if (ap[i] == null){
      ap[i] = timeresult[i].match(r1)[18]
    };
 
   //格式化(timeresult); 
    month[i] = timeresult[i].match(r1)[3];
    if ( month[i] == null )
      { month[i] = timeresult[i].match(r1)[12] }//同上，先后对应中英文
    if ( month[i].length == 1)
      { month[i] = month[i].replace(t,'0') };//中文部分月份只有一个数字的前面加0
         
    
    date[i] = timeresult[i].match(r1)[4];
    if ( date[i] == null)
      { date[i] = timeresult[i].match(r1)[13] };//同上 月份
    if ( date[i].length == 1) 
      { date[i] = date[i].replace(t,'0') };
    
    
    hour[i] = timeresult[i].match(r1)[7];
    if ( hour[i] == null)
      { hour[i] = timeresult[i].match(r1)[15] };
    if ( hour[i].length == 1) 
        { hour[i] = hour[i].replace(t,'0') };//同上，先将单个数前面加0
    if ( ap[i] == '下午' | ap[i] == 'P') //将下午的小时数加12
        {  temp = parseInt(hour[i]);
           temp += 12;
           hour[i] = temp + '';
        }

    //重新取出时间并以一定格式输出
    if ( month[i].length !== 2 ) //英文
      { time[i]=week[i] + ',' + month[i] + ' ' + date[i] + ',' + year[i] + ' ' + hour[i] + ':' + min[i] + ':' + sec[i] + ' ' + ap[i] };
    if ( month[i].length === 2)  //中文
       { time[i]=year[i]+'年'+month[i]+'月'+date[i]+'日' + week[i] + ' ' + ap[i] + hour[i] + ':' +min[i] + ':' + sec[i] };

    i++;
      
   
};


//bookname and writer
var outwr = /[^\=]+(?=\-\s)|=\s*.*[^\s]+.*(?=\-\s)/g;
var wrresult = str.match(outwr);

//writer  去掉最后面的括号
var wrt1 = /\([^\(]+(?=\)\n)/g;
var writer1 = [];
var i = 0;
while (wrresult[i] != null) {
  writer1[i] = wrresult[i].match(wrt1)[0];
  i++;
};

var wrt2 = /\(/g;
var writer2 = [];
var i = 0;
while(writer1[i] != null){
  writer2[i] = writer1[i].replace(wrt2,'');
  i++;
}

var wrt = /\)/;
var writer = [];
var i = 0;
while(writer2[i] != null){
  writer[i] = writer2[i].replace(wrt,'');
  i++;
}



//bookname  去括号
var book = [];
var i = 0;
var bk1 = /\(.+/;
while (wrresult[i] != null) {
  book[i] = wrresult[i].replace(bk1,'');
  i++;
};

var book1 = [];
var i = 0;
while (wrresult[i] != null) {
  book1[i] = book[i].replace('↵','');
  i++;
};


//content  内容部分以============结尾
var outcontent = /\d{1,2}:\d{1,2}:\d{1,2}\s*.*(?=\s+\=\=\=\=\=\=\=\=\=\=)|\d{1,2}:\d{1,2}:\d{1,2}\s*.*\s*.*(?=\s+\=\=\=\=\=\=\=\=\=\=)/g;
var contentresult = str.match(outcontent);

var r2 = /\d{1,2}:\d{1,2}:\d{1,2}\s*/g;
var content1 = [];
var i = 0;
while (contentresult[i] != null) {
  content1[i] = contentresult[i].replace(r2,'');
  i++;
};

var r3 = /\s*AM\s*/g;
var content = [];
var i = 0;
while (contentresult[i] != null) {
  content[i] = content1[i].replace(r3,'');
  i++;
};


//笔记内容
var A=[];
var i=0;
while (book[i] != null) {
  var obj = {};
  obj.title = book[i];
  obj.author = writer[i];
  obj.thetime = time[i];
  obj.theposition = position[i][0];
  obj.thecontent = content[i];
  A.push(obj);
  i++;
}


//booklist去重复
var list = [];
var a = 1;
var i = 0;
list[0] = book[0];
while (book[i] != null) {

  for ( j=0 ; j<a ; j++ )
  { 
    if(book[i] !== list[j])
      {
         m = 1;
         continue;

      } else { 
    
         m = 0;
         break;
      }
  } 

  if (m == 1)
  {
    list[a] = book[i];
    a = a + 1;
  }

  i++;
                
}

//去除空内容（字符串第一个笔记内容为空，删除该条记录）
var i = 0;
while (content[i] != null){

    if (content[i] == '')
    { A.splice(i,1);
      list.splice(i,1);
     }
    i++;
}

console.log(list);
console.log(A);


}

parseMarkTxt(str);
