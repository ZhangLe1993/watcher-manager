package com.aihuishou.bi.service;

import com.aihuishou.bi.live.model.AiJiHuiTradeStats;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MongoService {

    @Autowired
    @Qualifier(value = "basicMongoTemplate")
    private MongoTemplate mongoTemplate;

    public List<AiJiHuiTradeStats> aijihuiTradeStats() {
        Query query = new Query(Criteria.where("sourceTypeName").is("爱机汇").and("orderType").is("submit"));
        return mongoTemplate.find(query, AiJiHuiTradeStats.class, "aijihuiTradeStats");
    }
}
