package com.aihuishou.bi.controller;

import com.aihuishou.bi.core.SysConf;
import com.aihuishou.bi.entity.Mapping;
import com.aihuishou.bi.service.MappingService;
import com.aihuishou.bi.service.SysService;
import com.google.common.collect.ImmutableMap;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.io.FileNotFoundException;
import java.sql.SQLException;
import java.util.Map;


@Controller
@RequestMapping(value = "/route")
public class RouteController {

    private final Logger logger = LoggerFactory.getLogger(RouteController.class);

    @Autowired
    private SysService sysService;

    @Autowired
    private MappingService mappingService;


    @RequestMapping("/base")
    public String loadHtml(@RequestParam(value = "position") String position, ModelMap model) throws FileNotFoundException, SQLException {
        Mapping mapping = mappingService.getModel(position);
        String target = position;
        boolean map = false;
        if(mapping != null && StringUtils.isNotBlank(mapping.getTarget())) {
            map = true;
            target = mapping.getTarget();
        }
        Map<String, String> positionMap = sysService.getPositionMap();
        String loadName = positionMap.get(target) + SysConf.REST_JS_SUFFIX;
        String staticName = positionMap.get(target) + SysConf.REST_HTML_SUFFIX;
        logger.info(loadName);
        logger.info(staticName);
        model.addAttribute("model" , ImmutableMap.of("position", target, "loadName", loadName, "staticName", staticName));
        model.addAttribute("is_mapping", map);
        if(map) {
            model.addAttribute("param_key", mapping.getKey());
            model.addAttribute("param_value", mapping.getValue());
        }
        return "base";
    }


}
