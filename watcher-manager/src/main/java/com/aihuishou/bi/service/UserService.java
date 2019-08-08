package com.aihuishou.bi.service;

import com.aihuishou.bi.entity.User;
import org.apache.commons.dbutils.QueryRunner;
import org.apache.commons.dbutils.handlers.BeanHandler;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import javax.sql.DataSource;
import java.sql.SQLException;

@Service
public class UserService {

    @Qualifier("greenPlum")
    @Resource
    private DataSource greenPlum;

    @Cacheable(value = "current-user", key = "#obId")
    public User getUserByObId(String obId) throws SQLException {
        String sql = "SELECT observer_id as obId, observer_name AS name, observer_mobile AS mobile,observer_account_name AS email,coalesce(employee_no,observer_employee_no) AS employeeNo from dim.dim_observer WHERE observer_id=? order by employee_no desc limit 1;";
        return new QueryRunner(greenPlum).query(sql, new BeanHandler<>(User.class), Long.parseLong(obId));
    }
}
