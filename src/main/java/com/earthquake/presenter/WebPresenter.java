package com.earthquake.presenter;

import com.earthquake.model.DataProvider;
import com.earthquake.model.entity.*;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;

/**
 * Created by ss on 2017/5/6.
 */

@EnableAutoConfiguration
@RestController
@RequestMapping("/API")
public class WebPresenter {

    @Autowired
    private DataProvider dataProvider;


    private Logger logger = Logger.getLogger(WebPresenter.class);
    private Gson gson = new GsonBuilder().create();

    @RequestMapping("/Initialize")
    private String getInitialData() {

        ArrayList<ArrayList<ArrayList<Double>>> monthList =  dataProvider.getInitiatedData();
        String response =  gson.toJson(monthList);

        return response;
    }

    @RequestMapping("/top10")
    private String getTop10Data() {

        ArrayList<Top10DataBean> top10DataBeans = dataProvider.getTop10Data();
        String response = gson.toJson(top10DataBeans);

        return response;
    }

    @RequestMapping(value = "/DotData", method = RequestMethod.POST)
    private String getDotData(@RequestBody String body) {

        logger.info("accept dotData request");

        CountryBean countryBean = gson.fromJson(body, CountryBean.class);
        String countryName = countryBean.getCountryName();

        ArrayList<DotGeoDataBean> dotGeoDataBeans = dataProvider.getDotGeoData(countryName);

        logger.info(dotGeoDataBeans);

        String response = gson.toJson(dotGeoDataBeans);

        return response;
    }

    @RequestMapping(value = "/yearData", method = RequestMethod.POST)
    private String getYearData(@RequestBody String body) {

        CountryBean countryBean = gson.fromJson(body, CountryBean.class);
        String countryName = countryBean.getCountryName();

        ArrayList<YearlyDataBean> yearlyDataBeans =  dataProvider.getYearlyData(countryName);
        String response = gson.toJson(yearlyDataBeans);

        return response;
    }

    @RequestMapping(value = "/depthData", method = RequestMethod.POST)
    private String getDepthData(@RequestBody String body) {

        CountryBean countryBean = gson.fromJson(body, CountryBean.class);
        String countryName = countryBean.getCountryName();

        ArrayList<DepthDataBean> depthDataBeans = dataProvider.getDepthData(countryName);
        String response = gson.toJson(depthDataBeans);

        return response;
    }
}