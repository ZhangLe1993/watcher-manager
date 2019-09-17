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

    /**
     * 角色绑定权限的设置
     * @param roleId
     * @param operations
     * @param from
     * @param to
     * @return
     * @throws SQLException
     */
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


    //用户和权限的绑定关系
    public List<String> getExistsOperation(Long obId) throws SQLException {
        String sql = "select distinct access_name from user_operation_min where observer_id = ?;";
        return new QueryRunner(dataSource).query(sql, new ColumnListHandler<String>("access_name"), obId);
    }

    public int createUO(Long obId, List<String> operations) throws SQLException {
        if(operations != null && operations.size() != 0) {
            String sql = "INSERT INTO user_operation_min(observer_id, access_id, access_name) VALUES (?, 0, ?)";
            Object[][] params = new Object[operations.size()][2];
            for(int i = 0; i < operations.size(); i++) {
                params[i] = new Object[]{obId, operations.get(i)};
            }
            int [] res = new QueryRunner(dataSource).batch(sql, params);
            return res == null ? 0 : res.length;
        }
        return 0;
    }

    public int updateUO(Long obId, List<String> operations) throws SQLException {
        if(operations != null && operations.size() != 0) {
            String sql = "delete from user_operation_min where observer_id = ? and access_name = ?;";
            Object[][] params = new Object[operations.size()][2];
            for(int i = 0; i < operations.size(); i++) {
                params[i] = new Object[]{obId, operations.get(i)};
            }
            int [] res = new QueryRunner(dataSource).batch(sql, params);
            return res == null ? 0 : res.length;
        }
        return 0;
    }

    /*******************************************************         反绑定     ****************************************************************************/


    public List<Long> getExistsUser(Integer roleId) throws SQLException {
        String sql = "select distinct observerid from ods_ob_foundation_observerrole where roleid = ?;";
        return new QueryRunner(dataSource).query(sql, new ColumnListHandler<Long>("observerid"), roleId);
    }

    /**
     * 角色绑定用户
     * @param roleId
     * @param obIds
     * @return
     * @throws SQLException
     */
    public int create4(Integer roleId, List<Long> obIds) throws SQLException {
        String createObId = CasUtil.getId();
        if(obIds != null && obIds.size() != 0) {
            String sql = "insert into ods_ob_foundation_observerrole (observerid,roleid,createddt, createdby, lastmoddt, active) values (?, ?, now(), ?, now(), 1)";
            Object[][] params = new Object[obIds.size()][3];
            for(int i = 0; i < obIds.size(); i++) {
                Long obId = obIds.get(i);
                params[i] = new Object[]{obId, roleId, createObId};
            }
            int [] res = new QueryRunner(dataSource).batch(sql, params);
            return res == null ? 0 : res.length;
        }
        return 0;
    }


    /**
     *角色绑定用户设置
     * @param roleId
     * @param obIds
     * @param from
     * @param to
     * @return
     * @throws SQLException
     */
    public int update4(Integer roleId, List<Long> obIds, int from, int to) throws SQLException {
        if(obIds != null && obIds.size() != 0) {
            String sql = "update ods_ob_foundation_observerrole set active = ?, lastmoddt = now() where observerid = ? and roleid = ? and active = ?;";
            Object[][] params = new Object[obIds.size()][4];
            for(int i = 0; i < obIds.size(); i++) {
                Long obId = obIds.get(i);
                params[i] = new Object[]{to, obId, roleId, from};
            }
            int [] res = new QueryRunner(dataSource).batch(sql, params);
            return res == null ? 0 : res.length;
        }
        return 0;
    }


    //权限绑定用户
    public List<Long> getExistsUser(String operation) throws SQLException {
        String sql = "select distinct observer_id from user_operation_min where access_name = ?;";
        return new QueryRunner(dataSource).query(sql, new ColumnListHandler<Long>("observer_id"), operation);
    }

    public int create4(String operation, List<Long> obIds) throws SQLException {
        if(obIds != null && obIds.size() != 0) {
            String sql = "INSERT INTO user_operation_min(observer_id, access_id, access_name) VALUES (?, 0, ?)";
            Object[][] params = new Object[obIds.size()][2];
            for(int i = 0; i < obIds.size(); i++) {
                Long obId = obIds.get(i);
                params[i] = new Object[]{obId, operation};
            }
            int [] res = new QueryRunner(dataSource).batch(sql, params);
            return res == null ? 0 : res.length;
        }
        return 0;
    }

    public int update4(String operation, List<Long> obIds) throws SQLException {
        if(obIds != null && obIds.size() != 0) {
            String sql = "delete from user_operation_min where observer_id = ? and access_name = ?;";
            Object[][] params = new Object[obIds.size()][4];
            for(int i = 0; i < obIds.size(); i++) {
                Long obId = obIds.get(i);
                params[i] = new Object[]{obId, operation};
            }
            int [] res = new QueryRunner(dataSource).batch(sql, params);
            return res == null ? 0 : res.length;
        }
        return 0;
    }


    public List<Integer> getExistsRole(Integer operationId) throws SQLException {
        String sql = "select distinct roleid from ods_ob_foundation_roleoperation where operationid = ?;";
        return new QueryRunner(dataSource).query(sql, new ColumnListHandler<Integer>("roleid"), operationId);
    }

    /**
     * 权限绑定角色的新增
     * @param operationId
     * @param roleIds
     * @return
     * @throws SQLException
     */
    public int create3(Integer operationId, List<Integer> roleIds) throws SQLException {
        if(roleIds != null && roleIds.size() != 0) {
            String sql = "insert into ods_ob_foundation_roleoperation (roleid,operationid,createddt, lastmoddt, active) values (?, ?, now(),now(), 1)";
            Object[][] params = new Object[roleIds.size()][2];
            for(int i = 0; i < roleIds.size(); i++) {
                Integer roleId = roleIds.get(i);
                params[i] = new Object[]{roleId, operationId};
            }
            int [] res = new QueryRunner(dataSource).batch(sql, params);
            return res == null ? 0 : res.length;
        }
        return 0;
    }


    /**
     * 权限绑定角色的设置
     * @param operationId
     * @param roleIds
     * @param from
     * @param to
     * @return
     * @throws SQLException
     */
    public int update3(Integer operationId, List<Integer> roleIds, int from, int to) throws SQLException {
        if(roleIds != null && roleIds.size() != 0) {
            String sql = "update ods_ob_foundation_roleoperation set active = ?, lastmoddt = now() where operationid = ? and roleid = ? and active = ?;";
            Object[][] params = new Object[roleIds.size()][4];
            for(int i = 0; i < roleIds.size(); i++) {
                params[i] = new Object[]{to, operationId, roleIds.get(i), from};
            }
            int [] res = new QueryRunner(dataSource).batch(sql, params);
            return res == null ? 0 : res.length;
        }
        return 0;
    }
}
