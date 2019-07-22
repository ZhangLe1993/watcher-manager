package com.aihuishou.bi.service;

import com.aihuishou.bi.entity.NodeAuth;
import com.aihuishou.bi.utils.ExceptionInfo;
import org.apache.commons.dbutils.QueryRunner;
import org.apache.commons.dbutils.handlers.BeanListHandler;
import org.apache.ibatis.jdbc.SQL;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import javax.sql.DataSource;
import java.sql.SQLException;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class AuthService {

    private final static Logger logger = LoggerFactory.getLogger(AuthService.class);

    @Resource
    private DataSource dataSource;

    @Qualifier("greenPlum")
    @Resource
    private DataSource greenPlum;


    public boolean auth(String position, Map<String, List<String>> menuAuthMap, List<String> userAuthList) {
        try {
            //菜单权限
            List<String> menuAuthList = menuAuthMap.get(position);
            //如果菜单没有配置权限，意味所有人都能看
            return menuAuthList == null || menuAuthList.size() == 0 || menuAuthList.retainAll(userAuthList);
        } catch (Exception e) {
            logger.error("获取权限发生异常，异常信息: {}", ExceptionInfo.toString(e));
            return false;
        }
    }

    @Cacheable(value = "map-menu-auth", keyGenerator = "watcherManagerKeyGenerator")
    public Map<String, List<String>> menuAuth() throws SQLException {
        List<NodeAuth> list = cachePull();
        return list.stream().collect(Collectors.groupingBy(NodeAuth::getPosition, Collectors.mapping(NodeAuth::getAuthName, Collectors.toList())));
    }


    @Cacheable(value = "list-node-auth", keyGenerator = "watcherManagerKeyGenerator")
    private List<NodeAuth> cachePull() throws SQLException {
        String sql = "select node_position AS position,auth_name AS authName from node_auth;";
        return new QueryRunner(dataSource).query(sql, new BeanListHandler<>(NodeAuth.class));
    }

    @Cacheable(value = "list-user-auth", keyGenerator = "watcherManagerKeyGenerator")
    public List<String> userAuth(String obId) throws SQLException {
        String sql = new SQL() {
            {
                SELECT("distinct d.name");
                FROM("ods.ods_ob_foundation_observerrole a");
                JOIN("ods.ods_ob_foundation_role b ON a.roleid = b.id");
                JOIN("ods.ods_ob_foundation_roleoperation c ON b.id = c.roleid");
                JOIN("ods.ods_ob_foundation_operation d ON c.operationid=d.id");
                WHERE("a.observerid = " + obId);
            }
        }.toString();
        return new QueryRunner(greenPlum).query(sql, new BeanListHandler<>(String.class));
    }
}
