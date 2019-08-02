package com.aihuishou.bi;

import com.aihuishou.bi.interceptor.NotFoundInterceptor;
import com.aihuishou.bi.interceptor.ResourceInterceptor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.util.ResourceUtils;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurationSupport;

@Configuration
public class WebMvcConfig extends WebMvcConfigurationSupport {

    @Override
    protected void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/static/**").addResourceLocations(ResourceUtils.CLASSPATH_URL_PREFIX + "static/");
        registry.addResourceHandler("/fonts/**").addResourceLocations(ResourceUtils.CLASSPATH_URL_PREFIX + "fonts/");
        registry.addResourceHandler("/assets/**").addResourceLocations(ResourceUtils.CLASSPATH_URL_PREFIX + "assets/");
        registry.addResourceHandler("/images/**").addResourceLocations(ResourceUtils.CLASSPATH_URL_PREFIX + "images/");
        registry.addResourceHandler("/*.html").addResourceLocations("classpath:/templates/dist/");
        registry.addResourceHandler("/*.js").addResourceLocations("classpath:/templates/dist/");
        registry.addResourceHandler("/*.css").addResourceLocations("classpath:/templates/dist/");
        super.addResourceHandlers(registry);
    }


    @Bean
    public NotFoundInterceptor notFoundInterceptor() {
        return new NotFoundInterceptor();
    }


    @Bean
    public ResourceInterceptor resourceInterceptor() {
        return new ResourceInterceptor();
    }

    @Override
    protected void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(notFoundInterceptor()).addPathPatterns("/**")
                .excludePathPatterns("/static/**", "/templates/dist/**", "/images/**", "/fonts", "/assets", "/images", "/error", "/watcher/**", "/vender/**");
        registry.addInterceptor(resourceInterceptor()).addPathPatterns("/static/resources/**");
        registry.addInterceptor(resourceInterceptor()).addPathPatterns("/images/loading.gif");
        registry.addInterceptor(resourceInterceptor()).addPathPatterns("/fonts");
        registry.addInterceptor(resourceInterceptor()).addPathPatterns("/vendors.*.css");
        registry.addInterceptor(resourceInterceptor()).addPathPatterns("/vendors.*.js");
        registry.addInterceptor(resourceInterceptor()).addPathPatterns("/favicon.png");
        registry.addInterceptor(resourceInterceptor()).addPathPatterns("/umi.js");
    }
}
