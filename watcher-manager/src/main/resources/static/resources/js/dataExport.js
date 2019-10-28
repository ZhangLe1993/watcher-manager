    function exportFile(data,appHeader,paraValue,flag){    //data数据源，appHeader标头，paraValue查询属性，flag只是标志(一般随意)
            /**
             *
             * Licensed under the MIT License, http://opensource.org/licenses/mit-license
             */
            var defaults = {
                consoleLog: false,
                csvEnclosure: '"',
                csvSeparator: ',',
                csvUseBOM: true,
                displayTableName: false,
                escape: false,
                excelstyles: [], // e.g. ['border-bottom', 'border-top', 'border-left', 'border-right']
                fileName: 'tableExport',
                htmlContent: false,
                ignoreColumn: [],
                ignoreRow:[],
                jsonScope: 'all', // head, data, all
                jspdf: {orientation: 'p',
                    unit: 'pt',
                    format: 'a4', // jspdf page format or 'bestfit' for autmatic paper format selection
                    margins: {left: 20, right: 10, top: 10, bottom: 10},
                    autotable: {styles: {cellPadding: 2,
                        rowHeight: 12,
                        fontSize: 8,
                        fillColor: 255,        // color value or 'inherit' to use css background-color from html table
                        textColor: 50,         // color value or 'inherit' to use css color from html table
                        fontStyle: 'normal',   // normal, bold, italic, bolditalic or 'inherit' to use css font-weight and fonst-style from html table
                        overflow: 'ellipsize', // visible, hidden, ellipsize or linebreak
                        halign: 'left',        // left, center, right
                        valign: 'middle'       // top, middle, bottom
                    },
                        headerStyles: {fillColor: [52, 73, 94],
                            textColor: 255,
                            fontStyle: 'bold',
                            halign: 'center'
                        },
                        alternateRowStyles: {fillColor: 245
                        },
                        tableExport: {onAfterAutotable: null,
                            onBeforeAutotable: null,
                            onTable: null
                        }
                    }
                },
                numbers: {html: {decimalMark: '.',
                    thousandsSeparator: ','
                },
                    output: {decimalMark: '.',
                        thousandsSeparator: ','
                    }
                },
                onCellData: null,
                onCellHtmlData: null,
                outputMode: 'file', // 'file', 'string' or 'base64'
                tbodySelector: 'tr',
                theadSelector: 'tr',
                tableName: 'myTableName',
                type: 'csv', // 'csv', 'txt', 'sql', 'json', 'xml', 'excel', 'doc', 'png' or 'pdf'
                worksheetName: 'xlsWorksheetName'
            };

            var FONT_ROW_RATIO = 1.15;
            var el = this;
            var DownloadEvt = null;
            var $hrows = [];
            var $rows = [];
            var rowIndex = 0;
            var rowspans = [];
            var trData = '';
            var colNames = [];

//            var sqldata=eval('(' + data + ')');
            var sqldata=data;

            colNames = GetColumnNames (el);

            if (defaults.type == 'csv' || defaults.type == 'txt') {

                var csvData = "";
                var rowlength = 0;
                rowIndex = 0;
                if(flag=="cusStatistics"){
                    csvData=appHeader[0]+appHeader[1]+appHeader[2]+appHeader[3]+appHeader[4]+"\n";
                    for(var i=0;i<sqldata.length;i++){
                        var temp=parseInt(sqldata[i][paraValue[1]])+parseInt(sqldata[i][paraValue[2]]);
                        csvData+=sqldata[i][paraValue[0]]+","+sqldata[i][paraValue[1]]+","+sqldata[i][paraValue[2]]+","+sqldata[i][paraValue[3]]+","+temp+"\n";
                    }
                }else if(flag=="data"){
                    for(var k=0;k<appHeader.length;k++){
                        csvData+=appHeader[k];
                    }
                    csvData+="\n";
                    var keyVal=[];
                    for(var key in sqldata){
                        keyVal.push(key);
                    }
                    for(var n=0;n<sqldata[keyVal[0]].length;n++){
                        for(var m=0;m<keyVal.length;m++){
                            csvData+=sqldata[keyVal[m]][n]+",";
                        }
                        csvData+="\n";
                    }
                }else if("dataCommon"){
                    for(var k=0;k<appHeader.length;k++){
                        csvData+=appHeader[k];
                    }
                    csvData+="\n";
                    var keyVal=[];
                    for(var key in sqldata[0]){
                        keyVal.push(key);
                    }
                    for(var m=0;m<sqldata.length;m++){
                        for(var n=0;n<keyVal.length;n++){
                            csvData+=sqldata[m][keyVal[n]]+",";
                        }
                        csvData+="\n";
                    }
                }else{
                     for(var k=0;k<appHeader.length;k++){
                         csvData+=appHeader[k];
                     }
                     csvData+="\n";
                     for(var m=0;m<sqldata.length;m++){
                         for(var n=0;n<paraValue.length;n++){
                             csvData+=sqldata[m][paraValue[n]]+",";
                         }
                         csvData+="\n";
                     }
                 }

                csvData += "\n";

                //output
                if (defaults.consoleLog === true)
                    console.log(csvData);

                if (defaults.outputMode === 'string')
                    return csvData;

                if (defaults.outputMode === 'base64')
                    return base64encode(csvData);

                try {
                    var blob = new Blob([csvData], {type: "text/" + (defaults.type == 'csv' ? 'csv' : 'plain') + ";charset=utf-8"});
                    saveAs(blob, defaults.fileName + '.' + defaults.type, (defaults.type != 'csv' || defaults.csvUseBOM === false));
                }
                catch (e) {
                    downloadFile(defaults.fileName + '.' + defaults.type,
                        'data:text/' + (defaults.type == 'csv' ? 'csv' : 'plain') + ';charset=utf-8,' + ((defaults.type == 'csv' && defaults.csvUseBOM)? '\ufeff' : ''),
                        csvData);
                }

            }

            function FindColObject (objects, colIndex, rowIndex) {
                var result = null;
                $.each(objects, function () {
                    if (this.rowIndex == rowIndex && this.key == colIndex) {
                        result = this;
                        return false;
                    }
                });
                return result;
            }

            function GetColumnNames (table) {
                var result = [];
                $(table).find('thead').first().find('th').each(function(index, el) {
                    if ($(el).attr("data-field") !== undefined)
                        result[index] = $(el).attr("data-field");
                });
                return result;
            }

            function isColumnIgnored($row, colIndex) {
                var result = false;
                if (defaults.ignoreColumn.length > 0) {
                    if (typeof defaults.ignoreColumn[0] == 'string') {
                        if (colNames.length > colIndex && typeof colNames[colIndex] != 'undefined')
                            if ($.inArray(colNames[colIndex], defaults.ignoreColumn) != -1)
                                result = true;
                    }
                    else if (typeof defaults.ignoreColumn[0] == 'number') {
                        if ($.inArray(colIndex, defaults.ignoreColumn) != -1 ||
                            $.inArray(colIndex-$row.length, defaults.ignoreColumn) != -1)
                            result = true;
                    }
                }
                return result;
            }

            function ForEachVisibleCell(tableRow, selector, rowIndex, rowCount, cellcallback) {
                if ($.inArray(rowIndex, defaults.ignoreRow) == -1 &&
                    $.inArray(rowIndex-rowCount, defaults.ignoreRow) == -1) {

                    var $row = $(tableRow).filter(function() {
                        return $(this).data("tableexport-display") != 'none' &&
                            ($(this).is(':visible') ||
                            $(this).data("tableexport-display") == 'always' ||
                            $(this).closest('table').data("tableexport-display") == 'always');
                    }).find(selector);

                    var rowColspan = 0;
                    var rowColIndex = 0;

                    $row.each(function (colIndex) {
                        if ($(this).data("tableexport-display") == 'always' ||
                            ($(this).css('display') != 'none' &&
                            $(this).css('visibility') != 'hidden' &&
                            $(this).data("tableexport-display") != 'none')) {
                            if (isColumnIgnored($row, colIndex) == false) {
                                if (typeof (cellcallback) === "function") {
                                    var c, Colspan = 0;
                                    var r, Rowspan = 0;

                                    // handle rowspans from previous rows
                                    if (typeof rowspans[rowIndex] != 'undefined' && rowspans[rowIndex].length > 0) {
                                        for (c = 0; c <= colIndex; c++) {
                                            if (typeof rowspans[rowIndex][c] != 'undefined') {
                                                cellcallback(null, rowIndex, c);
                                                delete rowspans[rowIndex][c];
                                                colIndex++;
                                            }
                                        }
                                    }
                                    rowColIndex = colIndex;

                                    if ($(this).is("[colspan]")) {
                                        Colspan = parseInt($(this).attr('colspan'));
                                        rowColspan += Colspan > 0 ? Colspan - 1 : 0;
                                    }

                                    if ($(this).is("[rowspan]"))
                                        Rowspan = parseInt($(this).attr('rowspan'));

                                    // output content of current cell
                                    cellcallback(this, rowIndex, colIndex);

                                    // handle colspan of current cell
                                    for (c = 0; c < Colspan - 1; c++)
                                        cellcallback(null, rowIndex, colIndex + c);

                                    // store rowspan for following rows
                                    if (Rowspan) {
                                        for (r = 1; r < Rowspan; r++) {
                                            if (typeof rowspans[rowIndex + r] == 'undefined')
                                                rowspans[rowIndex + r] = [];

                                            rowspans[rowIndex + r][colIndex + rowColspan] = "";

                                            for (c = 1; c < Colspan; c++)
                                                rowspans[rowIndex + r][colIndex + rowColspan - c] = "";
                                        }
                                    }
                                }
                            }
                        }
                    });
                    // handle rowspans from previous rows
                    if (typeof rowspans[rowIndex] != 'undefined' && rowspans[rowIndex].length > 0) {
                        for (c = 0; c <= rowspans[rowIndex].length; c++) {
                            if (typeof rowspans[rowIndex][c] != 'undefined') {
                                cellcallback(null, rowIndex, c);
                                delete rowspans[rowIndex][c];
                            }
                        }
                    }
                }
            }

            function jsPdfOutput(doc) {
                if (defaults.consoleLog === true)
                    console.log(doc.output());

                if (defaults.outputMode === 'string')
                    return doc.output();

                if (defaults.outputMode === 'base64')
                    return base64encode(doc.output());

                try {
                    var blob = doc.output('blob');
                    saveAs(blob, defaults.fileName + '.pdf');
                }
                catch (e) {
                    downloadFile(defaults.fileName + '.pdf',
                        'data:application/pdf;base64,',
                        doc.output());
                }
            }

            function prepareAutoTableText (cell, data, cellopt) {
                var cs = 0;
                if ( typeof cellopt != 'undefined' )
                    cs = cellopt.colspan;

                if ( cs >= 0 ) {
                    // colspan handling
                    var cellWidth = cell.width;
                    var textPosX = cell.textPos.x;
                    var i = data.table.columns.indexOf(data.column);

                    for (var c = 1; c < cs; c++) {
                        var column = data.table.columns[i+c];
                        cellWidth += column.width;
                    }

                    if ( cs > 1 ) {
                        if ( cell.styles.halign === 'right' )
                            textPosX = cell.textPos.x + cellWidth - cell.width;
                        else if ( cell.styles.halign === 'center' )
                            textPosX = cell.textPos.x + (cellWidth - cell.width) / 2;
                    }

                    cell.width = cellWidth;
                    cell.textPos.x = textPosX;

                    if ( typeof cellopt != 'undefined' && cellopt.rowspan > 1 )
                        cell.height = cell.height * cellopt.rowspan;

                    // fix jsPDF's calculation of text position
                    if ( cell.styles.valign === 'middle' || cell.styles.valign === 'bottom' ) {
                        var splittedText = typeof cell.text === 'string' ? cell.text.split(/\r\n|\r|\n/g) : cell.text;
                        var lineCount = splittedText.length || 1;
                        if (lineCount > 2)
                            cell.textPos.y -= ((2 - FONT_ROW_RATIO) / 2 * data.row.styles.fontSize) * (lineCount-2) / 3 ;
                    }
                    return true;
                }
                else
                    return false; // cell is hidden (colspan = -1), don't draw it
            }

            function drawCellElements (cell, elements, teOptions) {
                elements.each(function () {
                    var kids = $(this).children();

                    if ( $(this).is("div") ) {
                        var bcolor = rgb2array(getStyle(this, 'background-color'), [255, 255, 255]);
                        var lcolor = rgb2array(getStyle(this, 'border-top-color'), [0, 0, 0]);
                        var lwidth = getPropertyUnitValue(this, 'border-top-width', defaults.jspdf.unit);

                        var r = this.getBoundingClientRect();
                        var ux = this.offsetLeft * teOptions.dw;
                        var uy = this.offsetTop * teOptions.dh;
                        var uw = r.width * teOptions.dw;
                        var uh = r.height * teOptions.dh;

                        teOptions.doc.setDrawColor.apply (undefined, lcolor);
                        teOptions.doc.setFillColor.apply (undefined, bcolor);
                        teOptions.doc.setLineWidth (lwidth);
                        teOptions.doc.rect(cell.x + ux, cell.y + uy, uw, uh, lwidth ? "FD" : "F");
                    }

                    if (typeof kids != 'undefined' && kids.length > 0)
                        drawCellElements (cell, kids, teOptions);
                });
            }

            function escapeRegExp(string) {
                return string.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
            }

            function replaceAll(string, find, replace) {
                return string.replace(new RegExp(escapeRegExp(find), 'g'), replace);
            }

            // Takes a string and encapsulates it (by default in double-quotes) if it
            // contains the csv field separator, spaces, or linebreaks.
            function csvString(cell, rowIndex, colIndex) {
                var result = '';

                if (cell != null) {
                    var dataString = parseString(cell, rowIndex, colIndex);

                    var csvValue = (dataString === null || dataString == '') ? '' : dataString.toString();

                    if (dataString instanceof Date)
                        result = defaults.csvEnclosure + dataString.toLocaleString() + defaults.csvEnclosure;
                    else {
                        result = replaceAll(csvValue, defaults.csvEnclosure, defaults.csvEnclosure + defaults.csvEnclosure);

                        if (result.indexOf(defaults.csvSeparator) >= 0 || /[\r\n ]/g.test(result))
                            result = defaults.csvEnclosure + result + defaults.csvEnclosure;
                    }
                }

                return result;
            }

            function parseNumber(value) {
                value = value || "0";
                value = replaceAll(value, defaults.numbers.html.decimalMark, '.');
                value = replaceAll(value, defaults.numbers.html.thousandsSeparator, '');

                return typeof value === "number" || jQuery.isNumeric(value) !== false ? value : false;
            }


            function parseString(cell, rowIndex, colIndex) {
                var result = '';

                if (cell != null) {
                    var $cell = $(cell);
                    var htmlData;

                    if ($cell[0].hasAttribute("data-tableexport-value"))
                        htmlData = $cell.data("tableexport-value");
                    else
                        htmlData = $cell.html();

                    if (typeof defaults.onCellHtmlData === 'function')
                        htmlData = defaults.onCellHtmlData($cell, rowIndex, colIndex, htmlData);

                    if (defaults.htmlContent === true) {
                        result = $.trim(htmlData);
                    }
                    else {
                        var text = htmlData.replace(/\n/g,'\u2028').replace(/<br\s*[\/]?>/gi, '\u2060');
                        var obj = $('<div/>').html(text).contents();
                        text = '';
                        $.each(obj.text().split("\u2028"), function(i, v) {
                            if (i > 0)
                                text += " ";
                            text += $.trim(v);
                        });

                        $.each(text.split("\u2060"), function(i, v) {
                            if (i > 0)
                                result += "\n";
                            result += $.trim(v).replace(/\u00AD/g, ""); // remove soft hyphens
                        });

                        if (defaults.numbers.html.decimalMark != defaults.numbers.output.decimalMark ||
                            defaults.numbers.html.thousandsSeparator != defaults.numbers.output.thousandsSeparator) {
                            var number = parseNumber (result);

                            if ( number !== false ) {
                                var frac = ("" + number).split('.');
                                if ( frac.length == 1 )
                                    frac[1] = "";
                                var mod = frac[0].length > 3 ? frac[0].length % 3 : 0;

                                result = (number < 0 ? "-" : "") +
                                    (defaults.numbers.output.thousandsSeparator ? ((mod ? frac[0].substr(0, mod) + defaults.numbers.output.thousandsSeparator : "") + frac[0].substr(mod).replace(/(\d{3})(?=\d)/g, "$1" + defaults.numbers.output.thousandsSeparator)) : frac[0]) +
                                    (frac[1].length ? defaults.numbers.output.decimalMark + frac[1] : "");
                            }
                        }
                    }

                    if (defaults.escape === true) {
                        result = escape(result);
                    }

                    if (typeof defaults.onCellData === 'function') {
                        result = defaults.onCellData($cell, rowIndex, colIndex, result);
                    }
                }

                return result;
            }

            function hyphenate(a, b, c) {
                return b + "-" + c.toLowerCase();
            }

            function rgb2array(rgb_string, default_result) {
                var re = /^rgb\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3})\)$/;
                var bits = re.exec(rgb_string);
                var result = default_result;
                if (bits)
                    result = [ parseInt(bits[1]), parseInt(bits[2]), parseInt(bits[3]) ];
                return result;
            }

            function getCellStyles (cell) {
                var a = getStyle(cell, 'text-align');
                var fw = getStyle(cell, 'font-weight');
                var fs = getStyle(cell, 'font-style');
                var f = '';
                if (a == 'start')
                    a = getStyle(cell, 'direction') == 'rtl' ? 'right' : 'left';
                if (fw >= 700)
                    f = 'bold';
                if (fs == 'italic')
                    f += fs;
                if (f == '')
                    f = 'normal';

                var result = {
                    style: {
                        align: a,
                        bcolor: rgb2array(getStyle(cell, 'background-color'), [255, 255, 255]),
                        color: rgb2array(getStyle(cell, 'color'), [0, 0, 0]),
                        fstyle: f
                    },
                    colspan: (parseInt($(cell).attr('colspan')) || 0),
                    rowspan: (parseInt($(cell).attr('rowspan')) || 0)
                };

                if (cell !== null) {
                    var r = cell.getBoundingClientRect();
                    result.rect = {
                        width: r.width,
                        height: r.height
                    };
                }

                return result;
            }

            // get computed style property
            function getStyle(target, prop) {
                try {
                    if (window.getComputedStyle) { // gecko and webkit
                        prop = prop.replace(/([a-z])([A-Z])/, hyphenate);  // requires hyphenated, not camel
                        return window.getComputedStyle(target, null).getPropertyValue(prop);
                    }
                    if (target.currentStyle) { // ie
                        return target.currentStyle[prop];
                    }
                    return target.style[prop];
                }
                catch (e) {
                }
                return "";
            }

            function getUnitValue(parent, value, unit) {
                var baseline = 100;  // any number serves

                var temp = document.createElement("div");  // create temporary element
                temp.style.overflow = "hidden";  // in case baseline is set too low
                temp.style.visibility = "hidden";  // no need to show it

                parent.appendChild(temp); // insert it into the parent for em, ex and %

                temp.style.width = baseline + unit;
                var factor = baseline / temp.offsetWidth;

                parent.removeChild(temp);  // clean up

                return (value * factor);
            }

            function getPropertyUnitValue(target, prop, unit) {
                var value = getStyle(target, prop);  // get the computed style value

                var numeric = value.match(/\d+/);  // get the numeric component
                if (numeric !== null) {
                    numeric = numeric[0];  // get the string

                    return getUnitValue (target.parentElement, numeric, unit);
                }
                return 0;
            }

            function downloadFile(filename, header, data) {

                var ua = window.navigator.userAgent;
                if (ua.indexOf("MSIE ") > 0 || !!ua.match(/Trident.*rv\:11\./)) {
                    // Internet Explorer (<= 9) workaround by Darryl (https://github.com/dawiong/tableExport.jquery.plugin)
                    // based on sampopes answer on http://stackoverflow.com/questions/22317951
                    // ! Not working for json and pdf format !
                    var frame = document.createElement("iframe");

                    if (frame) {
                        document.body.appendChild(frame);
                        frame.setAttribute("style", "display:none");
                        frame.contentDocument.open("txt/html", "replace");
                        frame.contentDocument.write(data);
                        frame.contentDocument.close();
                        frame.focus();

                        frame.contentDocument.execCommand("SaveAs", true, filename);
                        document.body.removeChild(frame);
                    }
                }
                else {
                    var DownloadLink = document.createElement('a');

                    if (DownloadLink) {
                        DownloadLink.style.display = 'none';
                        DownloadLink.download = filename;

                        if (header.toLowerCase().indexOf("base64,") >= 0)
                            DownloadLink.href = header + base64encode(data);
                        else
                            DownloadLink.href = header + encodeURIComponent(data);

                        document.body.appendChild(DownloadLink);

                        if (document.createEvent) {
                            if (DownloadEvt == null)
                                DownloadEvt = document.createEvent('MouseEvents');

                            DownloadEvt.initEvent('click', true, false);
                            DownloadLink.dispatchEvent(DownloadEvt);
                        }
                        else if (document.createEventObject)
                            DownloadLink.fireEvent('onclick');
                        else if (typeof DownloadLink.onclick == 'function')
                            DownloadLink.onclick();

                        document.body.removeChild(DownloadLink);
                    }
                }
            }

            function utf8Encode(string) {
                string = string.replace(/\x0d\x0a/g, "\x0a");
                var utftext = "";
                for (var n = 0; n < string.length; n++) {
                    var c = string.charCodeAt(n);
                    if (c < 128) {
                        utftext += String.fromCharCode(c);
                    }
                    else if ((c > 127) && (c < 2048)) {
                        utftext += String.fromCharCode((c >> 6) | 192);
                        utftext += String.fromCharCode((c & 63) | 128);
                    }
                    else {
                        utftext += String.fromCharCode((c >> 12) | 224);
                        utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                        utftext += String.fromCharCode((c & 63) | 128);
                    }
                }
                return utftext;
            }

            function base64encode(input) {
                var keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
                var output = "";
                var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
                var i = 0;
                input = utf8Encode(input);
                while (i < input.length) {
                    chr1 = input.charCodeAt(i++);
                    chr2 = input.charCodeAt(i++);
                    chr3 = input.charCodeAt(i++);
                    enc1 = chr1 >> 2;
                    enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
                    enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
                    enc4 = chr3 & 63;
                    if (isNaN(chr2)) {
                        enc3 = enc4 = 64;
                    } else if (isNaN(chr3)) {
                        enc4 = 64;
                    }
                    output = output +
                        keyStr.charAt(enc1) + keyStr.charAt(enc2) +
                        keyStr.charAt(enc3) + keyStr.charAt(enc4);
                }
                return output;
            }
            return this;
    }