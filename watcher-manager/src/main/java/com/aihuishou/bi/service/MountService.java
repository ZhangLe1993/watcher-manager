package com.aihuishou.bi.service;

import com.aihuishou.bi.annotation.AutoFill;
import com.aihuishou.bi.entity.Mount;
import com.aihuishou.bi.vo.MountVO;
import org.apache.commons.dbutils.QueryRunner;
import org.apache.commons.dbutils.handlers.BeanHandler;
import org.apache.commons.dbutils.handlers.BeanListHandler;
import org.apache.commons.dbutils.handlers.ColumnListHandler;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.Resource;
import javax.sql.DataSource;
import java.sql.SQLException;
import java.util.List;

@Service
public class MountService extends BaseService {

    @Resource
    private DataSource dataSource;

    public List<Mount> mounts() throws SQLException {
        String sql = "select id, name from bi_childless where state = '1' order by sort_no asc ;";
        return new QueryRunner(dataSource).query(sql, new BeanListHandler<Mount>(Mount.class));
    }

    @AutoFill
    public int createMount(MountVO mountVO) throws SQLException {
        String sql = "INSERT INTO bi_childless(name, state, empno, empname, create_time, update_time) VALUES (?, ?, ?, ?, NOW(), NOW());";
        return new QueryRunner(dataSource).update(sql, mountVO.getName(), mountVO.getState(), mountVO.getEmpno(), mountVO.getEmpname());
    }

    @AutoFill
    public int updateMount(MountVO mountVO) throws SQLException {
        String sql = "UPDATE bi_childless SET name = ?, state = ?, update_time = now() where id = ?;";
        return new QueryRunner(dataSource).update(sql, mountVO.getName(), mountVO.getState(), mountVO.getId());
    }


    @Transactional
    public int deleteMount(Long id) throws SQLException {
        //删除挂载点，基本不会有这个操作
        String sql = "DELETE FROM bi_childless WHERE id = ?;";
        int count = new QueryRunner(dataSource).update(sql, id);

        sql = "select position from bi_folder where mount = ?;";
        List<String> positions = new QueryRunner(dataSource).query(sql, new ColumnListHandler<>(), id);
        //级联删除Folder，以mount作为参数可以全局删除，不需要递归
        sql = "DELETE FROM bi_folder WHERE mount = ?;";
        new QueryRunner(dataSource).update(sql, id);

        //级联删除根报表,因为挂载在根目录时，没有父亲文件夹，只有挂载点。并且如果有父亲文件夹的报表的挂载点都是0，不可能会被删除
        sql = "DELETE FROM bi_nodes WHERE mount = ?;";
        new QueryRunner(dataSource).update(sql, id);
        //级联删除Node
        if(positions != null && positions.size() != 0) {
            sql = "DELETE FROM bi_nodes WHERE parent_position = ?;";
            Object[][] params = new Object[positions.size()][1];
            for(int i = 0; i< positions.size(); i++) {
                params[i] = new Object[]{positions.get(i)};
            }
            new QueryRunner(dataSource).batch(sql, params);
        }
        return count;
    }


    public Mount getMountById(Long id) throws SQLException {
        String sql = "SELECT id, name, state, sort_no AS sortNo FROM bi_childless WHERE id = ?;";
        return new QueryRunner(dataSource).query(sql, new BeanHandler<Mount>(Mount.class), id);
    }

    public List<Mount> getMount(String key, Integer pageIndex, Integer pageSize) {
        String sql = "SELECT id, name, state, sort_no AS sortNo FROM bi_childless WHERE 1=1 ";
        String append = "AND name like ? ";
        String suffix = " order by sort_no limit ?,?;";
        return super.getAbstractPageList(Mount.class, sql, suffix, key,null, pageIndex, pageSize, append, "");
    }


    public Long count(String key) {
        String sql = "SELECT count(*) AS num FROM bi_childless WHERE 1=1 ";
        String append = "AND name like ? ";
        return super.count(sql, key, null, append);
    }

    public int[] updateSort(List<Mount> mounts) throws SQLException {
        String sql = "update bi_childless set sort_no = ? where id = ?;";
        int size = mounts.size();
        Object[][] params = new Object[size][2];
        for(int i = 0; i < size; i++) {
            Mount mount = mounts.get(i);
            params[i] = new Object[]{mount.getSortNo(), mount.getId()};
        }
        return new QueryRunner(dataSource).batch(sql, params);
    }

}
