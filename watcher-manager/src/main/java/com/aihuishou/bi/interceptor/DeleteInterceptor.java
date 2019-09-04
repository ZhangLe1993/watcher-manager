package com.aihuishou.bi.interceptor;

import com.aihuishou.bi.WatcherApplication;
import com.aihuishou.bi.annotation.Delete;
import com.aihuishou.bi.annotation.Update;
import com.aihuishou.bi.cas.CasUtil;
import com.aihuishou.bi.core.Admin;
import com.aihuishou.bi.entity.User;
import com.aihuishou.bi.service.AdminService;
import com.aihuishou.bi.service.UserService;
import org.apache.commons.lang3.StringUtils;
import org.apache.logging.log4j.util.Strings;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.method.HandlerMethod;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.handler.HandlerInterceptorAdapter;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public class DeleteInterceptor extends HandlerInterceptorAdapter {

    @Autowired
    private AdminService adminService;

    @Autowired
    private UserService userService;

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        if (!(handler instanceof HandlerMethod)) {
            return true;
        }
        Delete operate = ((HandlerMethod) handler).getMethodAnnotation(Delete.class);
        if (operate != null) {
            String obId = CasUtil.getId();
            if (Strings.isBlank(obId)) {
                response.setStatus(HttpStatus.FORBIDDEN.value());
                response.getWriter().print("登录信息失效，请重新登录");
                return false;
            }
            if (adminService == null) {
                adminService = WatcherApplication.ctx.getBean(AdminService.class);
            }
            if (userService == null) {
                userService = WatcherApplication.ctx.getBean(UserService.class);
            }
            User user = userService.getUserByObId(obId);
            if(user == null || StringUtils.isBlank(user.getEmployeeNo())) {
                response.setStatus(HttpStatus.FORBIDDEN.value());
                response.getWriter().print("用户不存在或登录信息失效");
                return false;
            }
            Admin admin = adminService.inBoss(user.getEmployeeNo());
            if(admin.getCode() == Admin.GUEST.getCode() || admin.getCode() == Admin.DEVELOPER.getCode()) {
                response.setStatus(HttpStatus.FORBIDDEN.value());
                response.getWriter().print("您没有权限进行此项操作，请联系管理员 yule.zhang@aihuishou.com ");
                return false;
            }
            return true;
        }
        return true;
    }

    @Override
    public void postHandle(HttpServletRequest request, HttpServletResponse response, Object handler, ModelAndView modelAndView) throws Exception {
        super.postHandle(request, response, handler, modelAndView);
    }

    @Override
    public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex) throws Exception {
        super.afterCompletion(request, response, handler, ex);
    }
}
