package com.aihuishou.bi.controller;

import com.aihuishou.bi.vo.RoleOperationVO;
import com.aihuishou.bi.vo.UserRoleVO;
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
@RequestMapping("")
public class JoinController {

    @PostMapping("/user/role")
    public ResponseEntity userJoinRole(@RequestBody UserRoleVO userRoleVO) {

        return null;
    }

    @PostMapping("/role/operation")
    public ResponseEntity roleJoinOperation(@RequestBody RoleOperationVO roleOperationVO) {

        return null;
    }


}
