package com.aihuishou.bi.service;

import com.aihuishou.bi.dao.RoleDao;
import com.aihuishou.bi.entity.Permission;
import com.aihuishou.bi.entity.Role;
import com.aihuishou.bi.entity.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.sql.SQLException;
import java.util.List;
import java.util.concurrent.ExecutorService;

@Service
public class RoleService {

    @Resource(name="watcherThreadPool")
    private ExecutorService service;

    @Autowired
    private RoleDao roleDao;

    public int create(Role role) throws SQLException {
        return roleDao.insert(role);
    }

    public List<Role> getList(String key, int pageIndex, int pageSize) throws SQLException {
        int offset = (pageIndex - 1) * pageSize;
        return roleDao.getList(key, offset, pageSize);
    }

    public Long count(String key) throws SQLException {
        return roleDao.count(key);
    }

    //删除
    public int delete(Integer id) throws SQLException {
        return roleDao.delete(id);
    }

    public int update(Role role) throws SQLException {
        return roleDao.update(role);
    }


    public List<Permission> hasOwner(Integer roleId) throws SQLException {
        return roleDao.hasOwner(roleId);
    }

    public List<User> bHasOwner(Integer roleId) throws SQLException {
        return roleDao.bHasOwner(roleId);
    }
}
