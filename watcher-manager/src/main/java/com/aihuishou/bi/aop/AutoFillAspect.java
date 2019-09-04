package com.aihuishou.bi.aop;

import com.aihuishou.bi.cas.CasUtil;
import com.aihuishou.bi.entity.User;
import com.aihuishou.bi.service.UserService;
import com.aihuishou.bi.utils.ExceptionInfo;
import com.google.common.collect.ImmutableMap;
import org.apache.commons.lang3.StringUtils;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.AfterThrowing;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Pointcut;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.lang.reflect.Method;
import java.util.Map;

@Component
@Aspect
public class AutoFillAspect {
    private static final Logger logger = LoggerFactory.getLogger(AutoFillAspect.class);

    @Autowired
    protected UserService userService;

    protected final static String SERVICE_FIELD_EMPLOYEE_NAME = "empname";
    protected final static String SERVICE_FIELD_EMPLOYEE_NO = "empno";
    protected final static String CURRENT_USER_FIELD_EMPLOYEE_NAME = "name";
    protected final static String CURRENT_USER_FIELD_EMPLOYEE_NO = "employeeNo";

    private final static Map<String, String> fieldMap = ImmutableMap.of(SERVICE_FIELD_EMPLOYEE_NAME, CURRENT_USER_FIELD_EMPLOYEE_NAME, SERVICE_FIELD_EMPLOYEE_NO, CURRENT_USER_FIELD_EMPLOYEE_NO);

    /**
     * 定义一个切点
     */
    @Pointcut("@annotation(com.aihuishou.bi.annotation.AutoFill)")
    public void autoFill() {}

    @Around("autoFill()")
    public Object around(ProceedingJoinPoint joinPoint) throws Throwable {
        Object[] arguments = joinPoint.getArgs();
        if(arguments != null && arguments.length != 0) {
            autowired(arguments[0], SERVICE_FIELD_EMPLOYEE_NAME, SERVICE_FIELD_EMPLOYEE_NO);
        }
        return joinPoint.proceed(arguments);
    }

    /**
     * 打印异常
     * @param e
     * @throws Exception
     */
    @AfterThrowing(value = "autoFill()", throwing = "e")
    public void afterThrowing(Throwable e) throws Exception {
        logger.info("统一异常处理:{}", ExceptionInfo.toString(e));
    }


    /**
     *
     * @param obj
     * @param fields
     * @param <T>
     */
    public <T> void autowired(T obj, String ... fields) {
        try{
            Class<?> clazz = obj.getClass();
            String obId = CasUtil.getId();
            if(StringUtils.isBlank(obId) || "-2".equalsIgnoreCase(obId)) {
                logger.error("用户不存在或登录信息失效");
                return;
            }
            User user = userService.getUserByObId(obId);
            if(user == null) {
                logger.error("用户不存在或登录信息失效");
                return;
            }
            for(String fieldName : fields) {
                String methodName = "set" + fieldName.substring(0, 1).toUpperCase() + fieldName.substring(1);
                Method method = clazz.getDeclaredMethod(methodName, String.class);
                String valueFieldName = fieldMap.get(fieldName);
                String valueMethodName = "get" + valueFieldName.substring(0, 1).toUpperCase() + valueFieldName.substring(1);
                Method valueMethod = user.getClass().getDeclaredMethod(valueMethodName);
                method.invoke(obj, (String) valueMethod.invoke(user));
            }
        } catch(Exception e) {
            logger.error("用户信息自动装配发生异常", ExceptionInfo.toString(e));
        }
    }
}
