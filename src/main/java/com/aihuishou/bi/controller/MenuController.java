package com.aihuishou.bi.controller;

import com.aihuishou.bi.service.MenuService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.sql.SQLException;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/menu")
public class MenuController {

    @Autowired
    private MenuService menuService;


    @GetMapping("")
    public List<Map<String, Object>> menu() {
        try{
            return menuService.merge();
        }catch(SQLException e) {
            e.printStackTrace();
        }
        return null;
    }


}
