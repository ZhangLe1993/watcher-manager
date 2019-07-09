package com.aihuishou.bi.service;

import com.aihuishou.bi.core.SysConf;
import com.aihuishou.bi.utils.ScanFolder;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.util.ResourceUtils;

import java.io.FileNotFoundException;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class SysService {

    private final Logger logger = LoggerFactory.getLogger(SysService.class);


    @Value("${watcher.templates}")
    private String path;

    /*@CachePut(value = "position-map", key = "'position-map'", keyGenerator = "watcherManagerKeyGenerator")
    public Map initMap() {
        Map<String, String> positionMap = new HashMap<>();
        Set<String> files = ScanFolder.traverseFolder(path);
        assert files != null;
        positionMap = files.stream().collect(Collectors.toMap(p -> StringUtils.substringAfterLast(getAfter(getUrl(p),SysConf.URL_SEPARATOR + SysConf.OLD_FILE_FOLDER), SysConf.URL_SEPARATOR), p -> getAfter(getUrl(p),SysConf.URL_SEPARATOR + SysConf.OLD_FILE_FOLDER),(oldVal, currVal) -> currVal));
        logger.info(positionMap.toString());
        return positionMap;
    }*/


    @Cacheable(value = "position-map", keyGenerator = "watcherManagerKeyGenerator")
    public Map<String, String> getPositionMap() {
        Set<String> files = ScanFolder.traverseFolder(path);
        assert files != null;
        Map<String, String> positionMap = files.parallelStream().collect(Collectors.toMap(p -> StringUtils.substringAfterLast(getAfter(getUrl(p), SysConf.URL_SEPARATOR + SysConf.OLD_FILE_FOLDER), SysConf.URL_SEPARATOR), p -> getAfter(getUrl(p),SysConf.URL_SEPARATOR + SysConf.OLD_FILE_FOLDER),(oldVal, currVal) -> currVal));
        logger.info(positionMap.toString());
        return positionMap;
    }

    public String getUrl(String path) {
        String res = null;
        try {
            res = ResourceUtils.getURL(path).getPath();
        } catch (FileNotFoundException e) {
            e.printStackTrace();
        }
        return res;
    }

    public String getAfter(String path, String rep) {
        return StringUtils.substringAfterLast(path, StringUtils.substringBeforeLast(path, rep));
    }
}
