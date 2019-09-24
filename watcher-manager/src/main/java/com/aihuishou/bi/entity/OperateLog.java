package com.aihuishou.bi.entity;

import com.aihuishou.bi.utils.ConcurrentDateFormat;
import lombok.Getter;
import lombok.Setter;

import java.util.Date;

@Getter
@Setter
public class OperateLog {
    private Integer id;
    private String event;
    private String target;
    private String targetId;
    private String operateType;
    private String description;
    private String employeeName;
    private String employeeNo;
    private String operateTime;

    public OperateLog() {
    }

    public OperateLog(String event, String target, String targetId, String operateType, String description, String employeeName, String employeeNo) {
        this.event = event;
        this.target = target;
        this.targetId = targetId;
        this.operateType = operateType;
        this.description = description;
        this.employeeName = employeeName;
        this.employeeNo = employeeNo;
        this.operateTime = ConcurrentDateFormat.formatHMS(new Date());
    }
}
