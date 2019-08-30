package com.aihuishou.bi.controller;

import com.aihuishou.bi.live.model.AiJiHuiTradeStats;
import com.aihuishou.bi.live.model.EtlJob;
import com.aihuishou.bi.live.model.ExpressSourceTypeTradeStats;
import com.aihuishou.bi.service.MongoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.sql.SQLException;
import java.util.List;

@RestController
@RequestMapping("/mongo")
public class MongoController {

    @Autowired
    private MongoService mongoService;

    @GetMapping("/aijihuiTradeStats")
    public List<AiJiHuiTradeStats> aiJiHuiTradeStats(String sourceTypeName, @RequestParam(required = false) String orderType) {
        return mongoService.aiJiHuiTradeStats(sourceTypeName, orderType);
    }

    @GetMapping("/etljoblist")
    public List<EtlJob> etljoblist() {
        return mongoService.etlJobList();
    }

    @GetMapping("/sysn")
    public void operationMappings() throws SQLException {
        mongoService.operationMappings();
    }

    @GetMapping("/expressSourceTypeTradeStats")
    public List<ExpressSourceTypeTradeStats> expressSourceTypeTradeStats() {
        return mongoService.expressSourceTypeTradeStats();
    }
}
