package com.aihuishou.bi;

import com.aihuishou.bi.interceptor.*;
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
    public UpdateInterceptor updateInterceptor() {
        return new UpdateInterceptor();
    }

    @Bean
    public DeleteInterceptor deleteInterceptor() {
        return new DeleteInterceptor();
    }

    @Bean
    public NotFoundInterceptor notFoundInterceptor() {
        return new NotFoundInterceptor();
    }


    @Bean
    public ResourceInterceptor resourceInterceptor() {
        return new ResourceInterceptor();
    }

    @Bean
    public RosterInterceptor rosterInterceptor() {
        return new RosterInterceptor();
    }

    @Override
    protected void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(rosterInterceptor()).addPathPatterns("/**").excludePathPatterns("/static/**", "/templates/dist/**", "/images/**", "/fonts/**", "/assets/**", "/images", "/watcher/**", "/vender/**", "*.js", "*.css");
        registry.addInterceptor(updateInterceptor()).addPathPatterns("/menu/**");
        registry.addInterceptor(deleteInterceptor()).addPathPatterns("/menu/**");
        registry.addInterceptor(notFoundInterceptor()).addPathPatterns("/**")
                .excludePathPatterns("/static/**", "/templates/dist/**", "/images/**", "/fonts/**", "/assets/**", "/images/**", "/watcher/**", "/vender/**", "*.js", "*.css");
        registry.addInterceptor(resourceInterceptor()).addPathPatterns("/static/resources/**");
        registry.addInterceptor(resourceInterceptor()).addPathPatterns("/images/loading.gif");
        registry.addInterceptor(resourceInterceptor()).addPathPatterns("/fonts");
        registry.addInterceptor(resourceInterceptor()).addPathPatterns("/vendors.*.css");
        registry.addInterceptor(resourceInterceptor()).addPathPatterns("/vendors.*.js");
        registry.addInterceptor(resourceInterceptor()).addPathPatterns("/favicon.png");
        registry.addInterceptor(resourceInterceptor()).addPathPatterns("/umi.js");
        registry.addInterceptor(resourceInterceptor()).addPathPatterns("/umi.*.js");
        registry.addInterceptor(resourceInterceptor()).addPathPatterns("/umi.*.css");
        registry.addInterceptor(resourceInterceptor()).addPathPatterns("/*.chunk.css");
        registry.addInterceptor(resourceInterceptor()).addPathPatterns("/*.async.js");
    }
}
