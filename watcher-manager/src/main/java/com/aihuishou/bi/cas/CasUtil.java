package com.aihuishou.bi.cas;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.context.SecurityContextHolder;

/**
 * OA单点登录工具类
 * User: jian.sun
 * Date: 15-7-16
 * Time: 下午2:48
 * To change this template use File | Settings | File Templates.
 */
public class CasUtil {

    private final static Logger logger = LoggerFactory.getLogger(CasUtil.class);

    public static String getId() {
        UserDetailsObj user = null;
        try {
            user = (UserDetailsObj) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        } catch(Exception e) {
            logger.error("用户不存在或登录信息失效");
        }
        return user == null ? "-2" : user.getId();
    }

    public static String getUserName() {
        UserDetailsObj user = null;
        try {
            user = (UserDetailsObj) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        } catch(Exception e) {
            logger.error("用户不存在或登录信息失效");
        }
        return user == null ? "" : user.getUsername();
    }

}
