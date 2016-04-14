
//监听事件
function Event(){
    var myevent = {
        // 页面加载完成后
        readyEvent : function(fn) {
            if (fn==null) {
                fn=document;
            }
            var oldonload = window.onload;
            if (typeof window.onload != 'function') {
                window.onload = fn;
            } else {
                window.onload = function() {
                    oldonload();
                    fn();
                };
            }
        },
        // 视能力分别使用dom0||dom2||IE方式 来绑定事件
        // 参数： 操作的元素,事件名称 ,事件处理程序
        addEvent : function(element, type, handler) {
            if (element.addEventListener) {
                //事件类型、需要执行的函数、是否捕捉
                element.addEventListener(type, handler, false);
            } else if (element.attachEvent) {
                element.attachEvent('on' + type, function() {
                    handler.call(element);
                });
            } else {
                element['on' + type] = handler;
            }
        },
        // 移除事件
        removeEvent : function(element, type, handler) {
            if (element.removeEventListener) {
                element.removeEventListener(type, handler, false);
            } else if (element.datachEvent) {
                element.detachEvent('on' + type, handler);
            } else {
                element['on' + type] = null;
            }
        },
        // 阻止事件 (主要是事件冒泡，因为IE不支持事件捕获)
        stopPropagation : function(ev) {
            if (ev.stopPropagation) {
                ev.stopPropagation();
            } else {
                ev.cancelBubble = true;
            }
        },
        // 取消事件的默认行为
        preventDefault : function(event) {
            if (event.preventDefault) {
                event.preventDefault();
            } else {
                event.returnValue = false;
            }
        },
        // 获取事件目标
        getTarget : function(event) {
            return event.target || event.srcElement;
        },
        // 获取event对象的引用，取到事件的所有信息，确保随时能使用event；
        getEvent : function(e) {
            var ev = e || window.event;
            if (!ev) {
                var c = this.getEvent.caller;
                while (c) {
                    ev = c.arguments[0];
                    if (ev && Event == ev.constructor) {
                        break;
                    }
                    c = c.caller;
                }
            }
            return ev;
        }
    }
    return myevent;
}
//初始化监听事件
var myevent = new Event();
function hasClass(obj, cls) {
    return obj.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'));
}

function addClass(obj, cls) {
    if(!this.hasClass(obj, cls)) obj.className += " " + cls;
}

function removeClass(obj, cls) {
    if(hasClass(obj, cls)) {
        var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
        obj.className = obj.className.replace(reg, ' ');
    }
}

//日历
function Calendar(){
}

Calendar.prototype = {
            DateList :[],
            YearList : [],
            MonthList : [],
            solarTermsName: ["小寒", "大寒", "立春", "雨水", "惊蛰", "春分", "清明", "谷雨", "立夏", "小满", "芒种", "夏至", "小暑", "大暑", "立秋", "处暑", "白露", "秋分", "寒露", "霜降", "立冬", "小雪", "大雪", "冬至", "小寒", "大寒"],
            IFestival: {
                "0101": "元旦节",
                "0214": "情人节",
                "0305": "雷锋日",
                "0308": "妇女节",
                "0312": "植树节",
                "0401": "愚人节",
                "0501": "劳动节",
                "0504": "青年节",
                "0601": "儿童节",
                "0701": "建党日",
                "0801": "建军节",
                "0910": "教师节",
                "1001": "国庆节",
                "1224": "平安夜",
                "1225": "圣诞节",
            },
            TFestival: {
                "正月初一": "春节",
                "正月初五": "破五",
                "二月初二": "春龙节",
                "五月初六": "立夏节",
                "七月十五": "盂兰盆节",
                "七月三十": "地藏节",
                "腊月廿三": "小年",
                "腊月三十": "除夕",
                "正月十五": "元宵节",
                "五月初五": "端午节",
                "七月初七": "乞巧节",
                "八月十五": "中秋节",
                "九月初九": "重阳节",
                "腊月初八": "腊八节",
                "腊月廿四": "扫房日"
            },
            //初始化
            init:function(){

                var self = this;
                //初始化模板视图
                this.showTemplate();

                var curDate = new Date();
                var year = curDate.getFullYear();
                var month = curDate.getMonth();
                var day = curDate.getDate();

                //初始化年份列表     
                for(var i=0;i<120;i++){
                    self.YearList[i] = 1901+i;
                }
                //初始化月份列表
                for(i=0;i<12;i++){
                    self.MonthList[i] = i; 
                }  
                var selectyears_el = document.getElementsByClassName("select_year")[0];
                var selectmonths_el = document.getElementsByClassName("select_month")[0];


                //年月
                for(i=0;i<self.YearList.length;i++){
                    var y_options_el = document.createElement("option");
                    y_options_el.setAttribute("value",self.YearList[i]);                   
                    if(year == self.YearList[i]){
                        y_options_el.setAttribute("selected","true");
                    }
                    y_options_el.innerHTML = "&nbsp;"+self.YearList[i]+"年&nbsp;"
                    selectyears_el.appendChild(y_options_el);
                }
                for(i=0;i<self.MonthList.length;i++){
                    var m_options_el = document.createElement("option");
                    m_options_el.setAttribute("value",self.MonthList[i]);                   
                    if(month== self.MonthList[i]){
                        m_options_el.setAttribute("selected","true");
                    }
                    m_options_el.innerHTML = "&nbsp;"+(parseInt(self.MonthList[i])+1)+"月&nbsp;"
                    selectmonths_el.appendChild(m_options_el);
                }
                
                //获取并显示日期列表
                self.getDateList(year,month,day);
                 
                //监听事件               
                myevent.addEvent(document.querySelectorAll(".calendar .select_year")[0],"change",function(){
                    year = document.querySelectorAll(".calendar .select_year")[0].value;
                    month = document.querySelectorAll(".calendar .select_month")[0].value;
                    self.getDateList(year,month,1);
                });             
                myevent.addEvent(document.querySelectorAll(".calendar .select_month")[0],"change",function(){
                    year = document.querySelectorAll(".calendar .select_year")[0].value;
                    month = document.querySelectorAll(".calendar .select_month")[0].value;
                    self.getDateList(year,month,1);
                });
                myevent.addEvent(document.querySelectorAll(".calendar .return_today_btn")[0],"click",function(){
                    var TmpDate = new Date();
                    document.querySelectorAll(".calendar .select_year")[0].value = TmpDate.getFullYear();  
                    document.querySelectorAll(".calendar .select_month")[0].value = TmpDate.getMonth(); 

                    self.getDateList(TmpDate.getFullYear(),TmpDate.getMonth(),TmpDate.getDate());
                });                       
            },

            showTemplate:function(){
                var str = '<div id="hd"></div><div id="bd"><div class="h_calendar_box"><div class="h_calendar"><div class="h_calendar_select"><form><div style="float:left;margin:10px 10px;"><select name="year"class="select_year"></select></div><div style="float:left;margin:10px 10px;"><select name="month"class="select_month"></select></div></form><a class="return_today_btn"href="javascript:;">返回今天</a></div><div class="clearboth"></div><div class="h_calendar_week"><ul class="e_clear"><li class="week">日</li><li>一</li><li>二</li><li>三</li><li>四</li><li>五</li><li class="week">六</li></ul></div><div class="h_calendar_list"><ul class="e_clear js-cld-panel date_list"></ul></div></div><div class="h_calendar_right"><div class="h_calendar_alm"id="div_day_detail"><div class="alm_date"></div><div class="alm_day"></div><div class="alm_content nofestival"><div class="today_date"></div><p class="lunar_date_right"></p><p class="gan_zhi"></p><p class="animal"></p><p class="solar_term"></p><div class="alm_lunar_date"></div><div class="side-section"id="div_astro"><p class="tfestival_right"></p><p class="ifestival_right"></p></div></div></div></div>';
                var calendarels = document.getElementsByClassName("calendar");          
                calendarels[0].innerHTML = str;
            },
           
            showRight:function(){
                var self = this;
                var datestr = document.querySelectorAll(".calendar .date_list .today")[0].getAttribute("date");
                var ifestival = document.querySelectorAll(".calendar .date_list .today")[0].getAttribute("ifestival")?document.querySelectorAll(".calendar .date_list .today")[0].getAttribute("ifestival"):"";
                var tfestival = document.querySelectorAll(".calendar .date_list .today")[0].getAttribute("tfestival");
                var date = datestr.split("/");
                var result = lunar.solar2lunar(date[0],date[1],date[2]);
                document.querySelectorAll(".calendar .alm_date")[0].innerHTML = date[0]+"/"+date[1]+"/"+date[2];
                document.querySelectorAll(".calendar .alm_day")[0].innerHTML = result.ncWeek;
                
                document.querySelectorAll(".calendar .today_date")[0].innerHTML =date[2];
                document.querySelectorAll(".calendar .lunar_date_right")[0].innerHTML =result.IMonthCn+result.IDayCn;
                document.querySelectorAll(".calendar .gan_zhi")[0].innerHTML =result.gzYear+"年"+result.gzMonth+"月"+result.gzDay+"日";
                document.querySelectorAll(".calendar .animal")[0].innerHTML =result.Animal;
                document.querySelectorAll(".calendar .solar_term")[0].innerHTML =result.Term;
                var t;
                if(ifestival === undefined){
                    document.querySelectorAll(".calendar .ifestival_right")[0].innerHTML = "";  
                }else{
                    document.querySelectorAll(".calendar .ifestival_right")[0].innerHTML = ifestival;   
                }
                if(tfestival === undefined){
                    document.querySelectorAll(".calendar .tfestival_right")[0].innerHTML = "";  
                }else{
                    document.querySelectorAll(".calendar .tfestival_right")[0].innerHTML =tfestival;   
                }
            },
            
            showDateList:function(DateList){
                var self = this;
                if(DateList === undefined){
                    DateList = self.DateList;
                }
                var str = "";
                for(var i=0;i<DateList.length;i++){
                    str += '<li  class="';
                    if(!DateList[i].IsSelectMonth){
                        str += '   prevnext';
                    }
                    if(DateList[i].IsWeekend){
                        str += '   weekend';
                    }
                    if(DateList[i].IsSelectDay){
                        str += '   today';
                    }
                    str +='"';
                    if(DateList[i].IFestival){
                        str += ' ifestival="'+DateList[i].IFestival+'" ';
                    }
                    if(DateList[i].TFestival){
                        str += ' tfestival="'+DateList[i].TFestival+'" ';
                    }
                    str +='    date="'+DateList[i].year+'/'+(parseInt(DateList[i].month)+1)+'/'+DateList[i].day+'"><span class="border"></span><div class="solar_date">'+DateList[i].day+'</div><div class="lunar_date">';
                    
                    if(DateList[i].Term !== null){
                        str += DateList[i].Term+'</div>';
                    }else{
                        str += DateList[i].Lunar+'</div>';
                    }
                    
                    str+='</li>';
                    
                }
               document.getElementsByClassName("date_list")[0].innerHTML = str;
                self.EventLister();
            },
            //更新监听事件
            EventLister:function(){
                var self = this;
                var i,j;
                //监听事件
                var date_list_li_el = document.querySelectorAll(".calendar .date_list  li");
                for(i=0;i<date_list_li_el.length;i++){
                    myevent.addEvent(date_list_li_el[i], "click",function(event){                
                        var el;
                        for(j=0;j<date_list_li_el.length;j++){
                            removeClass(date_list_li_el[j],"today");
                        } 
                        if(myevent.getTarget(event).nodeName == "LI"){
                            el = myevent.getTarget(event);
                        }else{
                            el = myevent.getTarget(event).parentNode;
                        }
                        if(hasClass(myevent.getTarget(event).parentNode,"prevnext")){
                         //切换月份
                            var that = self;
                            var date = el.getAttribute("date").split("/");
                            document.querySelectorAll(".calendar .select_year")[0].value = date[0];  
                            document.querySelectorAll(".calendar .select_month")[0].value = date[1]-1; 
                        
                            self.getDateList(date[0],parseInt(date[1])-1,date[2]);
                        }else{
                            addClass(el,"today");
                            self.showRight();
                        }
                      
                    });
                }

            },
            //获取显示日期列表
            getDateList:function(year,month,day){ 
                var self = this; 
                //当月第一天
                var CurStart = new Date(year,month,1);
                //上月最后一天
                var PreEnd = new Date();  
                PreEnd.setTime(CurStart.getTime()-24*60*60*1000); 
                //下月第一天
                var new_year,new_month;
                if(parseInt(month) == 11){
                    new_year = parseInt(year)+1;
                    new_month = 0; 
                }else{
                    new_year = year;
                    new_month = parseInt(month)+1; 
                } 
                var NextStart = new Date(new_year,new_month,1); 
                //当月天数
                var CurDays = (NextStart.getTime()-CurStart.getTime())/(24*60*60*1000);
                //当月最后一天 
                var CurEnd = new Date(year,month,CurDays);

                var i=0;
                var TmpDate = new Date();
                var DateObjConstructor = function(){
                    var IsSelectMonth = false;
                    var IsWeekend = false;
                    var IsSelectDay = false;
                    var year = "";
                    var month = "";
                    var day = "";
                    var Lunar = "";
                    var Term = "";
                    var IFestival = "";
                    var TFestival = "";

                    
                };
                self.DateList=[];//清空列表
                //上月列表
                var result = {};
                var index = -1;
                var ifestival_date,tfestival_date,item;

                if(PreEnd.getDay() != 6){
                    for(i=0;i<=PreEnd.getDay();i++){
                        var DateObj = new DateObjConstructor();
                        TmpDate.setTime(PreEnd.getTime()-86400000*(PreEnd.getDay()-i));
                        DateObj.year = TmpDate.getFullYear();
                        DateObj.month = TmpDate.getMonth();
                        DateObj.day = TmpDate.getDate();
                        if(TmpDate.getDay() == 0 || TmpDate.getDay() == 6){//周末
                            DateObj.IsWeekend = true;
                        }

                        result = lunar.solar2lunar(DateObj.year,parseInt(DateObj.month)+1,DateObj.day);
                        DateObj.Term = result.Term;
                        DateObj.Lunar = result.IDayCn;
                        ifestival_date= ((parseInt(DateObj.month)<9)?("0"+(parseInt(DateObj.month)+1)):("1"+(parseInt(DateObj.month)+1)%10))+((parseInt(DateObj.day)<10)?("0"+DateObj.day):(DateObj.day));                    
                        tfestival_date = result.IMonthCn+result.IDayCn;
                        for(item in self.IFestival){
                            if(item == ifestival_date){
                                 DateObj.IFestival = self.IFestival[item];
                            }
                        }
                        for(item in self.TFestival){
                            if(item == tfestival_date){
                                 DateObj.TFestival = self.TFestival[item];
                            }
                        }
                        self.DateList.push(DateObj);
                    }
                }
                //当月列表
                for(i=0;i<CurDays;i++){
                    var DateObj = new DateObjConstructor();
                    TmpDate.setTime(CurStart.getTime()+86400000*i);
                    DateObj.year = TmpDate.getFullYear();
                    DateObj.month = TmpDate.getMonth();
                    DateObj.day = TmpDate.getDate();
                    DateObj.IsSelectMonth = true;  
                    if(TmpDate.getDay() == 0 || TmpDate.getDay() == 6){//周末
                        DateObj.IsWeekend = true;
                    }  
                    if(TmpDate.getDate() == day){//选中
                        DateObj.IsSelectDay = true;   
                    }
                    result = lunar.solar2lunar(DateObj.year,parseInt(DateObj.month)+1,DateObj.day);
                    DateObj.Lunar = result.IDayCn;
                    DateObj.Term = result.Term;                                    
                    ifestival_date= ((parseInt(DateObj.month)<9)?("0"+(parseInt(DateObj.month)+1)):("1"+(parseInt(DateObj.month)+1)%10))+((parseInt(DateObj.day)<10)?("0"+DateObj.day):(DateObj.day));                    
                    tfestival_date = result.IMonthCn+result.IDayCn;
                    for(item in self.IFestival){
                        if(item == ifestival_date){
                             DateObj.IFestival = self.IFestival[item];
                        }
                    }
                    for(item in self.TFestival){
                        if(item == tfestival_date){
                             DateObj.TFestival = self.TFestival[item];
                        }
                    }
                    self.DateList.push(DateObj);
                }
                 var NextShowDays = 42-(self.DateList.length);
    
                //下月列表(显示6行)
                for(i=0;i<NextShowDays;i++){       
                    var DateObj = new DateObjConstructor();
                    TmpDate.setTime(NextStart.getTime()+86400000*i);
                    DateObj.year = TmpDate.getFullYear();
                    DateObj.month = TmpDate.getMonth();
                    DateObj.day = TmpDate.getDate();
                    if(TmpDate.getDay() == 0 || TmpDate.getDay() == 6){//周末
                        DateObj.IsWeekend = true;
                    }
                    result = lunar.solar2lunar(DateObj.year,parseInt(DateObj.month)+1,DateObj.day);
                    DateObj.Lunar = result.IDayCn;
                    DateObj.Term = result.Term;
                    ifestival_date= ((parseInt(DateObj.month)<9)?("0"+(parseInt(DateObj.month)+1)):("1"+(parseInt(DateObj.month)+1)%10))+((parseInt(DateObj.day)<10)?("0"+DateObj.day):(DateObj.day));                    
                    tfestival_date = result.IMonthCn+result.IDayCn;
                    for(item in self.IFestival){
                        if(item == ifestival_date){
                             DateObj.IFestival = self.IFestival[item];
                        }
                    }
                    for(item in self.TFestival){
                        if(item == tfestival_date){
                             DateObj.TFestival = self.TFestival[item];
                        }
                    }
                    self.DateList.push(DateObj);
                }
                self.showDateList();
                self.showRight();
          
            }

};









