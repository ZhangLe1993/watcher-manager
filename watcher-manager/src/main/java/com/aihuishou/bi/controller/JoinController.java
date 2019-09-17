package com.aihuishou.bi.controller;

import com.aihuishou.bi.annotation.Delete;
import com.aihuishou.bi.service.JoinService;
import com.aihuishou.bi.utils.ExceptionInfo;
import com.aihuishou.bi.vo.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * 用户绑定角色
 * 角色绑定用户
 */
@RestController
@RequestMapping(value = "", produces = MediaType.APPLICATION_JSON_UTF8_VALUE)
public class JoinController {

    private static final Logger logger = LoggerFactory.getLogger(JoinController.class);

    @Autowired
    private JoinService joinService;

    @PostMapping("/user/role")
    @Delete
    public ResponseEntity userJoinRole(@RequestBody UserRoleVO userRoleVO) {
        try {
            int count = joinService.userJoinRole(userRoleVO);
            if(count > 0) return new ResponseEntity<>("用户绑定角色成功", HttpStatus.OK);
            return new ResponseEntity<>("用户绑定角色失败", HttpStatus.INTERNAL_SERVER_ERROR);
        } catch(Exception e) {
            logger.error("用户绑定角色异常，异常信息: {}", ExceptionInfo.toString(e));
        }
        return new ResponseEntity<>("用户绑定角色失败", HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @PostMapping("/role/user")
    @Delete
    public ResponseEntity userJoinRole(@RequestBody RoleUserVo roleUserVo) {
        try {
            int count = joinService.roleJoinUser(roleUserVo);
            if(count > 0) return new ResponseEntity<>("角色绑定用户成功", HttpStatus.OK);
            return new ResponseEntity<>("角色绑定用户失败", HttpStatus.INTERNAL_SERVER_ERROR);
        } catch(Exception e) {
            logger.error("角色绑定用户异常，异常信息: {}", ExceptionInfo.toString(e));
        }
        return new ResponseEntity<>("角色绑定用户失败", HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @Delete
    @PostMapping("/role/operation")
    public ResponseEntity roleJoinOperation(@RequestBody RoleOperationVO roleOperationVO) {
        try {
            int count = joinService.roleJoinOperation(roleOperationVO);
            if(count > 0) return new ResponseEntity<>("角色绑定权限成功", HttpStatus.OK);
            return new ResponseEntity<>("角色绑定权限失败", HttpStatus.INTERNAL_SERVER_ERROR);
        } catch(Exception e) {
            logger.error("角色绑定权限异常，异常信息: {}", ExceptionInfo.toString(e));
        }
        return new ResponseEntity<>("角色绑定权限失败", HttpStatus.INTERNAL_SERVER_ERROR);
    }


    @Delete
    @PostMapping("/permission/role")
    public ResponseEntity OperationJoinRole(@RequestBody OperationRoleVo operationRoleVo) {
        try {
            int count = joinService.operationJoinRole(operationRoleVo);
            if(count > 0) return new ResponseEntity<>("权限绑定角色成功", HttpStatus.OK);
            return new ResponseEntity<>("权限绑定角色失败", HttpStatus.INTERNAL_SERVER_ERROR);
        } catch(Exception e) {
            logger.error("权限绑定角色异常，异常信息: {}", ExceptionInfo.toString(e));
        }
        return new ResponseEntity<>("权限绑定角色失败", HttpStatus.INTERNAL_SERVER_ERROR);
    }


    /**
     * 权限绑定用户
     * @param ou
     * @return
     */
    @PostMapping("/privileges/user")
    @Delete
    public ResponseEntity operationJoinUser(@RequestBody OperationUserVO ou) {
        try {
            int count = joinService.operationJoinUser(ou);
            if(count > 0) return new ResponseEntity<>("权限绑定用户成功", HttpStatus.OK);
            return new ResponseEntity<>("权限绑定用户失败", HttpStatus.INTERNAL_SERVER_ERROR);
        } catch(Exception e) {
            logger.error("权限绑定用户异常，异常信息: {}", ExceptionInfo.toString(e));
        }
        return new ResponseEntity<>("权限绑定用户失败", HttpStatus.INTERNAL_SERVER_ERROR);
    }

    /**
     * 用户绑定权限
     * @param uo
     * @return
     */
    @PostMapping("/user/privileges")
    @Delete
    public ResponseEntity userJoinOperation(@RequestBody UserOperationVO uo) {
        try {
            int count = joinService.userJoinOperation(uo);
            if(count > 0) return new ResponseEntity<>("用户绑定权限成功", HttpStatus.OK);
            return new ResponseEntity<>("用户绑定权限失败", HttpStatus.INTERNAL_SERVER_ERROR);
        } catch(Exception e) {
            logger.error("用户绑定权限异常，异常信息: {}", ExceptionInfo.toString(e));
        }
        return new ResponseEntity<>("用户绑定权限失败", HttpStatus.INTERNAL_SERVER_ERROR);
    }

}
