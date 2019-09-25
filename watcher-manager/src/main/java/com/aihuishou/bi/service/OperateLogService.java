package com.aihuishou.bi.service;

import com.aihuishou.bi.entity.OperateLog;
import com.aihuishou.bi.vo.OperationInfo;
import org.apache.commons.dbutils.QueryRunner;
import org.apache.commons.dbutils.ResultSetHandler;
import org.apache.commons.dbutils.handlers.BeanListHandler;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import javax.sql.DataSource;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

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

    public List<OperationInfo> getOperationInfoList(String nodeType, Integer nodeId) throws SQLException {
        String sql = "select event, description,employee_name, operate_time from operate_log_b where target=? and target_id=? order by operate_time desc";
        List<List<OperationInfo>> operationInfos = new QueryRunner(dataSource).execute(sql, new BeanListHandler<OperationInfo>(OperationInfo.class), nodeType, nodeId);
        if(operationInfos != null && operationInfos.size() > 0){
            return operationInfos.get(0);
        }
        return new ArrayList<OperationInfo>();
    }
}
