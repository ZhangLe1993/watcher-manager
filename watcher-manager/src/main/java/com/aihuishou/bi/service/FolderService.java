package com.aihuishou.bi.service;

import com.aihuishou.bi.annotation.AutoFill;
import com.aihuishou.bi.entity.Folder;
import com.aihuishou.bi.utils.StringEx;
import com.aihuishou.bi.vo.FolderVO;
import org.apache.commons.dbutils.QueryRunner;
import org.apache.commons.dbutils.handlers.BeanHandler;
import org.apache.commons.dbutils.handlers.BeanListHandler;
import org.apache.commons.dbutils.handlers.ScalarHandler;
import org.apache.commons.lang3.StringUtils;
import org.apache.ibatis.jdbc.SQL;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.Resource;
import javax.sql.DataSource;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

@Service
public class FolderService extends BaseService {

    @Resource
    private DataSource dataSource;

    public List<Folder> folders() throws SQLException {
        String sql = new SQL() {
            {
                SELECT("a.id, a.mount, a.name, a.position, a.parent_position AS parentPosition, CONCAT_WS('/', e.position, d.position,c.position,b.position,a.position) as path");
                FROM("bi_folder a");
                LEFT_OUTER_JOIN("bi_folder b on a.parent_position = b.position");
                LEFT_OUTER_JOIN("bi_folder c on b.parent_position = c.position");
                LEFT_OUTER_JOIN("bi_folder d ON c.parent_position = d.position");
                LEFT_OUTER_JOIN("bi_folder e ON d.parent_position = e.position");
                WHERE("a.state='1'");
                ORDER_BY("a.sort_no asc");
            }
        }.toString();
        //String sql = "select id, mount, name, position, parent_position AS parentPosition from bi_folder where state='1' order by sort_no asc;";
        return new QueryRunner(dataSource).query(sql, new BeanListHandler<>(Folder.class));
    }


    public List<Folder> folders(Integer mount) throws SQLException {
        if(mount == null) {
            String sql = "select id, mount, name, position, parent_position AS parentPosition from bi_folder where 1=1 ;";
            return new QueryRunner(dataSource).query(sql, new BeanListHandler<Folder>(Folder.class));
        } else {
            String sql = "select id, mount, name, position, parent_position AS parentPosition from bi_folder where 1=1 and mount = ?;";
            return new QueryRunner(dataSource).query(sql, new BeanListHandler<Folder>(Folder.class), mount);
        }
    }


    /**
     * 获取直接子集目录
     * @param mount
     * @param parentPosition
     * @return
     * @throws SQLException
     */
    public List<Folder> folders(Integer mount, String parentPosition) throws SQLException {
        if(StringUtils.isNotBlank(parentPosition)) {
            String sql = "select id, mount, name, position, parent_position AS parentPosition, sort_no AS sortNo from bi_folder where 1=1 and parent_position = ?;";
            return new QueryRunner(dataSource).query(sql, new BeanListHandler<Folder>(Folder.class), parentPosition);
        } else if(mount != null) {
            String sql = "select id, mount, name, position, parent_position AS parentPosition from bi_folder where 1=1 and mount = ? and parent_position = '-1';";
            return new QueryRunner(dataSource).query(sql, new BeanListHandler<Folder>(Folder.class), mount);
        }
        return new ArrayList<>();
    }

    @AutoFill
    @Transactional
    public int createFolder(FolderVO folderVO) throws SQLException {
        String position = StringEx.newUUID();
        String parent = folderVO.getParentPosition();
        if(StringUtils.isBlank(parent)) {
            parent = "-1";
        }
        //select max(sort_no) + 1 from bi_folder where parent_position = ?
        String sql = "INSERT INTO bi_folder(position, name, state, parent_position, mount, empno, empname, create_time, update_time) VALUES (?,?,?,?,?,?,?,NOW(),NOW());";
        return new QueryRunner(dataSource).update(sql, position, folderVO.getName(), folderVO.getState(), parent, folderVO.getMount(), folderVO.getEmpno(), folderVO.getEmpname());
    }

    @AutoFill
    public int updateFolder(FolderVO folderVO) throws SQLException {
        String parent = folderVO.getParentPosition();
        if(StringUtils.isBlank(parent)) {
            parent = "-1";
        }
        //暂时只提供修改名称，修改路径，修改是否上线, 修改挂载点
        String sql = "UPDATE bi_folder SET name = ?, parent_position = ?, state = ?,mount = ? WHERE id = ?;";
        return new QueryRunner(dataSource).update(sql, folderVO.getName(), parent, folderVO.getState(), folderVO.getMount(), folderVO.getId());
    }

    @Transactional
    public int deleteFolder(Long id) throws SQLException {
        //func_get_folder_tree 是一个递归函数
        String sql = "SELECT func_get_folder_tree(?) AS positions;";
        String positions = new QueryRunner(dataSource).query(sql, new ScalarHandler<>(), id);
        sql = "DELETE FROM bi_folder WHERE id = ?;";
        int count = new QueryRunner(dataSource).update(sql, id);
        //级联递归删除子folder
        String[] in = StringUtils.split(positions, ",");

        if(in != null && in.length != 0) {
            Object[][] params = new Object[in.length][1];
            for(int i = 0; i < in.length; i++) {
                params[i] = new Object[]{in[i]};
            }
            sql = "DELETE FROM bi_folder WHERE parent_position = ?;";
            new QueryRunner(dataSource).batch(sql, params);
            //级联删除node
            sql = "DELETE FROM bi_nodes WHERE parent_position = ?;";
            new QueryRunner(dataSource).batch(sql, params);
        }
        return count;
    }

    public Folder getFolderById(Long id) throws SQLException {
        String sql = "SELECT id,position,name,state,parent_position as parentPosition,mount,sort_no as sortNo FROM bi_folder WHERE id = ?;";
        return new QueryRunner(dataSource).query(sql, new BeanHandler<Folder>(Folder.class), id);
    }

    public List<Folder> getFolder(String key, String parent, Integer pageIndex, Integer pageSize) {
        String sql = "SELECT id, position, name, state, mount, parent_position AS parentPosition, sort_no AS sortNo FROM bi_folder WHERE 1=1 ";
        String append = " AND name like ? ";
        String append1 = " AND parent_position = ?";
        String suffix = " order by id asc limit ?,?;";
        return super.getAbstractPageList(Folder.class, sql, suffix, key, parent, pageIndex, pageSize, append, append1);
    }


    public Long count(String key, String parent) {
        String sql = "SELECT count(*) AS num FROM bi_folder WHERE 1=1 ";
        String append = " AND name like ? ";
        String append1 = " AND parent_position = ?";
        return super.count(sql, key, parent, append, append1);
    }


    public int[] updateSort(List<Folder> folders) throws SQLException {
        String sql = "update bi_folder set sort_no = ? where id = ?;";
        int size = folders.size();
        Object[][] params = new Object[size][2];
        for(int i = 0; i < size; i++) {
            Folder folder = folders.get(i);
            params[i] = new Object[]{folder.getSortNo(), folder.getId()};
        }
        return new QueryRunner(dataSource).batch(sql, params);
    }


}
