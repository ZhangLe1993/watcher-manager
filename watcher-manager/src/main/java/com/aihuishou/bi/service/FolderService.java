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
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.Resource;
import javax.sql.DataSource;
import java.sql.SQLException;
import java.util.List;

@Service
public class FolderService extends BaseService {

    @Resource
    private DataSource dataSource;

    public List<Folder> folders() throws SQLException {
        String sql = "select id, mount, name, position, parent_position AS parentPosition from bi_folder where state='1';";
        return new QueryRunner(dataSource).query(sql, new BeanListHandler<Folder>(Folder.class));
    }

    @AutoFill
    @Transactional
    public void createFolder(FolderVO folderVO) throws SQLException {
        String position = StringEx.newUUID();
        String parent = folderVO.getParentPosition();
        if(StringUtils.isBlank(parent)) {
            parent = "-1";
        }
        //select max(sort_no) + 1 from bi_folder where parent_position = ?
        String sql = "INSERT INTO bi_folder(position, name, state, parent_position, mount, empno, empname, create_time, update_time) VALUES (?,?,?,?,?,?,?,NOW(),NOW());";
        new QueryRunner(dataSource).update(sql, position, folderVO.getName(), folderVO.getState(), parent, folderVO.getMount(), folderVO.getEmpno(), folderVO.getEmpname());
    }

    @AutoFill
    public void updateFolder(FolderVO folderVO) throws SQLException {
        //暂时只提供修改名称，修改路径，修改是否上线, 修改挂载点
        String sql = "UPDATE bi_folder SET name = ?, parent_position = ?, state = ?,mount = ? WHERE id = ?;";
        new QueryRunner(dataSource).update(sql, folderVO.getName(), folderVO.getParentPosition(), folderVO.getState(), folderVO.getMount(), folderVO.getId());
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

    public Folder getFolderById(Long id) throws SQLException {
        String sql = "SELECT id,position,name,state,parent_position as parentPosition,mount,sort_no as sortNo FROM bi_folder WHERE id = ?;";
        return new QueryRunner(dataSource).query(sql, new BeanHandler<Folder>(Folder.class), id);
    }

    public List<Folder> getFolder(String key, String parent, Integer pageIndex, Integer pageSize) {
        String sql = "SELECT id, position, name, state, sort_no AS sortNo FROM bi_folder WHERE 1=1 ";
        String append = " AND name like ? ";
        String append1 = " AND parent_position = ?";
        String suffix = " order by sort_no limit ?,?;";
        return this.getAbstractPageList(Folder.class, sql, suffix, key, parent, pageIndex, pageSize, append, append1);
    }


    public Long count(String key, String parent) {
        String sql = "SELECT count(*) AS num FROM bi_folder WHERE 1=1 ";
        String append = " AND name like ? ";
        String append1 = " AND parent_position = ?";
        return this.count(sql, key, parent, append, append1);
    }


}
