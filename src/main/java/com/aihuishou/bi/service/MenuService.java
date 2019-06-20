package com.aihuishou.bi.service;

import com.aihuishou.bi.entity.Folder;
import com.aihuishou.bi.entity.Mount;
import com.aihuishou.bi.entity.Node;
import com.aihuishou.bi.vo.FolderVO;
import com.aihuishou.bi.vo.MountVO;
import com.aihuishou.bi.vo.NodeVO;
import org.apache.commons.dbutils.QueryRunner;
import org.apache.commons.dbutils.handlers.BeanHandler;
import org.apache.commons.dbutils.handlers.BeanListHandler;
import org.apache.commons.dbutils.handlers.ColumnListHandler;
import org.apache.commons.dbutils.handlers.ScalarHandler;
import org.apache.commons.lang3.StringUtils;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.Resource;
import javax.sql.DataSource;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class MenuService {

    @Resource
    private DataSource dataSource;

    @Resource
    private JdbcTemplate jdbcTemplate;


    public List<Map<String,Object>> merge() throws SQLException {
        List<Map<String,Object>> merge = new ArrayList<>();
        List<Mount> mounts = mounts();
        List<Folder> folders = folders();
        List<Node> nodes = nodes();

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
        folder.put("children", children);
        merge.add(folder);
    }

    private void mergeNode(List<Map<String, Object>> merge, Node n) {
        Map<String,Object> node = new HashMap<>();
        node.put("path", n.getUrl());
        node.put("icon", "monitor");
        node.put("name", n.getName());
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


    public List<Mount> mounts() throws SQLException {
        String sql = "select id, name from bi_childless where state = '1';";
        return new QueryRunner(dataSource).query(sql, new BeanListHandler<Mount>(Mount.class));
    }

    public List<Folder> folders() throws SQLException {
        String sql = "select id, mount, name, position, parent_position AS parentPosition from bi_folder where state='1';";
        return new QueryRunner(dataSource).query(sql, new BeanListHandler<Folder>(Folder.class));
    }

    public List<Node> nodes() throws SQLException {
        String sql = "select id, position, url, auth, path, name, parent_position AS parentPosition from bi_nodes where state='1' order by sort_no;";
        return new QueryRunner(dataSource).query(sql, new BeanListHandler<Node>(Node.class));
    }

    public void createMount(MountVO mountVO) throws SQLException {
        String sql = "INSERT INTO bi_childless(name, state, empno, empname, create_time, update_time, sort_no) VALUES (?, ?, ?, ?, NOW(), NOW(), ?);";
        new QueryRunner(dataSource).update(sql, mountVO.getName(), mountVO.getState(), mountVO.getEmpno(), mountVO.getEmpname(), mountVO.getSortNo());
    }

    public void updateMount(MountVO mountVO) throws SQLException {
        String sql = "UPDATE bi_childless SET name = ?, state = ?, update_time = now(), sort_no = ? where id = ?;";
        new QueryRunner(dataSource).update(sql, mountVO.getName(), mountVO.getState(), mountVO.getSortNo(), mountVO.getId());
    }


    @Transactional
    public void deleteMount(Long id) throws SQLException {
        //删除挂载点，基本不会有这个操作
        String sql = "DELETE FROM bi_childless WHERE id = ?;";
        new QueryRunner(dataSource).update(sql, id);

        sql = "select position from bi_folder where mount = ?;";
        List<String> positions = new QueryRunner(dataSource).query(sql, new ColumnListHandler<>(), id);
        //级联删除Folder，以mount作为参数可以全局删除，不需要递归
        sql = "DELETE FROM bi_folder WHERE mount = ?;";
        new QueryRunner(dataSource).update(sql, id);
        //级联删除Node
        sql = "DELETE FROM bi_nodes WHERE parent_position in (?);";
        String where = StringUtils.join(positions,",");
        new QueryRunner(dataSource).update(sql, where);
    }


    public void createFolder(FolderVO folderVO) throws SQLException {
        String sql = "INSERT INTO bi_folder(position, name, state, parent_position, mount, empno, empname, create_time, update_time, sort_no) VALUES (?,?,?,?,?,?,?,NOW(),NOW(),?);";
        new QueryRunner(dataSource).update(sql, folderVO.getPosition(), folderVO.getName(), folderVO.getState(), folderVO.getMount(), folderVO.getEmpno(), folderVO.getEmpname(), folderVO.getSortNo());
    }


    public void updateFolder(FolderVO folderVO) throws SQLException {
        //暂时只提供修改名称，修改路径，修改是否上线, 修改排序
        String sql = "UPDATE bi_folder SET name = ?, parent_position = ?, state = ?, sort_no = ? WHERE id = ?;";
        new QueryRunner(dataSource).update(sql, folderVO.getName(), folderVO.getState(), folderVO.getSortNo(), folderVO.getId());
    }

    @Transactional
    public void deleteFolder(Long id) throws SQLException {
        //func_get_folder_tree 是一个递归函数
        String sql = "SELECT func_get_folder_tree(?) AS positions;";
        String positions = new QueryRunner(dataSource).query(sql, new ScalarHandler<>(), id);
        sql = "DELETE FROM bi_folder WHERE id = ?;";
        new QueryRunner(dataSource).update(sql, id);
        //级联递归删除子folder
        sql = "DELETE FROM bi_folder WHERE parent_position in (?);";
        String[] in = StringUtils.split(positions, ",");
        new QueryRunner(dataSource).update(sql, StringUtils.join(in, ","));
        //级联删除node
        sql = "DELETE FROM bi_nodes WHERE parent_position in (?);";
        new QueryRunner(dataSource).update(sql, StringUtils.join(in, ","));

    }


    public void createNode(NodeVO nodeVO) throws SQLException {
        String sql = "INSERT INTO bi_nodes(position, url, auth, path, name, parent_position,state,empno,empname,create_time,update_time,sort_no, genre) VALUES (?,?,?,?,?,?,?,?,?,now(),now(),?,?);";
        new QueryRunner(dataSource).update(sql, nodeVO.getPosition(),nodeVO.getUrl(), nodeVO.getAuth(), nodeVO.getPath(), nodeVO.getName(),
                nodeVO.getParentPosition(),nodeVO.getState(),nodeVO.getEmpno(),nodeVO.getEmpname(),nodeVO.getSortNo(),nodeVO.getGenre());
    }

    public void updateNode(NodeVO nodeVO) throws SQLException {
        String sql = "UPDATE bi_nodes SET position = ?, url = ?, auth = ?, path = ?, name = ?, parent_position = ?, state = ?, update_time = now(), sort_no = ?, genre = ? WHERE id = ?;";
        new QueryRunner(dataSource).update(sql, nodeVO.getPosition(),nodeVO.getUrl(), nodeVO.getAuth(), nodeVO.getPath(), nodeVO.getName(),
                nodeVO.getParentPosition(),nodeVO.getState(),nodeVO.getSortNo(),nodeVO.getGenre(), nodeVO.getId());
    }

    public void deleteNode(Long id) throws SQLException {
        String sql = "DELETE FROM bi_nodes WHERE id=?;";
        new QueryRunner(dataSource).update(sql, id);
    }

    public Mount getMountById(Long id) throws SQLException {
        String sql = "SELECT id, name, state, sort_no FROM bi_childless WHERE id = ?;";
        return new QueryRunner(dataSource).query(sql, new BeanHandler<Mount>(Mount.class), id);
    }

    public Folder getFolderById(Long id) throws SQLException {
        String sql = "SELECT id,position,name,state,parent_position as parentPosition,mount,sort_no as sortNo FROM bi_folder WHERE id = ?;";
        return new QueryRunner(dataSource).query(sql, new BeanHandler<Folder>(Folder.class), id);
    }

    public Node getNodeById(Long id) throws SQLException {
        String sql = "SELECT id, position, url, auth, path, name, parent_position AS parentPosition, state, sort_no AS sortNo, genre FROM bi_nodes WHERE id = ?;";
        return new QueryRunner(dataSource).query(sql, new BeanHandler<Node>(Node.class), id);
    }

}
