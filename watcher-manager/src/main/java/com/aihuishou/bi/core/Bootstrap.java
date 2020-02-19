package com.aihuishou.bi.core;

import com.aihuishou.bi.service.SysService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import javax.annotation.Resource;
import java.util.concurrent.ExecutorService;

@Component
public class Bootstrap implements CommandLineRunner {

    @Autowired
    private SysService sysService;

    @Resource(name="watcherThreadPool")
    private ExecutorService service;

    private final Logger logger = LoggerFactory.getLogger(Bootstrap.class);

    @Override
    public void run(String... args) throws Exception {
        sysService.getPositionMap();
        //syncService.sync();
        //mongoService.syncUserPermission("7205");
    }

}
