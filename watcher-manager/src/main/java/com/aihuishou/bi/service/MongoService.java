package com.aihuishou.bi.service;

import com.aihuishou.bi.live.model.*;
import org.apache.commons.dbutils.QueryRunner;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;

import javax.sql.DataSource;
import java.sql.SQLException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

@Service
public class MongoService {

    @Autowired
    @Qualifier(value = "basicMongoTemplate")
    private MongoTemplate mongoTemplate;

    @Autowired
    private DataSource dataSource;

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


    public void operationMappings() throws SQLException {
        List<OperationMapping> list = mongoTemplate.find(new Query(), OperationMapping.class, "userPermissionOperationMapping");
        String sql = "insert into operation_mapping(source_operation, target_operation) values (?,?);";
        Object[][] params = new Object[list.size()][2];
        for(int i = 0; i < list.size(); i++) {
            String operation  = list.get(i).getOperation();
            String accessName = list.get(i).getAccessName();
            params[i] = new Object[]{operation, accessName};
        }
        new QueryRunner(dataSource).batch(sql, params);
    }


    public List<ExpressSourceTypeTradeStats> expressSourceTypeTradeStats() {
        Query basic = new Query().with(new Sort(Sort.Direction.DESC, "createdDt"));
        DateTradeStats dateTradeStats = mongoTemplate.findOne(basic, DateTradeStats.class, "dateTradeStats");
        String date = dateTradeStats.getCreatedDt();
        Criteria criteria = Criteria.where("createdDt").is(date);
        Query query = new Query(criteria).with(new Sort(Sort.Direction.DESC, "tradeNum"));
        return mongoTemplate.find(query, ExpressSourceTypeTradeStats.class, "expressSourceTypeTradeStats");
    }

    public List<RealtimeOrderSummaryStats> realtimeOrderSummaryStats() {
        Date date = new Date();
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
        String to = sdf.format(date);
        Criteria criteria = Criteria.where("status").is("submit").and("date").is(to);
        Query query = new Query(criteria);
        return mongoTemplate.find(query, RealtimeOrderSummaryStats.class, "realtimeOrderSummaryStats");
    }

    public RealtimeOrderSummaryStats realtimeOrderSummaryStats(String id) {
        Date date = new Date();
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
        String to = sdf.format(date);
        Criteria criteria = Criteria.where("status").is("submit").and("date").is(to).and("_id").is(id);
        Query query = new Query(criteria);
        return mongoTemplate.findOne(query, RealtimeOrderSummaryStats.class, "realtimeOrderSummaryStats");
    }
}
