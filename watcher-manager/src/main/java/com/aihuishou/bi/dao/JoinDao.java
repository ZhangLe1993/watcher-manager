package com.aihuishou.bi.dao;

import com.aihuishou.bi.cas.CasUtil;
import org.apache.commons.dbutils.QueryRunner;
import org.apache.commons.dbutils.handlers.ColumnListHandler;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import javax.sql.DataSource;
import java.sql.SQLException;
import java.util.List;

@Repository
public class JoinDao {

    @Autowired
    private DataSource dataSource;

    //用户和角色的绑定关系
    public List<Integer> getExistsRole(Long obId) throws SQLException {
        String sql = "select distinct roleid from ods_ob_foundation_observerrole where observerid = ?;";
        return new QueryRunner(dataSource).query(sql, new ColumnListHandler<Integer>("roleid"), obId);
    }

    public int create(Long obId, List<Integer> roleIds) throws SQLException {
        String createObId = CasUtil.getId();
        if(roleIds != null && roleIds.size() != 0) {
            String sql = "insert into ods_ob_foundation_observerrole (observerid,roleid,createddt, createdby, lastmoddt, active) values (?, ?, now(), ?, now(), 1)";
            Object[][] params = new Object[roleIds.size()][3];
            for(int i = 0; i < roleIds.size(); i++) {
                params[i] = new Object[]{obId, roleIds.get(i), createObId};
            }
            int [] res = new QueryRunner(dataSource).batch(sql, params);
            return res == null ? 0 : res.length;
        }
        return 0;
    }


    public int update(Long obId, List<Integer> roleIds, int from, int to) throws SQLException {
        if(roleIds != null && roleIds.size() != 0) {
            String sql = "update ods_ob_foundation_observerrole set active = ?, lastmoddt = now() where observerid = ? and roleid = ? and active = ?;";
            Object[][] params = new Object[roleIds.size()][4];
            for(int i = 0; i < roleIds.size(); i++) {
                params[i] = new Object[]{to, obId, roleIds.get(i), from};
            }
            int [] res = new QueryRunner(dataSource).batch(sql, params);
            return res == null ? 0 : res.length;
        }
        return 0;
    }


    //角色和权限的绑定关系

    public List<Integer> getExistsOperation(Integer roleId) throws SQLException {
        String sql = "select distinct operationid from ods_ob_foundation_roleoperation where roleid = ?;";
        return new QueryRunner(dataSource).query(sql, new ColumnListHandler<Integer>("operationid"), roleId);
    }

    public int create2(Integer roleId, List<Integer> operations) throws SQLException {
        if(operations != null && operations.size() != 0) {
            String sql = "insert into ods_ob_foundation_roleoperation (roleid,operationid,createddt, lastmoddt, active) values (?, ?, now(),now(), 1)";
            Object[][] params = new Object[operations.size()][2];
            for(int i = 0; i < operations.size(); i++) {
                params[i] = new Object[]{roleId, operations.get(i)};
            }
            int [] res = new QueryRunner(dataSource).batch(sql, params);
            return res == null ? 0 : res.length;
        }
        return 0;
    }


    public int update2(Integer roleId, List<Integer> operations, int from, int to) throws SQLException {
        if(operations != null && operations.size() != 0) {
            String sql = "update ods_ob_foundation_roleoperation set active = ?, lastmoddt = now() where roleid = ? and operationid = ? and active = ?;";
            Object[][] params = new Object[operations.size()][4];
            for(int i = 0; i < operations.size(); i++) {
                params[i] = new Object[]{to, roleId, operations.get(i), from};
            }
            int [] res = new QueryRunner(dataSource).batch(sql, params);
            return res == null ? 0 : res.length;
        }
        return 0;
    }
}
