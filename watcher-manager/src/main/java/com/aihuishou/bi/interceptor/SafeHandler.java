package com.aihuishou.bi.interceptor;

import com.aihuishou.bi.annotation.SafeAuthenticate;
import com.aihuishou.bi.core.SysConf;
import com.aihuishou.bi.utils.MyRSA;
import org.apache.commons.lang3.math.NumberUtils;
import org.apache.logging.log4j.util.Strings;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.web.method.HandlerMethod;
import org.springframework.web.servlet.handler.HandlerInterceptorAdapter;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.File;
import java.io.FileInputStream;
import java.nio.ByteBuffer;
import java.nio.channels.FileChannel;
import java.nio.charset.StandardCharsets;
import java.security.PublicKey;
import java.util.HashMap;
import java.util.Map;

public class SafeHandler extends HandlerInterceptorAdapter {

    private final Logger logger = LoggerFactory.getLogger(SafeHandler.class);

    @Value("${watcher.templates}")
    private String path;

    @Value("${spring.profiles.active}")
    private String profiles;

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        //判断如果不是请求control方法直接返回true
        if (!(handler instanceof HandlerMethod)) {
            return true;
        }
        // 判断是否是watcher嵌入的页面，是的话直接返回true
        Map<String, String> cookiesMap = getCookie(request);
        if(cookiesMap.containsKey("sid") && cookiesMap.containsKey("sc") && "BI部门/嵌入页面管理".equalsIgnoreCase(cookiesMap.get("sc"))) {
            return true;
        }
        // 如果是 admin 用户可以直接看
        //logger.info("request请求地址:path[{}] , uri[{}]", request.getServletPath(),request.getRequestURI());
        // 获取类上的注解
        //Class<?> clazz = ((HandlerMethod) handler).getBeanType();
        //SafeAuthenticate annotation = clazz.getAnnotation(SafeAuthenticate.class);
        //获取方法上的注解
        SafeAuthenticate annotation = ((HandlerMethod) handler).getMethodAnnotation(SafeAuthenticate.class);
        if (annotation != null) {
            String sign = request.getParameter("sign");
            // 自己本地生成私钥测试
            // PrivateKey key = MyRSA.loadPrivateKey(new File(path + "rsa/ahs_pkcs8.pem"));
            // String sign = MyRSA.encrypt(key, Long.toString(System.currentTimeMillis()));
            logger.info("safe handler check,sign[" + sign + "]");
            // 这个版本，如果不传sign,设置为通过，如果传了sign，再进行验证
            if (Strings.isBlank(sign)) {
                response.setStatus(HttpStatus.FORBIDDEN.value());
                response.getWriter().print("Permission Not Authenticate, Request Param Required sign");
                return false;
                //return true;
            }
            boolean auth = auth(sign);
            if (!auth) {
                response.setStatus(HttpStatus.FORBIDDEN.value());
                response.getWriter().print("Permission Not Authenticate, Your sign 【" + sign + "】 is illegal");
            }
            return auth;
        }
        return true;
    }

    /**
     * 权限校验，解密出来的时间必须在允许的最近时间范围内，才合法
     *
     * @param sign    时间戳 RSA私钥加密后的密文
     * @return
     */
    private boolean auth(String sign) {
        PublicKey pub = MyRSA.loadPublicKey(new File(path + "rsa/ahs_public_" + profiles + ".pem"));
        String pre = MyRSA.decrypt(pub, sign);
        if (pre != null && NumberUtils.isNumber(pre)) {
            boolean flag = isIn(Long.parseLong(pre), System.currentTimeMillis(), SysConf.AUTH_ALLOWED_TIMEOUT);
            if (!flag) {
                logger.error("sign auth fail,the timestamp is not in the valid range,pre[" + pre + "]");
            }
            return flag;
        } else {
            logger.error("the sign is not timestamp pre[" + pre + "]\n" + sign);
            return false;
        }
    }

    //校验是否在范围中
    private boolean isIn(long exp, long target, int rangeSecond) {
        boolean flag = false;
        long min = target - rangeSecond * 1000L;
        long max = target + rangeSecond * 1000L;
        if (exp > min && exp < max) {
            flag = true;
        }
        return flag;
    }


    /**
     * 从公钥文件中读取内容
     */
    public String readText(String filePath) {
        try {
            //定义缓冲区对象
            ByteBuffer buffer = ByteBuffer.allocate(1024);
            //通过文件输入流获取文件通道流对象
            FileChannel inFc = new FileInputStream(filePath).getChannel();
            //读取数据
            buffer.clear();
            int length = inFc.read(buffer);
            String text = new String(buffer.array(),0, length, StandardCharsets.UTF_8);
            inFc.close();
            return text;
        } catch(Exception e) {

        }
        return null;
    }

    public Map<String, String> getCookie(HttpServletRequest request) {
        Map<String, String> collect = new HashMap<>();
        Cookie[] cookies = request.getCookies();
        if(cookies != null && cookies.length != 0) {
            for(Cookie cookie : cookies) {
                if("sid".equalsIgnoreCase(cookie.getName())) {
                    collect.put("sid", cookie.getValue());
                }
                if("sc".equalsIgnoreCase(cookie.getName())) {
                    collect.put("sc", cookie.getValue());
                }
            }
        }
        return collect;
    }
}
