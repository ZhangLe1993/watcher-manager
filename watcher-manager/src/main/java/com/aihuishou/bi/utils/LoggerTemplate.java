package com.aihuishou.bi.utils;

import org.slf4j.Logger;

public class LoggerTemplate {

    public final static String PROJECT_NAME = "watcher-manager";

    public static String EXCEPTION_INFO_TEMPLATE = "【{}】接口异常，异常接口：【{}】，异常堆栈信息：{}";

    public static String EXCEPTION_INFO_ALERT_TEMPLATE = "异常接口：【%s】\n\r异常信息：%s";

    public static void error(Logger logger, String msg, Throwable e) {
        logger.error(EXCEPTION_INFO_TEMPLATE, PROJECT_NAME, msg, ExceptionInfo.toString(e));
        //httpUtils.sendMSGTo110("", String.format(alertTemplate, msg, e.getMessage()));
    }
}
