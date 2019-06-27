package com.aihuishou.bi.entity;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class Folder {

    private Long id;

    private String position;

    private String name;

    private String state;

    private String parentPosition;

    private Long mount;

    private Long sortNo;

}
