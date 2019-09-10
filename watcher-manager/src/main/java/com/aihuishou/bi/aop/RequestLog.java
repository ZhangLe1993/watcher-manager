package com.aihuishou.bi.aop;

import com.aihuishou.bi.annotation.Mark;
import com.aihuishou.bi.annotation.SystemLog;
import com.aihuishou.bi.handler.BuryPoint;
import com.aihuishou.bi.service.NodeService;
import com.aihuishou.bi.utils.StringEx;
import com.alibaba.fastjson.JSONObject;
import com.sensorsdata.analytics.javasdk.exceptions.InvalidArgumentException;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.*;
import org.aspectj.lang.reflect.MethodSignature;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.UnsupportedEncodingException;
import java.lang.reflect.Method;
import java.net.URLDecoder;
import java.sql.SQLException;
import java.util.HashMap;
import java.util.Map;

@Component
@Aspect
public class RequestLog {

    @Autowired
    private BuryPoint buryPoint;

    @Autowired
    private NodeService nodeService;

    public static final Logger logger = LoggerFactory.getLogger(RequestLog.class);

    /**
     * Define a pointcut
     */
    @Pointcut("@annotation(com.aihuishou.bi.annotation.SystemLog)")
    public void controllerLog() {}

    /**
     * Print Log before controller
     * @param joinPoint
     */
    @Before("controllerLog()")
    public void before(JoinPoint joinPoint) throws Exception {
        HttpServletRequest request = ((ServletRequestAttributes) RequestContextHolder.getRequestAttributes()).getRequest();

        logger.info("请求IP：{}", request.getRemoteAddr());
        logger.info("请求路径：{}", URLDecoder.decode(request.getRequestURL().toString(), "UTF-8"));
        logger.info("请求方式：{}", request.getMethod());
        logger.info("方法描述：{}", getMethodDescription(joinPoint));
        logger.info("请求参数：{}", JSONObject.toJSONString(request.getParameterMap()));

    }

    /**
     * Print the time that request method execution spend
     * @param joinPoint
     * @throws Throwable
     */
    @Around("controllerLog()")
    public Object around(ProceedingJoinPoint joinPoint) throws Throwable {
        long startTime = System.currentTimeMillis();
        //获取方法上的注解
        MethodSignature signature = (MethodSignature) joinPoint.getSignature();
        Method method = joinPoint.getTarget().getClass().getMethod(signature.getName(), signature.getMethod().getParameterTypes());
        SystemLog systemLog = method.getAnnotation(SystemLog.class);
        Object[] args = joinPoint.getArgs();
        Object retVal;
        try {
            retVal = joinPoint.proceed(args);
            long endTime = System.currentTimeMillis();
            cookieAndPoint(systemLog, method, args, startTime, endTime, endTime - startTime, true);
            logger.info("执行时间：{} ms\n\t", endTime - startTime);
        } catch(Throwable e) {
            cookieAndPoint(systemLog, method, args, startTime, 0L, 0L, false);
            throw e;
        }
        return retVal;
    }

    private void cookieAndPoint(SystemLog systemLog, Method method, Object[] args, long startTime, long endTime, long takeTime, boolean status) throws InvalidArgumentException, UnsupportedEncodingException, SQLException {
        //是否需要埋点
        boolean needPoint = systemLog.point();
        if(needPoint) {
            Mark mark = method.getAnnotation(Mark.class);
            String type = mark.name();
            switch(type) {
                case "start": {
                    String sessionId = StringEx.newUUID();
                    String position = args[0].toString();
                    //String name = args[1].toString();
                    String url = args[2].toString();
                    HttpServletResponse response = ((ServletRequestAttributes) RequestContextHolder.getRequestAttributes()).getResponse();
                    String finalName = nodeService.getFinalPath(position);
                    kindCookie(sessionId, finalName, response);
                    buryPoint.point(sessionId, startTime, endTime, takeTime, "watcher_denominator", finalName, url, status);
                    break;
                }
                case "end": {
                    HttpServletRequest request = ((ServletRequestAttributes) RequestContextHolder.getRequestAttributes()).getRequest();
                    String url = URLDecoder.decode(request.getRequestURL().toString(), "UTF-8");
                    Map<String, String> cookieMap  = getCookie(request);
                    String sid = cookieMap.get("sid");
                    String finalName = cookieMap.get("sc");
                    buryPoint.point(sid, startTime, endTime, takeTime, "watcher_elememt", finalName, url, status);
                    break;
                }
            }
        }
    }

    /**
     * 种Cookie
     * @param response
     */
    private void kindCookie(String sessionId, String name, HttpServletResponse response) {
        Cookie sid = new Cookie("sid", sessionId);
        Cookie sName = new Cookie("sc", name.replaceAll(" ",""));
        sid.setPath("/");
        sName.setPath("/");
        response.addCookie(sid);
        response.addCookie(sName);
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

    /**
     * Print exception
     * @param ex
     */
    @AfterThrowing(throwing = "ex", pointcut = "controllerLog()")
    public void afterThrowing(Throwable ex) {
        logger.error("发生异常：{}", ex.toString());
    }

    /**
     * Acquire the description for annotation target method
     * @param joinPoint
     * @return
     * @throws Exception
     */
    protected String getMethodDescription(JoinPoint joinPoint) throws Exception {
        String targetName = joinPoint.getTarget().getClass().getName();
        String methodName = joinPoint.getSignature().getName();
        Object[] arguments = joinPoint.getArgs();
        Class<?> targetClass = Class.forName(targetName);
        Method[] methods = targetClass.getMethods();

        String description = "";
        for (Method method : methods) {
            if(method.getName().equals(methodName)) {
                Class<?>[] clazzs = method.getParameterTypes();
                if(clazzs.length == arguments.length) {
                    description = method.getAnnotation(SystemLog.class).description();
                    break;
                }
            }
        }
        return description;
    }
}
