package com.aihuishou.bi.core;

public interface Event {

    enum Mount implements Event {

        INSERT("新增挂载点", "【%s】于【%s】新增了【%s】"),
        UPDATE("修改挂载点", "【%s】于【%s】修改了【%s】 -> 【%s】"),
        DELETE("删除挂载点", "【%s】于【%s】删除了【%s】")
        ;

        private String name;
        private String template;

        Mount(String name, String template) {
            this.name = name;
            this.template = template;
        }

        public String getName() {
            return name;
        }

        public String getTemplate() {
            return template;
        }

        public static Mount select(Operate type) {
            switch(type) {
                case INSERT :
                    return Mount.INSERT;
                case UPDATE :
                    return Mount.UPDATE;
                case DELETE :
                    return Mount.DELETE;
            }
            return null;
        }
    }

    enum Folder implements Event {

        INSERT("新增文件夹", "【%s】于【%s】新增了【%s】"),
        UPDATE("修改文件夹", "【%s】于【%s】修改了【%s】 -> 【%s】"),
        DELETE("删除文件夹", "【%s】于【%s】删除了【%s】")
        ;

        private String name;
        private String template;

        Folder(String name, String template) {
            this.name = name;
            this.template = template;
        }

        public String getName() {
            return name;
        }

        public String getTemplate() {
            return template;
        }

        public static Folder select(Operate type) {
            switch(type) {
                case INSERT :
                    return Folder.INSERT;
                case UPDATE :
                    return Folder.UPDATE;
                case DELETE :
                    return Folder.DELETE;
            }
            return null;
        }

    }

    enum Node implements Event {

        INSERT("新增报表", "【%s】于【%s】新增了【%s】"),
        UPDATE("修改报表", "【%s】于【%s】修改了【%s】 -> 【%s】"),
        DELETE("删除报表", "【%s】于【%s】删除了【%s】")
        ;

        private String name;
        private String template;

        Node(String name, String template) {
            this.name = name;
            this.template = template;
        }

        public String getName() {
            return name;
        }

        public String getTemplate() {
            return template;
        }

        public static Node select(Operate type) {
            switch(type) {
                case INSERT :
                    return Node.INSERT;
                case UPDATE :
                    return Node.UPDATE;
                case DELETE :
                    return Node.DELETE;
            }
            return null;
        }

    }
}