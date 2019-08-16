package com.aihuishou.bi.service;

import com.aihuishou.bi.core.CacheConf;
import com.aihuishou.bi.entity.Mapping;
import com.aihuishou.bi.entity.NodeAuth;
import com.aihuishou.bi.utils.ExceptionInfo;
import com.aihuishou.bi.vo.GrantVO;
import org.apache.commons.collections.CollectionUtils;
import org.apache.commons.dbutils.QueryRunner;
import org.apache.commons.dbutils.handlers.BeanListHandler;
import org.apache.commons.dbutils.handlers.ColumnListHandler;
import org.apache.commons.dbutils.handlers.ScalarHandler;
import org.apache.commons.lang3.StringUtils;
import org.apache.ibatis.jdbc.SQL;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.Resource;
import javax.sql.DataSource;
import java.sql.SQLException;
import java.util.Collection;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class AuthService extends BaseService {

    private final static Logger logger = LoggerFactory.getLogger(AuthService.class);

    @Autowired
    private MappingService mappingService;

    @Resource
    private DataSource dataSource;

    @Qualifier("greenPlum")
    @Resource
    private DataSource greenPlum;


    public boolean auth(String position, Map<String, List<String>> menuAuthMap, List<String> userAuthList, Map<String, String> mapping) {
        try {
            //用户没有任何权限直接返回 false
            if(userAuthList == null || userAuthList.size() == 0) {
                return false;
            }
            String target = position;
            if(mapping != null && StringUtils.isNotBlank(mapping.get(position))) {
                target = mapping.get(target);
            }
            //菜单权限
            List<String> menuAuthList = menuAuthMap.get(target);
            //如果菜单没有配置权限，意味所有人都能看
            if(menuAuthList == null || menuAuthList.size() == 0) {
                return true;
            }
            Collection collection = CollectionUtils.intersection(menuAuthList, userAuthList);
            //交集为空，没有权限
            return collection != null && collection.size() != 0;
        } catch (Exception e) {
            logger.error("获取权限发生异常，异常信息: {}", ExceptionInfo.toString(e));
            return false;
        }
    }

    @Cacheable(value = CacheConf.MAP_MENU_AUTH)
    public Map<String, List<String>> menuAuth() throws SQLException {
        List<NodeAuth> list = cachePull();
        return list.stream().collect(Collectors.groupingBy(NodeAuth::getPosition, Collectors.mapping(NodeAuth::getAuthName, Collectors.toList())));
    }


    @Cacheable(value = CacheConf.LIST_NODE_AUTH)
    private List<NodeAuth> cachePull() throws SQLException {
        String sql = "select node_position AS position,auth_name AS authName from node_auth;";
        return new QueryRunner(dataSource).query(sql, new BeanListHandler<>(NodeAuth.class));
    }

    @Cacheable(value = CacheConf.LIST_USER_AUTH, key = "#obId")
    public List<String> userAuth(String obId) throws SQLException {
        String sql = new SQL() {
            {
                SELECT("distinct d.name");
                FROM("ods_ob_foundation_observerrole a");
                JOIN("ods_ob_foundation_role b ON a.roleid = b.id");
                JOIN("ods_ob_foundation_roleoperation c ON b.id = c.roleid");
                JOIN("ods_ob_foundation_operation d ON c.operationid=d.id");
                WHERE("a.observerid = " + obId);
            }
        }.toString();
        return new QueryRunner(dataSource).query(sql, new ColumnListHandler<String>("name"));
    }


    @Transactional
    public int grantAuth(GrantVO grantVO) throws SQLException {
        Mapping mapping = mappingService.getModel(grantVO.getPosition());
        String target = grantVO.getPosition();
        if(mapping != null) {
            target = mapping.getTarget();
        }
        String sql = "DELETE FROM node_auth WHERE node_position = ?;";
        QueryRunner dbUtils = new QueryRunner(dataSource);
        if(mapping != null) {
            dbUtils.update(sql, grantVO.getPosition());
        }
        dbUtils.update(sql, target);
        List<String> authList = grantVO.getAuth();
        if(authList == null || authList.size() == 0) {
            return 0;
        }
        sql = "INSERT INTO node_auth(node_position, auth_name) VALUES (?, ?);";
        Object[][] params = new Object[authList.size()][2];
        for(int i = 0; i < authList.size(); i++) {
            params[i] = new Object[]{target, authList.get(i)};
        }
        int rows[] = dbUtils.batch(sql, params);
        return rows == null ? 0 : rows.length;
    }

    public List<String> getAllAuth(String key, Integer pageIndex, Integer pageSize) throws SQLException {
        String sql = "select distinct name from ods.ods_ob_foundation_operation WHERE 1=1 ";
        if(StringUtils.isNotBlank(key)) {
            sql += " AND name like '%" + key + "%'";
        }
        if(pageIndex != null && pageSize != null) {
            int a = (pageIndex - 1) * pageSize;
            sql += " ORDER BY name DESC LIMIT " + pageSize + " OFFSET " + a + ";";
        }
        return new QueryRunner(greenPlum).query(sql, new ColumnListHandler<String>("name"));
    }


    public Long countAllAuth(String key) throws SQLException {
        String sql = "select count(*) AS num from ods.ods_ob_foundation_operation WHERE 1=1 ";
        if(StringUtils.isNotBlank(key)) {
            sql += " AND name like '%" + key + "%'";
        }
        return new QueryRunner(greenPlum).query(sql, new ScalarHandler<>("num"));
    }


    public List<String> getMenuAuth(String position) throws SQLException {
        Mapping mapping = mappingService.getModel(position);
        String target = position;
        if(mapping != null) {
            target = mapping.getTarget();
        }
        String sql = "SELECT auth_name AS auth FROM node_auth WHERE node_position = ?;";
        return new QueryRunner(dataSource).query(sql, new ColumnListHandler<>("auth"), target);
    }

    public int createAuth() {
        String sql = "insert into ";
        return 0;
    }


}
