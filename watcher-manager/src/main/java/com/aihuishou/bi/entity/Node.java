package com.aihuishou.bi.entity;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class Node {

    private Long id;

    private String position;

    private String url;

    private String auth;

    private String path;

    private String name;

    private String parentPosition;

    private String state;

    private Long sortNo;

    private String genre;

    private Long mount;

}
