package com.earthquake.model.utils;

import org.junit.Ignore;
import org.junit.Test;

import java.util.ArrayList;

import static org.junit.Assert.*;

/**
 * Created by ss on 2017/5/7.
 */
public class MongodbUtilsTest {

    @Test
    @Ignore
    public void testGetTop10Data() {
        System.out.println(MongodbUtils.getTop10Data());
    }

    @Test
    @Ignore
    public void testGetCountryDepthDotsData() {
        System.out.println(MongodbUtils.getCountryDepthDotsData("Japan"));
    }

    @Test
    @Ignore
    public void testGetDotGeoData() {
        System.out.println(MongodbUtils.getDotGeoData("United States"));
    }

    @Test
    @Ignore
    public void testYearlyData(){
        System.out.println(MongodbUtils.getYearlyData("Japan"));
    }

    @Test
    @Ignore
    public void testGetMonthData() {
        ArrayList<ArrayList<ArrayList<Double>>> testList = MongodbUtils.getMonthData();
        System.out.println(testList.get(10));
    }
}