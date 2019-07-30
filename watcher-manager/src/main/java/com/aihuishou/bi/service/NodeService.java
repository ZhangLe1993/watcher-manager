package com.aihuishou.bi.service;

import com.aihuishou.bi.annotation.AutoFill;
import com.aihuishou.bi.entity.Node;
import com.aihuishou.bi.utils.StringEx;
import com.aihuishou.bi.vo.NodeVO;
import org.apache.commons.dbutils.QueryRunner;
import org.apache.commons.dbutils.handlers.BeanHandler;
import org.apache.commons.dbutils.handlers.BeanListHandler;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.Resource;
import javax.sql.DataSource;
import java.sql.SQLException;
import java.util.List;

@Service
public class NodeService extends BaseService {

    @Resource
    private DataSource dataSource;

    public List<Node> nodes() throws SQLException {
        String sql = "select id, position, url, auth, path, name, parent_position AS parentPosition,mount from bi_nodes where state='1' order by sort_no;";
        return new QueryRunner(dataSource).query(sql, new BeanListHandler<Node>(Node.class));
    }

    @AutoFill
    @Transactional
    public void createNode(NodeVO nodeVO) throws SQLException {
        String position = StringEx.newUUID();
        String parent = nodeVO.getParentPosition();
        if(StringUtils.isBlank(parent)) {
            parent = "-1";
        }
        String mount = nodeVO.getMount();
        if(StringUtils.isBlank(parent)) {
            mount = "0";
        }
        String sql = "INSERT INTO bi_nodes(position, url, name, mount, parent_position, state, empno, empname, create_time, update_time, genre) VALUES (?,?,?,?,?,?,?,now(),now(),'1');";
        QueryRunner dbUtils = new QueryRunner(dataSource);
        dbUtils.update(sql, position, nodeVO.getUrl(), nodeVO.getName(), mount,
                parent, nodeVO.getState(), nodeVO.getEmpno(), nodeVO.getEmpname());
        //sql = "INSERT INTO node_auth(node_position, auth_name) VALUES (?, ?);";
        //List<String> auth = nodeVO.getAuth();
        //待实现
        //dbUtils.update(sql, position, nodeVO.getAuth());
    }

    @AutoFill
    public void updateNode(NodeVO nodeVO) throws SQLException {
        String sql = "UPDATE bi_nodes SET url = ?, name = ?, mount = ?, parent_position = ?, state = ?, update_time = now() WHERE id = ?;";
        QueryRunner dbUtils = new QueryRunner(dataSource);
        dbUtils.update(sql, nodeVO.getUrl(), nodeVO.getName(), nodeVO.getMount(),
                nodeVO.getParentPosition(), nodeVO.getState(), nodeVO.getId());
        //sql = "DELETE FROM node_auth WHERE node_position = ? AND auth_name = ?;";
        //待实现
        //sql = "INSERT INTO node_auth(node_position, auth_name) VALUES (?, ?);";
    }

    public void deleteNode(Long id) throws SQLException {
        String sql = "DELETE FROM bi_nodes WHERE id=?;";
        new QueryRunner(dataSource).update(sql, id);
    }

    public Node getNodeById(Long id) throws SQLException {
        String sql = "SELECT id, position, url, auth, path, name, parent_position AS parentPosition, state, sort_no AS sortNo, genre FROM bi_nodes WHERE id = ?;";
        return new QueryRunner(dataSource).query(sql, new BeanHandler<Node>(Node.class), id);
    }


    public List<Node> getNodes(String key, String parent, Integer pageIndex, Integer pageSize) {
        String sql = "SELECT id, position, url, auth, path, name, mount, parent_position AS parentPosition, state, sort_no AS sortNo, genre FROM bi_nodes WHERE 1=1 ";
        String append = " AND name like ? ";
        String append1 = " AND parent_position = ?";
        String suffix = " order by sort_no limit ?,?;";
        return this.getAbstractPageList(Node.class, sql, suffix, key, parent, pageIndex, pageSize, append, append1);
    }


    public Long count(String key, String parent) {
        String sql = "SELECT count(*) AS num FROM bi_nodes WHERE 1=1 ";
        String append = " AND name like ? ";
        String append1 = " AND parent_position = ?";
        return this.count(sql, key, parent, append, append1);
    }



}
