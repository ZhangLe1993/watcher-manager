package com.aihuishou.bi.interceptor;

import com.aihuishou.bi.WatcherApplication;
import com.aihuishou.bi.cas.CasUtil;
import com.aihuishou.bi.entity.User;
import com.aihuishou.bi.service.RosterService;
import com.aihuishou.bi.service.UserService;
import org.apache.commons.lang3.StringUtils;
import org.apache.logging.log4j.util.Strings;
import org.springframework.http.HttpStatus;
import org.springframework.web.method.HandlerMethod;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.handler.HandlerInterceptorAdapter;

import javax.annotation.Resource;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

public class RosterInterceptor extends HandlerInterceptorAdapter {

    @Resource
    private RosterService rosterService;

    @Resource
    private UserService userService;

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        response.setContentType("application/json;charset=UTF-8");
        if (!(handler instanceof HandlerMethod)) {
            return true;
        }
        String obId = CasUtil.getId();
        if (Strings.isBlank(obId)) {
            response.setStatus(HttpStatus.FORBIDDEN.value());
            response.getWriter().print("登录信息失效，请重新登录");
            return false;
        }
        if (rosterService == null) {
            rosterService = WatcherApplication.ctx.getBean(RosterService.class);
        }
        if (userService == null) {
            userService = WatcherApplication.ctx.getBean(UserService.class);
        }
        User user = userService.getUserByObId(obId);
        if(user == null || StringUtils.isBlank(user.getEmployeeNo())) {
            //response.setStatus(HttpStatus.FORBIDDEN.value());
            //response.getWriter().print("用户不存在或登录信息失效");
            return redirectAndCookie(response);
        }
        boolean exists = rosterService.exist(user.getEmployeeNo());
        if(!exists) {
            //HttpSession session = request.getSession();
            return redirectAndCookie(response);
        }
        return true;
    }

    private boolean redirectAndCookie(HttpServletResponse response) throws IOException {
        Cookie cookie = new Cookie("watchernew", "0");
        cookie.setPath("/");
        response.addCookie(cookie);
        cookie.setMaxAge(3 * 60 * 60);//设置为3个小时
        response.sendRedirect("/dashboard");
        return false;
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
