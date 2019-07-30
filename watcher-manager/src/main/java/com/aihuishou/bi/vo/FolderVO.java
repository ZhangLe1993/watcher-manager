package com.aihuishou.bi.vo;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class FolderVO {

    private Long id;
    private String position;
    private String name;
    private String state;
    private String parentPosition;
    private Long mount;
    private String empno;
    private String empname;
    private Long sortNo;

}
