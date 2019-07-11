/**
 * Created by huang on 2017/2/9.
 * 页面组件
 */
function transformDate(date) {
    var dateStrArray = date.split('-');
    return dateStrArray[1] + '/' + dateStrArray[2] + '/' + dateStrArray[0]
};

cleanParams = function(filter){
    var query = _.clone(filter);
    for(var key in query){
        if(!query[key]&&key!="offset"){
            delete query[key]
        }
    }
    return query
}

datePickerOptionsFunc =function(startDate,endDate,minDate,isSingleFlag) {
    return {
        "showDropdowns": true,
        //"alwaysShowCalendars": true,
        //"singleDatePicker": true,
        "singleDatePicker": isSingleFlag==undefined?false:isSingleFlag,
        "autoApply": true,
        "alwaysShowCalendars": false,
        "startDate": transformDate(startDate),
        "endDate": transformDate(endDate),
        "minDate": transformDate(minDate),
        "maxDate": transformDate(endDate),
        "locale": {
            "format": "MM/DD/YYYY",
            "separator": " - ",
            "applyLabel": "确认",
            "cancelLabel": "取消",
            "fromLabel": "从",
            "toLabel": "至",
            "customRangeLabel": "自定义",
            "daysOfWeek": [
                "日",
                "一",
                "二",
                "三",
                "四",
                "五",
                "六"
            ],
            "monthNames": [
                "一月",
                "二月",
                "三月",
                "四月",
                "五月",
                "六月",
                "七月",
                "八月",
                "九月",
                "十月",
                "十一月",
                "十二月"
            ],
            "firstDay": 0
        },
        "ranges": {
            '昨天': [moment().subtract(1, 'days').toDate(), moment().subtract(1, 'days').toDate()],
            '最近7天': [moment().subtract(7, 'days').toDate(), moment().toDate()],
            '最近15天': [moment().subtract(15, 'days').toDate(), moment().toDate()],
            '最近30天': [moment().subtract(30, 'days').toDate(), moment().toDate()],
            '本周': [moment().startOf('week').toDate(), moment().endOf('week').toDate()],
            '上周': [moment().subtract(1, 'week').startOf('week').toDate(), moment().subtract(1, 'week').endOf('week').toDate()],
            '本月': [moment().startOf('month').toDate(), moment().endOf('month').toDate()],
            '上个月': [moment().subtract(1, 'month').startOf('month').toDate(), moment().subtract(1, 'month').endOf('month').toDate()],
            '今年': [moment().startOf('year').toDate(), moment().endOf('year').toDate()],
            '去年': [moment().subtract(1, 'year').startOf('year').toDate(), moment().subtract(1, 'year').endOf('year').toDate()]
        }
    }
};
weekDatePickerOptionsFunc=function(startDate,endDate,minDate,isSingleFlag){
        return {
            onlyShowfirstDayOfWeek: true,
            "showDropdowns": true,
            //"alwaysShowCalendars": true,
            "alwaysShowCalendars": false,
            "singleDatePicker": isSingleFlag==undefined?false:isSingleFlag,
            "autoApply": true,
            "startDate": transformDate(startDate),
            "endDate": transformDate(endDate),
            "minDate": transformDate(minDate),
            "maxDate": transformDate(endDate),
            "locale": {
                "format": "MM/DD/YYYY",
                    "separator": " - ",
                    "applyLabel": "确认",
                    "cancelLabel": "取消",
                    "fromLabel": "从",
                    "toLabel": "至",
                    "customRangeLabel": "自定义",
                    "daysOfWeek": [
                    "日",
                    "一",
                    "二",
                    "三",
                    "四",
                    "五",
                    "六"
                ],
                    "monthNames": [
                    "一月",
                    "二月",
                    "三月",
                    "四月",
                    "五月",
                    "六月",
                    "七月",
                    "八月",
                    "九月",
                    "十月",
                    "十一月",
                    "十二月"
                ],
                    "firstDay": 0
            },
            "ranges": {
            '上周': [moment().subtract(1, 'week').startOf('week').toDate(), moment().subtract(1, 'week').startOf('week').toDate()],
                '上5周': [moment().subtract(5, 'week').startOf('week').toDate(), moment().subtract(1, 'week').startOf('week').toDate()],
                '上10周': [moment().subtract(10, 'week').startOf('week').toDate(), moment().subtract(1, 'week').startOf('week').toDate()],
                '上15周': [moment().subtract(15, 'week').startOf('week').toDate(), moment().subtract(1, 'week').startOf('week').toDate()],
                '今年': [moment().startOf('year').startOf('week').toDate(), moment().subtract(1, 'week').startOf('week').toDate()],
                '去年': [moment().subtract(1, 'year').startOf('year').startOf('week').toDate(), moment().subtract(1, 'year').endOf('year').startOf('week').toDate()]
            }
        }
};
monthDatePickerOptionsFunc=function(startDate,endDate,minDate,isSingleFlag){
    return {
        "onlyShowfirstDayOfMonth":true,
        "showDropdowns": true,
        //"alwaysShowCalendars": true,
        "singleDatePicker": isSingleFlag==undefined?false:isSingleFlag,
        "alwaysShowCalendars": false,
        "autoApply": true,
        "startDate": transformDate(startDate),
        "endDate": transformDate(endDate),
        "minDate": transformDate(minDate),
        "maxDate": transformDate(endDate),
        "locale": {
            "format": "MM/DD/YYYY",
            "separator": " - ",
            "applyLabel": "确认",
            "cancelLabel": "取消",
            "fromLabel": "从",
            "toLabel": "至",
            "customRangeLabel": "自定义",
            "daysOfWeek": [
                "日",
                "一",
                "二",
                "三",
                "四",
                "五",
                "六"
            ],
            "monthNames": [
                "一月",
                "二月",
                "三月",
                "四月",
                "五月",
                "六月",
                "七月",
                "八月",
                "九月",
                "十月",
                "十一月",
                "十二月"
            ],
            "firstDay": 0
        },
        "ranges": {
            '本月':[moment().startOf('month').toDate(),moment().startOf('month').toDate()],
            '上月': [moment().subtract(1, 'month').startOf('month').toDate(), moment().subtract(1, 'month').startOf('month').toDate()],
            '上3月': [moment().subtract(3, 'month').startOf('month').toDate(), moment().subtract(1, 'month').startOf('month').toDate()],
            '上6月': [moment().subtract(6, 'month').startOf('month').toDate(), moment().subtract(1, 'month').startOf('month').toDate()],
            '上12月': [moment().subtract(12, 'month').startOf('month').toDate(), moment().subtract(1, 'month').startOf('month').toDate()],
            '今年': [moment().startOf('year').startOf('month').toDate(), moment().subtract(1, 'month').startOf('month').toDate()],
            '去年': [moment().subtract(1, 'year').startOf('year').startOf('month').toDate(), moment().subtract(1, 'year').endOf('year').startOf('month').toDate()],
        }
    }
};

//详细月份数据
monthDatePickerOptionsFuncDetail=function(startDate,endDate,minDate,maxDate,isSingleFlag){
    return {
        "onlyShowfirstDayOfMonth":true,
        "showDropdowns": true,
        //"alwaysShowCalendars": true,
        "singleDatePicker": isSingleFlag==undefined?false:isSingleFlag,
        "alwaysShowCalendars": false,
        "autoApply": true,
        "startDate": transformDate(startDate),
        "endDate": transformDate(endDate),
        "minDate": transformDate(minDate),
        "maxDate": transformDate(maxDate),
        "locale": {
            "format": "MM/DD/YYYY",
            "separator": " - ",
            "applyLabel": "确认",
            "cancelLabel": "取消",
            "fromLabel": "从",
            "toLabel": "至",
            "customRangeLabel": "自定义",
            "daysOfWeek": [
                "日",
                "一",
                "二",
                "三",
                "四",
                "五",
                "六"
            ],
            "monthNames": [
                "一月",
                "二月",
                "三月",
                "四月",
                "五月",
                "六月",
                "七月",
                "八月",
                "九月",
                "十月",
                "十一月",
                "十二月"
            ],
            "firstDay": 0
        },
        "ranges": {
            '一月': [moment().subtract(eval(moment().format("MM")-1), 'month').startOf('month').toDate(), moment().subtract(eval(moment().format("MM")-1), 'month').startOf('month').toDate()],
            '二月': [moment().subtract(eval(moment().format("MM")-2), 'month').startOf('month').toDate(), moment().subtract(eval(moment().format("MM")-2), 'month').startOf('month').toDate()],
            '三月': [moment().subtract(eval(moment().format("MM")-3), 'month').startOf('month').toDate(), moment().subtract(eval(moment().format("MM")-3), 'month').startOf('month').toDate()],
            '四月': [moment().subtract(eval(moment().format("MM")-4), 'month').startOf('month').toDate(), moment().subtract(eval(moment().format("MM")-4), 'month').startOf('month').toDate()],
            '五月': [moment().subtract(eval(moment().format("MM")-5), 'month').startOf('month').toDate(), moment().subtract(eval(moment().format("MM")-5), 'month').startOf('month').toDate()],
            '六月': [moment().subtract(eval(moment().format("MM")-6), 'month').startOf('month').toDate(), moment().subtract(eval(moment().format("MM")-6), 'month').startOf('month').toDate()],
            '七月': [moment().subtract(eval(moment().format("MM")-7), 'month').startOf('month').toDate(), moment().subtract(eval(moment().format("MM")-7), 'month').startOf('month').toDate()],
            '八月': [moment().subtract(eval(moment().format("MM")-8), 'month').startOf('month').toDate(), moment().subtract(eval(moment().format("MM")-8), 'month').startOf('month').toDate()],
            '九月': [moment().subtract(eval(moment().format("MM")-9), 'month').startOf('month').toDate(), moment().subtract(eval(moment().format("MM")-9), 'month').startOf('month').toDate()],
            '十月': [moment().subtract(eval(moment().format("MM")-10), 'month').startOf('month').toDate(), moment().subtract(eval(moment().format("MM")-10), 'month').startOf('month').toDate()],
            '十一月': [moment().subtract(eval(moment().format("MM")-11), 'month').startOf('month').toDate(), moment().subtract(eval(moment().format("MM")-11), 'month').startOf('month').toDate()],
            '十二月': [moment().subtract(eval(moment().format("MM")-12), 'month').startOf('month').toDate(), moment().subtract(eval(moment().format("MM")-12), 'month').startOf('month').toDate()],
        }
    }
};

filterPickerOptionsFunc = function(startDate,endDate,minDate,isSingleFlag) {
    return {
        "showDropdowns": true,
        //"alwaysShowCalendars": true,
        //"singleDatePicker": true,
        "singleDatePicker": isSingleFlag==undefined?false:isSingleFlag,
        "autoApply": true,
        "alwaysShowCalendars": false,
        "startDate": transformDate(startDate),
        "endDate": transformDate(endDate),
        "minDate": transformDate(minDate),
        "maxDate": transformDate(endDate),
        "locale": {
            "format": "MM/DD/YYYY",
            "separator": " - ",
            "applyLabel": "确认",
            "cancelLabel": "取消",
            "fromLabel": "从",
            "toLabel": "至",
            "customRangeLabel": "自定义",
            "daysOfWeek": [
                "日",
                "一",
                "二",
                "三",
                "四",
                "五",
                "六"
            ],
            "monthNames": [
                "一月",
                "二月",
                "三月",
                "四月",
                "五月",
                "六月",
                "七月",
                "八月",
                "九月",
                "十月",
                "十一月",
                "十二月"
            ],
            "firstDay": 0
        },
        "ranges": {
            '最近7天': [moment().subtract(-7, 'days').toDate(), moment(-1).toDate()],
            '本周': [moment().startOf('week').toDate(), moment().endOf('week').toDate()],
            '上周': [moment().subtract(1, 'week').startOf('week').toDate(), moment().subtract(1, 'week').endOf('week').toDate()]
        }
    }
};

singlePickerOptionsFunc = function(startDate,endDate,minDate,isSingleFlag) {
    return {
        "showDropdowns": true,
        //"alwaysShowCalendars": true,
        //"singleDatePicker": true,
        "singleDatePicker": isSingleFlag==undefined?false:isSingleFlag,
        "autoApply": true,
        "alwaysShowCalendars": false,
        "startDate": transformDate(endDate),
        "endDate": transformDate(endDate),
        "minDate": transformDate(minDate),
        "maxDate": transformDate(endDate),
        "locale": {
            "format": "MM/DD/YYYY",
            "separator": " - ",
            "applyLabel": "确认",
            "cancelLabel": "取消",
            "fromLabel": "从",
            "toLabel": "至",
            "customRangeLabel": "自定义",
            "daysOfWeek": [
                "日",
                "一",
                "二",
                "三",
                "四",
                "五",
                "六"
            ],
            "monthNames": [
                "一月",
                "二月",
                "三月",
                "四月",
                "五月",
                "六月",
                "七月",
                "八月",
                "九月",
                "十月",
                "十一月",
                "十二月"
            ],
            "firstDay": 0
        },
        "ranges": {
            '最近7天': [moment().subtract(-7, 'days').toDate(), moment(-1).toDate()],
            '本周': [moment().startOf('week').toDate(), moment().endOf('week').toDate()],
            '上周': [moment().subtract(1, 'week').startOf('week').toDate(), moment().subtract(1, 'week').endOf('week').toDate()]
        }
    }
};