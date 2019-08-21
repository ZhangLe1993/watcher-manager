package com.aihuishou.bi.controller;

import com.aihuishou.bi.service.JoinService;
import com.aihuishou.bi.utils.ExceptionInfo;
import com.aihuishou.bi.vo.RoleOperationVO;
import com.aihuishou.bi.vo.UserRoleVO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * 用户绑定角色
 * 角色绑定用户
 */
@RestController
@RequestMapping("")
public class JoinController {

    private static final Logger logger = LoggerFactory.getLogger(JoinController.class);

    @Autowired
    private JoinService joinService;

    @PostMapping("/user/role")
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


}
