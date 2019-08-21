package com.aihuishou.bi.service;

import com.aihuishou.bi.dao.JoinDao;
import com.aihuishou.bi.entity.Role;
import com.aihuishou.bi.utils.StringEx;
import com.aihuishou.bi.vo.RoleOperationVO;
import com.aihuishou.bi.vo.UserRoleVO;
import org.apache.commons.dbutils.QueryRunner;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.sql.SQLException;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class JoinService {

    @Autowired
    private JoinDao joinDao;

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public int userJoinRole(UserRoleVO userRoleVO) throws SQLException {
        Long obId = userRoleVO.getOb();
        List<Integer> roleIds = userRoleVO.getIds();
        if(roleIds == null || roleIds.size() == 0) {
            //1、查询已经存在的
            List<Integer> exists = joinDao.getExistsRole(obId);
            //取钱不删除并返回
            return joinDao.update(obId, exists, 1, 0);
        }
        //1、查询已经存在的
        List<Integer> exists = joinDao.getExistsRole(obId);
        if(exists == null || exists.size() == 0) {
            //如果不存在，那么全部新增之后返回
            return joinDao.create(obId, roleIds);
        }
        //2、差集 求出需要新增的   新增设置为  1
        List<Integer> add = StringEx.copyUtil(roleIds);
        add.removeAll(exists);
        joinDao.create(obId, add);

        //3、差集  求出需要剔除的  设置为 0
        List<Integer> del = StringEx.copyUtil(exists);
        del.removeAll(roleIds);
        joinDao.update(obId, del, 1, 0);

        //4、求出交集，并全部设置为active为 1
        List<Integer> join = roleIds.stream().filter(exists::contains).collect(Collectors.toList());
        joinDao.update(obId, join, 0, 1);
        return 1;
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public int roleJoinOperation(RoleOperationVO roleOperationVO) throws SQLException {
        Integer roleId = roleOperationVO.getRole();
        List<Integer> roleIds = roleOperationVO.getOperation();
        if(roleIds == null || roleIds.size() == 0) {
            //1、查询已经存在的
            List<Integer> exists = joinDao.getExistsOperation(roleId);
            //将已有的全部删除。
            return joinDao.update2(roleId, exists, 1, 0);
        }
        //1、查询已经存在的
        List<Integer> exists = joinDao.getExistsOperation(roleId);
        if(exists == null || exists.size() == 0) {
            //如果不存在，那么全部新增之后返回
            return joinDao.create2(roleId, roleIds);
        }
        //2、差集 求出需要新增的   新增设置为  1
        List<Integer> add = StringEx.copyUtil(roleIds);
        add.removeAll(exists);
        joinDao.create2(roleId, add);

        //3、差集  求出需要剔除的  设置为 0
        List<Integer> del = StringEx.copyUtil(exists);
        del.removeAll(roleIds);
        joinDao.update2(roleId, del, 1, 0);

        //4、求出交集，并全部设置为active为 1
        List<Integer> join = roleIds.stream().filter(exists::contains).collect(Collectors.toList());
        joinDao.update2(roleId, join, 0, 1);
        return 1;
    }

}
