package com.aihuishou.bi.vo;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class OperationUserVO {
    private String operation;
    private List<Long> ids;
}
