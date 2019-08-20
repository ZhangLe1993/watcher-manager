package com.aihuishou.bi.entity;


import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class Permission {

    private Integer id;

    private String name;

    private String alias;

    private String description;

    private Integer active;
}
