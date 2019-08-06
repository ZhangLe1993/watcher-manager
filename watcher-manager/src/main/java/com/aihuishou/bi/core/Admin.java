package com.aihuishou.bi.core;

public enum Admin {
    ADMIN(0, "超级管理员"),
    MAINTAINER(1, "维护者"),
    DEVELOPER(2, "开发者"),
    GUEST(-1, "游客");

    private int code;
    private String desc;

    Admin(int code, String desc) {
        this.code = code;
        this.desc = desc;
    }

    public int getCode() {
        return code;
    }

    public String getDesc() {
        return desc;
    }
}
