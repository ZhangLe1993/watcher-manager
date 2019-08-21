package com.aihuishou.bi.controller;

import com.aihuishou.bi.annotation.SystemLog;
import com.aihuishou.bi.cas.CasUtil;
import com.aihuishou.bi.entity.Role;
import com.aihuishou.bi.entity.User;
import com.aihuishou.bi.service.UserService;
import com.aihuishou.bi.utils.ExceptionInfo;
import com.google.common.collect.ImmutableMap;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/user")
public class UserController {

    private static final Logger logger = LoggerFactory.getLogger(UserController.class);

    @Autowired
    private UserService userService;

    @SystemLog(description = "获取当前用户")
    @GetMapping("/currentUser")
    public Map<String,String> getCurrentUser() {
        return ImmutableMap.of("id", CasUtil.getId(), "username", CasUtil.getUserName());
    }

    /**
     * @param key       模糊匹配：工号、姓名、角色
     * @param pageIndex
     * @param pageSize
     * @return
     */
    @GetMapping("list")
    public ResponseEntity<Map<String,Object>> search(@RequestParam(value = "key", required = false) String key,
                                                     @RequestParam(value = "page_index", defaultValue = "1", required = false) int pageIndex,
                                                     @RequestParam(value = "page_size", defaultValue = "10", required = false) int pageSize) {
        try{
            List<User> users = userService.all(key, pageIndex, pageSize);
            return new ResponseEntity<>(ImmutableMap.of("data", users, "total", userService.count(key)), HttpStatus.OK);
        } catch(Exception e) {
            logger.error("修改操作权限异常，异常信息: {}", ExceptionInfo.toString(e));
        }
        return new ResponseEntity<>(ImmutableMap.of("data", new ArrayList<>(), "total", 0), HttpStatus.INTERNAL_SERVER_ERROR);
    }

    /**
     * 用户已经绑定了的角色
     * @param obId
     * @return
     */
    @GetMapping("/role")
    public ResponseEntity userRole(@RequestParam(value = "ob_id") Long obId) {
        try {
            List<Role> roles = userService.hasOwner(obId);
            return new ResponseEntity<>(roles, HttpStatus.OK);
        } catch(Exception e) {
            logger.error("查询用户已绑定角色异常，异常信息: {}", ExceptionInfo.toString(e));
        }
        return new ResponseEntity<>(new ArrayList<>(), HttpStatus.INTERNAL_SERVER_ERROR);
    }




}
