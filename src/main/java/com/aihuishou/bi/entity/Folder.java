package com.aihuishou.bi.entity;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class Folder {

    private Long id;

    private String position;

    private String name;

    private String state;

    private String parentPosition;

    private Long mount;

    private Long sortNo;

}
