package com.aihuishou.bi.service;

import com.aihuishou.bi.live.model.AiJiHuiTradeStats;
import com.aihuishou.bi.live.model.EtlJob;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

@Service
public class MongoService {

    @Autowired
    @Qualifier(value = "basicMongoTemplate")
    private MongoTemplate mongoTemplate;

    public List<AiJiHuiTradeStats> aiJiHuiTradeStats(String sourceTypeName, String orderType) {
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
        String today = sdf.format(new Date());
        Criteria criteria = Criteria.where("sourceTypeName").is(sourceTypeName).and("date").is(today);
        if(StringUtils.isNotBlank(orderType)) {
            criteria.and("orderType").is(orderType);
        }
        Query query = new Query(criteria);
        return mongoTemplate.find(query, AiJiHuiTradeStats.class, "aijihuiTradeStats");
    }

    public List<EtlJob> etlJobList() {
        Query query = new Query().with(new Sort(Sort.Direction.ASC, "id")).with(new Sort(Sort.Direction.ASC, "sid")).with(new Sort(Sort.Direction.ASC, "order"));
        return mongoTemplate.find(query, EtlJob.class, "etljoblist");
    }
}
