package com.aihuishou.bi;

import org.mitre.dsmiley.httpproxy.ProxyServlet;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.web.servlet.ServletRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class ProxyServletConfiguration {

    private String P_TARGET_URI = "targetUri";

    @Value("${proxy.watcher.servlet_url}")
    private String servletUrl;
    @Value("${proxy.watcher.target_url}")
    private String targetUrl;
    @Value("${proxy.watcher.logging_enabled}")
    private String loggingEnabled;

    @Bean
    public ServletRegistrationBean servletRegistrationBean(){
        ServletRegistrationBean servletRegistrationBean = new ServletRegistrationBean(new ProxyServlet(), servletUrl);
        servletRegistrationBean.addInitParameter(P_TARGET_URI, targetUrl);
        servletRegistrationBean.addInitParameter(ProxyServlet.P_LOG, loggingEnabled);
        return servletRegistrationBean;
    }

}
