package com.aihuishou.bi.controller;

import com.aihuishou.bi.service.MenuService;
import com.aihuishou.bi.service.OperateLogService;
import com.aihuishou.bi.vo.OperationInfo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.sql.SQLException;
import java.util.List;

@RestController
@RequestMapping(value = "/log", produces = MediaType.APPLICATION_JSON_UTF8_VALUE)
public class OperateLogController {

    @Autowired
    private OperateLogService operateLogService;

    @GetMapping("/getOperationInfoList")
    public List<OperationInfo> getOperationInfoList(String nodeType, Integer nodeId) throws SQLException {
        List<OperationInfo>  operationInfos = operateLogService.getOperationInfoList(nodeType, nodeId);
        return operationInfos;
    }
}
