package com.earthquake.model.entity;

import lombok.Data;

/**
 * Created by ss on 2017/5/7.
 */

@Data
public class DotGeoDataBean {

    private double mag;
    private String place;
    private double lat;
    private double lng;
    private String alert;
    private long time;
    private String iso3;
}