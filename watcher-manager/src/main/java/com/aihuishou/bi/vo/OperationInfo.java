package com.aihuishou.bi.vo;

import lombok.Data;

@Data
public class OperationInfo {

    private String event;        //节点类型
    private String description;  //操作内容
    private String employee_name; //操作者
    private String operate_time;  //操作时间
}
