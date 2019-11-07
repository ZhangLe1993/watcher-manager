package com.aihuishou.bi.dao;

import com.aihuishou.bi.cas.CasUtil;
import com.aihuishou.bi.entity.Operation;
import org.apache.commons.dbutils.QueryRunner;
import org.apache.commons.dbutils.handlers.BeanListHandler;
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

    //用户和IT权限的绑定关系
    public List<Integer> getExistsOperation(Long obId) throws SQLException {
        String sql = "select distinct operation_id from w_user_operation where observer_id = ?;";
        return new QueryRunner(dataSource).query(sql, new ColumnListHandler<Integer>("operation_id"), obId);
    }

    //用户和IT+watcher权限的绑定关系
    public List<Operation> getExistsOperationBean(Long obId) throws SQLException {
        String sql = "select distinct operation_id as id, b.name from w_user_operation a join w_operation b on a.operation_id = b.id where observer_id = ?;";
        return new QueryRunner(dataSource).query(sql, new BeanListHandler<>(Operation.class), obId);
    }

    public int createUO(Long obId, List<Integer> operationIds) throws SQLException {
        if(operationIds != null && operationIds.size() != 0) {
            String sql = "INSERT INTO w_user_operation(observer_id, operation_id, active) VALUES (?, ?, '1')";
            Object[][] params = new Object[operationIds.size()][2];
            for(int i = 0; i < operationIds.size(); i++) {
                params[i] = new Object[]{obId, operationIds.get(i)};
            }
            int [] res = new QueryRunner(dataSource).batch(sql, params);
            return res == null ? 0 : res.length;
        }
        return 0;
    }

    public int updateUO(Long obId, List<Integer> operationIds) throws SQLException {
        if(operationIds != null && operationIds.size() != 0) {
            String sql = "delete from w_user_operation where observer_id = ? and operation_id = ?;";
            Object[][] params = new Object[operationIds.size()][2];
            for(int i = 0; i < operationIds.size(); i++) {
                params[i] = new Object[]{obId, operationIds.get(i)};
            }
            int [] res = new QueryRunner(dataSource).batch(sql, params);
            return res == null ? 0 : res.length;
        }
        return 0;
    }

    /*******************************************************         反绑定     ****************************************************************************/
    //权限绑定用户
    public List<Integer> getExistsUser(Integer operationId) throws SQLException {
        String sql = "select distinct observer_id from w_user_operation where operation_id = ?;";
        return new QueryRunner(dataSource).query(sql, new ColumnListHandler<Integer>("observer_id"), operationId);
    }

    public int create4(Integer operation, List<Integer> obIds) throws SQLException {
        if(obIds != null && obIds.size() != 0) {
            String sql = "INSERT INTO w_user_operation(observer_id, operation_id, active) VALUES (?, ?, '1')";
            Object[][] params = new Object[obIds.size()][2];
            for(int i = 0; i < obIds.size(); i++) {
                params[i] = new Object[]{obIds.get(i), operation};
            }
            int [] res = new QueryRunner(dataSource).batch(sql, params);
            return res == null ? 0 : res.length;
        }
        return 0;
    }

    public int update4(Integer operationId, List<Integer> obIds) throws SQLException {
        if(obIds != null && obIds.size() != 0) {
            String sql = "delete from w_user_operation where observer_id = ? and operation_id = ?;";
            Object[][] params = new Object[obIds.size()][2];
            for(int i = 0; i < obIds.size(); i++) {
                params[i] = new Object[]{obIds.get(i), operationId};
            }
            int [] res = new QueryRunner(dataSource).batch(sql, params);
            return res == null ? 0 : res.length;
        }
        return 0;
    }
}
