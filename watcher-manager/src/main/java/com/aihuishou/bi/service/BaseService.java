package com.aihuishou.bi.service;

import com.aihuishou.bi.cas.CasUtil;
import com.aihuishou.bi.core.SysConf;
import com.aihuishou.bi.entity.User;
import com.aihuishou.bi.utils.ExceptionInfo;
import com.google.common.collect.ImmutableMap;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;

import javax.annotation.Resource;
import java.lang.reflect.Field;
import java.lang.reflect.Method;
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
        return jdbcTemplate.query(sql, new BeanPropertyRowMapper(clazz), params);
    }


    private Map<String,Object[]> getObjects(String prefix, String suffix, String key, String parent, Integer pageIndex, Integer pageSize, String ... args) {
        String sql;
        boolean pages = pageIndex != null && pageSize != null;
        boolean hasKey = !StringUtils.isBlank(key);
        boolean hasParent = !StringUtils.isBlank(parent);
        if(pages && hasKey && hasParent) {
            int a = (pageIndex - 1) * pageSize;
            sql = prefix + args[0] + args[1] + suffix;
            return ImmutableMap.of(sql, new Object[]{key, parent, a, pageSize});
        } else if(pages && hasKey && !hasParent) {
            int a = (pageIndex - 1) * pageSize;
            sql = prefix + args[0] + suffix;
            return ImmutableMap.of(sql, new Object[]{key, a, pageSize});
        } else if(pages && !hasKey && hasParent) {
            int a = (pageIndex - 1) * pageSize;
            sql = prefix + args[1] + suffix;
            return ImmutableMap.of(sql, new Object[]{parent, a, pageSize});
        } else if(!pages && hasKey && hasParent) {
            sql = prefix + args[0] + args[1];
            return ImmutableMap.of(sql, new Object[]{key, parent});
        } else if(!pages && hasKey && !hasParent) {
            sql = prefix + args[0];
            return ImmutableMap.of(sql, new Object[]{key});
        } else if(!pages && !hasKey && hasParent) {
            sql = prefix + args[1];
            return ImmutableMap.of(sql, new Object[]{parent});
        }
        return null;
    }

    public Long count(String prefix, String key, String parent, String ... args) {
        Map<String,Object[]> join = getCount(prefix, key, parent, args);
        if(join != null) {
            String sql = join.keySet().iterator().next();
            Object[] params = join.get(sql);
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
            return ImmutableMap.of(sql, new Object[]{key, parent});
        } else if(hasKey && !hasParent) {
            sql = prefix + args[0];
            return ImmutableMap.of(sql, new Object[]{key});
        } else if(!hasKey && hasParent) {
            sql = prefix + args[1];
            return ImmutableMap.of(sql, new Object[]{parent});
        }
        return null;
    }




}
