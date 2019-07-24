package com.aihuishou.bi.service;

import com.google.common.collect.ImmutableMap;
import org.apache.commons.lang3.StringUtils;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;

import javax.annotation.Resource;
import java.util.List;
import java.util.Map;

public class BaseService {

    @Resource
    protected JdbcTemplate jdbcTemplate;

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




}
