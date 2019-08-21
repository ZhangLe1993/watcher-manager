package com.aihuishou.bi.dao;

import com.aihuishou.bi.entity.Permission;
import org.apache.commons.dbutils.QueryRunner;
import org.apache.commons.dbutils.handlers.BeanListHandler;
import org.apache.commons.dbutils.handlers.ScalarHandler;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Repository;

import javax.annotation.Resource;
import javax.sql.DataSource;
import java.sql.SQLException;
import java.util.List;

@Repository
public class PermissionDao {

    @Resource
    private DataSource dataSource;

    public int insert(Permission permission) throws SQLException {
        String sql = "insert into ods_ob_foundation_operation(moduleid, name, alias, description, createddt, lastmoddt, active) values (42, ?, ?, ?,now(), now(), 1);";
        return new QueryRunner(dataSource).update(sql, permission.getName(), permission.getAlias(), permission.getDescription());
    }


    //删除
    public int delete(Integer id) throws SQLException {
        String sql = "update ods_ob_foundation_operation set active = 0 , lastmoddt = now() where active = 1 and id = ?;";
        return new QueryRunner(dataSource).update(sql, id);
    }

    public int update(Permission permission) throws SQLException {
        String sql = "update ods_ob_foundation_operation set name = ? , alias = ?, description = ? , lastmoddt = now() where active = 1 and id = ?";
        return new QueryRunner(dataSource).update(sql, permission.getName(), permission.getAlias(), permission.getDescription(), permission.getId());
    }



    public List<Permission> getList(String key, int offset, int limit) throws SQLException {
        String sql = "select id,name,alias,description,active from ods_ob_foundation_operation where active = 1 ";
        String where = " and name like or and alias like ? or description like ? ";
        String page = " limit ?,?;";
        if(StringUtils.isNotBlank(key)) {
            sql  = sql + where + page;
            return new QueryRunner(dataSource).query(sql, new BeanListHandler<>(Permission.class), "%" + key + "%", "%" + key + "%", "%" + key + "%", offset, limit);
        }
        sql = sql + page;
        return new QueryRunner(dataSource).query(sql, new BeanListHandler<>(Permission.class), offset, limit);
    }

    public Long count(String key) throws SQLException {
        String sql = "select count(distinct id) as num from ods_ob_foundation_operation where active = 1 ";
        String where = " and name like or and alias like ? or description like ? ";
        if(StringUtils.isNotBlank(key)) {
            sql  = sql + where;
            return new QueryRunner(dataSource).query(sql, new ScalarHandler<>("num"), "%" + key + "%", "%" + key + "%", "%" + key + "%");
        }
        return new QueryRunner(dataSource).query(sql, new ScalarHandler<>("num"));
    }

}
