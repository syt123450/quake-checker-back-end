/**
 * Created by ss on 2017/5/11.
 */

function setText() {
    if (language === "chinese") {
        renderChineseAsideNav();
        renderChineseModalTitle();
        renderChineseLanguageChooseArea();
        renderChineseHistoryEarthquakeText();
        renderChineseAboutUsText();
    } else if (language === "english") {
        renderEnglishAsideNav();
        renderEnglishModalTitle();
        renderEnglishLanguageChooseArea();
        renderEnglishHistoryEarthquakeText();
        renderEnglishAboutUsText();
    } else {

    }
}

function renderEnglishModalTitle() {
    $("#modal .modal-title").text(modalTitleText.english.header1);
    $("#modal2 .modal-title").text(modalTitleText.english.header2);
    $("#modal3 .modal-title").text(modalTitleText.english.header3);
}

function renderChineseModalTitle() {
    $("#modal .modal-title").text(modalTitleText.chinese.header1);
    $("#modal2 .modal-title").text(modalTitleText.chinese.header2);
    $("#modal3 .modal-title").text(modalTitleText.chinese.header3);
}

function renderEnglishAsideNav() {
    $("#hideNav h2, aside h2").text(navText.english.title);
    $("#hideNav input, aside input").attr("placeholder", navText.english.placeholder);
    $("#smallButton1, #button1").text(navText.english.button1);
    $("#smallButton2, #button2").text(navText.english.button2);
    $("#smallButton3, #button3").text(navText.english.button3);
}

function renderChineseAsideNav() {
    $("#hideNav h2, aside h2").text(navText.chinese.title);
    $("#hideNav input, aside input").attr("placeholder", navText.chinese.placeholder);
    $("#smallButton1, #button1").text(navText.chinese.button1);
    $("#smallButton2, #button2").text(navText.chinese.button2);
    $("#smallButton3, #button3").text(navText.chinese.button3);
}

function renderEnglishLanguageChooseArea() {
    $("#hideNav option[value=''], #language option[value='']").text(languageChooseAreaText.english.hint);
    $("#hideNav option[value='english'], #language option[value='english']").text(languageChooseAreaText.english.english);
    $("#hideNav option[value='chinese'], #language option[value='chinese']").text(languageChooseAreaText.english.chinese);
}

function renderChineseLanguageChooseArea() {
    $("#hideNav option[value=''], #language option[value='']").text(languageChooseAreaText.chinese.hint);
    $("#hideNav option[value='english'], #language option[value='english']").text(languageChooseAreaText.chinese.english);
    $("#hideNav option[value='chinese'], #language option[value='chinese']").text(languageChooseAreaText.chinese.chinese);
}

function renderEnglishHistoryEarthquakeText() {
    $("#modal2 .modal-body h5 a:eq(0)").text(historyEarthquakeText.english[0].title);
    $("#modal2 .modal-body p:eq(0)").text(historyEarthquakeText.english[0].content);
    $("#modal2 .modal-body h5 a:eq(1)").text(historyEarthquakeText.english[1].title);
    $("#modal2 .modal-body p:eq(1)").text(historyEarthquakeText.english[1].content);
    $("#modal2 .modal-body h5 a:eq(2)").text(historyEarthquakeText.english[2].title);
    $("#modal2 .modal-body p:eq(2)").text(historyEarthquakeText.english[2].content);
    $("#modal2 .modal-body h5 a:eq(3)").text(historyEarthquakeText.english[3].title);
    $("#modal2 .modal-body p:eq(3)").text(historyEarthquakeText.english[3].content);
    $("#modal2 .modal-body h5 a:eq(4)").text(historyEarthquakeText.english[4].title);
    $("#modal2 .modal-body p:eq(4)").text(historyEarthquakeText.english[4].content);
    $("#modal2 .modal-body h5 a:eq(5)").text(historyEarthquakeText.english[5].title);
    $("#modal2 .modal-body p:eq(5)").text(historyEarthquakeText.english[5].content);
}

function renderChineseHistoryEarthquakeText() {
    $("#modal2 .modal-body h5 a:eq(0)").text(historyEarthquakeText.chinese[0].title);
    $("#modal2 .modal-body p:eq(0)").text(historyEarthquakeText.chinese[0].content);
    $("#modal2 .modal-body h5 a:eq(1)").text(historyEarthquakeText.chinese[1].title);
    $("#modal2 .modal-body p:eq(1)").text(historyEarthquakeText.chinese[1].content);
    $("#modal2 .modal-body h5 a:eq(2)").text(historyEarthquakeText.chinese[2].title);
    $("#modal2 .modal-body p:eq(2)").text(historyEarthquakeText.chinese[2].content);
    $("#modal2 .modal-body h5 a:eq(3)").text(historyEarthquakeText.chinese[3].title);
    $("#modal2 .modal-body p:eq(3)").text(historyEarthquakeText.chinese[3].content);
    $("#modal2 .modal-body h5 a:eq(4)").text(historyEarthquakeText.chinese[4].title);
    $("#modal2 .modal-body p:eq(4)").text(historyEarthquakeText.chinese[4].content);
    $("#modal2 .modal-body h5 a:eq(5)").text(historyEarthquakeText.chinese[5].title);
    $("#modal2 .modal-body p:eq(5)").text(historyEarthquakeText.chinese[5].content);
}

function renderEnglishAboutUsText() {
    $("#modal3 .modal-body h5").text(aboutUsText.english.title);
    $("#modal3 .modal-body p").text(aboutUsText.english.content);
}

function renderChineseAboutUsText() {
    $("#modal3 .modal-body h5").text(aboutUsText.chinese.title);
    $("#modal3 .modal-body p").text(aboutUsText.chinese.content);
}