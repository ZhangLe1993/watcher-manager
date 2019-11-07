package com.aihuishou.bi.controller;

import com.aihuishou.bi.annotation.Delete;
import com.aihuishou.bi.annotation.SystemLog;
import com.aihuishou.bi.entity.Operation;
import com.aihuishou.bi.entity.User;
import com.aihuishou.bi.service.OperationService;
import com.aihuishou.bi.utils.ExceptionInfo;
import com.google.common.collect.ImmutableMap;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

/**
 * 新的权限接口
 */
@RestController
@RequestMapping(value = "/privileges", produces = MediaType.APPLICATION_JSON_UTF8_VALUE)
public class OperationController {

    private static final Logger logger = LoggerFactory.getLogger(OperationController.class);

    @Autowired
    private OperationService operationService;


    @SystemLog(description = "查询权限")
    @GetMapping("")
    public ResponseEntity allOperation(@RequestParam(value = "key", required = false) String key,
                                        @RequestParam(value = "page_index", required = false, defaultValue = "1") int pageIndex,
                                        @RequestParam(value = "page_size", required = false, defaultValue = "10000") int pageSize) {
        try{
            List<Operation> mounts = operationService.getList(key, pageIndex, pageSize);
            return new ResponseEntity<>(ImmutableMap.of("data", mounts,"total", operationService.count(key)), HttpStatus.OK);
        } catch(Exception e) {
            logger.error("匹配异常，异常信息: {}", ExceptionInfo.toString(e));
        }
        return new ResponseEntity<>(ImmutableMap.of("data", new ArrayList<>(),"total", 0), HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @GetMapping("/checkName")
    public ResponseEntity checkName(String name) {
        try{
            boolean exists = operationService.checkName(name);
            if(!exists) {
                return new ResponseEntity<>("false", HttpStatus.OK);
            }
            return new ResponseEntity<>("true", HttpStatus.OK);
        } catch(Exception e) {
            logger.error("匹配异常，异常信息: {}", ExceptionInfo.toString(e));
        }
        return new ResponseEntity<>("error", HttpStatus.INTERNAL_SERVER_ERROR);

    }

    @SystemLog(description = "新增操作权限")
    @Delete
    @PostMapping("")
    public ResponseEntity createPermission(@RequestBody Operation operation) {
        try{
            int count = operationService.insert(operation);
            if(count > 0) return new ResponseEntity<>("新增操作权限成功", HttpStatus.OK);
            return new ResponseEntity<>("新增操作权限失败", HttpStatus.INTERNAL_SERVER_ERROR);
        } catch(Exception e) {
            logger.error("新增操作权限异常，异常信息: {}", ExceptionInfo.toString(e));
        }
        return new ResponseEntity<>("新增操作权限失败", HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @SystemLog(description = "修改操作权限")
    @Delete
    @PutMapping("")
    public ResponseEntity updateOperation(@RequestBody Operation operation) {
        try{
            int count = operationService.update(operation);
            if(count > 0) return new ResponseEntity<>("修改操作权限成功", HttpStatus.OK);
            return new ResponseEntity<>("修改操作权限失败", HttpStatus.INTERNAL_SERVER_ERROR);
        } catch(Exception e) {
            logger.error("修改操作权限异常，异常信息: {}", ExceptionInfo.toString(e));
        }
        return new ResponseEntity<>("修改操作权限失败", HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @SystemLog(description = "删除操作权限")
    @Delete
    @DeleteMapping("")
    public ResponseEntity deleteOperation(Integer id) {
        try{
            int count = operationService.delete(id);
            if(count > 0) return new ResponseEntity<>("删除操作权限成功", HttpStatus.OK);
            return new ResponseEntity<>("删除操作权限失败", HttpStatus.INTERNAL_SERVER_ERROR);
        } catch(Exception e) {
            logger.error("删除操作权限异常，异常信息: {}", ExceptionInfo.toString(e));
        }
        return new ResponseEntity<>("删除操作权限失败", HttpStatus.INTERNAL_SERVER_ERROR);
    }

    /**
     * 权限已经绑定了的用户
     * @param operationId
     * @return
     */
    @GetMapping("/user")
    public ResponseEntity operationRole(@RequestParam(value = "operation_id") Integer operationId) {
        try {
            List<User> users = operationService.hasOwner(operationId);
            return new ResponseEntity<>(users, HttpStatus.OK);
        } catch(Exception e) {
            logger.error("查询权限已经绑定了的用户异常，异常信息: {}", ExceptionInfo.toString(e));
        }
        return new ResponseEntity<>(new ArrayList<>(), HttpStatus.INTERNAL_SERVER_ERROR);
    }

}
