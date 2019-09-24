package com.aihuishou.bi.service;

import com.aihuishou.bi.annotation.AutoFill;
import com.aihuishou.bi.core.SysConf;
import com.aihuishou.bi.entity.Folder;
import com.aihuishou.bi.entity.Node;
import com.aihuishou.bi.handler.OperateLogger;
import com.aihuishou.bi.utils.StringEx;
import com.aihuishou.bi.vo.FolderVO;
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
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class FolderService extends BaseService {

    @Resource
    private DataSource dataSource;

    @Autowired
    private OperateLogger operateLogger;

    public List<Folder> folders() throws SQLException {
        String sql = new SQL() {
            {
                SELECT("a.id, a.mount, a.name, a.position, a.parent_position AS parentPosition, CONCAT_WS('/', e.position, d.position,c.position,b.position,a.position) as path, a.sort_no AS sortNo");
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
            String sql = "select id, mount, name, position, parent_position AS parentPosition from bi_folder where 1=1 and state = '1';";
            return new QueryRunner(dataSource).query(sql, new BeanListHandler<Folder>(Folder.class));
        } else {
            String sql = "select id, mount, name, position, parent_position AS parentPosition from bi_folder where 1=1 and state = '1' and mount = ?;";
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

    //@Track(clazz = Clazz.FOLDER, operate = Operate.INSERT)
    @AutoFill
    @Transactional
    public int createFolder(FolderVO folderVO) throws SQLException {
        String position = StringEx.newUUID();
        String parent = folderVO.getParentPosition();
        folderVO.setPosition(position);
        if(StringUtils.isBlank(parent)) {
            parent = "-1";
        }
        //select max(sort_no) + 1 from bi_folder where parent_position = ?
        String sql = "INSERT INTO bi_folder(position, name, state, parent_position, mount, empno, empname, create_time, update_time) VALUES (?,?,?,?,?,?,?,NOW(),NOW());";
        int count = new QueryRunner(dataSource).update(sql, position, folderVO.getName(), folderVO.getState(), parent, folderVO.getMount(), folderVO.getEmpno(), folderVO.getEmpname());
        if(count > 0) {
            operateLogger.append(position, null, folderVO, "folder", "insert", "新增文件夹");
        }
        return count;
    }

    //@Track(clazz = Clazz.FOLDER, operate = Operate.UPDATE)
    @AutoFill
    public int updateFolder(FolderVO folderVO) throws SQLException {
        String parent = folderVO.getParentPosition();
        if(StringUtils.isBlank(parent)) {
            parent = "-1";
        }
        Folder old = getFolderById(folderVO.getId());
        folderVO.setPosition(old.getPosition());
        //暂时只提供修改名称，修改路径，修改是否上线, 修改挂载点
        String sql = "UPDATE bi_folder SET name = ?, parent_position = ?, state = ?,mount = ? WHERE id = ?;";
        int count = new QueryRunner(dataSource).update(sql, folderVO.getName(), parent, folderVO.getState(), folderVO.getMount(), folderVO.getId());
        if(count > 0) {
            operateLogger.append(old.getPosition(), old, folderVO, "folder", "update", "修改文件夹");
        }
        return count;
    }

    //@Track(clazz = Clazz.FOLDER, operate = Operate.DELETE)
    @Transactional
    public int deleteFolder(FolderVO folderVO) throws SQLException {
        Long id = folderVO.getId();
        if(id == null) {
            return 0;
        }
        //func_get_folder_tree 是一个递归函数
        String sql = "SELECT func_get_folder_tree(?) AS positions;";
        String positions = new QueryRunner(dataSource).query(sql, new ScalarHandler<>(), id);
        sql = "DELETE FROM bi_folder WHERE id = ?;";
        Folder old = getFolderById(folderVO.getId());
        //根据id删除文件夹
        int count = new QueryRunner(dataSource).update(sql, id);
        if(count > 0) {
            //记录日志
            operateLogger.append(old.getPosition(), null, old, "folder", "delete", "删除文件夹");
            //级联递归删除子folder
            String[] in = StringUtils.split(positions, ",");
            String ins = StringUtils.join(Arrays.stream(in).map(p -> "'" + p + "'").collect(Collectors.toList()), ",");
            if(in.length != 0) {
                Object[][] params = new Object[in.length][1];
                for(int i = 0; i < in.length; i++) {
                    params[i] = new Object[]{in[i]};
                }
                //查询出要删除的文件夹以便记录删除日志
                String load = SysConf.getLoadFolderSQLByParentId(ins);
                List<Folder> froms = new QueryRunner(dataSource).query(load, new BeanListHandler<>(Folder.class));
                //级联删除子文件夹
                sql = "DELETE FROM bi_folder WHERE parent_position = ?;";
                int folder[] = new QueryRunner(dataSource).batch(sql, params);
                if(folder.length != 0) {
                    this.batchFolderLogger(load, froms, "folder","recursive","级联删除文件夹");
                }
                //级联删除node
                load = SysConf.getLoadNodeSQLByParentId(ins);
                List<Node> nodes = new QueryRunner(dataSource).query(load, new BeanListHandler<>(Node.class));
                sql = "DELETE FROM bi_nodes WHERE parent_position = ?;";
                int node[] = new QueryRunner(dataSource).batch(sql, params);
                if(node.length != 0) {
                    this.batchNodeLogger(load, nodes, "node","recursive","级联删除报表");
                }
            }
        }

        return count;
    }

    public Folder getFolderById(Long id) throws SQLException {
        String sql = "SELECT a.id, a.mount, a.name, a.position, a.parent_position AS parentPosition, CONCAT_WS('/', e.position, d.position,c.position,b.position,a.position) as path, a.sort_no AS sortNo FROM bi_folder a "
                + " left join bi_folder b ON a.parent_position = b.position"
                + " left join bi_folder c ON b.parent_position = c.position"
                + " left join bi_folder d ON c.parent_position = d.position"
                + " left join bi_folder e ON d.parent_position = e.position"
                + " WHERE 1=1 and a.id = ?;";
        return new QueryRunner(dataSource).query(sql, new BeanHandler<>(Folder.class), id);
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


    //@Track(clazz = Clazz.FOLDER, operate = Operate.UPDATE)
    public int[] updateSort(List<Folder> folders) throws SQLException {
        if(folders == null || folders.size() == 0) {
            return new int[]{};
        }
        //先查询出修改前的记录
        String in = StringUtils.join(folders.stream().map(Folder::getId).collect(Collectors.toList()), ",");
        String load = SysConf.getLoadFolderSQLById(in);
        //修改之前的记录
        List<Folder> froms = new QueryRunner(dataSource).query(load, new BeanListHandler<>(Folder.class));
        String sql = "update bi_folder set sort_no = ? where id = ?;";
        int size = folders.size();
        Object[][] params = new Object[size][2];
        for(int i = 0; i < size; i++) {
            Folder folder = folders.get(i);
            params[i] = new Object[]{folder.getSortNo(), folder.getId()};
        }
        int[] count = new QueryRunner(dataSource).batch(sql, params);
        if(count.length > 0) {
            this.batchFolderLogger(load, froms, "folder","sort","修改排序");
        }
        return count;
    }



}
