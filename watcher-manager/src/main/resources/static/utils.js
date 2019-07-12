Date.prototype.format = function (fmt) {
    var o = {
        "M+": this.getMonth() + 1,
        "d+": this.getDate(),
        "h+": this.getHours(),
        "m+": this.getMinutes(),
        "s+": this.getSeconds(),
        "q+": Math.floor((this.getMonth() + 3) / 3),
        "S": this.getMilliseconds()
    };
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
    for (var k in o) {
        if (new RegExp("(" + k + ")").test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        }
    }
    return fmt;
};

Date.prototype.getNewDate = function (count) {

    this.setDate(this.getDate() + count);
    var year = this.getFullYear();
    var month = this.getMonth() + 1;
    var day = this.getDate();
    if (month < 10) {
        month = "0" + month
    }
    if (day < 10) {
        day = "0" + day
    }
    return year + "-" + month + "-" + day;
};

getDateList = function (startDate, endDate) {
    var ret = [];
    var i = 0;
    var diff = Math.abs(new Date(endDate) - new Date(startDate)) / 1000 / 60 / 60 / 24;
    while (i <= diff) {
        var dt = new Date(startDate).getNewDate(i);
        ret.push(dt);
        i++;
    }
    return ret;
};

Array.prototype.sum = function () {
    if (this.length > 0) {
        return this.reduce(function (partial, value) {
            return partial == undefined ? 0 : partial + (value == undefined ? 0 : value);
        })
    } else {
        return 0;
    }
};
Array.prototype.getNotContained = function (b) {

    var aStr = this.toString();
    var ret = [];
    for (var i = 0, len = b.length; i < len; i++) {
        if (aStr.indexOf(b[i]) == -1) {
            ret.push(b[i])
        }
    }
    return ret.sort();
};

Array.prototype.contains = function (ele) {
    var i = this.length;
    while (i--) {
        if (this[i] === ele) {
            return true;
        }
    }
    return false;
}

Array.prototype.similarContains = function (ele) {
    var i = this.length;
    while (i--) {
        if (this[i].indexOf(ele) > -1) {
            return true;
        }
    }
    return false;
}

Array.prototype.remove = function (val) {
    var index = this.indexOf(val);
    if (index > -1) {
        this.splice(index, 1);
    }
};
var shallowProperty = function (key) {
    return function (obj) {
        return obj == null ? void 0 : obj[key];
    };
};
Array.prototype.unzip = function () {
    var length = this && _.max(this, shallowProperty('length')).length || 0;// 返回数组中的元素的最长长度
    var result = Array(length);

    for (var index = 0; index < length; index++) {
        result[index] = _.pluck(this, index);// map(array, _.property(index))
    }
    return result;
};

isMobile = function () {
    var ua = navigator.userAgent.toLowerCase();
    var isAndroid = ua.indexOf("android") > -1;
    var isiOS = ua.indexOf("iphone") > -1;
    var mobile = false;
    if (isAndroid || isiOS) {
        //$('.sidebar-toggle').click();
        mobile = true;
    }
    return mobile
}
isNaNFunc = function (value) {
    return isNaN(value) ? 0 : value
}
//小数相加 解决精度问题
Number.prototype.addFloat = function (num) {
    var baseNum, baseNum1, baseNum2;
    try {
        baseNum1 = this.toString().split(".")[1].length;
    } catch (e) {
        baseNum1 = 0;
    }
    try {
        baseNum2 = num.toString().split(".")[1].length;
    } catch (e) {
        baseNum2 = 0;
    }
    baseNum = Math.pow(10, Math.max(baseNum1, baseNum2));
    return (this * baseNum + num * baseNum) / baseNum;
};
//除数是0
String.prototype.avoidInfinity = function () {
    if (isFinite(this)) {
        return this.toString()
    } else {
        return "0"
    }
};

Number.prototype.divide = function (arg2) {
    var t1 = 0, t2 = 0, r1, r2;
    try {
        t1 = this.toString().split(".")[1].length;
    }
    catch (e) {
    }
    try {
        t2 = arg2.toString().split(".")[1].length;
    }
    catch (e) {
    }
    with (Math) {
        r1 = Number(this.toString().replace(".", ""));
        r2 = Number(arg2.toString().replace(".", ""));
        return (r1 / r2) * pow(10, t2 - t1);
    }
};

String.prototype.cformat = function () {
    return this.replace(
        /\B(?=(\d{3})+(?!\d))/g, ","
    );
};

// Accounts.config({
//     loginExpirationInDays: 1
// });

// subs = new SubsManager({
//     cacheLimit: 100,
//     expireIn: 30
// });

/*获取当前周数*/
year_week_num = function () {
    var now = new Date();

    //每月多少日
    var monthOfFullDay = new Array(31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31);

    //当前日，在本年中第几日
    var currentDayOfYear = 0;

    //是否为润年，即能被4整除
    var isFullYear = false;

    var currentDayOfWeekIsLastDay = false;

    var firstDayOfYearIsFirstDayOfWeek = false;

    //当前年份
    var year = 0;
    if (now.getYear() >= 2000)
        year = now.getYear();
    else
        year = now.getYear() + 1900;

    //当前月份
    var month = now.getMonth();

    //当前日
    var day = now.getDate();

    //当前星期几
    var week = now.getDay();

    //为闰年，设isFullYear为true
    if (year % 4 == 0) {
        isFullYear = true;
    }


    //循环计算天数
    for (var i = 0; i < monthOfFullDay.length; i++) {
        //判断数组月份是否小于等于当前月份
        if (i < month) {
            //是闰年和2月份
            if (isFullYear && i == 1)
                currentDayOfYear = currentDayOfYear + 29;
            else
                currentDayOfYear = currentDayOfYear + monthOfFullDay[i];

        }
        if (i == month)
            currentDayOfYear = currentDayOfYear + day;
    }

    //设置本年1月1日
    var firstDayOfYear = new Date();
    firstDayOfYear.setYear(year);
    firstDayOfYear.setMonth(0);
    firstDayOfYear.setDate(1);

    if (firstDayOfYear.getDay() == 0) {
        firstDayOfYearIsFirstDayOfWeek = true;
    }

    var weeksOfYear = currentDayOfYear;

    //本星期是否为最后一日，否，则减去本兴起所有日
    if (!currentDayOfWeekIsLastDay) {
        weeksOfYear = weeksOfYear + firstDayOfYear.getDay();
    }

    //是否第一个星期为第一日（即星期日），否，则减去本星期所有日
    if (!firstDayOfYearIsFirstDayOfWeek) {
        weeksOfYear = weeksOfYear + (7 - week - 1);
    }

    var a = now.getDay();
    var twRawStart = new Date(now.getTime() - (a - 1) * 24 * 60 * 60 * 1000);
    var twRawEnd = now;
    var twStart = twRawStart.format("yyyy-MM-dd");
    var twEnd = twRawEnd.format("yyyy-MM-dd");
    var week = weeksOfYear / 7;
    return week;
};

function getUserId() {
    // if (Meteor.user()) {
    //     return Meteor.user().profile.name
    // } else {
    return "0"
    // }
}

getSecretKey = function (path) {
    var dfd = $.Deferred();
    // if (Meteor.isClient) {
    //     var userID = getUserId();
    //     Meteor.call('getSecretKey', {userId: userID, path: path}, function (error, result) {
    //         dfd.resolve(result, userID);
    //     });
    //     return dfd.promise()
    // }
    $.get(path, function (result) {
        dfd.resolve(result, 0)
    })
    return dfd.promise();
};

//两日期相隔天数
getSomeDays = function (startDate, endDate) {
    if (Meteor.isClient) {
        return moment(endDate).diff(startDate, 'days')
    }
};

urlParamsProcess = function (query) {
    var params = Object.keys(query).map(function (k) {
        var val = query[k];
        if (val instanceof Array) {
            var retStr = "";
            val.forEach(function (ele) {
                retStr += k + encodeURIComponent('[]') + '=' + encodeURIComponent(ele) + "&"
            });
            if (retStr) {
                return retStr.substring(0, retStr.length - 1)
            } else {
                return k + encodeURIComponent('[]') + '='
            }

        } else {
            return encodeURIComponent(k) + '=' + encodeURIComponent(val)
        }
    }).join('&');
    return params
};

requestURL = function (path, query) {
    if (Meteor.isClient) {
        var params = urlParamsProcess(query);
        var url = path + "?" + params;
        //var url = path+"?"+ $.param(query);
        //console.log(url);
        var dfd = $.Deferred();
        getSecretKey(url).done(function (key, userID) {
            //console.log(key);
            if (key) {
                $.getJSON(path, query, function (result) {
                    dfd.resolve(result)
                }).error(function (result) {
                    dfd.resolve(result);
                });
            } else {
                dfd.resolve({"errMsg": "异常错误!"})
            }
        });
        return dfd.promise()
    }
};

requestURLPost = function (path, query) {
    if (Meteor.isClient) {
        var dfd = $.Deferred();
        // $.post(path, query, function (result) {
        //     dfd.resolve(result)
        // })
        $.ajax({
          type: 'POST',
          url: path,
          contentType: 'application/json',
          dataType: 'json',
          data: JSON.stringify(query),
          success: function(result) {
            dfd.resolve(result)
          }
        })
        return dfd.promise()
    }
};

getMSTRSession = function (path, query) {
    if (Meteor.isClient) {
        var params = Object.keys(query).map(function (k) {
            return encodeURIComponent(k) + '=' + encodeURIComponent(query[k])
        }).join('&');
        var url = path + "?" + params;
        var dfd = $.Deferred();
        getSecretKey(url).done(function (key) {
            if (key) {
                $.get(path, query, function (result) {
                    dfd.resolve(result)
                })
            } else {
                dfd.resolve({"errMsg": "异常错误!"})
            }
        });
        return dfd.promise()
    }
};

toolTipCustom = function () {
    if (Meteor.isClient) {
        $("[data-toggle='tooltip']").tooltip(/*{
            position: {
                my: "center bottom-20",
                at: "center top",
                using: function( position, feedback ) {
                    $( this ).css( position );
                    $( "<div>" )
                        .addClass( "arrow" )
                        .addClass( feedback.vertical )
                        .addClass( feedback.horizontal )
                        .appendTo( this );
                }
            }
        }*/);
    }
}

JSONToCSVConvertor = function (JSONData, ReportTitle, ShowLabel) {
    if (Meteor.isClient) {
        //If JSONData is not an object then JSON.parse will parse the JSON string in an Object
        var arrData = typeof JSONData != 'object' ? JSON.parse(JSONData) : JSONData;
        var CSV = '';
        //This condition will generate the Label/Header
        if (ShowLabel) {
            var row = "";
            //This loop will extract the label from 1st index of on array
            for (var index in arrData[0]) {
                //Now convert each value to string and comma-seprated
                row += index + ',';
            }
            row = row.slice(0, -1);
            //append Label row with line break
            CSV += row + '\r\n';
        }
        //1st loop is to extract each row
        for (var i = 0; i < arrData.length; i++) {
            var row = "";
            //2nd loop will extract each column and convert it in string comma-seprated
            for (var index in arrData[i]) {
                row += '"' + arrData[i][index] + '",';
            }
            row.slice(0, row.length - 1);
            //add a line break after each row
            CSV += row + '\r\n';
        }

        if (CSV == '') {
            alert("Invalid data");
            return;
        }
        var csv = "\ufeff" + CSV;
        blob = new Blob([csv], {type: 'text/csv,charset=UTF-8'});
        var csvUrl = (window.URL || window.webkitURL || {}).createObjectURL(blob);
        //var createObjectURL = (window.URL || window.webkitURL || {}).createObjectURL || function(){};
        var fileName = ReportTitle.replace(/ /g, "_");
        //this trick will generate a temp "a" tag
        var link = document.createElement("a");
        link.href = csvUrl;
        //set the visibility hidden so it will not effect on your web-layout
        link.style = "visibility:hidden";
        link.download = fileName + ".csv";
        //this part will append the anchor tag and remove it after automatic click
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

};

cleanParams = function (filter) {
    //clean parameters
    var query = _.clone(filter);
    for (var key in query) {
        if (!query[key] && key != "offset") {
            delete query[key]
        }
    }
    return query
};

renderOptions = function (sel, data) {
    $(sel).empty();
    data.forEach(function (ele) {
        $(sel).append("<option value='" + ele + "'>" + ele + "</option>")
    });
};

//根据账号类型以及账号具体权限进行判断，这样有利于代码后期的维护。
hideOwnNaviTab = function (permissionObjList) {
    //根据账号类型进行判断
    var accountType = Meteor.user().profile.type;
    if (accountType == 2) {
        var permissionList = _.map(permissionObjList, function (obj) {
            return obj.accessName
        })
        $('.own').hide();
        $('.otherservice').hide();
        var obid = Meteor.user().profile.name;

        var flag = true;
        permissionList.forEach(function (ele) {
            //判断是否拥有相应的具体权限。
            if (ele.indexOf("数据报表_第三方数据") >= 0) {
                //显示第三方数据
                $('.tp').show();
                if (flag) {
                    //点击第三方数据
                    $("#hrbank a").click();
                }
                flag = false;
            }
            if (ele.indexOf("数据报表_京东") >= 0) {
                //显示京东数据
                $('.jd').show();
                if (flag) {
                    //点击京东数据
                    $("#JDTradeMonitorJDOnly a").click();
                }
                flag = false;
            }
            if (ele.indexOf("数据报表_三星") >= 0) {
                //显示三星数据
                $('.sansung').show();
                if (flag) {
                    //点击三星数据
                    $("#venderSansungAreaInfo a").click();
                }
                flag = false;
            }
            if (ele.indexOf("数据报表_乐语") >= 0) {
                //显示乐语数据
                $('.leyu').show();
                if (flag) {
                    //点击乐语数据
                    $("#venderLeYuAreaInfo a").click();
                }
                flag = false;
            }
            if (ele.indexOf("数据报表_贵阳联通") >= 0) {
                //显示贵阳联通数据
                $('.guiyang').show();
                if (flag) {
                    //点击贵阳联通数据
                    $("#venderGYUnicomInfo a").click();
                }
                flag = false;
            }
            if (ele.indexOf("数据报表_华为") >= 0) {
                //显示华为数据
                $('.huawei').show();
                if (flag) {
                    //点击华为数据
                    $("#huaweiTradeMonitor a").click();
                }
                flag = false;
            }
        })
    }
    $("#ulSideNav").show()
};

autocompleteMultiple = function (inputName, data) {
    $(inputName)
    // don't navigate away from the field on tab when selecting an item
        .on("keydown", function (event) {
            if (event.keyCode === $.ui.keyCode.TAB &&
                $(this).autocomplete("instance").menu.active) {
                event.preventDefault();
            }
        })
        .autocomplete({
            minLength: 0,
            source: function (request, response) {
                // delegate back to autocomplete, but extract the last term
                response($.ui.autocomplete.filter(
                    data, (request.term).split(/,\s*/).pop()));
            },
            focus: function () {
                // prevent value inserted on focus
                return false;
            },
            select: function (event, ui) {
                var terms = (this.value).split(/,\s*/);
                // remove the current input
                terms.pop();
                // add the selected item
                terms.push(ui.item.value);
                // add placeholder to get the comma-and-space at the end
                terms.push("");
                this.value = terms.join(",");
                return false;
            }
        });
}

getAutocompleteMultipleSelectedFilter = function (params) {
    if (params == "" || params == "全部") {
        return null;
    } else {
        var tmpValue = params.split(",")
        var query = _.clone(tmpValue);
        for (var key in query) {
            if (query[key] == "") {
                delete query[key];
                query.length--;
            }
        }
        return query
    }
};

openPopup = function (param) {
    zeroModal.show({
        title: (param == undefined || param.title == undefined || param.title == '') ? '弹出层' : param.title,
        content: (param == undefined || param.content == undefined || param.content == '') ? '空空如也' : param.content,
        width: (param == undefined || param.width == undefined) ? '500px' : param.width,
        height: (param == undefined || param.height == undefined) ? '300px' : param.height,
        max: (param == undefined || param.max == undefined) ? false : param.max,
        min: (param == undefined || param.min == undefined) ? false : param.min,
        opacity: 0.8,
        ok: (param == undefined || param.ok == undefined) ? false : param.ok,
        cancel: (param == undefined || param.cancel == undefined) ? false : param.cancel,
        okFn: function (opt) {
            console.log(opt);
            return true;
        }
    });
};


//加法防止0.1不显示
accAdd = function (num1, num2) {
    num1 = Number(num1);
    num2 = Number(num2);
    var dec1, dec2, times;
    try {
        dec1 = countDecimals(num1) + 1;
    } catch (e) {
        dec1 = 0;
    }
    try {
        dec2 = countDecimals(num2) + 1;
    } catch (e) {
        dec2 = 0;
    }
    times = Math.pow(10, Math.max(dec1, dec2));
    // var result = (num1 * times + num2 * times) / times;
    var result = (accMul(num1, times) + accMul(num2, times)) / times;
    return getCorrectResult("add", num1, num2, result);
    // return result;
};

//减法防止0.1不显示
accSub = function (num1, num2) {
    num1 = Number(num1);
    num2 = Number(num2);
    var dec1, dec2, times;
    try {
        dec1 = countDecimals(num1) + 1;
    } catch (e) {
        dec1 = 0;
    }
    try {
        dec2 = countDecimals(num2) + 1;
    } catch (e) {
        dec2 = 0;
    }
    times = Math.pow(10, Math.max(dec1, dec2));
    // var result = Number(((num1 * times - num2 * times) / times);
    var result = Number((accMul(num1, times) - accMul(num2, times)) / times);
    return getCorrectResult("sub", num1, num2, result);
    // return result;
};
//÷法防止0.1不显示
accDiv = function (num1, num2) {
    num1 = Number(num1);
    num2 = Number(num2);
    var t1 = 0, t2 = 0, dec1, dec2;
    try {
        t1 = countDecimals(num1);
    } catch (e) {
    }
    try {
        t2 = countDecimals(num2);
    } catch (e) {
    }
    dec1 = convertToInt(num1);
    dec2 = convertToInt(num2);
    var result = accMul((dec1 / dec2), Math.pow(10, t2 - t1));
    return getCorrectResult("div", num1, num2, result);
    // return result;
};
//陈法防止0.1不显示
accMul = function (num1, num2) {
    num1 = Number(num1);
    num2 = Number(num2);
    var times = 0, s1 = num1.toString(), s2 = num2.toString();
    try {
        times += countDecimals(s1);
    } catch (e) {
    }
    try {
        times += countDecimals(s2);
    } catch (e) {
    }
    var result = convertToInt(s1) * convertToInt(s2) / Math.pow(10, times);
    return getCorrectResult("mul", num1, num2, result);
    // return result;
};

countDecimals = function (num) {
    var len = 0;
    try {
        num = Number(num);
        var str = num.toString().toUpperCase();
        if (str.split('E').length === 2) { // scientific notation
            var isDecimal = false;
            if (str.split('.').length === 2) {
                str = str.split('.')[1];
                if (parseInt(str.split('E')[0]) !== 0) {
                    isDecimal = true;
                }
            }
            var x = str.split('E');
            if (isDecimal) {
                len = x[0].length;
            }
            len -= parseInt(x[1]);
        } else if (str.split('.').length === 2) { // decimal
            if (parseInt(str.split('.')[1]) !== 0) {
                len = str.split('.')[1].length;
            }
        }
    } catch (e) {
        throw e;
    } finally {
        if (isNaN(len) || len < 0) {
            len = 0;
        }
        return len;
    }
};
convertToInt = function (num) {
    num = Number(num);
    var newNum = num;
    var times = countDecimals(num);
    var temp_num = num.toString().toUpperCase();
    if (temp_num.split('E').length === 2) {
        newNum = Math.round(num * Math.pow(10, times));
    } else {
        newNum = Number(temp_num.replace(".", ""));
    }
    return newNum;
};
getCorrectResult = function (type, num1, num2, result) {
    var temp_result = 0;
    switch (type) {
        case "add":
            temp_result = num1 + num2;
            break;
        case "sub":
            temp_result = num1 - num2;
            break;
        case "div":
            temp_result = num1 / num2;
            break;
        case "mul":
            temp_result = num1 * num2;
            break;
    }
    if (Math.abs(result - temp_result) > 1) {
        return temp_result;
    }
    return result;
};


getDateRangeArray = function (startDate, endDate, diffType) {
    var length = getDateRangeLength(startDate, endDate, diffType);
    var dateArray = [];
    //dateArray.push(startDate);
    //console.log(length);
    for (var i = 1; i <= length; i++) {
        dateArray.push(new Date(endDate).getNewDate(-i));
    }
    return dateArray.sort();
};

getDateRangeLength = function (startTime, endTime, diffType) {
    //将xxxx-xx-xx的时间格式，转换为 xxxx/xx/xx的格式
    startTime = startTime.replace(/\-/g, "/");
    endTime = endTime.replace(/\-/g, "/");
    //将计算间隔类性字符转换为小写
    diffType = diffType.toLowerCase();
    var sTime = new Date(startTime); //开始时间
    var eTime = new Date(endTime); //结束时间
    //作为除数的数字
    var timeType = 1;
    switch (diffType) {
        case"second":
            timeType = 1000;
            break;
        case"minute":
            timeType = 1000 * 60;
            break;
        case"hour":
            timeType = 1000 * 3600;
            break;
        case"day":
            timeType = 1000 * 3600 * 24;
            break;
        default:
            break;
    }
    return parseInt((eTime.getTime() - sTime.getTime()) / parseInt(timeType));
};

//爱机汇权限获取

//获取权限省份城市
getVenderCityPermission = function (controlName) {
    var filter = {};
    if (controlName.indexOf("全国") == -1) {
        if (_.contains(controlName, '#') && _.contains(controlName, '&')) {   //安徽/河南#济南*绍兴&七里河^新华
            var name = controlName.split('#'); //省份
            var provinceName = name[0].split('/');
            var cityName = name[1].split('&')[0].split('*'); //市
            var districtName = name[1].split('&')[1].split('$');  //县区
            filter.province = provinceName;
            filter.city = cityName;
            filter.district = districtName;
        } else if (_.contains(controlName, '#')) {   //安徽/河南#济南*绍兴
            var name = controlName.split('#');
            if (_.contains(name[1], '*')) {
                var provinceName = name[0].split('/');
                var cityName = name[1].split('*');
                filter.province = provinceName;
                filter.city = cityName;
            } else if (_.contains(name[1], '$')) {
                var provinceName = name[0].split('/');
                var districtName = name[1].split('$');
                filter.province = provinceName;
                filter.district = districtName;
            }
        } else if (_.contains(controlName, '&')) {   //济南*绍兴&七里河^新华
            var name = controlName.split('&');
            if (_.contains(name[0], '*')) {
                var cityName = name[0].split('*');
                var districtName = name[1].split('$');
                filter.city = cityName;
                filter.district = districtName;
            } else if (_.contains(name[0], '/')) {
                var provinceName = name[0].split('/');
                var districtName = name[1].split('$');
                filter.province = provinceName;
                filter.district = districtName;
            }
        } else if (_.contains(controlName, '*')) {  //济南*绍兴
            var cityName = controlName.split('*');
            filter.city = cityName;
        } else if (_.contains(controlName, '$')) {  //七里河^新华
            var districtName = controlName.split('$');
            filter.district = districtName;
        } else {                                    //安徽/河南
            var provinceName = controlName.split('/');
            filter.province = provinceName;
        }
    }
    return filter;
}


getCookie = function (name) {
    var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");

    if (arr = document.cookie.match(reg))

        return unescape(arr[2]);
    else
        return null;
}
// mstrServer = Meteor.settings.public.mstrService.server;