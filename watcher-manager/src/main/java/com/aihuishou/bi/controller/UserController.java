package com.aihuishou.bi.controller;

import com.aihuishou.bi.annotation.SystemLog;
import com.aihuishou.bi.cas.CasUtil;
import com.google.common.collect.ImmutableMap;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/user")
public class UserController {

    @SystemLog(description = "获取当前用户")
    @GetMapping("/currentUser")
    public Map<String,String> getCurrentUser() {
        return ImmutableMap.of("id", CasUtil.getId(), "username", CasUtil.getUserName());
    }

}
