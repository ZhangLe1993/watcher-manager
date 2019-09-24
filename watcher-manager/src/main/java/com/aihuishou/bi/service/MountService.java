package com.aihuishou.bi.service;

import com.aihuishou.bi.annotation.AutoFill;
import com.aihuishou.bi.core.SysConf;
import com.aihuishou.bi.entity.Folder;
import com.aihuishou.bi.entity.Mount;
import com.aihuishou.bi.entity.Node;
import com.aihuishou.bi.handler.OperateLogger;
import com.aihuishou.bi.vo.MountVO;
import org.apache.commons.dbutils.QueryRunner;
import org.apache.commons.dbutils.handlers.BeanHandler;
import org.apache.commons.dbutils.handlers.BeanListHandler;
import org.apache.commons.dbutils.handlers.ColumnListHandler;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.Resource;
import javax.sql.DataSource;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class MountService extends BaseService {

    @Resource
    private DataSource dataSource;

    @Autowired
    private OperateLogger operateLogger;

    public List<Mount> mounts() throws SQLException {
        String sql = "select id, name from bi_childless where state = '1' order by sort_no asc ;";
        return new QueryRunner(dataSource).query(sql, new BeanListHandler<Mount>(Mount.class));
    }

    //@Track(clazz = Clazz.MOUNT, operate = Operate.INSERT)
    @AutoFill
    public Long createMount(MountVO mountVO) throws SQLException {
        String sql = "INSERT INTO bi_childless(name, state, empno, empname, create_time, update_time) VALUES (?, ?, ?, ?, NOW(), NOW());";
        Long count = insertCase(sql, mountVO);
        if(count > 0) {
            mountVO.setId(count);
            operateLogger.append(count.toString(), null, mountVO, "mount", "insert", "新增挂载点");
        }
        return count;
    }

    /**
     * 具体的插入方法
     *
     * @param sql
     * @param mountVO
     * @return
     */
    private Long insertCase(String sql, MountVO mountVO) {
        KeyHolder keyHolder = new GeneratedKeyHolder();
        jdbcTemplate.update(conn -> {
            PreparedStatement ps = conn.prepareStatement(sql, PreparedStatement.RETURN_GENERATED_KEYS);
            ps.setString(1, mountVO.getName());
            ps.setString(2, mountVO.getState());
            ps.setString(3, mountVO.getEmpno());
            ps.setString(4, mountVO.getEmpname());
            return ps;
        }, keyHolder);
        // 返回主键
        //System.out.println("插入后数据主键：" + keyHolder.getKey().longValue());
        return keyHolder.getKey().longValue();
    }

    //@Track(clazz = Clazz.MOUNT, operate = Operate.UPDATE)
    @AutoFill
    @Transactional
    public int updateMount(MountVO mountVO) throws SQLException {
        Mount old = getMountById(mountVO.getId());
        String sql = "UPDATE bi_childless SET name = ?, state = ?, update_time = now() where id = ?;";
        int count = new QueryRunner(dataSource).update(sql, mountVO.getName(), mountVO.getState(), mountVO.getId());
        if(count > 0) {
            operateLogger.append(mountVO.getId().toString(), old, mountVO,  "mount", "update", "修改挂载点");
        }
        return count;
    }


    //@Track(clazz = Clazz.MOUNT, operate = Operate.DELETE)
    @Transactional
    public int deleteMount(MountVO mountVO) throws SQLException {
        Long id = mountVO.getId();
        if(id == null) {
            return 0;
        }
        //删除挂载点，基本不会有这个操作
        Mount old = getMountById(mountVO.getId());
        String sql = "DELETE FROM bi_childless WHERE id = ?;";
        int count = new QueryRunner(dataSource).update(sql, id);
        if(count == 0) {
            return 0;
        }
        //记录日志
        operateLogger.append(mountVO.getId().toString(), null, old, "mount", "delete", "删除挂载点");
        sql = "select position from bi_folder where mount = ?;";
        List<String> positions = new QueryRunner(dataSource).query(sql, new ColumnListHandler<>(), id);
        //级联删除Folder，以mount作为参数可以全局删除，不需要递归
        String load = SysConf.getLoadFolderSQLByMountId(id);
        List<Folder> froms = new QueryRunner(dataSource).query(load, new BeanListHandler<>(Folder.class));
        //执行删除
        sql = "DELETE FROM bi_folder WHERE mount = ?;";
        int row = new QueryRunner(dataSource).update(sql, id);
        if(row > 0) {
            this.batchFolderLogger(load, froms, "folder","recursive","级联删除文件夹");
        }
        //级联删除根报表,因为挂载在根目录时，没有父亲文件夹，只有挂载点。并且如果有父亲文件夹的报表的挂载点都是0，不可能会被删除
        load = SysConf.getLoadNodeSQLByMountId(id);
        List<Node> nodes = new QueryRunner(dataSource).query(load, new BeanListHandler<>(Node.class));
        sql = "DELETE FROM bi_nodes WHERE mount = ?;";
        row = new QueryRunner(dataSource).update(sql, id);
        if(row > 0) {
            this.batchNodeLogger(load, nodes, "node","recursive","级联删除报表");
        }
        //级联删除Node
        if(positions != null && positions.size() != 0) {
            String ins = StringUtils.join(positions.stream().map(p -> "'" + p + "'").collect(Collectors.toList()), ",");
            load = SysConf.getLoadNodeSQLByParentId(ins);
            nodes = new QueryRunner(dataSource).query(load, new BeanListHandler<>(Node.class));
            sql = "DELETE FROM bi_nodes WHERE parent_position = ?;";
            Object[][] params = new Object[positions.size()][1];
            for(int i = 0; i< positions.size(); i++) {
                params[i] = new Object[]{positions.get(i)};
            }
            int [] rows = new QueryRunner(dataSource).batch(sql, params);
            if(rows.length > 0) {
                this.batchNodeLogger(load, nodes, "node","recursive","级联删除报表");
            }
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
        String suffix = " order by id asc limit ?,?;";
        return super.getAbstractPageList(Mount.class, sql, suffix, key,null, pageIndex, pageSize, append, "");
    }


    public Long count(String key) {
        String sql = "SELECT count(*) AS num FROM bi_childless WHERE 1=1 ";
        String append = "AND name like ? ";
        return super.count(sql, key, null, append);
    }

    //@Track(clazz = Clazz.MOUNT, operate = Operate.UPDATE)
    @Transactional
    public int[] updateSort(List<Mount> mounts) throws SQLException {
        if(mounts == null || mounts.size() == 0) {
            return new int[]{};
        }
        //先查询出修改前的记录
        String in = StringUtils.join(mounts.stream().map(Mount::getId).collect(Collectors.toList()), ",");
        String load = SysConf.getLoadMountSQLById(in);
        //修改之前的记录
        List<Mount> froms = new QueryRunner(dataSource).query(load, new BeanListHandler<>(Mount.class));
        //执行修改
        String sql = "update bi_childless set sort_no = ? where id = ?;";
        int size = mounts.size();
        Object[][] params = new Object[size][2];
        for(int i = 0; i < size; i++) {
            Mount mount = mounts.get(i);
            params[i] = new Object[]{mount.getSortNo(), mount.getId()};
        }
        int[] count = new QueryRunner(dataSource).batch(sql, params);
        if(count.length > 0) {
            this.batchMountLogger(load, froms, "mount","sort","修改排序");
        }
        return count;
    }

}
