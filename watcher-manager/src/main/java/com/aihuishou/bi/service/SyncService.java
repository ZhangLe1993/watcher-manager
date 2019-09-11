package com.aihuishou.bi.service;

import com.aihuishou.bi.controller.RouteController;
import com.aihuishou.bi.entity.User;
import com.aihuishou.bi.utils.StringEx;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.sql.SQLException;
import java.util.List;

@Service
public class SyncService {

    private final Logger logger = LoggerFactory.getLogger(SyncService.class);

    @Autowired
    private AuthService authService;
    @Autowired
    private UserService userService;

    @Autowired
    private MongoService mongoService;

    public void sync() throws SQLException {
        List<User> list = userService.all(null, 1,100000);
        list.add(0, new User(7205));
        for(User user : list) {
            List<String> userAuthListFromDB = authService.userAuth(user.getObId().toString());
            List<String> userAuthListFromMongo = mongoService.syncUserPermission(user.getObId().toString());
            if(userAuthListFromDB == null && userAuthListFromMongo == null) {
                //logger.info("用户obId:【】,工号:【】,姓名:【】MYSQL中查询出来的权限与MONGO中查询的一样，都为空", user.getObId(), user.getEmployeeNo(), user.getName());
                return;
            }
            if(!SyncService.isEquals(userAuthListFromDB, userAuthListFromMongo)) {
                List<String> copyDB = StringEx.copyUtil(userAuthListFromDB);

                userAuthListFromDB.removeAll(userAuthListFromMongo);

                logger.info("用户obId:【{}】,工号:【{}】,姓名:【{}】权限中  DB 中比MONGO中多出来的数组为：【{}】", user.getObId(), user.getEmployeeNo(), user.getName(), userAuthListFromDB);

                userAuthListFromMongo.removeAll(copyDB);

                logger.info("用户obId:【{}】,工号:【{}】,姓名:【{}】权限中  MONGO 中比DB中多出来的数组为：【{}】", user.getObId(), user.getEmployeeNo(), user.getName(), userAuthListFromMongo);
            }
        }
    }

    public static boolean isEquals(List<String> list1, List<String> list2) {
        if (null != list1 && null != list2) {
            if (list1.containsAll(list2) && list2.containsAll(list1)) {
                return true;
            }
            return false;
        }
        return true;
    }
}
