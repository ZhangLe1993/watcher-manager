package com.aihuishou.bi.service;

import com.aihuishou.bi.core.CacheConf;
import com.aihuishou.bi.entity.Mapping;
import org.apache.commons.dbutils.QueryRunner;
import org.apache.commons.dbutils.handlers.BeanHandler;
import org.apache.commons.dbutils.handlers.BeanListHandler;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import javax.sql.DataSource;
import java.sql.SQLException;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class MappingService {

    @Resource
    private DataSource dataSource;

    @Cacheable(value = CacheConf.POSITION_MAPPING_MODEL, key = "#source")
    public Mapping getModel(String source) throws SQLException {
        String sql = "select id, source_position AS source, target_position AS target, param_key AS `key`, param_value AS `value` from replace_mapping  where source_position = ?;";
        return new QueryRunner(dataSource).query(sql, new BeanHandler<>(Mapping.class), source);
    }

    public Map<String, String> getModelMap(List<String> positions) throws SQLException {
        if(positions != null && positions.size() != 0) {
            StringBuilder sql = new StringBuilder().append("select source_position AS source, target_position AS target from replace_mapping  where source_position in (");
            for(int i = 0; i < positions.size(); i++) {
                sql.append("'").append(positions.get(i)).append("'");
                if(i != positions.size() - 1) {
                    sql.append(",");
                }
            }
            sql.append(");");
            List<Mapping> maps = new QueryRunner(dataSource).query(sql.toString(), new BeanListHandler<>(Mapping.class));
            return maps.stream().collect(Collectors.toMap(Mapping:: getSource, Mapping :: getTarget, (oldVal, currVal) -> currVal));
        }
        return null;
    }

    @Cacheable(value = CacheConf.POSITION_MAPPING_MAP)
    public Map<String, String> getMapping() throws SQLException {
        String sql = "select source_position AS source, target_position AS target from replace_mapping;";
        List<Mapping> list = new QueryRunner(dataSource).query(sql, new BeanListHandler<>(Mapping.class));
        return list.stream().collect(Collectors.toMap(Mapping :: getSource, Mapping :: getTarget, (oldVal, currVal) -> currVal));
    }

}
