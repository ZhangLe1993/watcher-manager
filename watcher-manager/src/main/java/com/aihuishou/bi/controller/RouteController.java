package com.aihuishou.bi.controller;

import com.aihuishou.bi.annotation.Mark;
import com.aihuishou.bi.annotation.SystemLog;
import com.aihuishou.bi.cas.CasUtil;
import com.aihuishou.bi.core.SysConf;
import com.aihuishou.bi.entity.Mapping;
import com.aihuishou.bi.service.AuthService;
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

import javax.servlet.http.HttpServletResponse;
import java.io.FileNotFoundException;
import java.sql.SQLException;
import java.util.List;
import java.util.Map;


@Controller
@RequestMapping(value = "/route")
public class RouteController {

    private final Logger logger = LoggerFactory.getLogger(RouteController.class);

    @Autowired
    private SysService sysService;

    @Autowired
    private MappingService mappingService;

    @Autowired
    private AuthService authService;


    @Mark(name = SysConf.POINT_TYPE_START)
    @SystemLog(point = true, description = "定位报表")
    @RequestMapping("/base")
    public String loadHtml(@RequestParam(value = "position") String position,
                           @RequestParam(value = "name") String name,
                           @RequestParam(value = "url") String url,
                           ModelMap model, HttpServletResponse response) throws FileNotFoundException, SQLException {
        String target = position;
        boolean auth = auth(position);
        boolean map = false;
        Mapping mapping = null;
        if(!auth) {
            target = "home";
        } else {
            mapping = mappingService.getModel(position);
            if(mapping != null && StringUtils.isNotBlank(mapping.getTarget())) {
                map = true;
                target = mapping.getTarget();
            }
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

    /**
     * 判断当前用户是否有菜单权限
     * @param position
     * @return
     * @throws SQLException
     */
    private boolean auth(String position) throws SQLException {
        Map<String, List<String>> menuAuthMap = authService.menuAuth();
        String obId = CasUtil.getId();
        if(StringUtils.isBlank(obId) || "-2".equalsIgnoreCase(obId)) {
            return false;
        }
        List<String> userAuthList = authService.userAuth(obId);
        Map<String, String> mapping = mappingService.getMapping();
        return authService.auth(position, menuAuthMap, userAuthList, mapping);
    }


}
