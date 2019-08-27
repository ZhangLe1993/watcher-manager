package com.aihuishou.bi.dao;

import com.aihuishou.bi.entity.Permission;
import com.aihuishou.bi.entity.Role;
import org.apache.commons.dbutils.QueryRunner;
import org.apache.commons.dbutils.handlers.BeanListHandler;
import org.apache.commons.dbutils.handlers.ScalarHandler;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Repository;

import javax.annotation.Resource;
import javax.sql.DataSource;
import java.sql.SQLException;
import java.util.List;
import java.util.concurrent.ExecutorService;

@Repository
public class RoleDao {

    @Resource(name="watcherThreadPool")
    private ExecutorService service;

    @Resource
    private DataSource dataSource;

    public int insert(Role role) throws SQLException {
        String sql = "insert into ods_ob_foundation_role(departmentid, name, alias, description, createddt, lastmoddt, active) values (1, ?, ?, ?,now(), now(), 1);";
        return new QueryRunner(dataSource).update(sql, role.getName(), role.getAlias(), role.getDescription());
    }


    //删除
    public int delete(Integer id) throws SQLException {
        String sql = "update ods_ob_foundation_role set active = 0 , lastmoddt = now() where active = 1 and id = ?;";
        return new QueryRunner(dataSource).update(sql, id);
    }

    public int update(Role role) throws SQLException {
        String sql = "update ods_ob_foundation_role set name = ? , alias = ?, description = ? , lastmoddt = now() where active = 1 and id = ?";
        return new QueryRunner(dataSource).update(sql, role.getName(), role.getAlias(), role.getDescription(), role.getId());
    }


    public int updateSQL(Role role) throws SQLException {
        String sql = "update ods_ob_foundation_role set group_sql = ?, lastmoddt = now() where active = 1 and id = ?";
        int count = new QueryRunner(dataSource).update(sql, role.getGroupSQL(), role.getId());
        //清除人的权限缓存
        service.execute(() -> {

        });
        return count;
    }

    public List<Role> getList(String key, int offset, int limit) throws SQLException {
        String sql = "select id,name,alias,description,active from ods_ob_foundation_role where active = 1 ";
        String where = " and (name like ? or alias like ? or description like ?) ";
        String page = " limit ?,?;";
        if(StringUtils.isNotBlank(key)) {
            sql  = sql + where + page;
            return new QueryRunner(dataSource).query(sql, new BeanListHandler<>(Role.class), "%" + key + "%", "%" + key + "%", "%" + key + "%", offset, limit);
        }
        sql = sql + page;
        return new QueryRunner(dataSource).query(sql, new BeanListHandler<>(Role.class), offset, limit);
    }

    public Long count(String key) throws SQLException {
        String sql = "select count(distinct id) as num from ods_ob_foundation_role where active = 1 ";
        String where = " and (name like ? or alias like ? or description like ?) ";
        if(StringUtils.isNotBlank(key)) {
            sql  = sql + where;
            return new QueryRunner(dataSource).query(sql, new ScalarHandler<>("num"), "%" + key + "%", "%" + key + "%", "%" + key + "%");
        }
        return new QueryRunner(dataSource).query(sql, new ScalarHandler<>("num"));
    }

    public List<Permission> hasOwner(Integer roleId) throws SQLException {
        String sql = "select id,name,alias,description,active from ods_ob_foundation_operation where active = 1 and id in (select distinct operationid from ods_ob_foundation_roleoperation where active = 1 and roleid = ?);";
        return new QueryRunner(dataSource).query(sql, new BeanListHandler<>(Permission.class), roleId);
    }
}
