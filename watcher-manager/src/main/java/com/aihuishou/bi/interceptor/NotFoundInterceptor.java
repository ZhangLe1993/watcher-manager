package com.aihuishou.bi.interceptor;

import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.handler.HandlerInterceptorAdapter;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public class NotFoundInterceptor extends HandlerInterceptorAdapter {

    private static final Logger logger = LoggerFactory.getLogger(NotFoundInterceptor.class);

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        return super.preHandle(request, response, handler);
    }

    @Override
    public void postHandle(HttpServletRequest request, HttpServletResponse response, Object handler, ModelAndView modelAndView) throws Exception {
        super.postHandle(request, response, handler, modelAndView);
    }

    @Override
    public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex) throws Exception {
        if(response.getStatus() == HttpStatus.NOT_FOUND.value() || (StringUtils.isNotBlank(request.getRequestURI()) && "/error".equalsIgnoreCase(request.getRequestURI()))) {
            /*logger.error("\r\n" + request.getRequestURI() + "\r\n");*/
            logger.error("404错误，页面自动跳转到首页");
            response.sendRedirect("/");
            return;
        }
        super.afterCompletion(request, response, handler, ex);
    }
}
