package com.aihuishou.bi.service;

import org.apache.commons.dbutils.QueryRunner;
import org.apache.commons.dbutils.handlers.ScalarHandler;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import javax.sql.DataSource;
import java.sql.SQLException;

@Service
public class RosterService {

    @Resource
    private DataSource dataSource;

    public boolean exist(String employeeNo) throws SQLException {
        String sql = "select count(distinct id) as num from roster where employee_no = ?;";
        Long count = new QueryRunner(dataSource).query(sql, new ScalarHandler<>("num"), employeeNo);
        return count > 0;
    }
}
