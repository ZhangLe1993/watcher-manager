package com.aihuishou.bi;

import com.aihuishou.bi.utils.SysUtils;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.web.servlet.support.SpringBootServletInitializer;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.ImportResource;
import org.springframework.core.env.Environment;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.web.context.ContextLoaderListener;
import org.springframework.web.context.WebApplicationContext;

import javax.servlet.ServletContext;
import javax.servlet.ServletContextEvent;
import javax.servlet.ServletException;
import java.io.FileNotFoundException;

@SpringBootApplication
@ComponentScan("com.aihuishou.bi")
@EnableCaching
@EnableAutoConfiguration
@EnableScheduling
@ImportResource("classpath:cas.xml")
@EnableWebSecurity
public class WatcherApplication extends SpringBootServletInitializer {

	public static ApplicationContext ctx;

	private static Environment env;

	public static void main(String[] args) {
		ctx = SpringApplication.run(WatcherApplication.class, args);
		try {
			SysUtils.load();
		} catch (FileNotFoundException e) {
			e.printStackTrace();
		}
	}

	public static String getPro(String key) {
		return env.getProperty(key);
	}

	@Autowired
	public void setEnv(Environment env) {
		WatcherApplication.env = env;
	}

	@Override
	protected SpringApplicationBuilder configure(SpringApplicationBuilder builder) {
		return builder.sources(this.getClass());
	}

	@Override
	public void onStartup(ServletContext servletContext) throws ServletException {
		this.logger = LogFactory.getLog(this.getClass());
		WebApplicationContext rootAppContext = this.createRootApplicationContext(servletContext);
		if (rootAppContext != null) {
			ctx = rootAppContext;
			servletContext.addListener(new ContextLoaderListener(rootAppContext) {
				public void contextInitialized(ServletContextEvent event) {
				}
			});
		} else {
			this.logger.debug("No ContextLoaderListener registered, as createRootApplicationContext() did not return an application context");
		}
	}

}
