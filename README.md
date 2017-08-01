# 任务
## 背景介绍
kindle 为亚马逊推出的一款电子阅读器，阅读过程中可对书籍内容进行标注，系统会把备注生成一个 Mycliping.txt 文件。
但是这个文件可读性差，不易于导出到第三方的一些笔记应用(诸如印象笔记)。因此，有需求就有市场，clippings.io 为外国开发的一款
解决该问题的 web 应用，功能强大。

## 目标
本次任务的目标就是完成解析 Mycliping.txt的任务，将标记规范的输出。
技术实现上，这里主要着重利用正则解析给定的字符串（省去通过 FileReader Api来读取文件这一步骤）。

##  输入start 待解析的的字符串 
```
var sourceString = 
'
Harry Potter and the Chamber of Secrets (Rowling, J.K.)
- 您在位置 #3251-3252的标注 | 添加于 2017年1月12日星期四 下午11:39:43

There was barely a face to be seen in the school that didn’t look worried and tense, and any laughter that rang through the corridors sounded shrill and unnatural and was quickly stifled.
==========
知更鸟女孩 ([美] 查克·温迪格)
- Your Highlight on Location 2619-2625 | Added on Tuesday, February 21, 2017 1:11:53 AM

他就像个精通怀柔之术的太极高手，又像个超然世外的禅宗大师，对她循循善诱，无声无息间便将她咄咄逼人的戾气化解得无影无踪。
==========
知更鸟女孩 ([美] 查克·温迪格)
- Your Highlight on Location 2619-2625 | Added on Tuesday, February 21, 2017 1:11:53 AM


==========
把生命浪费在美好的事物上 (吴晓波)
- 您在位置 #240-248的标注 | 添加于 2016年4月18日星期一 下午7:43:37

近年来，还突然喜欢看建筑师、设计师的文字，因为我觉得他们的实用感是我们这些做文章的人需要学习的，房子是建来让人住的，服装是裁剪出让人穿的，所以，合体舒服是第一要义。做文章是让人读的，也应该这样。山本耀司是我非常喜欢的日本服装设计师，他很喜欢从老照片中吸取灵感，他说自己有很多世纪初人像摄影的图书，喜欢那里面人与衣服之间的关系，人们穿的不是时尚，而是现实（reality）。或者换句话说，山本耀司希望他设计的服饰能够给穿它们的人这种感觉。我想，这是一种人们能够通过自己的穿着认识自己的感觉，当你照镜子的时候，你看到的是自己，而非衣服或时尚。 这样的体悟又岂仅与服装有关。大抵造园、作画、裁衣、行文、做企业、为人，天下一理，若胸中格局足够，无论大小都不足惧，关键是大处能容天地，小处能觅细针，须控制事物发展的节奏。所谓经验两字，经是经过的事，验是得到印证的事，都与实际有关。
==========
把生命浪费在美好的事物上 (吴晓波)
- 您在位置 #366-367的标注 | 添加于 2016年5月2日星期一 下午3:08:36

我们的书单决定了我们的过去，同时也指向一个辽阔的未来。
==========
'
```
##  输出结果
```
var bookList = ["把生命浪费在美好的事物上", "知更鸟女孩", "Harry Potter and the Chamber of Secrets"]
var mark = [
  { // 样例
    title: "把生命浪费在美好的事物上",
    author: "吴晓波",
    postion: "366", // 取 ”您在位置 #366-367的标注“中的366既可,如果是#240-248则选取240即可
    time: "2016年5月2日星期一 下午3:08:36", 
    content: "我们的书单决定了我们的过去，同时也指向一个辽阔的未来。"
  },
  ... // 其余的解析结果
]
```

1. 考虑到系统切换为英文的情况，中间关于标记位置与时间的部分变为英文 
"- Your Highlight on Location 2619-2625 | Added on Tuesday, February 21, 2017 1:11:53 AM"
2. mark中的time，转化为标准的时间格式 YYYY-MM-DD hh:mm:ss，月份与年份如果为个位数，补全十位为0，即5月份需显示为05
"2016年5月2日星期一 下午3:08:36" 格式化为 2016-05-02 03:08:36
3. mark中的content为空，则去掉该条记录，以防止空的记录。
4. 12与24小时进制之间的转化

注：欢迎您发现新的问题。
