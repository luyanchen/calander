
(function($) {
    $.fn.calendar = function() {
        return new calendar(this);
    };
    var calendar = (function(el){
        var calendar = function(el){
            this.container = el
        };

        calendar.prototype = {
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
                //显示模板
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
                //年月
                for(i=0;i<self.YearList.length;i++){
                    if(year == self.YearList[i]){
                        $(".calendar .select_year").append("<option value='"+self.YearList[i]+"' selected>&nbsp;"+self.YearList[i]+"年&nbsp;</option>");
                    }else{
                        $(".calendar .select_year").append("<option value='"+self.YearList[i]+"'>&nbsp;"+self.YearList[i]+"年&nbsp;</option>");
                    }
                }
                for(i=0;i<self.MonthList.length;i++){
                    if(month == self.MonthList[i]){
                        $(".calendar .select_month").append("<option value='"+self.MonthList[i]+"' selected>&nbsp;"+(parseInt(self.MonthList[i])+1)+"月&nbsp;</option>");
                    }else{
                        $(".calendar .select_month").append("<option value='"+self.MonthList[i]+"'>&nbsp;"+(parseInt(self.MonthList[i])+1)+"月&nbsp;</option>");
                    }
                }
                
                //获取并显示日期列表
                self.getDateList(year,month,day);
                 
                //监听事件
                $(".calendar .select_year").on("change",function(){
                    year = $(".calendar .select_year").val();
                    month = $(".calendar .select_month").val();
                    self.getDateList(year,month,1);
                });
                $(".calendar .select_month").on("change",function(){
                    year = $(".calendar .select_year").val();
                    month = $(".calendar .select_month").val();
                    self.getDateList(year,month,1);
                });

                $(".calendar .return_today_btn").on("click",function(){
                    var TmpDate = new Date();
                    $(".calendar .select_year").val(TmpDate.getFullYear());
                    $(".calendar .select_month").val(TmpDate.getMonth());
                    self.getDateList(TmpDate.getFullYear(),TmpDate.getMonth(),TmpDate.getDate());
                });         
                //$(".calendar .return_today_btn").trigger("click");
            },
            showTemplate:function(){
                var str = '<div id="hd"></div><div id="bd"><div class="h_calendar_box"><div class="h_calendar"><div class="h_calendar_select"><form><div style="float:left;margin:10px 10px;"><select name="year"class="select_year"></select></div><div style="float:left;margin:10px 10px;"><select name="month"class="select_month"></select></div></form><a class="return_today_btn"href="javascript:;">返回今天</a></div><div class="clearboth"></div><div class="h_calendar_week"><ul class="e_clear"><li class="week">日</li><li>一</li><li>二</li><li>三</li><li>四</li><li>五</li><li class="week">六</li></ul></div><div class="h_calendar_list"><ul class="e_clear js-cld-panel date_list"></ul></div></div><div class="h_calendar_right"><div class="h_calendar_alm"id="div_day_detail"><div class="alm_date"></div><div class="alm_day"></div><div class="alm_content nofestival"><div class="today_date"></div><p class="lunar_date_right"></p><p class="gan_zhi"></p><p class="animal"></p><p class="solar_term"></p><div class="alm_lunar_date"></div><div class="side-section"id="div_astro"><p class="tfestival_right"></p><p class="ifestival_right"></p></div></div></div></div>';
                $(".calendar").html(str);
            },
            showRight:function(){
                var self = this;
                var datestr = $(".calendar .date_list .today").attr("date");
                var ifestival = $(".calendar .date_list .today").attr("ifestival")?$(".calendar .date_list .today").attr("ifestival"):"";
                var tfestival = $(".calendar .date_list .today").attr("tfestival");
                var date = datestr.split("/");
                var result = lunar.solar2lunar(date[0],date[1],date[2]);
                $(".calendar .alm_date").html(date[0]+"/"+date[1]+"/"+date[2]);
                $(".calendar .alm_day").html(result.ncWeek);
                $(".calendar .today_date").html(date[2]);
                $(".calendar .lunar_date_right").html(result.IMonthCn+result.IDayCn);
                $(".calendar .gan_zhi").html(result.gzYear+"年"+result.gzMonth+"月"+result.gzDay+"日");
                $(".calendar .animal").html(result.Animal);
                $(".calendar .solar_term").html(result.Term);
                var t;
                if(ifestival === undefined){
                   $(".calendar .ifestival_right").html("");  
                }else{
                   $(".calendar .ifestival_right").html(ifestival);   
                }
                if(tfestival === undefined){
                   $(".calendar .tfestival_right").html("");  
                }else{
                   $(".calendar .tfestival_right").html(tfestival);   
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
                $(".calendar .date_list").html(str);
                self.EventLister();
            },
            //更新监听事件
            EventLister:function(){
                var self = this;
                //监听事件
                 $(".calendar .date_list li").on("click",function(){
                        $(".calendar .date_list li").removeClass("today");                              
                        if($(this).hasClass("prevnext")){
                         //切换月份
                            var that = self;
                            var date = $(this).attr("date").split("/");
                            $(".calendar .select_year").val(date[0]);
                            $(".calendar .select_month").val(date[1]-1);
                            console.log($(".calendar .select_month").val())
                            self.getDateList(date[0],parseInt(date[1])-1,date[2]);
                        }else{
                            $(this).addClass("today");
                            self.showRight();
                        }
                        
                });
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
        return calendar;
    })();
})(jQuery);

$(function() {
    var calendar = $(".calendar").calendar();
    calendar.init();
 });





