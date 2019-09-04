package com.aihuishou.bi.handler;

import com.aihuishou.bi.cas.CasUtil;
import com.aihuishou.bi.entity.User;
import com.aihuishou.bi.service.UserService;
import com.alibaba.fastjson.JSONObject;
import com.sensorsdata.analytics.javasdk.SensorsAnalytics;
import com.sensorsdata.analytics.javasdk.exceptions.InvalidArgumentException;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import javax.annotation.Resource;
import java.sql.SQLException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Component
public class BuryPoint {
    private static final Logger logger = LoggerFactory.getLogger(BuryPoint.class);

    @Resource
    private SensorsAnalytics sensorsAnalytics;

    @Autowired
    private UserService userService;

    /**
     * 埋点
     * @param startTime
     * @param endTime
     * @param position
     * @param name
     * @param url
     * @throws InvalidArgumentException
     */
    public void point(String sessionId, long startTime, long endTime, long takeTime, String position, String name, String url, boolean status) throws InvalidArgumentException, SQLException {
        //埋点
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
        String userName = CasUtil.getUserName();
        String employeeNo = user.getEmployeeNo();
        Map<String, Object> properties = new HashMap<>();
        properties.put("user_key", obId);
        Map<String, Object> data = new HashMap<>();
        data.put("sid", sessionId);
        data.put("start_time", new SimpleDateFormat("yyyy-MM-dd HH:mm:ss.SSS").format(new Date(startTime)));
        data.put("end_time", new SimpleDateFormat("yyyy-MM-dd HH:mm:ss.SSS").format(new Date(endTime)));
        data.put("take_time", takeTime);
        data.put("time_unit", "ms");
        data.put("sensors_event_name", position);
        data.put("sensors_title", name);
        data.put("sensors_screen_name", url);
        data.put("status", status);
        data.put("user_name", userName);
        data.put("employee_no", employeeNo);
        properties.put("properties_ext", JSONObject.toJSONString(data));
        //System.out.println(JSONObject.toJSONString(properties));
        sensorsAnalytics.track(obId, true, "CustomDefined", properties);
    }
}


