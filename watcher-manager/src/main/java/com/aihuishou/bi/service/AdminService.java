package com.aihuishou.bi.service;

import com.aihuishou.bi.core.Admin;
import org.apache.commons.dbutils.QueryRunner;
import org.apache.commons.dbutils.handlers.ScalarHandler;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import javax.sql.DataSource;
import java.sql.SQLException;

@Service
public class AdminService {

    @Resource
    private DataSource dataSource;

    /**
     * 获取当前登录用户是什么权限
     * @return
     */
    public Admin inBoss(String employeeNo) throws SQLException {
        //严格限制仅有一条
        String sql = "select count(*) as num from admin where employee_no = ?;";
        Long num = new QueryRunner(dataSource).query(sql, new ScalarHandler<>("num"), employeeNo);
        if(num != null && num > 0) {
            sql = "select ifnull(role, -1) role from admin where employee_no = ? limit 0, 1;";
            Long role = new QueryRunner(dataSource).query(sql, new ScalarHandler<>("role"), employeeNo);
            return check(role.intValue());
        }
        return Admin.GUEST;
    }

    public Admin check(int code) {
        switch(code) {
            case -1 :
                return Admin.GUEST;
            case 0:
                return Admin.ADMIN;
            case 1:
                return Admin.MAINTAINER;
            case 2:
                return Admin.DEVELOPER;
            default:
                return Admin.GUEST;
        }
    }
}
