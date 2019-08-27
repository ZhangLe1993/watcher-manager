package com.aihuishou.bi.core;

import com.google.common.util.concurrent.ThreadFactoryBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.concurrent.*;

@Configuration
public class SpringTask {

    private static final int MAX_POOL_SIZE = 30;
    private static final int CORE_POOL_SIZE = Runtime.getRuntime().availableProcessors() * 2 + 1;
    private static final String THREAD_NAME = "watcher-thread-%d";

    /**
     * 线程池
     * @return
     */
    @Bean(value = "watcherThreadPool")
    public ExecutorService buildWatcherThreadPool() {
        ThreadFactory threadFactory = new ThreadFactoryBuilder().setNameFormat(THREAD_NAME).build();
        ExecutorService threadPool = new ThreadPoolExecutor(
                CORE_POOL_SIZE,
                MAX_POOL_SIZE,
                0L,
                TimeUnit.SECONDS,
                new ArrayBlockingQueue<Runnable>(MAX_POOL_SIZE),
                threadFactory,
                new ThreadPoolExecutor.AbortPolicy());
        return threadPool;
    }
}
