package com.aihuishou.bi.entity;

import lombok.Getter;
import lombok.Setter;

import java.math.BigInteger;

@Getter
@Setter
public class Folder {

    private BigInteger id;

    private String position;

    private String name;

    private String state;

    private String parentPosition;

    private Long mount;

    private Long sortNo;

    private String path;

}
