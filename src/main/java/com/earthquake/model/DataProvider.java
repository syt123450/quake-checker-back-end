package com.earthquake.model;

import com.earthquake.model.entity.DepthDataBean;
import com.earthquake.model.entity.DotGeoDataBean;
import com.earthquake.model.entity.Top10DataBean;
import com.earthquake.model.entity.YearlyDataBean;
import com.earthquake.model.utils.MongodbUtils;
import org.springframework.stereotype.Component;

import java.util.ArrayList;

/**
 * Created by ss on 2017/5/7.
 */

@Component
public class DataProvider {

    public ArrayList<ArrayList<ArrayList<Double>>> getInitiatedData() {

        return MongodbUtils.getMonthData();
    }

    public ArrayList<DotGeoDataBean> getDotGeoData(String countryName) {

        return MongodbUtils.getDotGeoData(countryName);
    }

    public ArrayList<DepthDataBean> getDepthData(String countryName) {

        return MongodbUtils.getCountryDepthDotsData(countryName);
    }

    public ArrayList<Top10DataBean> getTop10Data() {

        return MongodbUtils.getTop10Data();
    }

    public ArrayList<YearlyDataBean> getYearlyData(String countryName) {

        return MongodbUtils.getYearlyData(countryName);
    }
}