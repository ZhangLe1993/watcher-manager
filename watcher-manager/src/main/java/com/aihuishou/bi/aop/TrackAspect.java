package com.aihuishou.bi.aop;

import com.aihuishou.bi.annotation.Track;
import com.aihuishou.bi.cas.CasUtil;
import com.aihuishou.bi.core.Clazz;
import com.aihuishou.bi.core.Event;
import com.aihuishou.bi.core.Operate;
import com.aihuishou.bi.entity.OperateLog;
import com.aihuishou.bi.entity.User;
import com.aihuishou.bi.service.*;
import com.aihuishou.bi.utils.ConcurrentDateFormat;
import com.aihuishou.bi.utils.ExceptionInfo;
import com.alibaba.fastjson.JSONObject;
import org.apache.commons.lang3.StringUtils;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.AfterThrowing;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Pointcut;
import org.aspectj.lang.reflect.MethodSignature;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import javax.annotation.Resource;
import java.lang.reflect.Method;
import java.sql.SQLException;
import java.util.Date;

@Component
@Aspect
public class TrackAspect {

    private static final Logger logger = LoggerFactory.getLogger(TrackAspect.class);

    @Resource
    private OperateLogService operateLogService;

    @Autowired
    private MountService mountService;

    @Autowired
    private FolderService folderService;

    @Autowired
    private NodeService nodeService;

    @Autowired
    private UserService userService;

    @Pointcut("@annotation(com.aihuishou.bi.annotation.Track)")
    public void track() {}

    @Around("track()")
    public Object around(ProceedingJoinPoint joinPoint) throws Throwable {
        MethodSignature signature = (MethodSignature) joinPoint.getSignature();
        Method method = joinPoint.getTarget().getClass().getMethod(signature.getName(), signature.getMethod().getParameterTypes());
        Track track = method.getAnnotation(Track.class);
        Clazz cl = track.clazz();
        Operate type = track.operate();
        Object[] arguments = joinPoint.getArgs();
        OperateLog operateLog = null;
        if(arguments != null && arguments.length != 0) {
            Object obj = arguments[0];
            Class<?> clazz = obj.getClass();
            String methodName = "getId";
            Method vMethod = clazz.getDeclaredMethod(methodName);
            Object id = vMethod.invoke(obj);
            operateLog = select(id, cl, type, obj);
        }
        Object val = joinPoint.proceed();
        operateLogService.track(operateLog);
        return val;
    }

    private OperateLog select(Object id, Clazz clazz, Operate type, Object target) throws SQLException {
        OperateLog operateLog = null;
        switch(clazz) {
            case MOUNT : {
                Event.Mount event = Event.Mount.select(type);
                String eventName = event.getName();
                String template = event.getTemplate();
                Object from = null;
                if(id != null) {
                    from = mountService.getMountById(Long.parseLong(id.toString()));
                }
                operateLog = build(eventName, template, from, target);
                break;
            }
            case FOLDER : {
                Event.Folder event = Event.Folder.select(type);
                String eventName = event.getName();
                String template = event.getTemplate();
                Object from = null;
                if(id != null) {
                    from = folderService.getFolderById(Long.parseLong(id.toString()));
                }
                operateLog = build(eventName, template, from, target);
                break;
            }
            case NODE : {
                Event.Node event = Event.Node.select(type);
                String eventName = event.getName();
                String template = event.getTemplate();
                Object from = null;
                if(id != null) {
                    from = nodeService.getNodeById(Long.parseLong(id.toString()));
                }
                operateLog = build(eventName, template, from, target);
                break;
            }
        }
        return operateLog;
    }


    private OperateLog build(String eventName, String template, Object from, Object target) throws SQLException {
        String obId = CasUtil.getId();
        if(StringUtils.isBlank(obId) || "-2".equalsIgnoreCase(obId)) {
            logger.error("用户不存在或登录信息失效");
            return null;
        }
        User user = userService.getUserByObId(obId);
        if(user == null || StringUtils.isBlank(user.getEmployeeNo())) {
            logger.error("用户不存在或登录信息失效");
            return null;
        }
        String userName = user.getName() + "【" + user.getEmployeeNo() + "】";
        String current = ConcurrentDateFormat.formatHMS(new Date());
        String desc;
        if(from != null) {
            desc = String.format(template, userName, current, JSONObject.toJSON(from), JSONObject.toJSON(target));
        } else {
            desc = String.format(template, userName, current, JSONObject.toJSON(target));
        }
        return new OperateLog(eventName, desc, userName, current);
    }



    @AfterThrowing(value = "track()", throwing = "e")
    public void afterThrowing(Throwable e) throws Exception {
        logger.info("统一异常处理:{}", ExceptionInfo.toString(e));
    }



}
