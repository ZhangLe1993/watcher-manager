package com.aihuishou.bi.service;

import com.aihuishou.bi.dao.JoinDao;
import com.aihuishou.bi.utils.StringEx;
import com.aihuishou.bi.vo.OperationRoleVo;
import com.aihuishou.bi.vo.RoleOperationVO;
import com.aihuishou.bi.vo.RoleUserVo;
import com.aihuishou.bi.vo.UserRoleVO;
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
        List<Integer> operationIds = roleOperationVO.getOperation();
        if(operationIds == null || operationIds.size() == 0) {
            //1、查询已经存在的
            List<Integer> exists = joinDao.getExistsOperation(roleId);
            //将已有的全部删除。
            return joinDao.update2(roleId, exists, 1, 0);
        }
        //1、查询已经存在的
        List<Integer> exists = joinDao.getExistsOperation(roleId);
        if(exists == null || exists.size() == 0) {
            //如果不存在，那么全部新增之后返回
            return joinDao.create2(roleId, operationIds);
        }
        //2、差集 求出需要新增的   新增设置为  1
        List<Integer> add = StringEx.copyUtil(operationIds);
        add.removeAll(exists);
        joinDao.create2(roleId, add);

        //3、差集  求出需要剔除的  设置为 0
        List<Integer> del = StringEx.copyUtil(exists);
        del.removeAll(operationIds);
        joinDao.update2(roleId, del, 1, 0);

        //4、求出交集，并全部设置为active为 1
        List<Integer> join = operationIds.stream().filter(exists::contains).collect(Collectors.toList());
        joinDao.update2(roleId, join, 0, 1);
        return 1;
    }



    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public int roleJoinUser(RoleUserVo roleUserVo) throws SQLException {
        Integer roleId = roleUserVo.getRole();
        List<Long> obIds = roleUserVo.getIds();
        if(obIds == null || obIds.size() == 0) {
            //1、查询已经存在的
            List<Long> exists = joinDao.getExistsUser(roleId);
            //取钱不删除并返回
            return joinDao.update4(roleId, exists, 1, 0);
        }
        //1、查询已经存在的
        List<Long> exists = joinDao.getExistsUser(roleId);
        if(exists == null || exists.size() == 0) {
            //如果不存在，那么全部新增之后返回
            return joinDao.create4(roleId, obIds);
        }
        //2、差集 求出需要新增的   新增设置为  1
        List<Long> add = StringEx.copyUtil(obIds);
        add.removeAll(exists);
        joinDao.create4(roleId, add);

        //3、差集  求出需要剔除的  设置为 0
        List<Long> del = StringEx.copyUtil(exists);
        del.removeAll(obIds);
        joinDao.update4(roleId, del, 1, 0);

        //4、求出交集，并全部设置为active为 1
        List<Long> join = obIds.stream().filter(exists::contains).collect(Collectors.toList());
        joinDao.update4(roleId, join, 0, 1);
        return 1;
    }

    /**
     * 权限绑定角色
     * @param operationRoleVo
     * @return
     * @throws SQLException
     */
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public int operationJoinRole(OperationRoleVo operationRoleVo) throws SQLException {
        Integer operationId = operationRoleVo.getOperation();
        List<Integer> roleIds = operationRoleVo.getRole();
        if(roleIds == null || roleIds.size() == 0) {
            //1、查询已经存在的
            List<Integer> exists = joinDao.getExistsRole(operationId);
            //将已有的全部删除。
            return joinDao.update3(operationId, exists, 1, 0);
        }
        //1、查询已经存在的
        List<Integer> exists = joinDao.getExistsRole(operationId);
        if(exists == null || exists.size() == 0) {
            //如果不存在，那么全部新增之后返回
            return joinDao.create3(operationId, roleIds);
        }
        //2、差集 求出需要新增的   新增设置为  1
        List<Integer> add = StringEx.copyUtil(roleIds);
        add.removeAll(exists);
        joinDao.create3(operationId, add);

        //3、差集  求出需要剔除的  设置为 0
        List<Integer> del = StringEx.copyUtil(exists);
        del.removeAll(roleIds);
        joinDao.update3(operationId, del, 1, 0);

        //4、求出交集，并全部设置为active为 1
        List<Integer> join = roleIds.stream().filter(exists::contains).collect(Collectors.toList());
        joinDao.update3(operationId, join, 0, 1);
        return 1;
    }

}
