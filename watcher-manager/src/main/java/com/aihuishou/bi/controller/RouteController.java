package com.aihuishou.bi.controller;

import com.aihuishou.bi.core.SysConf;
import com.aihuishou.bi.service.SysService;
import com.google.common.collect.ImmutableMap;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.io.FileNotFoundException;
import java.util.Map;


@Controller
@RequestMapping(value = "/route")
public class RouteController {

    private final Logger logger = LoggerFactory.getLogger(RouteController.class);

    @Autowired
    private SysService sysService;


    @RequestMapping("/base")
    public String loadHtml(@RequestParam(value = "position") String position, ModelMap model) throws FileNotFoundException {
        Map<String, String> positionMap = sysService.getPositionMap();
        String loadName = positionMap.get(position) + SysConf.REST_JS_SUFFIX;
        String staticName = positionMap.get(position) + SysConf.REST_HTML_SUFFIX;
        logger.info(loadName);
        logger.info(staticName);
        model.addAttribute("model" , ImmutableMap.of("position", position, "loadName", loadName, "staticName", staticName));
        return "base";
    }


}
