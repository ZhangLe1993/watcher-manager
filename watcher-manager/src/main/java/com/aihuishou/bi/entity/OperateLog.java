package com.aihuishou.bi.entity;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class OperateLog {
    private Integer id;
    private String event;
    private String description;
    private String person;
    private String operateTime;

    public OperateLog() {
    }

    public OperateLog(String event, String description, String person, String operateTime) {
        this.event = event;
        this.description = description;
        this.person = person;
        this.operateTime = operateTime;
    }
}
