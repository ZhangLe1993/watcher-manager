package com.aihuishou.bi.service;

import com.aihuishou.bi.core.Admin;
import com.aihuishou.bi.entity.Role;
import com.aihuishou.bi.entity.User;
import org.apache.commons.dbutils.QueryRunner;
import org.apache.commons.dbutils.handlers.BeanHandler;
import org.apache.commons.dbutils.handlers.BeanListHandler;
import org.apache.commons.dbutils.handlers.ScalarHandler;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import javax.sql.DataSource;
import java.sql.SQLException;
import java.util.List;

@Service
public class UserService {

    @Resource
    private DataSource dataSource;

    @Autowired
    private AdminService adminService;

    @Cacheable(value = "current-user", key = "#obId")
    public User getUserByObId(String obId) throws SQLException {
        String sql = "SELECT observer_account_id as obId, observer_account_user_name AS name, observer_account_mobile_txt AS mobile,observer_account_email_txt AS email,observer_account_employee_no AS employeeNo from dim_observer_account WHERE observer_account_id=? order by observer_account_id desc limit 0,1;";
        User user = new QueryRunner(dataSource).query(sql, new BeanHandler<>(User.class), Long.parseLong(obId));
        Admin admin = adminService.inBoss(user.getEmployeeNo());
        if(admin.getCode() != Admin.GUEST.getCode()) {
            user.setAdmin(true);
        }
        return user;
    }

    public List<User> all(String key, int pageIndex, int pageSize) throws SQLException {
        String sql = "SELECT observer_account_id as obId, observer_account_user_name AS name, observer_account_mobile_txt AS mobile,observer_account_email_txt AS email,observer_account_employee_no AS employeeNo from dim_observer_account where observer_account_id <> -1";
        String where = " and observer_account_id like ? or observer_account_user_name like ? or observer_account_employee_no like ? ";
        String page = " order by observer_account_id limit ?,?";
        int offset = (pageIndex - 1) * pageSize;
        if(StringUtils.isNotBlank(key)) {
            sql = sql + where + page;
            return new QueryRunner(dataSource).query(sql, new BeanListHandler<>(User.class), "%" + key + "%", "%" + key + "%", "%" + key + "%", offset, pageSize);
        }
        sql = sql + page;
        return new QueryRunner(dataSource).query(sql, new BeanListHandler<>(User.class), offset, pageSize);
    }

    public Long count(String key) throws SQLException {
        String sql = "SELECT count(distinct observer_account_id) as num from dim_observer_account where observer_account_id <> -1";
        String where = " and observer_account_id like ? or observer_account_user_name like ? or observer_account_employee_no like ? ";
        if(StringUtils.isNotBlank(key)) {
            sql = sql + where;
            return new QueryRunner(dataSource).query(sql, new ScalarHandler<>("num"), "%" + key + "%", "%" + key + "%", "%" + key + "%");
        }
        return new QueryRunner(dataSource).query(sql, new ScalarHandler<>("num"));
    }


    public List<Role> hasOwner(Long obId) throws SQLException {
        String sql = "select id,name,alias,description,active from ods_ob_foundation_role where active = 1 and id in (select distinct roleid from ods_ob_foundation_observerrole where active = 1 and observerid = ?);";
        return new QueryRunner(dataSource).query(sql, new BeanListHandler<>(Role.class), obId);
    }
}
