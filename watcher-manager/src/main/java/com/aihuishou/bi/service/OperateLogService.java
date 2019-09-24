package com.aihuishou.bi.service;

import com.aihuishou.bi.entity.OperateLog;
import org.apache.commons.dbutils.QueryRunner;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import javax.sql.DataSource;
import java.sql.SQLException;

@Service
public class OperateLogService {

    @Resource
    private DataSource dataSource;

    public void logger(String event, String description, String person, String operateTime) throws SQLException {
        String sql = "insert into operate_log_b (event, target, target_id, operate_type, description, employee_name, employee_no, operate_time) values (?, ?, ?, ?, ?, ?, ?, ?);";
        //new QueryRunner(dataSource).update(sql, event, description, person, operateTime);
    }

    public void logger(OperateLog operateLog) throws SQLException {
        String sql = "insert into operate_log_b (event, target, target_id, operate_type, description, employee_name, employee_no, operate_time) values (?, ?, ?, ?, ?, ?, ?, ?);";
        new QueryRunner(dataSource).update(sql, operateLog.getEvent(), operateLog.getTarget(), operateLog.getTargetId(), operateLog.getOperateType(), operateLog.getDescription(), operateLog.getEmployeeName(), operateLog.getEmployeeNo(), operateLog.getOperateTime());
    }
}
