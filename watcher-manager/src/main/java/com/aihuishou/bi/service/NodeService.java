package com.aihuishou.bi.service;

import com.aihuishou.bi.annotation.AutoFill;
import com.aihuishou.bi.core.SysConf;
import com.aihuishou.bi.entity.Node;
import com.aihuishou.bi.entity.NodeAuth;
import com.aihuishou.bi.utils.StringEx;
import com.aihuishou.bi.vo.NodeVO;
import org.apache.commons.dbutils.QueryRunner;
import org.apache.commons.dbutils.handlers.BeanHandler;
import org.apache.commons.dbutils.handlers.BeanListHandler;
import org.apache.commons.dbutils.handlers.ScalarHandler;
import org.apache.commons.lang3.StringUtils;
import org.apache.ibatis.jdbc.SQL;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.Resource;
import javax.sql.DataSource;
import java.sql.SQLException;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class NodeService extends BaseService {

    @Resource
    private DataSource dataSource;

    @Autowired
    private MappingService mappingService;

    public List<Node> nodes() throws SQLException {
        String sql = new SQL() {
            {
                SELECT("a.id, a.position, a.url, a.auth, a.name, a.parent_position AS parentPosition,a.mount,a.genre , CONCAT_WS('/', e.position, d.position,c.position,b.position,a.position) as path");
                FROM("bi_nodes a");
                LEFT_OUTER_JOIN("bi_folder b on a.parent_position = b.position");
                LEFT_OUTER_JOIN("bi_folder c on b.parent_position = c.position");
                LEFT_OUTER_JOIN("bi_folder d ON c.parent_position = d.position");
                LEFT_OUTER_JOIN("bi_folder e ON d.parent_position = e.position");
                WHERE("a.state='1'");
                ORDER_BY("a.sort_no asc");
            }
        }.toString();
        //String sql = "select id, position, url, auth, path, name, parent_position AS parentPosition,mount,genre from bi_nodes where state='1' order by sort_no;";
        return new QueryRunner(dataSource).query(sql, new BeanListHandler<Node>(Node.class));
    }

    @AutoFill
    @Transactional
    public int createNode(NodeVO nodeVO) throws SQLException {
        String position = StringEx.newUUID();
        String parent = nodeVO.getParentPosition();
        String mount = nodeVO.getMount();
        if(StringUtils.isBlank(parent) && StringUtils.isBlank(mount)) {
            throw new RuntimeException("父节点和挂载点必选其中之一");
        }
        if(StringUtils.isBlank(parent)) {
            parent = "-1";
        }
        if(StringUtils.isNotBlank(nodeVO.getParentPosition())) {
            mount = "0";
        }
        String sql = "INSERT INTO bi_nodes(position, url, name, mount, parent_position, state, empno, empname, create_time, update_time, genre) VALUES (?,?,?,?,?,?,?,?,now(),now(),'1');";
        QueryRunner dbUtils = new QueryRunner(dataSource);
        return dbUtils.update(sql, position, nodeVO.getUrl(), nodeVO.getName(), mount, parent, nodeVO.getState(), nodeVO.getEmpno(), nodeVO.getEmpname());
    }

    @AutoFill
    public int updateNode(NodeVO nodeVO) throws SQLException {
        String parent = nodeVO.getParentPosition();
        String mount = nodeVO.getMount();
        if(StringUtils.isBlank(parent) && StringUtils.isBlank(mount)) {
            throw new RuntimeException("父节点和挂载点必选其中之一");
        }
        if(StringUtils.isBlank(parent)) {
            parent = "-1";
        }
        if(StringUtils.isNotBlank(parent)) {
            mount = "0";
        }
        String sql = "UPDATE bi_nodes SET url = ?, name = ?, mount = ?, parent_position = ?, state = ? update_time = now() WHERE id = ?;";
        String url = nodeVO.getUrl();
        if(StringUtils.isNotBlank(url) && url.contains(SysConf.DAVINCI_SHARE_LINK_PREFIX)) {
            sql = "UPDATE bi_nodes SET url = ?, name = ?, mount = ?, parent_position = ?, state = ?, genre = '1' update_time = now() WHERE id = ?;";
            return new QueryRunner(dataSource).update(sql, nodeVO.getUrl(), nodeVO.getName(), mount, parent, nodeVO.getState(), nodeVO.getId());
        }
        return new QueryRunner(dataSource).update(sql, url, nodeVO.getName(), mount, parent, nodeVO.getState(), nodeVO.getId());
    }

    public int deleteNode(Long id) throws SQLException {
        String sql = "DELETE FROM bi_nodes WHERE id=?;";
        return new QueryRunner(dataSource).update(sql, id);
    }

    public Node getNodeById(Long id) throws SQLException {
        String sql = "SELECT id, position, url, auth, path, name, parent_position AS parentPosition, state, sort_no AS sortNo, genre FROM bi_nodes WHERE id = ?;";
        return new QueryRunner(dataSource).query(sql, new BeanHandler<Node>(Node.class), id);
    }


    public List<Node> getNodes(String key, String parent, Integer pageIndex, Integer pageSize) throws SQLException {
        String sql = "SELECT id, position, url, name, mount, parent_position AS parentPosition, state, sort_no AS sortNo, genre FROM bi_nodes WHERE 1=1 ";
        String append = " AND name like ? ";
        String append1 = " AND parent_position = ?";
        String suffix = " order by id asc limit ?,?;";
        //return this.getAbstractPageList(Node.class, sql, suffix, key, parent, pageIndex, pageSize, append, append1);
        List<Node> nodes = super.getAbstractPageList(Node.class, sql, suffix, key, parent, pageIndex, pageSize, append, append1);
        //List<Node> res = new ArrayList<>();
        if(nodes != null && nodes.size() != 0) {
            StringBuilder sb = new StringBuilder();
            List<String> positions = nodes.stream().map(Node::getPosition).collect(Collectors.toList());
            //Map<String, String> maps = mappingService.getModelMap(positions);

            sb.append("SELECT node_position as position, group_concat(auth_name SEPARATOR ',') AS authName FROM node_auth WHERE node_position in (");
            for(int i = 0; i < nodes.size(); i++) {
                String sourcePosition = nodes.get(i).getPosition();
                /*if(maps != null && maps.containsKey(sourcePosition)) {
                    sb.append("'").append(maps.get(sourcePosition)).append("'");
                } else {
                    sb.append("'").append(sourcePosition).append("'");
                }*/
                sb.append("'").append(sourcePosition).append("'");
                if(i != nodes.size() - 1) {
                    sb.append(",");
                }
            }
            sb.append(") group by node_position;");

            List<NodeAuth> authList = new QueryRunner(dataSource).query(sb.toString(), new BeanListHandler<>(NodeAuth.class));
            if(authList != null && authList.size() != 0) {
                Map<String, String> authMap = authList.stream().collect(Collectors.toMap(NodeAuth:: getPosition, NodeAuth :: getAuthName, (oldVal, currVal) -> currVal));
                nodes.stream().peek(p -> {
                    String po = p.getPosition();
                    String auth = "";
                    /*if(maps != null && maps.containsKey(po)) {
                        auth = authMap.get(maps.get(po));
                    } else {
                        auth = authMap.get(po);
                    }*/
                    auth = authMap.get(po);
                    if(StringUtils.isNotBlank(auth)) {
                        //String tar = StringUtils.substringBeforeLast(auth, ",");
                        p.setAuth(auth);
                    }
                }).collect(Collectors.toList());
            }
        }
        return nodes;
    }


    public Long count(String key, String parent) {
        String sql = "SELECT count(*) AS num FROM bi_nodes WHERE 1=1 ";
        String append = " AND name like ? ";
        String append1 = " AND parent_position = ?";
        return super.count(sql, key, parent, append, append1);
    }


    public int[] updateSort(List<Node> nodes) throws SQLException {
        String sql = "update bi_nodes set sort_no = ? where id = ?;";
        int size = nodes.size();
        Object[][] params = new Object[size][2];
        for(int i = 0; i < size; i++) {
            Node node = nodes.get(i);
            params[i] = new Object[]{node.getSortNo(), node.getId()};
        }
        return new QueryRunner(dataSource).batch(sql, params);
    }

    public Node nodeGenre(String position) throws SQLException {
        String sql = "select id, position, url, auth, path, name, parent_position AS parentPosition,mount,genre from bi_nodes where position = ? order by update_time desc limit 0,1;";
        Node node = new QueryRunner(dataSource).query(sql, new BeanHandler<>(Node.class), position);
        String path = getFinalPath(position);
        if(path == null) {
            return null;
        }
        node.setPath(path);
        return node;
    }

    public String getFinalPath(String position) throws SQLException {
        String sql = new SQL() {
            {
                SELECT("CONCAT_WS('/',e. NAME,d. NAME,c. NAME,b. NAME,a. NAME) AS path");
                FROM("bi_nodes a");
                LEFT_OUTER_JOIN("bi_folder b ON a.parent_position = b.position");
                LEFT_OUTER_JOIN("bi_folder c ON b.parent_position = c.position");
                LEFT_OUTER_JOIN("bi_folder d ON c.parent_position = d.position");
                LEFT_OUTER_JOIN("bi_folder e ON d.parent_position = e.position");
                WHERE("a.position = '" + position + "'");
            }
        }.toString();
        return new QueryRunner(dataSource).query(sql, new ScalarHandler<>("path"));
    }



}
