package com.aihuishou.bi.service;

import com.aihuishou.bi.core.CacheConf;
import com.aihuishou.bi.core.Sort;
import com.aihuishou.bi.entity.Folder;
import com.aihuishou.bi.entity.Mount;
import com.aihuishou.bi.entity.Node;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.sql.SQLException;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
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
     *
     * @return
     * @throws SQLException
     */


    public List<Map<String, Object>> searchMerge(String obId, String keyWord) throws SQLException {
        List<Map<String, Object>> tree = merge(obId, keyWord);
        if(StringUtils.isBlank(keyWord)) {
            return tree;
        }
        /**
         * 搜索功能
         */
        ListIterator<Map<String, Object>> iterator = tree.listIterator();
        while(iterator.hasNext()) {
            Map<String, Object> map = iterator.next();
            Boolean mount = (Boolean) map.get("is_mount");
            if(mount) {
                continue;
            }
            //是否是文件夹
            if(map.containsKey("children")) {
                List<Map<String, Object>> children = (List<Map<String, Object>>) map.get("children");

            }
        }
        return null;
    }

    @Cacheable(value = CacheConf.REFINED_MENU, key = "#obId + '-' + #keyWord")
    public List<Map<String, Object>> merge(String obId, String keyWord) throws SQLException {
        List<Map<String, Object>> merge = new ArrayList<>();
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
            List<Map<String, Object>> part = new ArrayList<>();
            List<Map<String, Object>> body = new ArrayList<>();
            //构造挂载点
            mergeMount(part, m);
            //构造文件夹
            //获取
            List<Folder> mRoots = root.stream().filter(mr -> {
                return m.getId().equals(mr.getMount());
            }).collect(Collectors.toList());

            //构造
            mRoots.stream().forEach(f -> {
                mergeList(body, folders, nodes, f, menuAuthMap, userAuthList, mapping, keyWord);
            });

            //构造菜单
            //获取
            List<Node> mNodes = leaf.stream().filter(mn -> {
                return m.getId().equals(mn.getMount());
            }).collect(Collectors.toList());
            //构造
            mNodes.stream().forEach(n -> {
                mergeNode(body, n, menuAuthMap, userAuthList, mapping, keyWord);
            });
            if(StringUtils.isNotBlank(keyWord)) {
                //如果是搜索，mount下面没有东西就不显示
                if(body.size() > 0) {
                    merge.addAll(part);
                    merge.addAll(body.stream().sorted(Comparator.comparing(Sort :: comparingBySortNo)).collect(Collectors.toList()));
                }
            } else {
                //如果是正常展示，mount正常展示，如果body没有的话。
                merge.addAll(part);
                if(body.size() > 0) {
                    merge.addAll(body.stream().sorted(Comparator.comparing(Sort :: comparingBySortNo)).collect(Collectors.toList()));
                }
            }
        });
        return merge;
    }

    private void mergeMount(List<Map<String, Object>> merge, Mount m) {
        Map<String, Object> mount = new ConcurrentHashMap<>();
        /*mount.put("path", "");*/
        mount.put("is_mount", true);
        mount.put("icon", "tag");
        mount.put("name", m.getName());
        merge.add(mount);
    }

    private void mergeList(List<Map<String, Object>> merge, List<Folder> folders, List<Node> nodes, Folder f, Map<String, List<String>> menuAuthMap, List<String> userAuthList, Map<String, String> mapping, String keyWord) {
        List<Map<String, Object>> children = getMaps(folders, nodes, f, menuAuthMap, userAuthList, mapping, keyWord);
        if(StringUtils.isNotBlank(keyWord) && (children == null || children.size() == 0)) {
            return;
        }
        Map<String, Object> folder = new ConcurrentHashMap<>();
        /*folder.put("path", "");*/
        folder.put("is_mount", false);
        folder.put("icon", "folder");
        folder.put("name", f.getName());
        folder.put("position", f.getPosition());
        folder.put("children", children);
        folder.put("path", "/page/" + f.getPath());
        folder.put("sort", f.getSortNo());
        merge.add(folder);
    }

    private void mergeNode(List<Map<String, Object>> merge, Node n, Map<String, List<String>> menuAuthMap, List<String> userAuthList, Map<String, String> mapping, String keyWord) {
        String name = n.getName();
        String position = n.getPosition();
        if(StringUtils.isNotBlank(keyWord) && !name.contains(keyWord)) {
            return;
        }
        Map<String, Object> node = new ConcurrentHashMap<>();
        //List<String> menuAuth = authService.auth(n.getPosition(), menuAuthMap, mapping);
        node.put("is_mount", false);
        node.put("icon", "monitor");
        node.put("name", name);
        node.put("component", position);
        node.put("exact", true);
        //node.put("auths", menuAuth == null ? new ArrayList<>() : menuAuth);
        node.put("path", "/page/" + n.getPath());
        //node.put("auth", (Boolean) authService.auth(n.getPosition(), menuAuthMap, userAuthList, mapping));
        String genre = n.getGenre();
        node.put("genre", genre);
        if ("1".equals(genre)) {
            node.put("url", n.getUrl());
        }
        node.put("sort", n.getSortNo());
        merge.add(node);
    }

    private List<Map<String, Object>> getMaps(List<Folder> folders, List<Node> nodes, Folder f, Map<String, List<String>> menuAuthMap, List<String> userAuthList, Map<String, String> mapping, String keyWord) {
        List<Map<String, Object>> children = new ArrayList<>();
        List<Folder> tempF = folders.stream().filter(filter -> {
            return filter.getParentPosition().equalsIgnoreCase(f.getPosition());
        }).collect(Collectors.toList());

        List<Node> tempN = nodes.stream().filter(filter -> {
            return filter.getParentPosition().equalsIgnoreCase(f.getPosition());
        }).collect(Collectors.toList());

        tempF.stream().forEach(ele -> {
            mergeList(children, folders, nodes, ele, menuAuthMap, userAuthList, mapping, keyWord);
        });

        tempN.stream().forEach(ele -> {
            mergeNode(children, ele, menuAuthMap, userAuthList, mapping, keyWord);
        });
        return children.stream().sorted(Comparator.comparing(Sort :: comparingBySortNo)).collect(Collectors.toList());
    }


    /**
     * 获取文件夹树
     *
     * @return
     * @throws SQLException
     */
    public List<Map<String, Object>> folderTree(Integer mount) throws SQLException {
        List<Map<String, Object>> merge = new ArrayList<>();
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
        Map<String, Object> folder = new HashMap<>();
        folder.put("title", f.getName());
        folder.put("value", f.getPosition());
        List<Map<String, Object>> children = treeMaps(folders, f);
        folder.put("key", f.getPosition());
        folder.put("children", children);
        merge.add(folder);
    }

    private List<Map<String, Object>> treeMaps(List<Folder> folders, Folder f) {
        List<Map<String, Object>> children = new ArrayList<>();
        List<Folder> tempF = folders.stream().filter(filter -> {
            return filter.getParentPosition().equalsIgnoreCase(f.getPosition());
        }).collect(Collectors.toList());
        tempF.stream().forEach(ele -> {
            treeList(children, folders, ele);
        });
        return children;
    }

}
