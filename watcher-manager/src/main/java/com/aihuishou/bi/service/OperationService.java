package com.aihuishou.bi.service;

import com.aihuishou.bi.entity.Operation;
import com.aihuishou.bi.entity.User;
import org.apache.commons.dbutils.QueryRunner;
import org.apache.commons.dbutils.handlers.BeanListHandler;
import org.apache.commons.dbutils.handlers.ScalarHandler;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import javax.sql.DataSource;
import java.sql.SQLException;
import java.util.List;

@Service
public class OperationService {

    @Resource
    private DataSource dataSource;

    public int insert(Operation operation) throws SQLException {
        String sql = "select count(*) as num from operation_mapping where source_operation = ? and target_operation = ?;";
        Long count = new QueryRunner(dataSource).query(sql, new ScalarHandler<>("num"), operation.getSourceOperation(), operation.getTargetOperation());
        if(count > 0) {
            return 0;
        }
        sql = "insert into operation_mapping(source_operation, target_operation) values (?, ?);";
        return new QueryRunner(dataSource).update(sql, operation.getSourceOperation(), operation.getTargetOperation());
    }

    public int delete(Integer id) throws SQLException {
        String sql = "delete from operation_mapping where id = ?;";
        return new QueryRunner(dataSource).update(sql, id);
    }

    public int update(Operation operation) throws SQLException {
        String sql = "update operation_mapping set source_operation = ? , target_operation = ? where id = ?";
        return new QueryRunner(dataSource).update(sql, operation.getSourceOperation(), operation.getTargetOperation(), operation.getId());
    }

    public List<Operation> getList(String key, int pageIndex, int pageSize) throws SQLException {
        String sql = "select id, source_operation AS sourceOperation, target_operation as targetOperation from operation_mapping where 1 = 1 ";
        String where = " and (source_operation like ? or target_operation like ?) ";
        String page = " limit ?, ?;";
        int offset = (pageIndex - 1) * pageSize;
        if(StringUtils.isNotBlank(key)) {
            sql  = sql + where + page;
            return new QueryRunner(dataSource).query(sql, new BeanListHandler<>(Operation.class), "%" + key + "%", "%" + key + "%", offset, pageSize);
        }
        sql = sql + page;
        return new QueryRunner(dataSource).query(sql, new BeanListHandler<>(Operation.class), offset, pageSize);
    }

    public Long count(String key) throws SQLException {
        String sql = "select count(distinct id) as num from operation_mapping where 1 = 1 ";
        String where = " and (source_operation like ? or target_operation like ?) ";
        if(StringUtils.isNotBlank(key)) {
            sql  = sql + where;
            return new QueryRunner(dataSource).query(sql, new ScalarHandler<>("num"), "%" + key + "%", "%" + key + "%");
        }
        return new QueryRunner(dataSource).query(sql, new ScalarHandler<>("num"));
    }

    public List<User> hasOwner(String operation) throws SQLException {
        String sql = "SELECT observer_account_id as obId, observer_account_user_name AS name, observer_account_mobile_txt AS mobile,observer_account_email_txt AS email,observer_account_employee_no AS employeeNo from dim_observer_account where observer_account_is_active_flag = 1 and observer_account_id <> -1 and observer_account_id in (select distinct observer_id from user_operation_min where access_name in (select target_operation from operation_mapping where source_operation = ?));";
        return new QueryRunner(dataSource).query(sql, new BeanListHandler<>(User.class), operation);
    }

}
