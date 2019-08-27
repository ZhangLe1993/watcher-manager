package com.aihuishou.bi.vo;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class OperationRoleVo {

    private Integer operation;

    private List<Integer> role;
}
