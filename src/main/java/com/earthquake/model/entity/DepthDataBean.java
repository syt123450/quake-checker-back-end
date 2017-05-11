package com.earthquake.model.entity;

import lombok.Data;

/**
 * Created by ss on 2017/5/7.
 */

@Data
public class DepthDataBean {

    private double mag;
    private String place;
    private long time;
    private String alert;
    private double depth;
}