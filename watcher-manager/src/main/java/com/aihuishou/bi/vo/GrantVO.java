package com.aihuishou.bi.vo;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class GrantVO {
    private String position;
    private List<Integer> auth;
    private List<String> authName;
}
