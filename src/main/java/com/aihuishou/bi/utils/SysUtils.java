package com.aihuishou.bi.utils;

import com.aihuishou.bi.core.SysConf;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.util.ResourceUtils;

import java.io.FileNotFoundException;
import java.util.HashMap;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

public class SysUtils {

    private static final Logger logger = LoggerFactory.getLogger(SysUtils.class);

    private static Map<String, String> positionMap = new HashMap<>();

    public static void load() throws FileNotFoundException {
        String path = ResourceUtils.getURL(ResourceUtils.CLASSPATH_URL_PREFIX + SysConf.OLD_FILE_FOLDER).getPath();
        Set<String> files = ScanFolder.traverseFolder(path);
        assert files != null;
        positionMap = files.stream().collect(Collectors.toMap(p -> StringUtils.substringAfterLast(getAfter(getUrl(p),SysConf.URL_SEPARATOR + SysConf.OLD_FILE_FOLDER), SysConf.URL_SEPARATOR), p -> getAfter(getUrl(p),SysConf.URL_SEPARATOR + SysConf.OLD_FILE_FOLDER),(oldVal, currVal) -> currVal));
        logger.info(positionMap.toString());
    }

    public static String getUrl(String path) {
        String res = null;
        try {
            res = ResourceUtils.getURL(path).getPath();
        } catch (FileNotFoundException e) {
            e.printStackTrace();
        }
        return res;
    }

    public static String getAfter(String path, String rep) {
        return StringUtils.substringAfterLast(path, StringUtils.substringBeforeLast(path, rep));
    }

    public static Map<String, String> getPositionMap() {
        return positionMap;
    }
}
