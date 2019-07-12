package com.aihuishou.bi.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class IndexC {


    @RequestMapping(value = {"/back/**","/"})
    public String index() {
        System.out.println("indexC===>index");
        return "index";
    }

    @RequestMapping("_health_check")
    public void healthCheck(){

    }
}
