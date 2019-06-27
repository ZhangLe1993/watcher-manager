package com.aihuishou.bi.entity;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
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

}
