package com.aihuishou.bi.entity;

import lombok.Getter;
import lombok.Setter;

/**
 * 老watcher中同步过来的权限，作为新的权限表
 */
@Getter
@Setter
public class Operation {
    private Integer id;
    private  String sourceOperation;
    private String targetOperation;
}
