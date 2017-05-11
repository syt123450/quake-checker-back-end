package com.earthquake.model.utils;

import com.earthquake.model.entity.DepthDataBean;
import com.earthquake.model.entity.DotGeoDataBean;
import com.earthquake.model.entity.Top10DataBean;
import com.earthquake.model.entity.YearlyDataBean;
import com.mongodb.*;
import com.mongodb.client.*;
import org.bson.Document;

import java.util.*;

/**
 * Created by ss on 2017/5/6.
 */
public class MongodbUtils {

    static private String HOST = "localhost";
    static private int PORT = 27017;
    static private String DATABASE_NAME = "earthquake";
    static private String EARTHQUAKE_INFO_COLLECTION_NAME = "earthquakeInfo";
    static private MongoClient mongoClient = new MongoClient(HOST, PORT);
    static private MongoDatabase mongoDatabase = mongoClient.getDatabase(DATABASE_NAME);
    static private MongoCollection<Document> earthquakeInfoCollection = mongoDatabase.getCollection(EARTHQUAKE_INFO_COLLECTION_NAME);

    private static final String[] monthString = {"Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"};

    static public ArrayList<ArrayList<ArrayList<Double>>> getMonthData() {

        ArrayList<ArrayList<ArrayList<Double>>> monthList = new ArrayList<>();
        for (int i = 0; i < 31; i++) {
            monthList.add(new ArrayList<>());
        }

        Calendar calendar = Calendar.getInstance();
        long timeStamp = calendar.getTimeInMillis();

        Calendar calendar1 = Calendar.getInstance();
        calendar1.set(Calendar.MONTH, calendar.get(Calendar.MONTH) - 1);
        long lastMonthTimeStamp = calendar1.getTimeInMillis();
        System.out.println(lastMonthTimeStamp);
        BasicDBObject basicDBObject = new BasicDBObject();
        BasicDBObject basicDBObject1 = new BasicDBObject("$gt", lastMonthTimeStamp);
        basicDBObject.append("properties.time", basicDBObject1);

        FindIterable<Document> findIterable = earthquakeInfoCollection.find(basicDBObject);
        MongoCursor<Document> mongoCursor = findIterable.iterator();

        while (mongoCursor.hasNext()) {
            Document result = mongoCursor.next();
            ArrayList<Double> geoInfo = new ArrayList<>();

            Document geometry = (Document) result.get("geometry");
            ArrayList coordinates = (ArrayList) geometry.get("coordinates");
            Document properties = (Document) result.get("properties");

            geoInfo.add(((Number) coordinates.get(1)).doubleValue());
            geoInfo.add(((Number) coordinates.get(0)).doubleValue());
            geoInfo.add(((Number) properties.get("mag")).doubleValue());
            geoInfo.add(((Number) coordinates.get(2)).doubleValue());

            long earthquakeTime = (long) properties.get("time");

            int days = (int) ((timeStamp - earthquakeTime) / (1000*3600*24));

            monthList.get(days).add(geoInfo);
        }

        return monthList;
    }

    static public ArrayList<Top10DataBean> getTop10Data() {

        AggregateIterable<Document> output = earthquakeInfoCollection.aggregate(Arrays.asList(
                new Document("$group", new Document("_id", "$properties.country").append("num", new Document("$sum", 1))),
                new Document("$sort", new Document("num", -1)),
                new Document("$limit", 12)
        ));

        ArrayList<Top10DataBean> top10DataBeans = new ArrayList<>();
        for (Document dbObject : output) {
            if (dbObject.get("_id") != null) {
                Top10DataBean top10DataBean = new Top10DataBean();
                top10DataBean.setCountry(dbObject.get("_id").toString());
                top10DataBean.setCounts((int) dbObject.get("num"));
                top10DataBeans.add(top10DataBean);
            }
        }

        return top10DataBeans;
    }

    static public ArrayList<DepthDataBean> getCountryDepthDotsData(String countryName) {
        BasicDBObject queryObject = new BasicDBObject();
        BasicDBList values = new BasicDBList();
        values.add(new BasicDBObject("properties.country", countryName));
        values.add(new BasicDBObject("properties.iso3", countryName));
        values.add(new BasicDBObject("properties.zh", countryName));
        queryObject.put("$or", values);

        FindIterable<Document> findIterable = earthquakeInfoCollection.find(queryObject);
        MongoCursor<Document> mongoCursor = findIterable.iterator();
        ArrayList<DepthDataBean> depthDataBeans = new ArrayList<>();
        int i = 0;
        while (mongoCursor.hasNext()) {

            Document result = mongoCursor.next();
            Document properties = (Document) result.get("properties");

            if (properties.get("alert") != null) {
                DepthDataBean depthDataBean = new DepthDataBean();
                Document geometry = (Document) result.get("geometry");
                ArrayList coordinates = (ArrayList) geometry.get("coordinates");
                depthDataBean.setDepth(((Number) coordinates.get(2)).doubleValue());
                depthDataBean.setMag(((Number) properties.get("mag")).doubleValue());
                depthDataBean.setTime((long) properties.get("time"));
                depthDataBean.setAlert((String) properties.get("alert"));
                depthDataBean.setPlace((String) properties.get("place"));
                System.out.println(depthDataBean);
                depthDataBeans.add(depthDataBean);
            }

        }

        System.out.println(i);

        return depthDataBeans;
    }

    static public ArrayList<DotGeoDataBean> getDotGeoData(String countryName) {
        BasicDBObject queryObject = new BasicDBObject();
        BasicDBList values = new BasicDBList();
        values.add(new BasicDBObject("properties.country", countryName));
        values.add(new BasicDBObject("properties.iso3", countryName));
        values.add(new BasicDBObject("properties.zh", countryName));
        queryObject.put("$or", values);

        FindIterable<Document> findIterable = earthquakeInfoCollection.find(queryObject);
        MongoCursor<Document> mongoCursor = findIterable.iterator();

        ArrayList<DotGeoDataBean> dotGeoDataBeans = new ArrayList<>();
        while (mongoCursor.hasNext()) {
            DotGeoDataBean dotGeoDataBean = new DotGeoDataBean();
            Document result = mongoCursor.next();
            Document geometry = (Document) result.get("geometry");
            ArrayList coordinates = (ArrayList) geometry.get("coordinates");
            dotGeoDataBean.setLat(((Number) coordinates.get(0)).doubleValue());
            dotGeoDataBean.setLng(((Number) coordinates.get(1)).doubleValue());
            Document properties = (Document) result.get("properties");
            dotGeoDataBean.setMag(((Number) properties.get("mag")).doubleValue());
            dotGeoDataBean.setPlace((String) properties.get("place"));
            dotGeoDataBean.setAlert((String) properties.get("alert"));
            dotGeoDataBean.setTime((long) properties.get("time"));

            dotGeoDataBeans.add(dotGeoDataBean);
        }

        return dotGeoDataBeans;
    }

    static public ArrayList<YearlyDataBean> getYearlyData(String countryName) {

        BasicDBObject queryObject = new BasicDBObject();
        BasicDBList values = new BasicDBList();
        values.add(new BasicDBObject("properties.country", countryName));
        values.add(new BasicDBObject("properties.iso3", countryName));
        values.add(new BasicDBObject("properties.zh", countryName));
        queryObject.put("$or", values);

        FindIterable<Document> findIterable = earthquakeInfoCollection.find(queryObject);
        MongoCursor<Document> mongoCursor = findIterable.iterator();

        int[] monthList = new int[12];
        for (int i = 0; i < monthList.length; i++) {
            monthList[i] = 0;
        }
        while (mongoCursor.hasNext()) {

            YearlyDataBean yearlyDataBean = new YearlyDataBean();

            Document result = mongoCursor.next();
            Document properties = (Document) result.get("properties");
            long time = (long) properties.get("time");
            int yearInfo = getYearlyInfo(time);
            if (yearInfo != -1) {
                System.out.println(yearInfo);
                monthList[yearInfo]++;
            }
        }
        ArrayList<YearlyDataBean> yearlyDataBeans = generateYearlyData(monthList);

        return yearlyDataBeans;
    }

    static private int getYearlyInfo(long time) {

        Calendar calendar = Calendar.getInstance();

        int monthNow = calendar.get(Calendar.MONTH);
        int yearNow = calendar.get(Calendar.YEAR);

        calendar.setTimeInMillis(time);

        int month = calendar.get(Calendar.MONTH);
        int year = calendar.get(Calendar.YEAR);
        int yearDifference = yearNow - year;
        if (yearDifference == 0) {
            return monthNow - month;
        } else if (yearDifference == 1) {
            int monthDifference = monthNow - month + 12;
            if (monthDifference < 12) {
                return monthDifference;
            } else {
                return -1;
            }
        } else {
            return -1;
        }
    }

    static private ArrayList<YearlyDataBean> generateYearlyData(int[] monthList) {

        ArrayList<YearlyDataBean> yearlyDataBeans = new ArrayList<>();

        int[] newList = new int[12];
        for (int i = 0; i < 12; i++) {
            newList[i] = monthList[11 - i];
        }

        Calendar calendar = Calendar.getInstance();
        int monthNow = calendar.get(Calendar.MONTH);
        for (int i = 0; i < 12; i++) {
            YearlyDataBean yearlyDataBean = new YearlyDataBean();
            yearlyDataBean.setCounts(newList[i]);
            yearlyDataBean.setMonth(monthString[(monthNow + 1 + i) % 12]);
            yearlyDataBeans.add(yearlyDataBean);
        }

        return yearlyDataBeans;
    }
}