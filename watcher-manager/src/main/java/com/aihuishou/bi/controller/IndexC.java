package com.aihuishou.bi.controller;

import com.aihuishou.bi.cas.CasUtil;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpMethod;
import org.springframework.http.client.ClientHttpRequest;
import org.springframework.http.client.ClientHttpResponse;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.stereotype.Controller;
import org.springframework.util.StreamUtils;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.ArrayList;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Controller
public class IndexC {


    @Value("${proxy.watcher.target_url}")
    private String targetUrl;

    @RequestMapping(value = {"/back/**", "/"})
    public String index() {
        System.out.println("indexC===>index");
        return "dist/index";
    }

    @RequestMapping("_health_check")
    public void healthCheck(HttpServletRequest request) throws IOException {

    }

    @ResponseBody
    @RequestMapping("/api/currentUser")
    public Map currentUser() {
        //TODO
        return new HashMap();
    }

    @RequestMapping("/watcher/**")
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
                response.setHeader(kv.getKey(), it);
            });
        });
        StreamUtils.copy(clientHttpResponse.getBody(), response.getOutputStream());
    }
}
