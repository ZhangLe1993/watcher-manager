package com.aihuishou.bi.controller;

import com.aihuishou.bi.annotation.SystemLog;
import com.aihuishou.bi.entity.Role;
import com.aihuishou.bi.service.RoleService;
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
@RequestMapping("/role")
public class RoleController {

    private static final Logger logger = LoggerFactory.getLogger(MenuController.class);

    @Autowired
    private RoleService roleService;

    @SystemLog(description = "查询角色")
    @GetMapping("/")
    public ResponseEntity allMount(@RequestParam(value = "key", required = false) String key,
                                   @RequestParam(value = "page_index", required = false, defaultValue = "1") int pageIndex,
                                   @RequestParam(value = "page_size", required = false, defaultValue = "10000") int pageSize) {
        try{
            List<Role> mounts = roleService.getList(key, pageIndex, pageSize);
            return new ResponseEntity<>(ImmutableMap.of("data", mounts,"total", roleService.count(key)), HttpStatus.OK);
        } catch(Exception e) {
            logger.error("匹配异常，异常信息: {}", ExceptionInfo.toString(e));
        }
        return new ResponseEntity<>(ImmutableMap.of("data", new ArrayList<>(),"total", 0), HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @SystemLog(description = "新增角色")
    /*@Update*/
    @PostMapping("")
    public ResponseEntity createPermission(@RequestBody Role role) {
        try{
            int count = roleService.create(role);
            if(count > 0) return new ResponseEntity<>("新增角色成功", HttpStatus.OK);
            return new ResponseEntity<>("新增角色失败", HttpStatus.INTERNAL_SERVER_ERROR);
        } catch(Exception e) {
            logger.error("新增角色异常，异常信息: {}", ExceptionInfo.toString(e));
        }
        return new ResponseEntity<>("新增角色失败", HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @SystemLog(description = "修改角色")
    /*@Update*/
    @PutMapping("")
    public ResponseEntity updateMount(@RequestBody Role role) {
        try{
            int count = roleService.update(role);
            if(count > 0) return new ResponseEntity<>("修改角色成功", HttpStatus.OK);
            return new ResponseEntity<>("修改角色失败", HttpStatus.INTERNAL_SERVER_ERROR);
        } catch(Exception e) {
            logger.error("修改角色异常，异常信息: {}", ExceptionInfo.toString(e));
        }
        return new ResponseEntity<>("修改角色失败", HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @SystemLog(description = "删除角色")
    /*@Delete*/
    @DeleteMapping("")
    public ResponseEntity deleteMount(Integer id) {
        try{
            int count = roleService.delete(id);
            if(count > 0) return new ResponseEntity<>("删除角色成功", HttpStatus.OK);
            return new ResponseEntity<>("删除角色失败", HttpStatus.INTERNAL_SERVER_ERROR);
        } catch(Exception e) {
            logger.error("删除角色异常，异常信息: {}", ExceptionInfo.toString(e));
        }
        return new ResponseEntity<>("删除角色失败", HttpStatus.INTERNAL_SERVER_ERROR);
    }


}
