package com.aihuishou.bi.controller;

import com.aihuishou.bi.core.SysConf;
import com.aihuishou.bi.utils.SysUtils;
import com.google.common.collect.ImmutableMap;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.io.FileNotFoundException;
import java.util.Map;


@Controller
@RequestMapping(value = "/route")
public class RouteController {

    @RequestMapping("/base")
    public String loadHtml(@RequestParam(value = "position") String position, ModelMap model) throws FileNotFoundException {
        Map<String, String> positionMap = SysUtils.getPositionMap();
        String loadName = positionMap.get(position) + SysConf.REST_JS_SUFFIX;
        String staticName = positionMap.get(position) + SysConf.REST_HTML_SUFFIX;
        model.addAttribute("model" , ImmutableMap.of("position", position, "loadName", loadName, "staticName", staticName));
        return "base";
    }


}
