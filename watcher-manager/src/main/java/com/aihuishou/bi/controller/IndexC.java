package com.aihuishou.bi.controller;

import com.aihuishou.bi.annotation.Loop;
import com.aihuishou.bi.annotation.Mark;
import com.aihuishou.bi.annotation.SafeAuthenticate;
import com.aihuishou.bi.annotation.SystemLog;
import com.aihuishou.bi.cas.CasUtil;
import com.aihuishou.bi.core.Admin;
import com.aihuishou.bi.core.SysConf;
import com.aihuishou.bi.entity.User;
import com.aihuishou.bi.service.AdminService;
import com.aihuishou.bi.service.MappingService;
import com.aihuishou.bi.service.SysService;
import com.aihuishou.bi.service.UserService;
import com.aihuishou.bi.utils.ExceptionInfo;
import com.aihuishou.bi.utils.LoggerTemplate;
import com.alibaba.fastjson.JSONArray;
import com.google.common.collect.ImmutableMap;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.http.client.ClientHttpRequest;
import org.springframework.http.client.ClientHttpResponse;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.util.StreamUtils;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.net.URI;
import java.net.URISyntaxException;
import java.net.URLDecoder;
import java.sql.SQLException;
import java.util.*;

@Controller
public class IndexC {

    private final static Logger logger = LoggerFactory.getLogger(IndexC.class);

    public static boolean health = true;

    @Autowired
    private UserService userService;

    @Autowired
    private SysService sysService;

    @Autowired
    private MappingService mappingService;

    @Autowired
    private AdminService adminService;

    @RequestMapping("sleep")
    public ResponseEntity sleep() throws InterruptedException {
        Thread.sleep(30000L);
        return new ResponseEntity(HttpStatus.OK);
    }


    @Value("${proxy.watcher.target_url}")
    private String targetUrl;

    @RequestMapping(value = {"/back/**", "/", "/page/**"})
    public String index(HttpServletRequest request, HttpServletResponse response) throws IOException {
        //TODO 权限校验
        return "dist/index";
    }

    @RequestMapping(value = {"/pages/**"})
    public String manager(ModelMap model) {
        try {
            String obId = CasUtil.getId();
            if(StringUtils.isBlank(obId) || "-2".equalsIgnoreCase(obId)) {
                baseFun(model, "home");
                model.addAttribute("is_mapping", false);
                return "base";
            }
            User user = userService.getUserByObId(obId);
            if(user == null || StringUtils.isBlank(user.getEmployeeNo())) {
                baseFun(model, "home");
                model.addAttribute("is_mapping", false);
                return "base";
            }
            Admin admin = adminService.inBoss(user.getEmployeeNo());
            if(admin.getCode() == Admin.GUEST.getCode()) {
                baseFun(model, "home");
                model.addAttribute("is_mapping", false);
                return "base";
            }
            //TODO 权限校验
            return "dist/index";
        } catch(Exception e) {
            logger.error("鉴权过程发生异常,异常信息：{}", ExceptionInfo.toString(e));
            baseFun(model, "home");
            model.addAttribute("is_mapping", false);
            return "base";
        }
    }

    @RequestMapping("/favicon.png")
    public void icon(HttpServletRequest request, HttpServletResponse response) throws IOException, ServletException {
        request.getRequestDispatcher("/static/resources/images/favicon.ico").forward(request, response);
        return;
    }

    @RequestMapping("/aI8GzBl3MX.txt")
    public String txt(HttpServletRequest request, HttpServletResponse response) throws IOException, ServletException {
        return "c2a58d3db26a085d93a347487cf9bf7f";
    }

    @RequestMapping("/favicon.ico")
    public void ico(HttpServletRequest request, HttpServletResponse response) throws IOException, ServletException {
        request.getRequestDispatcher("/static/resources/images/favicon.ico").forward(request, response);
        return;
    }

    @RequestMapping("_health_check")
    public ResponseEntity healthCheck() throws IOException {
        if (health) {
            return new ResponseEntity<>("OK", HttpStatus.OK);
        } else {
            return new ResponseEntity<>("FORBIDDEN", HttpStatus.FORBIDDEN);
        }
    }

    @SystemLog(description = "获取当前用户")
    @ResponseBody
    @RequestMapping(value = "/api/currentUser", produces = MediaType.APPLICATION_JSON_UTF8_VALUE)
    public User currentUser() throws SQLException {
        try {
            String obId = CasUtil.getId();
            if(StringUtils.isBlank(obId) || "-2".equalsIgnoreCase(obId)) {
                return null;
            }
            return userService.getUserByObId(obId);
        } catch (Exception e) {
            LoggerTemplate.error(logger, "获取当前登录用户", e);
        }
        return null;
    }

    @Mark(name = SysConf.POINT_TYPE_END)
    @SystemLog(point = true, description = "代理转发")
    @RequestMapping(value = "/watcher/**", produces = MediaType.APPLICATION_JSON_UTF8_VALUE)
    public void proxy(HttpServletRequest request, HttpServletResponse response) throws IOException, URISyntaxException {
        //添加参数
        String obId = CasUtil.getId();
        URI uri = new URI(request.getRequestURI());
        String q = request.getQueryString();
        if (StringUtils.isNotBlank(q)) {
            q += "&userId=" + obId + "&uid=" + obId + "&accountId=" + obId;
        } else {
            q = "userId=" + obId + "&uid=" + obId + "&accountId=" + obId;
        }
        URI newUri = new URI(targetUrl + uri.getPath() + "?" + q);
        //执行代理查询
        ClientHttpRequest delegate = new SimpleClientHttpRequestFactory().createRequest(newUri, HttpMethod.resolve(request.getMethod()));
        Enumeration<String> headerNames = request.getHeaderNames();
        while (headerNames.hasMoreElements()) {
            String headerName = headerNames.nextElement();
            Enumeration<String> v = request.getHeaders(headerName);
            List<String> arr = new ArrayList<>();
            while (v.hasMoreElements()) {
                arr.add(v.nextElement());
            }
            delegate.getHeaders().addAll(headerName, arr);
        }
        StreamUtils.copy(request.getInputStream(), delegate.getBody());
        ClientHttpResponse clientHttpResponse = delegate.execute();
        response.setStatus(clientHttpResponse.getStatusCode().value());
        clientHttpResponse.getHeaders().entrySet().forEach((kv) -> {
            kv.getValue().stream().forEach(it -> {
                if (kv.getKey().startsWith("Content-")) {
                    response.setHeader(kv.getKey(), it);
                }
            });
        });
        StreamUtils.copy(clientHttpResponse.getBody(), response.getOutputStream());
    }


    @SystemLog(description = "第三方报表代理转发")
    @RequestMapping(value = "/third/watcher/**", produces = MediaType.APPLICATION_JSON_UTF8_VALUE)
    public void proxyForThird(HttpServletRequest request, HttpServletResponse response) throws IOException, URISyntaxException {
        //添加参数
        URI uri = new URI(request.getRequestURI());
        String q = request.getQueryString();
        URI newUri = new URI(targetUrl + uri.getPath().replace("/third", "") + "?" + q);
        //执行代理查询
        ClientHttpRequest delegate = new SimpleClientHttpRequestFactory().createRequest(newUri, HttpMethod.resolve(request.getMethod()));
        Enumeration<String> headerNames = request.getHeaderNames();
        while (headerNames.hasMoreElements()) {
            String headerName = headerNames.nextElement();
            Enumeration<String> v = request.getHeaders(headerName);
            List<String> arr = new ArrayList<>();
            while (v.hasMoreElements()) {
                arr.add(v.nextElement());
            }
            delegate.getHeaders().addAll(headerName, arr);
        }
        StreamUtils.copy(request.getInputStream(), delegate.getBody());
        ClientHttpResponse clientHttpResponse = delegate.execute();
        response.setStatus(clientHttpResponse.getStatusCode().value());
        clientHttpResponse.getHeaders().entrySet().forEach((kv) -> {
            kv.getValue().stream().forEach(it -> {
                if (kv.getKey().startsWith("Content-")) {
                    response.setHeader(kv.getKey(), it);
                }
            });
        });
        StreamUtils.copy(clientHttpResponse.getBody(), response.getOutputStream());
    }

    @SafeAuthenticate
    @Loop
    @SystemLog(description = "爱机汇嵌入页面 & fancyBox 弹出层页面")
    @RequestMapping(value = {"/vender/**", "/customer/intelligenceShop/**", "/area/dealSmartShopReport/**", "/area/coupon/**", "/datareport/**", "/operation/**"}, produces = MediaType.APPLICATION_JSON_UTF8_VALUE)
    public String vender(HttpServletRequest request, HttpServletResponse response, ModelMap model) throws IOException {
        //添加参数
        request.setCharacterEncoding("utf-8");
        String url = request.getRequestURI();
        url = URLDecoder.decode(url, "UTF-8");
        String [] args = StringUtils.split(url, "/");
        if(args != null && args.length > 2) {
            String root = args[0];
            String target = args[1];
            if(otherTarget.containsKey(target)) {
                target = otherTarget.get(target);
                baseFun(model, target);
                model.addAttribute("is_mapping", false);
            }
            if("datareport".equals(root) || "operation".equals(root) || targets.contains(target)) {
                List<String> temp = new ArrayList<>(Arrays.asList(args));
                List<String> params = temp.subList(2, args.length);
                baseFun(model, target);
                model.addAttribute("is_mapping", true);
                model.addAttribute("param_key", "list");
                model.addAttribute("param_value", JSONArray.toJSON(params));
            }
        } else {
            logger.error("参数错误");
            return "home";
        }
        return "base";
    }

    private void baseFun(ModelMap model, String target) {
        Map<String, String> positionMap = sysService.getPositionMap();
        String loadName = positionMap.get(target) + SysConf.REST_JS_SUFFIX;
        String staticName = positionMap.get(target) + SysConf.REST_HTML_SUFFIX;
        logger.info(loadName);
        logger.info(staticName);
        model.addAttribute("model" , ImmutableMap.of("position", target, "loadName", loadName, "staticName", staticName));
    }

    private final static List<String> targets = new ArrayList<>(Arrays.asList(
            "venderFinance", "VenderBussinessAnalysis", "VenderIncomeAnalysis",
            "VenderErrorRateAnalysis", "VenderOrderLostAnalysis", "VenderQualityErrorAnalysis",
            "VenderOrderStatistics", "KAVenderBussinessAnalysis",
            "KAVenderOrderLostAnalysis", "KAVenderQualityErrorAnalysis"));


    private final static Map<String,String> otherTarget =
            ImmutableMap.of("intelligenceShop", "DoorOfBrainpower", "dealSmartShopReport","smartShopDealIFrame", "coupon", "couponIframe");


}
