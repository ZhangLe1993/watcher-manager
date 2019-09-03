package com.aihuishou.bi.live.model;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RealtimeOrderSummaryStats {

    private String _id;

    private String date;

    private String provinceName;

    private String cityName;

    private String status;

    private Integer tradeNum;

    private Integer payAmount;
}
