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
            return new ResponseEntity<>("权限绑定用户成功", HttpStatus.OK);
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
            return new ResponseEntity<>("用户绑定权限成功", HttpStatus.OK);
        } catch(Exception e) {
            logger.error("用户绑定权限异常，异常信息: {}", ExceptionInfo.toString(e));
        }
        return new ResponseEntity<>("用户绑定权限失败", HttpStatus.INTERNAL_SERVER_ERROR);
    }

}
