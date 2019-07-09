package com.aihuishou.bi.utils;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.File;
import java.util.HashSet;
import java.util.Set;

public class ScanFolder {

    private static final Logger logger = LoggerFactory.getLogger(ScanFolder.class);

    private static Set<String> inFiles = new HashSet<>();

	/**
	 * 递归方法
	 * @param path
	 */
	public static Set<String> traverseFolder(String path) {
        File file = new File(path);
        if (file.exists()) {
            File[] files = file.listFiles();
            if (files.length == 0) {
                return null;
            } else {
                for (File file2 : files) {
                    if (file2.isDirectory()) {
                        traverseFolder(file2.getAbsolutePath());
                    }else if(file2.isFile()) {
                        inFiles.add(file2.getAbsolutePath().replace(".html", "").replace(".js",""));
                    }
                }
            }
        } else {
            logger.info("目录不存在！");
        }
        return inFiles;
    } 
}
