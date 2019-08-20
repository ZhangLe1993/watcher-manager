package com.aihuishou.bi.service;

import com.aihuishou.bi.vo.UserRoleVO;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class JoinService {

    public void userJoinRole(UserRoleVO userRoleVO) {
        Long obId = userRoleVO.getOb();
        List<Integer> roleIds = userRoleVO.getIds();




    }
}
