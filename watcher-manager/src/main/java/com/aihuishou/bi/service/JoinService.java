package com.aihuishou.bi.service;

import com.aihuishou.bi.dao.JoinDao;
import com.aihuishou.bi.utils.StringEx;
import com.aihuishou.bi.vo.*;
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

    /**
     * 用户绑定权限
     * @param uo
     * @return
     * @throws SQLException
     */
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public int userJoinOperation(UserOperationVO uo) throws SQLException {
        Long obId = uo.getOb();
        List<Integer> operationIds = uo.getOperationIds();
        if(operationIds == null || operationIds.size() == 0) {
            //1、查询已经存在的
            List<Integer> exists = joinDao.getExistsOperation(obId);
            //直接删除并返回
            return joinDao.updateUO(obId, exists);
        }
        //1、查询已经存在的
        List<Integer> exists = joinDao.getExistsOperation(obId);
        if(exists == null || exists.size() == 0) {
            //如果不存在，那么全部新增之后返回
            return joinDao.createUO(obId, operationIds);
        }
        //2、差集 求出需要新增的   新增设置为  1
        List<Integer> add = StringEx.copyUtil(operationIds);
        add.removeAll(exists);
        joinDao.createUO(obId, add);

        //3、差集  求出需要剔除的  设置为 0
        List<Integer> del = StringEx.copyUtil(exists);
        del.removeAll(operationIds);
        joinDao.updateUO(obId, del);

        //4、求出交集，并全部设置为active为 1，交集是不用新增的
        //List<String> join = roleIds.stream().filter(exists::contains).collect(Collectors.toList());
        //joinDao.update(obId, join, 0, 1);
        return 1;
    }


    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public int operationJoinUser(OperationUserVO ou) throws SQLException {
        Integer operationId = ou.getOperationId();
        List<Integer> obIds = ou.getIds();
        if(obIds == null || obIds.size() == 0) {
            //1、查询已经存在的
            List<Integer> exists = joinDao.getExistsUser(operationId);
            //全部删除并返回
            return joinDao.update4(operationId, exists);
        }
        //1、查询已经存在的
        List<Integer> exists = joinDao.getExistsUser(operationId);
        if(exists == null || exists.size() == 0) {
            //如果不存在，那么全部新增之后返回
            return joinDao.create4(operationId, obIds);
        }
        //2、差集 求出需要新增的   新增设置为  1
        List<Integer> add = obIds.stream().filter(t -> !exists.contains(t)).collect(Collectors.toList());
        // add.removeAll(exists);
        //list.stream().forEach(System.out::println);
        joinDao.create4(operationId, add);

        //3、差集  求出需要剔除的  设置为 0
        List<Integer> del = exists.stream().filter(t -> !obIds.contains(t)).collect(Collectors.toList());
        //del.removeAll(obIds);
        joinDao.update4(operationId, del);

        //4、求出交集，并全部设置为active为 1
        /*List<Long> join = obIds.stream().filter(exists::contains).collect(Collectors.toList());
        joinDao.update4(roleId, join, 0, 1);*/
        return 1;
    }
}
