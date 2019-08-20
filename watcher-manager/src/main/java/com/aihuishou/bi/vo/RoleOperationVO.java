package com.aihuishou.bi.vo;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class RoleOperationVO {

    private Integer role;

    private List<Integer> operation;
}
