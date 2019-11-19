package com.aihuishou.bi.core;

import org.apache.ibatis.jdbc.SQL;

public class SysConf {
    public static int AUTH_ALLOWED_TIMEOUT = 60;//KA报表鉴权的时间 前后允许范围 单位秒
    public final static String URL_SEPARATOR = "/";
    public final static String OLD_FILE_FOLDER = "static/templates";
    public final static String REST_HTML_SUFFIX = ".html";
    public final static String REST_JS_SUFFIX = ".js";

    public final static String POINT_TYPE_START = "start";
    public final static String POINT_TYPE_END = "end";

    public final static String DAVINCI_SHARE_LINK_PREFIX_TEST = "http://47.97.240.5:8093/share.html";
    public final static String DAVINCI_SHARE_LINK_PREFIX = "http://47.97.240.5:8092/share.html";
    public final static String DAVINCI_SHARE_LINK_PREFIX_PROD = "https://abdavinci.aihuishou.com/share.html";

    public final static String PARAM_DATE_FORMATTER = "yyyy-MM-dd";

    public final static String PARAM_DATE_FORMATTER_H = "yyyy-MM-dd HH";

    public final static String PARAM_DATE_FORMATTER_HM = "yyyy-MM-dd HH:mm";

    public final static String PARAM_TIME_FORMATTER_HMS = "yyyy-MM-dd HH:mm:ss";

    public final static String PARAM_DATE_FORMATTER_HMS_SSS = "yyyy-MM-dd HH:mm:ss.SSS";


    public static String getLoadMountSQLById(String in) {
        String load = new SQL() {
            {
                SELECT("id, name, state, sort_no AS sortNo");
                FROM("bi_childless");
                WHERE("id in (" + in + ")");
            }
        }.toString();
        return load;
    }

    public static String getLoadNodeSQLById(String in) {
        String load = new SQL() {
            {
                SELECT("a.id, a.position, a.url, CONCAT_WS('/',e. NAME,d. NAME,c. NAME,b. NAME,a. NAME) AS name, a.mount, a.parent_position AS parentPosition, a.state, a.sort_no AS sortNo, a.genre");
                FROM("bi_nodes a");
                LEFT_OUTER_JOIN("bi_folder b ON a.parent_position = b.position");
                LEFT_OUTER_JOIN("bi_folder c ON b.parent_position = c.position");
                LEFT_OUTER_JOIN("bi_folder d ON c.parent_position = d.position");
                LEFT_OUTER_JOIN("bi_folder e ON d.parent_position = e.position");
                WHERE("a.id in (" + in + ")");
            }
        }.toString();
        return load;
    }

    public static String getLoadNodeSQLByParentId(String in) {
        String load = new SQL() {
            {
                SELECT("a.id, a.position, a.url, CONCAT_WS('/',e. NAME,d. NAME,c. NAME,b. NAME,a. NAME) AS name, a.mount, a.parent_position AS parentPosition, a.state, a.sort_no AS sortNo, a.genre");
                FROM("bi_nodes a");
                LEFT_OUTER_JOIN("bi_folder b ON a.parent_position = b.position");
                LEFT_OUTER_JOIN("bi_folder c ON b.parent_position = c.position");
                LEFT_OUTER_JOIN("bi_folder d ON c.parent_position = d.position");
                LEFT_OUTER_JOIN("bi_folder e ON d.parent_position = e.position");
                WHERE("a.parent_position in (" + in + ")");
            }
        }.toString();
        return load;
    }

    public static String getLoadFolderSQLById(String in) {
        String load = new SQL() {
            {
                SELECT("a.id, a.mount, a.name, a.position, a.parent_position AS parentPosition, CONCAT_WS('/', e.position, d.position,c.position,b.position,a.position) as path, a.sort_no AS sortNo");
                FROM("bi_folder a");
                LEFT_OUTER_JOIN("bi_folder b ON a.parent_position = b.position");
                LEFT_OUTER_JOIN("bi_folder c ON b.parent_position = c.position");
                LEFT_OUTER_JOIN("bi_folder d ON c.parent_position = d.position");
                LEFT_OUTER_JOIN("bi_folder e ON d.parent_position = e.position");
                WHERE("a.id in (" + in + ")");
            }
        }.toString();
        return load;
    }

    public static String getLoadFolderSQLByParentId(String in) {
        String load = new SQL() {
            {
                SELECT("a.id, a.mount, a.name, a.position, a.parent_position AS parentPosition, CONCAT_WS('/', e.position, d.position,c.position,b.position,a.position) as path, a.sort_no AS sortNo");
                FROM("bi_folder a");
                LEFT_OUTER_JOIN("bi_folder b ON a.parent_position = b.position");
                LEFT_OUTER_JOIN("bi_folder c ON b.parent_position = c.position");
                LEFT_OUTER_JOIN("bi_folder d ON c.parent_position = d.position");
                LEFT_OUTER_JOIN("bi_folder e ON d.parent_position = e.position");
                WHERE("a.parent_position in (" + in + ")");
            }
        }.toString();
        return load;
    }


    public static String getLoadFolderSQLByMountId(Long id) {
        String load = new SQL() {
            {
                SELECT("a.id, a.mount, a.name, a.position, a.parent_position AS parentPosition, CONCAT_WS('/', e.position, d.position,c.position,b.position,a.position) as path, a.sort_no AS sortNo");
                FROM("bi_folder a");
                LEFT_OUTER_JOIN("bi_folder b ON a.parent_position = b.position");
                LEFT_OUTER_JOIN("bi_folder c ON b.parent_position = c.position");
                LEFT_OUTER_JOIN("bi_folder d ON c.parent_position = d.position");
                LEFT_OUTER_JOIN("bi_folder e ON d.parent_position = e.position");
                WHERE("a.mount = " + id);
            }
        }.toString();
        return load;
    }

    public static String getLoadNodeSQLByMountId(Long id) {
        String load = new SQL() {
            {
                SELECT("a.id, a.position, a.url, CONCAT_WS('/',e. NAME,d. NAME,c. NAME,b. NAME,a. NAME) AS name, a.mount, a.parent_position AS parentPosition, a.state, a.sort_no AS sortNo, a.genre");
                FROM("bi_nodes a");
                LEFT_OUTER_JOIN("bi_folder b ON a.parent_position = b.position");
                LEFT_OUTER_JOIN("bi_folder c ON b.parent_position = c.position");
                LEFT_OUTER_JOIN("bi_folder d ON c.parent_position = d.position");
                LEFT_OUTER_JOIN("bi_folder e ON d.parent_position = e.position");
                WHERE("a.mount = " + id);
            }
        }.toString();
        return load;
    }
}
