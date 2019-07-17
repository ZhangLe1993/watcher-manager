package com.aihuishou.bi.entity;


import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class Mapping {

    private Long id;

    private String source;

    private String target;

    private String key;

    private String value;
}
