package com.aihuishou.bi.service;

import com.aihuishou.bi.dao.PermissionDao;
import com.aihuishou.bi.entity.Permission;
import com.aihuishou.bi.entity.Role;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.sql.SQLException;
import java.util.List;

@Service
public class PermissionService {

    @Autowired
    private PermissionDao permissionDao;

    public int create(Permission permission) throws SQLException {
        return permissionDao.insert(permission);
    }

    public List<Permission> getList(String key, int pageIndex, int pageSize) throws SQLException {
        int offset = (pageIndex - 1) * pageSize;
        return permissionDao.getList(key, offset, pageSize);
    }

    public Long count(String key) throws SQLException {
        return permissionDao.count(key);
    }

    //删除
    public int delete(Integer id) throws SQLException {
        return permissionDao.delete(id);
    }

    public int update(Permission permission) throws SQLException {
        return permissionDao.update(permission);
    }

    public List<Role> hasOwner(Integer operationId) throws SQLException {
        return permissionDao.hasOwner(operationId);
    }

    /**
     *
     * @return
     */
    public List<String> buildRoleBindOperationByGroupSQL() throws SQLException {
        List<Permission> list = permissionDao.scanWhenNotNullGroupSQL();
        return null;
    }
}
