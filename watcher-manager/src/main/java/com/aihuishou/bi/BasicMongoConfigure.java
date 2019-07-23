package com.aihuishou.bi;

import com.mongodb.MongoClient;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.SimpleMongoDbFactory;

@Configuration
public class BasicMongoConfigure {

    @Value("${basic.mongodb.host}")
    private String host;
    @Value("${basic.mongodb.database}")
    private String database;
    @Value("${basic.mongodb.port}")
    private int port;


    @Bean(name = "basicMongoTemplate")
    public MongoTemplate getMongoTemplate() throws Exception {
        return new MongoTemplate(new SimpleMongoDbFactory(new MongoClient(host, port), database));
    }
}
