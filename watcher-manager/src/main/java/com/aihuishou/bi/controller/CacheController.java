package com.aihuishou.bi.controller;

import com.aihuishou.bi.service.CacheService;
import org.apache.commons.lang3.StringUtils;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import javax.annotation.Resource;

@RestController
@RequestMapping("/cache")
public class CacheController {

    @Resource
    private CacheService cacheService;

    /**
     * 一把梭哈
     * @return
     */
    @RequestMapping("/suoha")
    public ResponseEntity cleanAll() {
        try {
            cacheService.removeLNA();
            cacheService.removeLUA();
            cacheService.removeMMA();
            cacheService.removePM();
            cacheService.removePMM();
            cacheService.removePMMS();
            cacheService.removeRM();
            return new ResponseEntity<>("梭哈方案--清除成功", HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("梭哈方案--清除失败", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * 配置完菜单之后的肯德基标配套餐
     * @return
     */
    @RequestMapping("/package")
    public ResponseEntity cleanStandard() {
        try {
            //精致菜单清除
            cacheService.removeRM();
            //菜单权限清除
            cacheService.removeMMA();
            //用户权限
            cacheService.removeLUA();
            //菜单权限
            cacheService.removeLNA();
            return new ResponseEntity<>("套餐 -- 成功", HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("套餐 -- 失败", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    @RequestMapping("/menu")
    public ResponseEntity cleanMenu() {
        try {
            //精致菜单清除
            cacheService.removeRM();
            return new ResponseEntity<>("菜单缓存 -- 成功", HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("菜单缓存 -- 失败", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * 清除某一用户的权限缓存
     * @param obId
     * @return
     */
    @RequestMapping("/lua")
    public ResponseEntity cleanLNA(@RequestParam(value = "obId", required = false) String obId) {
        try {
            if(StringUtils.isBlank(obId)) {
                cacheService.removeLUA(obId);
            } else {
                cacheService.removeLUA();
            }
            return new ResponseEntity<>("清除成功", HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("清除失败", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

}
