package com.aihuishou.bi.utils;

import com.aihuishou.bi.core.SysConf;
import org.apache.commons.lang3.StringUtils;

import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;

/**
 * 并发环境
 * @author yule.zhnag
 *
 */
public class ConcurrentDateFormat {

    /**
     * java 1.8 +
     * @param dateStr
     * @return
     * @throws ParseException
     */
	/*private static ThreadLocal<DateFormat> threadLocal = ThreadLocal.withInitial(() -> {
        return new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
    });*/

    /**
     * java1.8 +
     */
	private static ThreadLocal<DateFormat> threadLocal = ThreadLocal.withInitial(() -> new SimpleDateFormat(SysConf.PARAM_DATE_FORMATTER));
    private static ThreadLocal<DateFormat> threadLocalH = ThreadLocal.withInitial(() -> new SimpleDateFormat(SysConf.PARAM_DATE_FORMATTER_H));
    private static ThreadLocal<DateFormat> threadLocalHM = ThreadLocal.withInitial(() -> new SimpleDateFormat(SysConf.PARAM_DATE_FORMATTER_HM));
    private static ThreadLocal<DateFormat> threadLocalHMS = ThreadLocal.withInitial(() -> new SimpleDateFormat(SysConf.PARAM_TIME_FORMATTER_HMS));
    private static ThreadLocal<DateFormat> threadLocalHMSSSS = ThreadLocal.withInitial(() -> new SimpleDateFormat(SysConf.PARAM_DATE_FORMATTER_HMS_SSS));

    public static Date parse(String dateStr) throws ParseException {
        return threadLocal.get().parse(dateStr);
    }

    public static String format(Date date) {
        return threadLocal.get().format(date);
    }

    public static String formatHMS(Date date) {
        return threadLocalHMS.get().format(date);
    }

    public static Date parseToDate(String str) {
        if (StringUtils.isBlank(str)) {
            return null;
        }
        Date date;
        DateFormat sdf = threadLocal.get();
        try {
            int length = str.length();
            if (length == SysConf.PARAM_DATE_FORMATTER_HMS_SSS.length()) {
                sdf = threadLocalHMSSSS.get();
            } else if (length == SysConf.PARAM_TIME_FORMATTER_HMS.length()) {
                sdf = threadLocalHMS.get();
            } else if (length == SysConf.PARAM_DATE_FORMATTER_HM.length()) {
                sdf = threadLocalHM.get();
            } else if (length == SysConf.PARAM_DATE_FORMATTER_H.length()) {
                sdf = threadLocalH.get();
            }
            date = sdf.parse(str);
        } catch (ParseException e) {
            e.printStackTrace();
            return null;
        }
        return date;
    }

    public static java.sql.Date strToSqlDate(String strDate) {
        DateFormat sf = threadLocal.get();
        Date date = null;
        try {
            date = sf.parse(strDate);
        } catch (ParseException e) {
            e.printStackTrace();
        }
        return new java.sql.Date(date.getTime());
    }
}
