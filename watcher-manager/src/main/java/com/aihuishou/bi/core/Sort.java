package com.aihuishou.bi.core;

import java.util.Map;

public class Sort {

    public static Long comparingBySortNo(Map<String, Object> map) {
        return (Long) map.get("sort");
    }
}
