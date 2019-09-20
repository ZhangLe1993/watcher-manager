package com.aihuishou.bi.annotation;

import com.aihuishou.bi.core.Clazz;
import com.aihuishou.bi.core.Operate;

import java.lang.annotation.*;

@Target({ElementType.METHOD})
@Retention(RetentionPolicy.RUNTIME)
@Documented
public @interface Track {

    Clazz clazz();
    Operate operate();
}
