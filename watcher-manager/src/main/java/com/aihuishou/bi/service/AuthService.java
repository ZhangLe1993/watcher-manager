package com.aihuishou.bi.service;

import com.aihuishou.bi.cas.CasUtil;
import com.aihuishou.bi.core.CacheConf;
import com.aihuishou.bi.entity.NodeAuth;
import com.aihuishou.bi.entity.Operation;
import com.aihuishou.bi.handler.OperateLogger;
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
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.Resource;
import javax.sql.DataSource;
import java.sql.SQLException;
import java.util.ArrayList;
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

    @Autowired
    private OperateLogger operateLogger;


    /**
     * 判断当前用户是否有菜单权限
     * @param position
     * @return
     * @throws SQLException
     */
    public boolean auth(String position) throws SQLException {
        Map<String, List<String>> menuAuthMap = menuAuth();
        String obId = CasUtil.getId();
        if(StringUtils.isBlank(obId) || "-2".equalsIgnoreCase(obId)) {
            return false;
        }
        List<String> userAuthList = userAuth(obId);
        Map<String, String> mapping = mappingService.getMapping();
        return auth(position, menuAuthMap, userAuthList, mapping);
    }

    public boolean auth(String position, Map<String, List<String>> menuAuthMap, List<String> userAuthList, Map<String, String> mapping) {
        try {
            //用户没有任何权限直接返回 false
            if(userAuthList == null || userAuthList.size() == 0) {
                return false;
            }
            String target = position;
            /*if(mapping != null && StringUtils.isNotBlank(mapping.get(position))) {
                target = mapping.get(target);
            }*/
            //菜单权限
            List<String> menuAuthList = menuAuthMap.get(target);
            //如果菜单没有配置权限，意味所有人都能看
            if(menuAuthList == null || menuAuthList.size() == 0) {
                return true;
            }
            Collection collection = CollectionUtils.intersection(menuAuthList, userAuthList);
            //交集为空，没有权限
            return collection.size() != 0;
        } catch (Exception e) {
            logger.error("获取权限发生异常，异常信息: {}", ExceptionInfo.toString(e));
            return false;
        }
    }

    public List<String> auth(String position, Map<String, List<String>> menuAuthMap, Map<String, String> mapping) {
        try {
            //菜单权限
            return  menuAuthMap.get(position);
        } catch (Exception e) {
            logger.error("获取权限发生异常，异常信息: {}", ExceptionInfo.toString(e));
            return new ArrayList<>();
        }
    }

    @Cacheable(value = CacheConf.MAP_MENU_AUTH)
    public Map<String, List<String>> menuAuth() throws SQLException {
        List<NodeAuth> list = cachePull();
        return list.stream().collect(Collectors.groupingBy(NodeAuth::getPosition, Collectors.mapping(NodeAuth::getAuthName, Collectors.toList())));
    }


    @Cacheable(value = CacheConf.LIST_NODE_AUTH)
    public List<NodeAuth> cachePull() throws SQLException {
        String sql = "select a.node_position AS position,b.name AS authName from w_node_operation a join w_operation b on a.operation_id = b.id;";
        return new QueryRunner(dataSource).query(sql, new BeanListHandler<>(NodeAuth.class));
    }

    /**
     * 暂时废弃
     * @param obId
     * @return
     * @throws SQLException
     */
    /*@Cacheable(value = CacheConf.LIST_USER_AUTH, key = "#obId")*/
    public List<String> userAuth0(String obId) throws SQLException {
        String in = new SQL() {
            {
                SELECT("distinct d.name");
                FROM("ods_ob_foundation_observerrole a");
                JOIN("ods_ob_foundation_role b ON a.roleid = b.id");
                JOIN("ods_ob_foundation_roleoperation c ON b.id = c.roleid");
                JOIN("ods_ob_foundation_operation d ON c.operationid=d.id");
                WHERE("a.active = 1 and b.active = 1 and c.active = 1 and d.active = 1 and a.observerid = " + obId);
            }
        }.toString();
        List<String> list = new QueryRunner(dataSource).query(in, new ColumnListHandler<String>("name"));
        String sql = new SQL() {
            {
                SELECT("distinct source_operation as name");
                FROM("operation_mapping");
                WHERE("target_operation in (" + in + ")");
            }
        }.toString();
        List<String> other = new QueryRunner(dataSource).query(sql, new ColumnListHandler<String>("name"));
        //other相对于list的茶集
        other.removeAll(list);
        //合并
        list.addAll(other);
        return list;
    }

    /**
     * 直接获取接口落地的数据
     * @param obId
     * @return
     */
    @Cacheable(value = CacheConf.LIST_USER_AUTH, key = "#obId")
    public List<String> userAuth(String obId) throws SQLException {
        String sql = "select b.name from w_user_operation a join w_operation b on a.operation_id = b.id where a.active = 1 and a.observer_id = ?";
        return new QueryRunner(dataSource).query(sql, new ColumnListHandler<String>("name"), Long.parseLong(obId));
    }


    /**
     * 旧版
     * @param obId
     * @return
     * @throws SQLException
     */
    public List<String> userAuthOld(String obId) throws SQLException  {
        String in = "select access_name as name from user_operation_min where active = 1 and observer_id = " + Long.parseLong(obId);
        List<String> list = new QueryRunner(dataSource).query(in, new ColumnListHandler<String>("name"));
        if(list == null || list .size() == 0) {
            return new ArrayList<>();
        }
        other(list);
        return list;
    }


    /**
     * 取出Watcher中关联在Mongo中的数据
     * @param list
     * @throws SQLException
     */
    private void other(List<String> list) throws SQLException {
        String sql = new SQL() {
            {
                SELECT("distinct source_operation as name");
                FROM("operation_mapping");
                WHERE("target_operation in (" + StringUtils.join(list.stream().map(p -> "'" + p + "'").collect(Collectors.toList()), ",") + ")");
            }
        }.toString();
        List<String> other = new QueryRunner(dataSource).query(sql, new ColumnListHandler<String>("name"));
        //other相对于list的茶集
        other.removeAll(list);
        //合并
        list.addAll(other);
    }

    @Transactional
    public int grantAuth(GrantVO grantVO) throws SQLException {
        String target = grantVO.getPosition();
        String sql = "select operation_id from w_node_operation where node_position = ?";
        QueryRunner dbUtils = new QueryRunner(dataSource);
        List<Integer> auths = dbUtils.query(sql, new ColumnListHandler<>("operation_id"), target);
        sql = "DELETE FROM w_node_operation WHERE node_position = ?;";
        dbUtils.update(sql, target);
        List<Integer> authList = grantVO.getAuth();
        if(authList == null || authList.size() == 0) {
            operateLogger.append(target, auths, authList, "node", "auth", "报表赋权");
            return 0;
        }
        sql = "INSERT INTO w_node_operation(node_position, operation_id) VALUES (?, ?);";
        Object[][] params = new Object[authList.size()][2];
        for(int i = 0; i < authList.size(); i++) {
            params[i] = new Object[]{target, authList.get(i)};
        }
        int rows[] = dbUtils.batch(sql, params);
        List<String> authNames = grantVO.getAuthName();
        operateLogger.append(target, auths, authNames, "node", "auth", "报表赋权");
        return 1;
    }

    public List<Operation> getAllAuth(String key, Integer pageIndex, Integer pageSize) throws SQLException {
        String sql = "select id, name from w_operation where 1=1 ";
        if(StringUtils.isNotBlank(key)) {
            sql += " AND name like '%" + key + "%'";
        }
        if(pageIndex != null && pageSize != null) {
            int a = (pageIndex - 1) * pageSize;
            sql += " ORDER BY name DESC LIMIT " + pageSize + " OFFSET " + a + ";";
        }
        return new QueryRunner(dataSource).query(sql, new BeanListHandler<>(Operation.class));
    }

    public Long countAllAuth(String key) throws SQLException {
        String sql = "select count(distinct id) AS num from w_operation WHERE 1=1 ";
        if(StringUtils.isNotBlank(key)) {
            sql += " AND name like '%" + key + "%'";
        }
        return new QueryRunner(dataSource).query(sql, new ScalarHandler<>("num"));
    }

    /**
     * 获取菜单的权限
     * @param position
     * @return
     * @throws SQLException
     */
    public List<Operation> getMenuAuth(String position) throws SQLException {
        String sql = "select b.id, b.name from w_node_operation a join w_operation b on a.operation_id = b.id where a.node_position = ?;";
        return new QueryRunner(dataSource).query(sql, new BeanListHandler<>(Operation.class), position);
    }

}
