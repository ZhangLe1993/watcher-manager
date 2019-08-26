package com.aihuishou.bi.handler;

import com.aihuishou.bi.cas.CasUtil;
import com.alibaba.fastjson.JSONObject;
import com.sensorsdata.analytics.javasdk.SensorsAnalytics;
import com.sensorsdata.analytics.javasdk.exceptions.InvalidArgumentException;
import org.springframework.stereotype.Component;

import javax.annotation.Resource;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Component
public class BuryPoint {

    @Resource
    private SensorsAnalytics sensorsAnalytics;

    /**
     * 埋点
     * @param startTime
     * @param endTime
     * @param position
     * @param name
     * @param url
     * @throws InvalidArgumentException
     */
    public void point(String sessionId, long startTime, long endTime, long takeTime, String position, String name, String url, boolean status) throws InvalidArgumentException {
        //埋点
        String obId = CasUtil.getId();
        Map<String, Object> properties = new HashMap<>();
        properties.put("user_key", obId);
        Map<String, Object> data = new HashMap<>();
        data.put("sid", sessionId);
        data.put("start_time", new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(new Date(startTime)));
        data.put("end_time", new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(new Date(endTime)));
        data.put("take_time", takeTime);
        data.put("time_unit", "ms");
        data.put("sensors_event_name", position);
        data.put("sensors_title", name);
        data.put("sensors_screen_name", url);
        data.put("status", status);
        properties.put("properties_ext", JSONObject.toJSONString(data));
        //System.out.println(JSONObject.toJSONString(properties));
        sensorsAnalytics.track(obId, true, "CustomDefined", properties);
    }
}


