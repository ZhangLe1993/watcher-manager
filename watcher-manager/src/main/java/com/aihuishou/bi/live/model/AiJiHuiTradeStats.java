package com.aihuishou.bi.live.model;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AiJiHuiTradeStats {
    private Long vendorId;
    private Long venderGroupId;
    private Integer tradeNum;
    private String sourceTypeName;
    private String sourceAgentName;
    private Long sourceAgent;
    private String provinceName;
    private Integer payAmount;
    private String orderType;
    private int orderCancel;
    private int junkFlag;
    private String date;
    private String cityName;
    private String categoryName;
}
