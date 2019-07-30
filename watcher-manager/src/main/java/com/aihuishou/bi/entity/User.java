package com.aihuishou.bi.entity;

import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;

@Getter
@Setter
public class User implements Serializable {

    private Integer obId;

    private String name;

    private String mobile;

    private String email;

    private String employeeNo;

}
