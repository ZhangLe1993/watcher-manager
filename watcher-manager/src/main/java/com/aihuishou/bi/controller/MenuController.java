package com.aihuishou.bi.controller;

import com.aihuishou.bi.annotation.SystemLog;
import com.aihuishou.bi.entity.Folder;
import com.aihuishou.bi.entity.Mount;
import com.aihuishou.bi.entity.Node;
import com.aihuishou.bi.service.FolderService;
import com.aihuishou.bi.service.MenuService;
import com.aihuishou.bi.service.MountService;
import com.aihuishou.bi.service.NodeService;
import com.aihuishou.bi.utils.ExceptionInfo;
import com.aihuishou.bi.vo.FolderVO;
import com.aihuishou.bi.vo.MountVO;
import com.aihuishou.bi.vo.NodeVO;
import com.google.common.collect.ImmutableMap;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/menu")
public class MenuController {

    private static final Logger logger = LoggerFactory.getLogger(MenuController.class);

    @Autowired
    private MenuService menuService;

    @Autowired
    private MountService mountService;

    @Autowired
    private FolderService folderService;

    @Autowired
    private NodeService nodeService;

    @SystemLog(description = "获取菜单")
    @GetMapping("")
    public List<Map<String, Object>> menu() {
        try{
            return menuService.merge();
        }catch(SQLException e) {
            e.printStackTrace();
        }
        return null;
    }

    @SystemLog(description = "查询挂载点")
    @GetMapping("/mount")
    public ResponseEntity allMount(@RequestParam(value = "key", required = false) String key,
                                @RequestParam(value = "page_index", required = false) Integer pageIndex,
                                @RequestParam(value = "page_size", required = false) Integer pageSize) {
        try{
            List<Mount> mounts = mountService.getMount(key, pageIndex, pageSize);
            if(pageIndex == null || pageSize == null) {
                return new ResponseEntity(mounts, HttpStatus.OK);
            }
            return new ResponseEntity(ImmutableMap.of("data", mounts,"total", mountService.count(key)), HttpStatus.OK);
        } catch(Exception e) {
            logger.error("匹配异常，异常信息: {}", ExceptionInfo.toString(e));
        }
        return new ResponseEntity(ImmutableMap.of("data", new ArrayList<>(),"total", 0), HttpStatus.INTERNAL_SERVER_ERROR);
    }


    @SystemLog(description = "新增挂载点")
    @PostMapping("/mount")
    public void createMount(@RequestBody MountVO mountVO) {
        try {
            mountService.createMount(mountVO);
        } catch(Exception e) {
            logger.error("新增挂载点异常，异常信息: {}", ExceptionInfo.toString(e));
        }

    }

    @SystemLog(description = "修改挂载点")
    @PutMapping("/mount")
    public void updateMount(@RequestBody MountVO mountVO) {
        try{
            mountService.updateMount(mountVO);
        } catch(Exception e) {
            logger.error("修改挂载点异常，异常信息: {}", ExceptionInfo.toString(e));
        }
    }

    @SystemLog(description = "删除挂载点")
    @DeleteMapping("/mount")
    public void deleteMount(Long id) {
        try{
            mountService.deleteMount(id);
        } catch(Exception e) {
            logger.error("删除挂载点异常，异常信息: {}", ExceptionInfo.toString(e));
        }
    }


    @SystemLog(description = "查询文件夹")
    @GetMapping("/folder")
    public ResponseEntity allFolder(@RequestParam(value = "key", required = false) String key,
                                  @RequestParam(value = "parent", required = false) String parent,
                                  @RequestParam(value = "page_index", required = false) Integer pageIndex,
                                  @RequestParam(value = "page_size", required = false) Integer pageSize) {
        try{
            List<Folder> folder = folderService.getFolder(key, parent, pageIndex, pageSize);
            if(pageIndex == null || pageSize == null) {
                return new ResponseEntity(folder, HttpStatus.OK);
            }
            return new ResponseEntity(ImmutableMap.of("data", folder,"total", folderService.count(key, parent)), HttpStatus.OK);
        } catch(Exception e) {
            logger.error("匹配异常，异常信息: {}", ExceptionInfo.toString(e));
        }
        return new ResponseEntity(ImmutableMap.of("data", new ArrayList<>(),"total", 0), HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @SystemLog(description = "新增文件夹")
    @PostMapping("/folder")
    public void createFolder(@RequestBody FolderVO folderVO) {
        try{
            folderService.createFolder(folderVO);
        } catch(Exception e) {
            logger.error("新增文件夹异常，异常信息: {}", ExceptionInfo.toString(e));
        }
    }

    @SystemLog(description = "修改文件夹")
    @PutMapping("/folder")
    public void updateFolder(@RequestBody FolderVO folderVO) {
        try{
            folderService.updateFolder(folderVO);
        } catch(Exception e) {
            logger.error("编辑文件夹异常，异常信息: {}", ExceptionInfo.toString(e));
        }
    }

    @SystemLog(description = "删除文件夹")
    @DeleteMapping("/folder")
    public void deleteFolder(Long id) {
        try{
            folderService.deleteFolder(id);
        } catch(Exception e) {
            logger.error("删除文件夹异常，异常信息: {}", ExceptionInfo.toString(e));
        }
    }

    @SystemLog(description = "查询报表")
    @GetMapping("/node")
    public ResponseEntity allNode(@RequestParam(value = "key", required = false) String key,
                                    @RequestParam(value = "parent", required = false) String parent,
                                    @RequestParam(value = "page_index", required = false) Integer pageIndex,
                                    @RequestParam(value = "page_size", required = false) Integer pageSize) {
        try{
            List<Node> folder = nodeService.getNodes(key, parent, pageIndex, pageSize);
            if(pageIndex == null || pageSize == null) {
                return new ResponseEntity(folder, HttpStatus.OK);
            }
            return new ResponseEntity(ImmutableMap.of("data", folder,"total", nodeService.count(key, parent)), HttpStatus.OK);
        } catch(Exception e) {
            logger.error("匹配异常，异常信息: {}", ExceptionInfo.toString(e));
        }
        return new ResponseEntity(ImmutableMap.of("data", new ArrayList<>(),"total", 0), HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @SystemLog(description = "新增报表")
    @PostMapping("/node")
    public void createNode(@RequestBody NodeVO nodeVO) {
        try{
            nodeService.createNode(nodeVO);
        } catch(Exception e) {
            logger.error("新增报表菜单异常，异常信息: {}", ExceptionInfo.toString(e));
        }
    }

    @SystemLog(description = "修改报表")
    @PutMapping("/node")
    public void updateNode(@RequestBody NodeVO nodeVO) {
        try{
            nodeService.updateNode(nodeVO);
        } catch(Exception e) {
            logger.error("编辑报表菜单异常，异常信息: {}", ExceptionInfo.toString(e));
        }
    }

    @SystemLog(description = "删除报表")
    @DeleteMapping("/node")
    public void deleteNode(Long id) {
        try{
            nodeService.deleteNode(id);
        } catch(Exception e) {
            logger.error("删除报表菜单异常，异常信息: {}", ExceptionInfo.toString(e));
        }
    }


}
