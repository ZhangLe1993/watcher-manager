package com.aihuishou.bi.service;

import com.aihuishou.bi.cas.CasUtil;
import com.aihuishou.bi.core.CacheConf;
import com.aihuishou.bi.entity.Folder;
import com.aihuishou.bi.entity.Mount;
import com.aihuishou.bi.entity.Node;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class MenuService {

    @Autowired
    private MountService mountService;

    @Autowired
    private FolderService folderService;

    @Autowired
    private NodeService nodeService;

    @Autowired
    private AuthService authService;

    @Autowired
    private MappingService mappingService;

    /**
     * 获取菜单全部的树
     * @return
     * @throws SQLException
     */

    @Cacheable(value = CacheConf.REFINED_MENU, key = "#obId")
    public List<Map<String,Object>> merge(String obId) throws SQLException {
        List<Map<String,Object>> merge = new ArrayList<>();
        List<Mount> mounts = mountService.mounts();
        List<Folder> folders = folderService.folders();
        List<Node> nodes = nodeService.nodes();

        List<Folder> root = folders.stream().filter(f -> {
            return "-1".equalsIgnoreCase(f.getParentPosition());
        }).collect(Collectors.toList());

        List<Node> leaf = nodes.stream().filter(n -> {
            return "-1".equalsIgnoreCase(n.getParentPosition());
        }).collect(Collectors.toList());

        //获取菜单和权限映射关系，规定哪些报表只有那些人拥有哪些权限才能看
        Map<String, List<String>> menuAuthMap = authService.menuAuth();

        List<String> userAuthList = authService.userAuth(obId);
        Map<String, String> mapping = mappingService.getMapping();

        mounts.stream().forEach(m -> {
            //构造挂载点
            mergeMount(merge, m);

            List<Folder> mRoots = root.stream().filter(mr -> {
                return m.getId().equals(mr.getMount());
            }).collect(Collectors.toList());
            //构造文件夹
            mRoots.stream().forEach(f -> { mergeList(merge, folders, nodes, f, menuAuthMap, userAuthList, mapping); });

            List<Node> mNodes = leaf.stream().filter(mn -> {
                return m.getId().equals(mn.getMount());
            }).collect(Collectors.toList());
            //构造菜单
            mNodes.stream().forEach(n -> { mergeNode(merge, n, menuAuthMap, userAuthList, mapping); });
        });
        return merge;
    }

    private void mergeMount(List<Map<String, Object>> merge, Mount m) {
        Map<String,Object> mount = new HashMap<>();
        /*mount.put("path", "");*/
        mount.put("is_mount", true);
        mount.put("icon", "tag");
        mount.put("name", m.getName());
        merge.add(mount);
    }

    private void mergeList(List<Map<String, Object>> merge, List<Folder> folders, List<Node> nodes, Folder f, Map<String, List<String>> menuAuthMap, List<String> userAuthList, Map<String, String> mapping) {
        Map<String,Object> folder = new HashMap<>();
        /*folder.put("path", "");*/
        folder.put("is_mount", false);
        folder.put("icon", "folder");
        folder.put("name", f.getName());
        List<Map<String, Object>> children = getMaps(folders, nodes, f, menuAuthMap, userAuthList, mapping);
        folder.put("position", f.getPosition());
        folder.put("children", children);
        merge.add(folder);
    }

    private void mergeNode(List<Map<String, Object>> merge, Node n, Map<String, List<String>> menuAuthMap, List<String> userAuthList, Map<String, String> mapping) {
        Map<String, Object> node = new HashMap<>();
        node.put("is_mount", false);
        node.put("icon", "monitor");
        node.put("name", n.getName());
        node.put("component", n.getPosition());
        node.put("auth", (Boolean) authService.auth(n.getPosition(), menuAuthMap, userAuthList, mapping));
        String genre = n.getGenre();
        node.put("genre", genre);
        if("1".equals(genre)) {
            node.put("url", n.getUrl());
        }
        merge.add(node);
    }

    private List<Map<String, Object>> getMaps(List<Folder> folders, List<Node> nodes, Folder f, Map<String, List<String>> menuAuthMap, List<String> userAuthList, Map<String, String> mapping) {
        List<Map<String,Object>> children = new ArrayList<>();
        List<Folder> tempF = folders.stream().filter(filter -> {
            return filter.getParentPosition().equalsIgnoreCase(f.getPosition());
        }).collect(Collectors.toList());

        List<Node> tempN = nodes.stream().filter(filter -> {
            return filter.getParentPosition().equalsIgnoreCase(f.getPosition());
        }).collect(Collectors.toList());

        tempF.stream().forEach(ele -> {
            mergeList(children, folders, nodes, ele, menuAuthMap, userAuthList, mapping);
        });

        tempN.stream().forEach(ele -> {
            mergeNode(children, ele, menuAuthMap, userAuthList, mapping);
        });
        return children;
    }


    /**
     * 获取文件夹树
     * @return
     * @throws SQLException
     */
    public List<Map<String,Object>> folderTree(Integer mount) throws SQLException {
        List<Map<String,Object>> merge = new ArrayList<>();
        List<Folder> folders = folderService.folders(mount);
        List<Folder> root = folders.stream().filter(f -> {
            return "-1".equalsIgnoreCase(f.getParentPosition());
        }).collect(Collectors.toList());

        root.stream().forEach(r -> {
            treeList(merge, folders, r);
        });
        return merge;
    }

    private void treeList(List<Map<String, Object>> merge, List<Folder> folders, Folder f) {
        Map<String,Object> folder = new HashMap<>();
        folder.put("title", f.getName());
        folder.put("value", f.getPosition());
        List<Map<String, Object>> children = treeMaps(folders, f);
        folder.put("key", f.getPosition());
        folder.put("children", children);
        merge.add(folder);
    }

    private List<Map<String, Object>> treeMaps(List<Folder> folders, Folder f) {
        List<Map<String,Object>> children = new ArrayList<>();
        List<Folder> tempF = folders.stream().filter(filter -> {
            return filter.getParentPosition().equalsIgnoreCase(f.getPosition());
        }).collect(Collectors.toList());
        tempF.stream().forEach(ele -> {
            treeList(children, folders, ele);
        });
        return children;
    }

}
