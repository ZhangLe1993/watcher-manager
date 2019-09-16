package com.aihuishou.bi.controller;

import com.aihuishou.bi.annotation.Delete;
import com.aihuishou.bi.annotation.SystemLog;
import com.aihuishou.bi.annotation.Update;
import com.aihuishou.bi.cas.CasUtil;
import com.aihuishou.bi.entity.Folder;
import com.aihuishou.bi.entity.Mount;
import com.aihuishou.bi.entity.Node;
import com.aihuishou.bi.service.*;
import com.aihuishou.bi.utils.ExceptionInfo;
import com.aihuishou.bi.vo.FolderVO;
import com.aihuishou.bi.vo.GrantVO;
import com.aihuishou.bi.vo.MountVO;
import com.aihuishou.bi.vo.NodeVO;
import com.google.common.collect.ImmutableMap;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping(value = "/menu", produces = MediaType.APPLICATION_JSON_UTF8_VALUE)
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

    @Autowired
    private AuthService authService;

    @SystemLog(description = "获取菜单")
    @GetMapping("")
    public List<Map<String, Object>> menu(@RequestParam(value = "key_word", required = false) String keyWord) {
        try{
            String obId = CasUtil.getId();
            if(StringUtils.isBlank(obId) || "-2".equalsIgnoreCase(obId)) {
                return new ArrayList<>();
            }
            return menuService.merge(obId, keyWord);
        }catch(SQLException e) {
            logger.error("获取菜单异常，异常信息: {}", ExceptionInfo.toString(e));
        }
        return new ArrayList<>();
    }

    @SystemLog(description = "查询挂载点")
    @GetMapping("/mount")
    public ResponseEntity allMount(@RequestParam(value = "key", required = false) String key,
                                @RequestParam(value = "page_index", required = false) Integer pageIndex,
                                @RequestParam(value = "page_size", required = false) Integer pageSize) {
        try{
            List<Mount> mounts = mountService.getMount(key, pageIndex, pageSize);
            if(pageIndex == null || pageSize == null) {
                return new ResponseEntity<>(mounts, HttpStatus.OK);
            }
            return new ResponseEntity<>(ImmutableMap.of("data", mounts,"total", mountService.count(key)), HttpStatus.OK);
        } catch(Exception e) {
            logger.error("匹配异常，异常信息: {}", ExceptionInfo.toString(e));
        }
        return new ResponseEntity<>(ImmutableMap.of("data", new ArrayList<>(),"total", 0), HttpStatus.INTERNAL_SERVER_ERROR);
    }


    @SystemLog(description = "新增挂载点")
    @Update
    @PostMapping("/mount")
    public ResponseEntity createMount(@RequestBody MountVO mountVO) {
        try {
            int count = mountService.createMount(mountVO);
            if(count > 0) return new ResponseEntity<>("新增挂载点成功", HttpStatus.OK);
            return new ResponseEntity<>("新增挂载点失败", HttpStatus.INTERNAL_SERVER_ERROR);
        } catch(Exception e) {
            logger.error("新增挂载点异常，异常信息: {}", ExceptionInfo.toString(e));
        }
        return new ResponseEntity<>("新增挂载点失败", HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @SystemLog(description = "修改挂载点")
    @Update
    @PutMapping("/mount")
    public ResponseEntity updateMount(@RequestBody MountVO mountVO) {
        try{
            int count = mountService.updateMount(mountVO);
            if(count > 0) return new ResponseEntity<>("修改挂载点成功", HttpStatus.OK);
            return new ResponseEntity<>("修改挂载点失败", HttpStatus.INTERNAL_SERVER_ERROR);
        } catch(Exception e) {
            logger.error("修改挂载点异常，异常信息: {}", ExceptionInfo.toString(e));
        }
        return new ResponseEntity<>("修改挂载点失败", HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @SystemLog(description = "删除挂载点")
    @Delete
    @DeleteMapping("/mount")
    public ResponseEntity deleteMount(Long id) {
        try{
            int count = mountService.deleteMount(id);
            if(count > 0) return new ResponseEntity<>("删除挂载点成功", HttpStatus.OK);
            return new ResponseEntity<>("删除挂载点失败", HttpStatus.INTERNAL_SERVER_ERROR);
        } catch(Exception e) {
            logger.error("删除挂载点异常，异常信息: {}", ExceptionInfo.toString(e));
        }
        return new ResponseEntity<>("删除挂载点失败", HttpStatus.INTERNAL_SERVER_ERROR);
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
                return new ResponseEntity<>(folder, HttpStatus.OK);
            }
            return new ResponseEntity<>(ImmutableMap.of("data", folder,"total", folderService.count(key, parent)), HttpStatus.OK);
        } catch(Exception e) {
            logger.error("查询文件夹异常，异常信息: {}", ExceptionInfo.toString(e));
        }
        return new ResponseEntity<>(ImmutableMap.of("data", new ArrayList<>(),"total", 0), HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @SystemLog(description = "新增文件夹")
    @Update
    @PostMapping("/folder")
    public ResponseEntity createFolder(@RequestBody FolderVO folderVO) {
        try{
            int count = folderService.createFolder(folderVO);
            if(count > 0) return new ResponseEntity<>("新增文件夹成功", HttpStatus.OK);
            return new ResponseEntity<>("新增文件夹失败", HttpStatus.INTERNAL_SERVER_ERROR);
        } catch(Exception e) {
            logger.error("新增文件夹异常，异常信息: {}", ExceptionInfo.toString(e));
        }
        return new ResponseEntity<>("新增文件夹失败", HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @SystemLog(description = "修改文件夹")
    @Update
    @PutMapping("/folder")
    public ResponseEntity updateFolder(@RequestBody FolderVO folderVO) {
        try{
            int count = folderService.updateFolder(folderVO);
            if(count > 0) return new ResponseEntity<>("修改文件夹成功", HttpStatus.OK);
            return new ResponseEntity<>("修改文件夹失败", HttpStatus.INTERNAL_SERVER_ERROR);
        } catch(Exception e) {
            logger.error("编辑文件夹异常，异常信息: {}", ExceptionInfo.toString(e));
        }
        return new ResponseEntity<>("修改文件夹失败", HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @SystemLog(description = "删除文件夹")
    @Delete
    @DeleteMapping("/folder")
    public ResponseEntity deleteFolder(Long id) {
        try{
            int count = folderService.deleteFolder(id);
            if(count > 0) return new ResponseEntity<>("删除文件夹成功", HttpStatus.OK);
            return new ResponseEntity<>("删除文件夹失败", HttpStatus.INTERNAL_SERVER_ERROR);
        } catch(Exception e) {
            logger.error("删除文件夹异常，异常信息: {}", ExceptionInfo.toString(e));
        }
        return new ResponseEntity<>("删除文件夹失败", HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @SystemLog(description = "查询报表")
    @GetMapping("/node")
    public ResponseEntity<?> allNode(@RequestParam(value = "key", required = false) String key,
                                    @RequestParam(value = "parent", required = false) String parent,
                                    @RequestParam(value = "page_index", required = false) Integer pageIndex,
                                    @RequestParam(value = "page_size", required = false) Integer pageSize) {
        try{
            List<Node> folder = nodeService.getNodes(key, parent, pageIndex, pageSize);
            if(pageIndex == null || pageSize == null) {
                return new ResponseEntity<>(folder, HttpStatus.OK);
            }
            return new ResponseEntity<>(ImmutableMap.of("data", folder,"total", nodeService.count(key, parent)), HttpStatus.OK);
        } catch(Exception e) {
            logger.error("匹配异常，异常信息: {}", ExceptionInfo.toString(e));
        }
        return new ResponseEntity<>(ImmutableMap.of("data", new ArrayList<>(),"total", 0), HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @SystemLog(description = "查询报表类型")
    @GetMapping("/node/genre")
    public ResponseEntity nodeGenre(@RequestParam(value = "position") String position) {
        try{
            Node node = nodeService.nodeGenre(position);
            if(node == null) {
                return new ResponseEntity<>("请对该资源进行重定向", HttpStatus.NOT_FOUND);
            }
            return new ResponseEntity<>(node, HttpStatus.OK);
        } catch(Exception e) {
            logger.error("查询报表类型异常，异常信息: {}", ExceptionInfo.toString(e));
        }
        return new ResponseEntity<>(new Node(), HttpStatus.INTERNAL_SERVER_ERROR);
    }



    @SystemLog(description = "新增报表")
    @Update
    @PostMapping("/node")
    public ResponseEntity createNode(@RequestBody NodeVO nodeVO) {
        try{
            int count = nodeService.createNode(nodeVO);
            if(count > 0) return new ResponseEntity<>("新增报表成功", HttpStatus.OK);
            return new ResponseEntity<>("新增报表失败", HttpStatus.INTERNAL_SERVER_ERROR);
        } catch(Exception e) {
            logger.error("新增报表菜单异常，异常信息: {}", ExceptionInfo.toString(e));
        }
        return new ResponseEntity<>("新增报表失败", HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @SystemLog(description = "修改报表")
    @Update
    @PutMapping("/node")
    public ResponseEntity updateNode(@RequestBody NodeVO nodeVO) {
        try{
            int count = nodeService.updateNode(nodeVO);
            if(count > 0) return new ResponseEntity<>("修改报表成功", HttpStatus.OK);
            return new ResponseEntity<>("修改报表失败", HttpStatus.INTERNAL_SERVER_ERROR);
        } catch(Exception e) {
            logger.error("编辑报表菜单异常，异常信息: {}", ExceptionInfo.toString(e));
        }
        return new ResponseEntity<>("修改报表失败", HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @SystemLog(description = "删除报表")
    @Delete
    @DeleteMapping("/node")
    public ResponseEntity deleteNode(Long id) {
        try{
            int count = nodeService.deleteNode(id);
            if(count > 0) return new ResponseEntity<>("删除报表成功", HttpStatus.OK);
            return new ResponseEntity<>("删除报表失败", HttpStatus.INTERNAL_SERVER_ERROR);
        } catch(Exception e) {
            logger.error("删除报表菜单异常，异常信息: {}", ExceptionInfo.toString(e));
        }
        return new ResponseEntity<>("删除报表失败", HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @SystemLog(description = "报表菜单授权")
    @Update
    @PostMapping("/auth")
    public ResponseEntity grantAuth(@RequestBody GrantVO grantVO) {
        try {
            int count = authService.grantAuth(grantVO);
            if(count > 0) return new ResponseEntity<>("授权成功", HttpStatus.OK);
            return new ResponseEntity<>("授权失败", HttpStatus.INTERNAL_SERVER_ERROR);
        } catch(Exception e) {
            logger.error("报表菜单授权异常，异常信息: {}", ExceptionInfo.toString(e));
        }
        return new ResponseEntity<>("授权失败", HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @SystemLog(description = "查询所有权限")
    @GetMapping("/auth/all")
    public ResponseEntity<?> allAuth(@RequestParam(value = "key", required = false) String key,
                                     @RequestParam(value = "page_index", required = false, defaultValue = "1") Integer pageIndex,
                                     @RequestParam(value = "page_size", required = false, defaultValue = "5000") Integer pageSize) {
        try{
            List<String> auth = authService.getAllAuth(key, pageIndex, pageSize);
            if(pageIndex == null || pageSize == null) {
                return new ResponseEntity<>(auth, HttpStatus.OK);
            }
            return new ResponseEntity<>(ImmutableMap.of("data", auth,"total", authService.countAllAuth(key)), HttpStatus.OK);
        } catch(Exception e) {
            logger.error("匹配异常，异常信息: {}", ExceptionInfo.toString(e));
        }
        return new ResponseEntity<>(ImmutableMap.of("data", new ArrayList<>(),"total", 0), HttpStatus.INTERNAL_SERVER_ERROR);
    }


    @SystemLog(description = "查询菜单已经授予的权限")
    @GetMapping("/auth")
    public ResponseEntity<?> menuAuth(@RequestParam(value = "position") String position) {
        try{
            List<String> auth = authService.getMenuAuth(position);
            return new ResponseEntity<>(auth, HttpStatus.OK);
        } catch(Exception e) {
            logger.error("匹配异常，异常信息: {}", ExceptionInfo.toString(e));
        }
        return new ResponseEntity<>(new ArrayList<>(), HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @SystemLog(description = "获取文件夹树")
    @GetMapping("/folder/tree")
    public ResponseEntity folderTree(@RequestParam(value = "mount",required = false) Integer mount) {
        try {
            List<Map<String, Object>> list = menuService.folderTree(mount);
            return new ResponseEntity<>(list, HttpStatus.OK);
        } catch(SQLException e) {
            logger.error("获取文件夹树异常，异常信息: {}", ExceptionInfo.toString(e));
        }
        return new ResponseEntity<>(new ArrayList<>(), HttpStatus.INTERNAL_SERVER_ERROR);
    }


    @SystemLog(description = "获取直接子文件夹")
    @GetMapping("/folder/zero")
    public ResponseEntity folderTree(@RequestParam(value = "mount",required = false) Integer mount,
                                     @RequestParam(value = "parent",required = false) String parent) {
        if(mount == null && StringUtils.isBlank(parent)) {
            return new ResponseEntity<>("mount 和 parent 参数必有其一", HttpStatus.BAD_REQUEST);
        }
        try {
            List<Folder> list = folderService.folders(mount, parent);
            return new ResponseEntity<>(list, HttpStatus.OK);
        } catch(SQLException e) {
            logger.error("获取文件夹树异常，异常信息: {}", ExceptionInfo.toString(e));
        }
        return new ResponseEntity<>(new ArrayList<>(), HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @SystemLog(description = "挂载点顺序调整")
    @Update
    @PutMapping("/mount/sort")
    public ResponseEntity mountSort(@RequestBody List<Mount> mounts) {
        try {
            int[] count = mountService.updateSort(mounts);
            if(count.length > 0) return new ResponseEntity<>("挂载点顺序调整成功", HttpStatus.OK);
            return new ResponseEntity<>("挂载点顺序调整失败", HttpStatus.INTERNAL_SERVER_ERROR);
        } catch(Exception e) {
            logger.error("挂载点顺序调整异常，异常信息: {}", ExceptionInfo.toString(e));
        }
        return new ResponseEntity<>("挂载点顺序调整失败", HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @SystemLog(description = "文件夹顺序调整")
    @Update
    @PutMapping("/folder/sort")
    public ResponseEntity folderSort(@RequestBody List<Folder> folders) {
        try {
            int[] count = folderService.updateSort(folders);
            if(count.length > 0) return new ResponseEntity<>("文件夹顺序调整成功", HttpStatus.OK);
            return new ResponseEntity<>("文件夹顺序调整失败", HttpStatus.INTERNAL_SERVER_ERROR);
        } catch(Exception e) {
            logger.error("文件夹顺序调整异常，异常信息: {}", ExceptionInfo.toString(e));
        }
        return new ResponseEntity<>("文件夹顺序调整失败", HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @SystemLog(description = "报表顺序调整")
    @Update
    @PutMapping("/node/sort")
    public ResponseEntity nodeSort(@RequestBody List<Node> nodes) {
        try {
            int[] count = nodeService.updateSort(nodes);
            if(count.length > 0) return new ResponseEntity<>("报表顺序调整成功", HttpStatus.OK);
            return new ResponseEntity<>("报表顺序调整失败", HttpStatus.INTERNAL_SERVER_ERROR);
        } catch(Exception e) {
            logger.error("报表顺序调整异常，异常信息: {}", ExceptionInfo.toString(e));
        }
        return new ResponseEntity<>("报表顺序调整失败", HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
