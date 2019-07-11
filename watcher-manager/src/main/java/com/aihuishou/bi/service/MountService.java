package com.aihuishou.bi.service;

import com.aihuishou.bi.entity.Mount;
import com.aihuishou.bi.vo.MountVO;
import org.apache.commons.dbutils.QueryRunner;
import org.apache.commons.dbutils.handlers.BeanHandler;
import org.apache.commons.dbutils.handlers.BeanListHandler;
import org.apache.commons.dbutils.handlers.ColumnListHandler;
import org.apache.commons.lang3.StringUtils;
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
        String sql = "select id, name from bi_childless where state = '1';";
        return new QueryRunner(dataSource).query(sql, new BeanListHandler<Mount>(Mount.class));
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


    public Mount getMountById(Long id) throws SQLException {
        String sql = "SELECT id, name, state, sort_no AS sortNo FROM bi_childless WHERE id = ?;";
        return new QueryRunner(dataSource).query(sql, new BeanHandler<Mount>(Mount.class), id);
    }

    public List<Mount> getMount(String key, Integer pageIndex, Integer pageSize) {
        String sql = "SELECT id, name, state, sort_no AS sortNo FROM bi_childless WHERE name like ? ";
        String suffix = " order by sort_no limit ?,?;";
        return this.getAbstractPageList(Mount.class, sql, suffix, "%" + key + "%",null, pageIndex, pageSize, "", "");
    }


    public Long count(String key) {
        String sql = "SELECT count(*) AS num FROM bi_childless WHERE 1=1 ";
        String append = "AND name like ? ";
        return this.count(sql, key, null, append);
    }


}
