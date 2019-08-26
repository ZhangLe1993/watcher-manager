package com.aihuishou.bi.controller;

import com.aihuishou.bi.annotation.SystemLog;
import com.aihuishou.bi.annotation.Update;
import com.aihuishou.bi.entity.Permission;
import com.aihuishou.bi.service.PermissionService;
import com.aihuishou.bi.utils.ExceptionInfo;
import com.google.common.collect.ImmutableMap;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/permission")
public class PermissionController {

    private static final Logger logger = LoggerFactory.getLogger(PermissionController.class);

    @Autowired
    private PermissionService permissionService;

    @SystemLog(description = "查询权限")
    @GetMapping("")
    public ResponseEntity allMount(@RequestParam(value = "key", required = false) String key,
                                   @RequestParam(value = "page_index", required = false, defaultValue = "1") int pageIndex,
                                   @RequestParam(value = "page_size", required = false, defaultValue = "10000") int pageSize) {
        try{
            List<Permission> mounts = permissionService.getList(key, pageIndex, pageSize);
            return new ResponseEntity<>(ImmutableMap.of("data", mounts,"total", permissionService.count(key)), HttpStatus.OK);
        } catch(Exception e) {
            logger.error("匹配异常，异常信息: {}", ExceptionInfo.toString(e));
        }
        return new ResponseEntity<>(ImmutableMap.of("data", new ArrayList<>(),"total", 0), HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @SystemLog(description = "新增操作权限")
    @Update
    @PostMapping("")
    public ResponseEntity createPermission(@RequestBody Permission permission) {
        try{
            int count = permissionService.create(permission);
            if(count > 0) return new ResponseEntity<>("新增操作权限成功", HttpStatus.OK);
            return new ResponseEntity<>("新增操作权限失败", HttpStatus.INTERNAL_SERVER_ERROR);
        } catch(Exception e) {
            logger.error("新增操作权限异常，异常信息: {}", ExceptionInfo.toString(e));
        }
        return new ResponseEntity<>("新增操作权限失败", HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @SystemLog(description = "修改操作权限")
    @Update
    @PutMapping("")
    public ResponseEntity updateMount(@RequestBody Permission permission) {
        try{
            int count = permissionService.update(permission);
            if(count > 0) return new ResponseEntity<>("修改操作权限成功", HttpStatus.OK);
            return new ResponseEntity<>("修改操作权限失败", HttpStatus.INTERNAL_SERVER_ERROR);
        } catch(Exception e) {
            logger.error("修改操作权限异常，异常信息: {}", ExceptionInfo.toString(e));
        }
        return new ResponseEntity<>("修改操作权限失败", HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @SystemLog(description = "删除操作权限")
    @Update
    @DeleteMapping("")
    public ResponseEntity deleteMount(Integer id) {
        try{
            int count = permissionService.delete(id);
            if(count > 0) return new ResponseEntity<>("删除操作权限成功", HttpStatus.OK);
            return new ResponseEntity<>("删除操作权限失败", HttpStatus.INTERNAL_SERVER_ERROR);
        } catch(Exception e) {
            logger.error("删除操作权限异常，异常信息: {}", ExceptionInfo.toString(e));
        }
        return new ResponseEntity<>("删除操作权限失败", HttpStatus.INTERNAL_SERVER_ERROR);
    }


}
