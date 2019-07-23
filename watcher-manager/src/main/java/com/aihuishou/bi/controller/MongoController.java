package com.aihuishou.bi.controller;

import com.aihuishou.bi.live.model.AiJiHuiTradeStats;
import com.aihuishou.bi.service.MongoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/mongo")
public class MongoController {

    @Autowired
    private MongoService mongoService;

    @GetMapping("/aijihuiTradeStats")
    public List<AiJiHuiTradeStats> test() {
        return mongoService.aijihuiTradeStats();
    }
}
