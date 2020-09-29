
var giteeSet;
var objApp = window.external;
var objDatabase = null;
var objDocument = null;


var myTextarea = document.getElementById('myTextarea')
var editor = HyperMD.fromTextArea(myTextarea, {
    // for code fence highlighting
    hmdModeLoader: "https://cdn.jsdelivr.net/npm/codemirror/",
})

//读gitee配置
$.ajaxSettings.async = false;
try {
    $.getJSON("../../config.json", function (data) { //each循环 使用$.each方法遍历返回的数据date

        var d = $.Deferred();
        giteeSet = data.gitee;
    });

} catch (error) {
    console.log(error);
}
$.ajaxSettings.async = true;
/////////////

// 加载文档
loadDocument();
function loadDocument() {
    var guid = getQueryString("guid", location.href);
    var kbGUID = getQueryString("kbguid", location.href);

    if (kbGUID == "" || kbGUID == null) {
        objDatabase = objApp.Database;
    } else {
        objDatabase = objApp.GetGroupDatabase(kbGUID);
    }

    var code = "";
    try {
        objDocument = objDatabase.DocumentFromGUID(guid);
        docTitle = objDocument.Title;
        document.title = "编辑 " + objDocument.Title.replace(new RegExp(".md", "gi"), "");

        var content = objDocument.GetText(0);
        editor.setValue(content);

    } catch (err) {}

    return code;
};

////////////////////////////////////////////////

// 解析参数
function getQueryString(name, hrefValue) {
    if (hrefValue.indexOf("?") == -1 || hrefValue.indexOf(name + '=') == -1) {
        return '';
    }
    var queryString = hrefValue.substring(hrefValue.indexOf("?") + 1);

    var parameters = queryString.split("&");

    var pos, paraName, paraValue;
    for (var i = 0; i < parameters.length; i++) {
        pos = parameters[i].indexOf('=');
        if (pos == -1) {
            continue;
        }

        paraName = parameters[i].substring(0, pos);
        paraValue = parameters[i].substring(pos + 1);

        if (paraName == name) {
            return unescape(paraValue.replace(/\+/g, " "));
        }
    }
    return '';
};

////////////////////////////////////////////////

//保存事件
function OnPluginSave() {
    var doc = editor.getValue();
    doc = $('<div/>').text(doc).html();
    doc = doc.replace(/\t/g, '&nbsp;&nbsp;&nbsp;&nbsp;');   // 替换制表符
    doc = doc.replace(/\n|\r|(\r\n)|(\u0085)|(\u2028)|(\u2029)/g, "<br/>").replace(/ /g, '\u00a0');
    doc = "<!DOCTYPE html><html><head><style id=\"wiz_custom_css\"></style></head><body>" + doc + "</body></html>";
    objDocument.UpdateDocument3(doc, 0);
};
///////////