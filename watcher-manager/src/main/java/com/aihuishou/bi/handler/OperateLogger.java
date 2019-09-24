package com.aihuishou.bi.handler;

import com.aihuishou.bi.cas.CasUtil;
import com.aihuishou.bi.entity.OperateLog;
import com.aihuishou.bi.entity.User;
import com.aihuishou.bi.service.OperateLogService;
import com.aihuishou.bi.service.UserService;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.google.common.collect.ImmutableMap;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;

import java.sql.SQLException;

@Component
public class OperateLogger {
    @Autowired
    private UserService userService;
    @Autowired
    private OperateLogService operateLogService;

    private static final Logger logger = LoggerFactory.getLogger(OperateLogger.class);

    @Async
    public void append(String position, Object from, Object to, String target, String operateType, String eventName) throws SQLException {
        String obId = CasUtil.getId();
        User user = userService.getUserByObId(obId);
        String userName = user.getName();
        String employeeNo = user.getEmployeeNo();
        String desc;
        String tos = transfer(to);
        if(from != null) {
            String froms = transfer(from);
            desc = JSONObject.toJSONString(ImmutableMap.of("old", froms, "new", tos));
        } else {
            desc = tos;
        }
        OperateLog log = new OperateLog(eventName, target, position, operateType, desc, userName, employeeNo);
        operateLogService.logger(log);
    }

    private String transfer(Object o) {
        String result;
        try {
            result = JSONObject.toJSONString(o);
        } catch (Exception e) {
            try {
                result = JSONArray.toJSONString(o);
            } catch (Exception e1) {
                logger.error("对象或数组转化为JSON字符串出错");
                throw new RuntimeException("对象或数组转化为JSON字符串出错");
            }
        }
        return result;
    }
}
