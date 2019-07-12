package com.aihuishou.bi.service;

import com.aihuishou.bi.entity.Folder;
import com.aihuishou.bi.entity.Mount;
import com.aihuishou.bi.entity.Node;
import org.springframework.beans.factory.annotation.Autowired;
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

    public List<Map<String,Object>> merge() throws SQLException {
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

        mounts.stream().forEach(m -> {
            //构造挂载点
            mergeMount(merge, m);

            List<Folder> mRoots = root.stream().filter(mr -> {
                return m.getId().equals(mr.getMount());
            }).collect(Collectors.toList());
            //构造文件夹
            mRoots.stream().forEach(f -> { mergeList(merge, folders, nodes, f); });

            List<Node> mNodes = leaf.stream().filter(mn -> {
                return m.getId().equals(mn.getMount());
            }).collect(Collectors.toList());
            //构造菜单
            leaf.stream().forEach(n -> { mergeNode(merge, n); });
        });
        return merge;
    }

    private void mergeMount(List<Map<String, Object>> merge, Mount m) {
        Map<String,Object> mount = new HashMap<>();
        mount.put("path", "");
        mount.put("icon", "tag");
        mount.put("name", m.getName());
        merge.add(mount);
    }

    private void mergeList(List<Map<String, Object>> merge, List<Folder> folders, List<Node> nodes, Folder f) {
        Map<String,Object> folder = new HashMap<>();
        folder.put("path", "");
        folder.put("icon", "folder");
        folder.put("name", f.getName());
        List<Map<String, Object>> children = getMaps(folders, nodes, f);
        folder.put("position", f.getPosition());
        folder.put("children", children);
        merge.add(folder);
    }

    private void mergeNode(List<Map<String, Object>> merge, Node n) {
        Map<String,Object> node = new HashMap<>();
        node.put("path", n.getUrl());
        node.put("icon", "monitor");
        node.put("name", n.getName());
        node.put("component", n.getPosition());
        merge.add(node);
    }

    private List<Map<String, Object>> getMaps(List<Folder> folders, List<Node> nodes, Folder f) {
        List<Map<String,Object>> children = new ArrayList<>();
        List<Folder> tempF = folders.stream().filter(filter -> {
            return filter.getParentPosition().equalsIgnoreCase(f.getPosition());
        }).collect(Collectors.toList());

        List<Node> tempN = nodes.stream().filter(filter -> {
            return filter.getParentPosition().equalsIgnoreCase(f.getPosition());
        }).collect(Collectors.toList());

        tempF.stream().forEach(ele -> {
            mergeList(children, folders, nodes, ele);
        });

        tempN.stream().forEach(ele -> {
            mergeNode(children, ele);
        });
        return children;
    }


}
