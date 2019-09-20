package com.aihuishou.bi.core;

public enum Operate {
    INSERT("insert"), UPDATE("update"), DELETE("delete");

    private String name;

    Operate(String name) {
        this.name = name;
    }

    public String getName() {
        return name;
    }
}
