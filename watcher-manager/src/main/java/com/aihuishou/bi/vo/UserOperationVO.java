package com.aihuishou.bi.vo;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class UserOperationVO {
    private Long ob;
    private List<Integer> operationIds;
}
