package com.aihuishou.bi.service;

import com.aihuishou.bi.entity.Mapping;
import org.apache.commons.dbutils.QueryRunner;
import org.apache.commons.dbutils.handlers.BeanHandler;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import javax.sql.DataSource;
import java.sql.SQLException;

@Service
public class MappingService {

    @Resource
    private DataSource dataSource;

    public Mapping getModel(String source) throws SQLException {
        String sql = "select id, source_position AS source, target_position AS target, param_key AS `key`, param_value AS `value` from replace_mapping  where source_position = ?;";
        return new QueryRunner(dataSource).query(sql, new BeanHandler<>(Mapping.class), source);
    }
}
