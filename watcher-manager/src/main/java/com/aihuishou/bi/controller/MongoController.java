package com.aihuishou.bi.controller;

import com.aihuishou.bi.live.model.AiJiHuiTradeStats;
import com.aihuishou.bi.live.model.EtlJob;
import com.aihuishou.bi.live.model.ExpressSourceTypeTradeStats;
import com.aihuishou.bi.live.model.RealtimeOrderSummaryStats;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping(value = "/mongo", produces = MediaType.APPLICATION_JSON_UTF8_VALUE)
public class MongoController {

    @GetMapping("/aijihuiTradeStats")
    public List<AiJiHuiTradeStats> aiJiHuiTradeStats(String sourceTypeName, @RequestParam(required = false) String orderType) {
        return new ArrayList<>();
    }

    @GetMapping("/etljoblist")
    public List<EtlJob> etljoblist() {
        return new ArrayList<>();
    }

    @GetMapping("/sysn")
    public void operationMappings() throws SQLException {

    }

    @GetMapping("/expressSourceTypeTradeStats")
    public List<ExpressSourceTypeTradeStats> expressSourceTypeTradeStats() {
        return new ArrayList<>();
    }


    @GetMapping("/realtimeOrderSummaryStats")
    public List<RealtimeOrderSummaryStats> realtimeOrderSummaryStats() {
        return new ArrayList<>();
    }

    @GetMapping("/realtimeOrderSummaryStats/one")
    public RealtimeOrderSummaryStats realtimeOrderSummaryStats(String id) {
        return new RealtimeOrderSummaryStats();
    }
}
