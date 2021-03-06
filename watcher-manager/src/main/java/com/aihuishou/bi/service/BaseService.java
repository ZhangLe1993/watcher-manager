package com.aihuishou.bi.service;

import com.aihuishou.bi.entity.Folder;
import com.aihuishou.bi.entity.Mount;
import com.aihuishou.bi.entity.Node;
import com.aihuishou.bi.handler.OperateLogger;
import com.google.common.collect.ImmutableMap;
import org.apache.commons.dbutils.QueryRunner;
import org.apache.commons.dbutils.handlers.BeanListHandler;
import org.apache.commons.lang3.StringUtils;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;

import javax.annotation.Resource;
import javax.sql.DataSource;
import java.sql.SQLException;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

public class BaseService {

    @Resource
    protected JdbcTemplate jdbcTemplate;

    @Resource
    private DataSource dataSource;

    @Resource
    private OperateLogger operateLogger;

    public BaseService() {
    }

    public <T> List<T> getAbstractPageList(Class<?> clazz, String prefix, String suffix, String key, String parent, Integer pageIndex, Integer pageSize, String ... args) {
        Map<String,Object[]> join = getObjects(prefix, suffix, key, parent, pageIndex, pageSize, args);
        String sql = join.keySet().iterator().next();
        Object[] params = join.get(sql);
        if(params[0] == null) {
            return jdbcTemplate.query(sql, new BeanPropertyRowMapper(clazz));
        }
        return jdbcTemplate.query(sql, new BeanPropertyRowMapper(clazz), params);
    }


    private Map<String,Object[]> getObjects(String prefix, String suffix, String key, String parent, Integer pageIndex, Integer pageSize, String ... args) {
        String sql;
        boolean pages = pageIndex != null && pageSize != null;
        boolean hasKey = !StringUtils.isBlank(key);
        boolean hasParent = !StringUtils.isBlank(parent);
        if(pages && !hasKey && !hasParent) {
            int a = (pageIndex - 1) * pageSize;
            sql = prefix + suffix;
            return ImmutableMap.of(sql, new Object[]{a, pageSize});
        }else if(pages && hasKey && hasParent) {
            int a = (pageIndex - 1) * pageSize;
            sql = prefix + args[0] + args[1] + suffix;
            return ImmutableMap.of(sql, new Object[]{"%" + key + "%", parent, a, pageSize});
        } else if(pages && hasKey && !hasParent) {
            int a = (pageIndex - 1) * pageSize;
            sql = prefix + args[0] + suffix;
            return ImmutableMap.of(sql, new Object[]{"%" + key + "%", a, pageSize});
        } else if(pages && !hasKey && hasParent) {
            int a = (pageIndex - 1) * pageSize;
            sql = prefix + args[1] + suffix;
            return ImmutableMap.of(sql, new Object[]{parent, a, pageSize});
        } else if(!pages && hasKey && hasParent) {
            sql = prefix + args[0] + args[1];
            return ImmutableMap.of(sql, new Object[]{"%" + key + "%", parent});
        } else if(!pages && hasKey && !hasParent) {
            sql = prefix + args[0];
            return ImmutableMap.of(sql, new Object[]{"%" + key + "%"});
        } else if(!pages && !hasKey && hasParent) {
            sql = prefix + args[1];
            return ImmutableMap.of(sql, new Object[]{parent});
        } else if(!pages && !hasKey && !hasParent) {
            sql = prefix;
            return ImmutableMap.of(sql, new Object[]{null});
        }
        return null;
    }

    public Long count(String prefix, String key, String parent, String ... args) {
        Map<String,Object[]> join = getCount(prefix, key, parent, args);
        if(join != null) {
            String sql = join.keySet().iterator().next();
            Object[] params = join.get(sql);
            if(params[0] == null) {
                return jdbcTemplate.queryForObject(sql, Long.class);
            }
            return jdbcTemplate.queryForObject(sql, Long.class, params);
        }
        return 0L;
    }


    private Map<String,Object[]> getCount(String prefix, String key, String parent, String ... args) {
        String sql;
        boolean hasKey = !StringUtils.isBlank(key);
        boolean hasParent = !StringUtils.isBlank(parent);
        if(hasKey && hasParent) {
            sql = prefix + args[0] + args[1];
            return ImmutableMap.of(sql, new Object[]{"%" + key + "%", parent});
        } else if(hasKey && !hasParent) {
            sql = prefix + args[0];
            return ImmutableMap.of(sql, new Object[]{"%" + key + "%"});
        } else if(!hasKey && hasParent) {
            sql = prefix + args[1];
            return ImmutableMap.of(sql, new Object[]{parent});
        } else if(!hasKey && !hasParent) {
            sql = prefix;
            return ImmutableMap.of(sql, new Object[]{null});
        }
        return null;
    }

    protected void batchMountLogger(String load, List<Mount> froms, String target, String operateType, String eventName) throws SQLException {
        //修改之后的记录
        if(!"recursive".equalsIgnoreCase(operateType)) {
            List<Mount> to = new QueryRunner(dataSource).query(load, new BeanListHandler<>(Mount.class));
            Map<Long, Mount> map = to.stream().collect(Collectors.toMap(Mount::getId, v -> v, (o, c) -> c));
            //记录日志
            for(int i = 0; i < froms.size(); i++) {
                Mount from = froms.get(i);
                Long position = from.getId();
                operateLogger.append(position.toString(), from , map.get(position), target, operateType, eventName);
            }
        } else {
            //记录日志
            for(int i = 0; i < froms.size(); i++) {
                Mount from = froms.get(i);
                Long position = from.getId();
                operateLogger.append(position.toString(), null , from, target, operateType, eventName);
            }
        }

    }

    protected void batchFolderLogger(String load, List<Folder> froms, String target, String operateType, String eventName) throws SQLException {
        //修改之后的记录
        if(!"recursive".equalsIgnoreCase(operateType)) {
            List<Folder> to = new QueryRunner(dataSource).query(load, new BeanListHandler<>(Folder.class));
            Map<String, Folder> map = to.stream().collect(Collectors.toMap(Folder::getPosition, v -> v, (o, c) -> c));
            //记录日志
            for(int i = 0; i < froms.size(); i++) {
                Folder from = froms.get(i);
                String position = from.getPosition();
                operateLogger.append(position, from , map.get(position), target, operateType, eventName);
            }
        } else {
            //记录日志
            for(int i = 0; i < froms.size(); i++) {
                Folder from = froms.get(i);
                String position = from.getPosition();
                operateLogger.append(position, null , from, target, operateType, eventName);
            }
        }
    }

    protected void batchNodeLogger(String load, List<Node> froms, String target, String operateType, String eventName) throws SQLException {
        //修改之后的记录
        if(!"recursive".equalsIgnoreCase(operateType)) {
            List<Node> to = new QueryRunner(dataSource).query(load, new BeanListHandler<>(Node.class));
            Map<String, Node> map = to.stream().collect(Collectors.toMap(Node::getPosition, v -> v, (o, c) -> c));
            //记录日志
            for(int i = 0; i < froms.size(); i++) {
                Node from = froms.get(i);
                String position = from.getPosition();
                operateLogger.append(position, from , map.get(position), target, operateType, eventName);
            }
        } else {
            for(int i = 0; i < froms.size(); i++) {
                Node from = froms.get(i);
                String position = from.getPosition();
                operateLogger.append(position, null , from, target, operateType, eventName);
            }
        }

    }



}
