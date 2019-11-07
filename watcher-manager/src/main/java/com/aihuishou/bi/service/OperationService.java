package com.aihuishou.bi.service;

import com.aihuishou.bi.annotation.AutoFill;
import com.aihuishou.bi.entity.Operation;
import com.aihuishou.bi.entity.User;
import org.apache.commons.dbutils.QueryRunner;
import org.apache.commons.dbutils.handlers.BeanListHandler;
import org.apache.commons.dbutils.handlers.ScalarHandler;
import org.apache.commons.lang3.StringUtils;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import javax.sql.DataSource;
import java.sql.SQLException;
import java.util.List;

@Service
public class OperationService {

    @Resource
    private DataSource dataSource;

    @AutoFill
    public int insert(Operation operation) throws SQLException {
        String sql = "select count(*) as num from w_operation where name = ?;";
        Long count = new QueryRunner(dataSource).query(sql, new ScalarHandler<>("num"), operation.getName());
        if(count > 0) {
            return 0;
        }
        sql = "insert into w_operation(name, empno, empname, create_time, update_time) values (?, ?, ?, now(), now());";
        return new QueryRunner(dataSource).update(sql, operation.getName(), operation.getEmpno(), operation.getEmpname());
    }

    public int delete(Integer id) throws SQLException {
        String sql = "delete from w_operation where id = ?;";
        return new QueryRunner(dataSource).update(sql, id);
    }

    @AutoFill
    public int update(Operation operation) throws SQLException {
        String sql = "select count(*) as num from w_operation where name = ?;";
        Long count = new QueryRunner(dataSource).query(sql, new ScalarHandler<>("num"), operation.getName());
        if(count > 0) {
            return 0;
        }
        sql = "update w_operation set name = ?, update_time = now() where id = ?";
        return new QueryRunner(dataSource).update(sql, operation.getName(), operation.getId());
    }

    public List<Operation> getList(String key, int pageIndex, int pageSize) throws SQLException {
        String sql = "select id, name from w_operation where 1 = 1 ";
        String where = " and name like ? ";
        String page = " order by update_time desc limit ?, ? ;";
        int offset = (pageIndex - 1) * pageSize;
        if(StringUtils.isNotBlank(key)) {
            sql  = sql + where + page;
            return new QueryRunner(dataSource).query(sql, new BeanListHandler<>(Operation.class), "%" + key + "%", offset, pageSize);
        }
        sql = sql + page;
        return new QueryRunner(dataSource).query(sql, new BeanListHandler<>(Operation.class), offset, pageSize);
    }

    public Long count(String key) throws SQLException {
        String sql = "select count(distinct id) as num from w_operation where 1 = 1 ";
        String where = " and name like ? ";
        if(StringUtils.isNotBlank(key)) {
            sql  = sql + where;
            return new QueryRunner(dataSource).query(sql, new ScalarHandler<>("num"), "%" + key + "%");
        }
        return new QueryRunner(dataSource).query(sql, new ScalarHandler<>("num"));
    }

    public List<User> hasOwner(Integer operationId) throws SQLException {
        String sql = "SELECT observer_account_id as obId, observer_account_user_name AS name, observer_account_mobile_txt AS mobile,observer_account_email_txt AS email,observer_account_employee_no AS employeeNo from dim_observer_account where observer_account_is_active_flag = 1 and observer_account_id <> -1 and observer_account_id in (select distinct observer_id from w_user_operation where operation_id = ?);";
        return new QueryRunner(dataSource).query(sql, new BeanListHandler<>(User.class), operationId);
    }


    public boolean checkName(String name) throws SQLException {
        String sql = "select count(*) as num from w_operation where name = ?;";
        Long count = new QueryRunner(dataSource).query(sql, new ScalarHandler<>("num"), name);
        return count > 0;
    }

}
