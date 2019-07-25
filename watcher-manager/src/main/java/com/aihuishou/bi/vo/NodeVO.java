package com.aihuishou.bi.vo;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class NodeVO {
    private Long id;
    private String position;
    private String url;
    /*private List<String> auth;*/
    private String path;
    private String name;
    private String mount;
    private String parentPosition;
    private String state;
    private Long sortNo;
    private String empno;
    private String empname;
    private String genre;
}
