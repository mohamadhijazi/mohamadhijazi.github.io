// Utilities.js
function logErrorMessage(t) {
    try {
        console.log(t)
    } catch (t) {}
}
function getColorByNumberSign(t) {
    var e = ["greenNumber", "redNumber", "zeroNumber"];
    return t > 0 ? e[0] : t < 0 ? e[1] : e[2]
}
function isUserLoggedin() {
    return _spPageContextInfo.userId
}
function insertAtIndex(t, e, n) {
    return t.splice(e, 0, n),
    t
}
function logAjaxErrorMessage(t) {
    logErrorMessage(t.responseText)
}
function getCurrentLanguageId() {
    return _spPageContextInfo.currentLanguage
}
function numberWithCommas(t) {
    return t.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}
function getCurrentLanguageInfo() {
    var t, e = getCurrentLanguageId();
    return t = {
        language: t = 1025 === e,
        fullName: t ? "Arabic" : "English",
        shortName: t ? "ar" : "en",
        locale: e
    }
}
String.format || (String.format = function(t) {
    var e = Array.prototype.slice.call(arguments, 1);
    return t.replace(/{(\d+)}/g, function(t, n) {
        return void 0 !== e[n] ? e[n] : t
    })
}
);
var _currentLanguage = {};
function applyResources(t) {
    try {
        $(".resource").each(function() {
            var e = $(this).attr("resourceKey");
            $(this).html(t[e])
        })
    } catch (t) {
        logErrorMessage(t.toString())
    }
}
function addBackgroundColorToCell() {
    $(".bgNegative").each(function() {
        $(this).addClass("colorNegative").parent().addClass("backgroundNegative")
    }),
    $(".bgPositive").each(function() {
        $(this).addClass("colorPositive").parent().addClass("backgroundPositive")
    })
}
function ChangeColor(t, e, n, r, i) {
    var o = "<span class='bgNeutral neutralResults'>" + n + "</span>";
    if (null !== n) {
        var s = getColorByNumberSign(n);
        n > 0 ? o = "<span class='bgPositive GreenArrow " + s + "'>" + n + "</span>" : n < 0 ? o = "<span class='bgNegative RedArrow " + s + "'>" + n + "</span>" : 0 == n && (o = "<span class='bgNeutral neutralResults " + s + "'>" + n + "</span>")
    }
    return o
}
function NumberWithCommas(t) {
    return t.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}
function get(t, e) {
    for (var n = e.split("."), r = n.pop(); e = n.shift(); )
        if (null == (t = t[e]))
            return;
    return t[r]
}
function noop() {
    return ""
}
function groupBy(t) {
    var e = {
        group: function(t, e) {
            var n = (e = e || {}).fn || noop
              , r = e.inverse || noop
              , i = e.hash
              , o = i && i.by
              , s = []
              , a = {};
            return o && t && t.length ? (t.forEach(function(t) {
                var e = get(t, o);
                -1 === s.indexOf(e) && s.push(e),
                a[e] || (a[e] = {
                    value: e,
                    items: []
                }),
                a[e].items.push(t)
            }),
            s.reduce(function(t, e) {
                return t + n(a[e])
            }, "")) : r(this)
        }
    };
    return t.registerHelper(e),
    t
}
function NumberWithCommasFormatter(t, e, n, r, i) {
    return null !== n ? NumberWithCommas(n) : n
}
function decimalFormatter(t, e, n, r, i) {
    return NumberWithCommas(null !== n ? n.toFixed(2) : n)
}
function threedecimalFormatter_grid(t, e, n, r, i) {
    return NumberWithCommas(null !== n ? n.toFixed(3) : n)
}
function formatDateTime2(t, e) {
    return e ? t.toString("yyyy-MM-dd hh:mm:ss tt") : t.toString("yyyy-MM-dd")
}
function changeFormatter(t, e, n, r, i) {
    var o = "<span class='bgNeutral'>" + n + "</span>";
    if (null !== n) {
        var s = i[r.field + "Change"];
        o = s > 0 ? "<span class='bgPositive '>" + NumberWithCommas(n) + "</span>" : s < 0 ? "<span class='bgNegative '>" + NumberWithCommas(n) + "</span>" : "<span class='bgNeutral '>" + NumberWithCommas(n) + "</span>"
    }
    return o
}
function changeFormatterEmptyIfNull(t, e, n, r, i) {
    var o = "<span class='bgNeutral'></span>";
    if (null !== n) {
        var s = i[r.field + "Change"];
        o = s > 0 ? "<span class='bgPositive '>" + NumberWithCommas(n) + "</span>" : s < 0 ? "<span class='bgNegative '>" + NumberWithCommas(n) + "</span>" : "<span class='bgNeutral '>" + NumberWithCommas(n) + "</span>"
    }
    return o
}
function decimalAndNumberChangeFormatter(t, e, n, r, i) {
    var o = "<span class='bgNeutral'></span>";
    if (null !== n) {
        var s = i[r.field + "Change"]
          , a = getColorByNumberSign(n);
        o = s > 0 ? "<span class='bgPositive " + a + "'>" + NumberWithCommas(n.toFixed(2)) + "</span>" : s < 0 ? "<span class='bgNegative " + a + "'>" + NumberWithCommas(n.toFixed(2)) + "</span>" : "<span class='bgNeutral " + a + "'>" + NumberWithCommas(n.toFixed(2)) + "</span>"
    }
    return o
}
function decimal3AndNumberChangeFormatter(t, e, n, r, i) {
    var o = "<span class='bgNeutral'></span>";
    if (null !== n) {
        var s = i[r.field + "Change"]
          , a = getColorByNumberSign(n);
        o = s > 0 ? "<span class='bgPositive " + a + "'>" + NumberWithCommas(n.toFixed(3)) + "</span>" : s < 0 ? "<span class='bgNegative " + a + "'>" + NumberWithCommas(n.toFixed(3)) + "</span>" : "<span class='bgNeutral " + a + "'>" + NumberWithCommas(n.toFixed(3)) + "</span>"
    }
    return o
}
function decimalChangeColorIconText(t, e, n, r, i) {
    var o = "<span class='bgNeutral neutralResults'>" + n + "</span>";
    if (null !== n) {
        var s = i[r.field + "Change"]
          , a = getColorByNumberSign(n);
        o = s > 0 ? "<span class='bgPositive GreenArrow " + a + "'>" + NumberWithCommas(n.toFixed(2)) + "</span>" : s < 0 ? "<span class='bgNegative RedArrow " + a + "'>" + NumberWithCommas(n.toFixed(2)) + "</span>" : "<span class='bgNeutral neutralResults " + a + "'>" + NumberWithCommas(n.toFixed(2)) + "</span>"
    }
    return o
}
function decimalAndChangeFormatter(t, e, n, r, i) {
    var o = "<span class='bgNeutral'>" + n + "</span>";
    if (null !== n) {
        var s = i[r.field + "Change"];
        o = s > 0 ? "<span class='bgPositive '>" + NumberWithCommas(n.toFixed(2)) + "</span>" : s < 0 ? "<span class='bgNegative '>" + NumberWithCommas(n.toFixed(2)) + "</span>" : "<span class='bgNeutral '>" + NumberWithCommas(n.toFixed(2)) + "</span>"
    }
    return o
}
function decimal3AndChangeFormatter(t, e, n, r, i) {
    var o = "<span class='bgNeutral'>" + n + "</span>";
    if (null !== n) {
        var s = i[r.field + "Change"];
        o = s > 0 ? "<span class='bgPositive '>" + NumberWithCommas(n.toFixed(3)) + "</span>" : s < 0 ? "<span class='bgNegative '>" + NumberWithCommas(n.toFixed(3)) + "</span>" : "<span class='bgNeutral '>" + NumberWithCommas(n.toFixed(3)) + "</span>"
    }
    return o
}
function decimalAndChangeFormatterEmptyIfNull(t, e, n, r, i) {
    var o = "<span class='bgNeutral'></span>";
    if (null !== n) {
        var s = i[r.field + "Change"];
        o = s > 0 ? "<span class='bgPositive '>" + NumberWithCommas(n.toFixed(2)) + "</span>" : s < 0 ? "<span class='bgNegative '>" + NumberWithCommas(n.toFixed(2)) + "</span>" : "<span class='bgNeutral '>" + NumberWithCommas(n.toFixed(2)) + "</span>"
    }
    return o
}
function debouncer(t, e) {
    var n;
    e = e || 200;
    return function() {
        var r = this
          , i = arguments;
        clearTimeout(n),
        n = setTimeout(function() {
            t.apply(r, Array.prototype.slice.call(i))
        }, e)
    }
}
function isNullOrUndefined(t) {
    return !(void 0 !== t && null != t)
}
function isArray(t) {
    return "[object Array]" === Object.prototype.toString.call(t)
}
function errorNotification(t) {
    alert(t)
}
function openInColorBox() {
    $(".colorBoxIframe").each(function() {
        var t = $(this).attr("iframe-Width") ? $(this).attr("iframe-Width") : "80%"
          , e = $(this).attr("iframe-Height") ? $(this).attr("iframe-Height") : "80%"
          , n = $(this).attr("iframe-InnerWidth") ? $(this).attr("iframe-InnerWidth") : "80%"
          , r = $(this).attr("iframe-InnerHeight") ? $(this).attr("iframe-InnerHeight") : "80%";
        $(this).colorbox({
            iframe: !0,
            close: Resources.Labels.Close,
            maxWidth: t,
            maxHeight: e,
            innerWidth: n,
            innerHeight: r
        })
    })
}
function bindTemplate(t, e, n, r, i) {
    n.progressIndicator.show(),
    n.content.hide(),
    n.errorMessage.hide();
    var o = {
        isHtmlContentTemplateLoaded: !1,
        isDataLoaded: !1,
        hasData: !1,
        isError: !1,
        htmlContentTemplate: "",
        data: {}
    };
    $.get(e, function(t, e, i) {
        o.htmlContentTemplate = t,
        o.isHtmlContentTemplateLoaded = !0,
        o.isDataLoaded && renderTemplate(o, n, r)
    }),
    $.getJSON(t).done(function(t) {
        o.hasData = !isArray(t) || t.length > 0,
        o.data.Items = t,
        o.isDataLoaded = !0,
        o.isHtmlContentTemplateLoaded && renderTemplate(o, n, r)
    }).fail(function(t, e, r) {
        o.isError = !0,
        logAjaxErrorMessage(t),
        renderTemplate(o, n, i)
    })
}
function renderTemplate(t, e, n) {
    try {
        if (t.isError)
            void 0 !== e.errorMessage && e.errorMessage.show(),
            void 0 !== e.progressIndicator && e.progressIndicator.hide(),
            e.content.hide();
        else {
            var r = Handlebars.compile(t.htmlContentTemplate)(t.data);
            e.content.html(r),
            void 0 !== e.errorMessage && e.errorMessage.hide(),
            void 0 !== e.progressIndicator && e.progressIndicator.hide(),
            e.content.show()
        }
        n && n(t)
    } catch (t) {
        console.log(t)
    }
}
function lsSave(t, e) {
    localStorage.setItem(t, JSON.stringify(e))
}
function lsGet(t) {
    return $.extend({}, JSON.parse(localStorage.getItem(t)))
}
function lsClear() {
    localStorage.clear()
}
function lsInt(t, e) {
    localStorage.removeItem(t),
    lsSave(t, e)
}
function customValidatorUpdateDisplay(t) {
    if ("string" == typeof t.display) {
        if ("None" == t.display)
            return;
        if ("Dynamic" == t.display)
            return void (t.style.display = t.isvalid ? "none" : "inline")
    }
    navigator.userAgent.indexOf("Mac") > -1 && navigator.userAgent.indexOf("MSIE") > -1 && (t.style.display = "inline"),
    t.style.visibility = t.isvalid ? "hidden" : "visible";
    var e = 0;
    t.isvalid ? ($(t).siblings("span").each(function() {
        0 == $(this).isvalid && (e = 1)
    }),
    0 == e && $(t).prev(".form-control").removeClass("rfvError")) : $(t).prev(".form-control").addClass("rfvError")
}
$(function() {
    _currentLanguage = getCurrentLanguageInfo(),
    $.ajaxSetup({
        cache: !1
    })
}),
Handlebars.registerHelper("companyprofileen", function(t, e, n, r) {
    var i = "{3}?listedcompanyid={1}&isin={2}&pnavTitle={4}";
    return i = (i = (i = (i = 515 == t ? i.replace("{3}", "/english/pages/productsandservices/securities/etffunds/default.aspx") : 511 == t ? i.replace("{3}", "/english/Pages/ProductsAndServices/Securities/BondsList/default.aspx") : i.replace("{3}", "/english/Pages/ProductsAndServices/Securities/SelectCompany/default.aspx")).replace("{1}", n)).replace("{2}", e)).replace("{4}", r)
}),
Handlebars.registerHelper("companyprofilear", function(t, e, n) {}),
Handlebars.registerHelper("mod", function(t, e, n) {
    return parseInt(t) > 0 && (parseInt(t) + 1) % parseInt(e) == 0 ? n : ""
}),
Handlebars.registerHelper("IndexColor", function(t) {
    var e = "";
    return null !== t && (t > 0 ? e = "text-color-green" : t < 0 && (e = "text-color-red")),
    e
}),
Handlebars.registerHelper("getLinkTitle", function(t) {
    var e = "";
    return null != t && "" != t && (e = t.substring(t.lastIndexOf("/") + 1, t.length)),
    e
}),
Handlebars.registerHelper("NumberWithCommas", function(t) {
    return "" == t || null == t || null == t || "undefined" == t || $.isPlainObject(t) ? "0" : t.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}),
Handlebars.registerHelper("decimalNumberWithCommas", function(t) {
    return "" == t || null == t || null == t || "undefined" == t || $.isPlainObject(t) ? "0.00" : t.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}),
Handlebars.registerHelper("3decimalNumberWithCommas", function(t) {
    return "" == t || null == t || null == t || "undefined" == t || $.isPlainObject(t) ? "0.000" : t.toFixed(3).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}),
Handlebars.registerHelper("FormatDate", function(t) {
    return "" == t || null == t || null == t || "undefined" == t || $.isPlainObject(t) ? "" : new Date(t).toString("dd-MMM-yyyy")
}),
Handlebars.registerHelper("FormatDateTime", function(t, e, n) {
    return "" == t || null == t || null == t || "undefined" == t || $.isPlainObject(t) ? "" : ($.isPlainObject(e) && (e = "dd-MMM-yyyy HH:mm:ss"),
    r = new Date(t),
    $.isPlainObject(n) || 1 == n && (r = new Date(parseInt(t.substr(6)))),
    r.toString(e));
    var r
}),
Handlebars.registerHelper("decimal", function(t) {
    return null != t ? NumberWithCommas(t.toFixed(2)) : t
}),
Handlebars.registerHelper("3decimal", function(t) {
    return null != t ? NumberWithCommas(t.toFixed(3)) : t
}),
Handlebars.registerHelper("decimalChangeFormatter", function(t, e) {
    var n = "<span class='bgNeutral'>" + t + "</span>";
    if (null !== t) {
        e > 0 ? n = "<span class='bgPositive '>" + t.toFixed(2) + "</span>" : e < 0 ? n = "<span class='bgNegative '>" + t.toFixed(2) + "</span>" : 0 == e && (n = "<span class='bgNeutral '>" + t.toFixed(2) + "</span>")
    }
    return n
}),
Handlebars.registerHelper("decimalChangeColorIconText", function(t, e) {
    var n = "<span class='bgNeutral neutralResults'>" + t + "</span>";
    if (null !== t) {
        e > 0 ? n = "<span class='bgPositive GreenArrow '>" + NumberWithCommas(t.toFixed(2)) + "</span>" : e < 0 ? n = "<span class='bgNegative RedArrow '>" + NumberWithCommas(t.toFixed(2)) + "</span>" : 0 == e && (n = "<span class='bgNeutral neutralResults '>" + NumberWithCommas(t.toFixed(2)) + "</span>")
    }
    return n
}),
Handlebars.registerHelper("changeFormatter", function(t, e) {
    var n = "<span class='bgNeutral'>" + t + "</span>";
    if (null !== t) {
        e > 0 ? n = "<span class='bgPositive '>" + NumberWithCommas(t) + "</span>" : e < 0 ? n = "<span class='bgNegative '>" + NumberWithCommas(t) + "</span>" : 0 == e && (n = "<span class='bgNeutral '>" + NumberWithCommas(t) + "</span>")
    }
    return n
}),
Handlebars.registerHelper("IndexCaret", function(t) {
    var e = "";
    return null !== t && (t > 0 ? e = "fa-caret-up" : t < 0 && (e = "fa-caret-down")),
    e
}),
Handlebars.registerHelper("IndexArrow", function(t) {
    var e = "";
    return null !== t && (t > 0 ? e = "fa-arrow-up" : t < 0 && (e = "fa-arrow-down")),
    e
}),
Handlebars.registerHelper("IndexArrowCircle", function(t) {
    var e = "fa-circle";
    return null !== t && (t > 0 ? e = "fa-arrow-circle-up txt-green" : t < 0 && (e = "fa-arrow-circle-down txt-red")),
    e
}),
Handlebars.registerHelper("ColorRedGreen", function(t) {
    var e = "";
    return null !== t && (t > 0 ? e = "color1" : t < 0 && (e = "color2")),
    e
}),
Handlebars.registerHelper("textRedGreen", function(t) {
    var e = "";
    return null !== t && (t > 0 ? e = "txt-green" : t < 0 && (e = "txt-red")),
    e
}),
Handlebars.registerHelper("FormatMoment", function(t, e) {
    return "undefined" === t || null == t || $.isPlainObject(t) ? "" : (("undefined" === e || null == e || $.isPlainObject(e)) && (e = "DD-MMM-YYYY"),
    moment(t).format(e))
}),
Handlebars.registerHelper("IfModeEquals", function(t, e, n, r) {
    if (parseInt(t) % e === n)
        return r.fn(this)
}),
Handlebars.registerHelper("RemoveUrlProtocol", function(t) {
    return null != t && "" != t ? t.replace(/(^\w+:|^)\/\//, "") : t
}),
Handlebars.registerHelper("EncodeURIComponent", function(t) {
    return null != t && "" != t ? encodeURIComponent(t) : t
}),
Handlebars.registerHelper("ImageCheck", function(t) {
    return null == t || t.length <= 0 ? "/_layouts/15/STYLES/ADX/Images/default.jpg" : t
}),
Handlebars.registerHelper("ImageCheckForAttachments", function(t) {
    return null == t || t.length <= 0 ? "/_layouts/15/STYLES/ADX/Images/default-Attachement.jpg" : t
}),
Handlebars.registerHelper("ImageCheckObj", function(t) {
    return null != t && $(t).attr("src").length > 0 ? $(t).attr("src") : "/_layouts/15/STYLES/ADX/Images/default.jpg"
}),
Handlebars.registerHelper("NewsTitleText", function(t, e) {
    var n = t;
    return $.isPlainObject(e) && (e = 28),
    null != t && "undefined" != t && "" != t && null != n && n.length > e && (n = n.substring(0, e),
    n += "..."),
    n
}),
Handlebars.registerHelper("NewsBriefText", function(t, e) {
    var n = $("<div/>").html(t).text();
    return $.isPlainObject(e) && (e = 100),
    null != t && "undefined" != t && "" != t && null != n && n.length > e && (n = n.substring(0, e),
    n += "..."),
    n
}),
Handlebars.registerHelper("NewsListingBriefText", function(t, e) {
    var n = $("<div/>").html(t).text();
    return $.isPlainObject(e) && (e = 350),
    null != t && "undefined" != t && "" != t && null != n && n.length > e && (n = n.substring(0, e),
    n += "..."),
    n
}),
Handlebars.registerHelper(groupBy(Handlebars)),
Handlebars.registerHelper("compare", function(t, e, n) {
    if (arguments.length < 3)
        throw new Error("Handlerbars Helper 'compare' needs 2 parameters");
    operator = n.hash.operator || "==";
    var r = {
        "==": function(t, e) {
            return t == e
        },
        "===": function(t, e) {
            return t === e
        },
        "!=": function(t, e) {
            return t != e
        },
        "<": function(t, e) {
            return t < e
        },
        ">": function(t, e) {
            return t > e
        },
        "<=": function(t, e) {
            return t <= e
        },
        ">=": function(t, e) {
            return t >= e
        },
        typeof: function(t, e) {
            return typeof t == e
        }
    };
    if (!r[operator])
        throw new Error("Handlerbars Helper 'compare' doesn't know the operator " + operator);
    return r[operator](t, e) ? n.fn(this) : n.inverse(this)
}),
Handlebars.registerHelper("inc", function(t, e) {
    return parseInt(t) + 1
}),
Handlebars.registerHelper("briefRichText", function(t, e) {
    var n = $("<div/>").html(t).text();
    return $.isPlainObject(e) && (e = 100),
    null != t && "undefined" != t && "" != t && null != n && n.length > e && (n = n.substring(0, e),
    n += "..."),
    n
}),
Handlebars.registerHelper("brief", function(t, e) {
    var n = t;
    return $.isPlainObject(e) && (e = 100),
    null != t && "undefined" != t && "" != t && null != n && n.length > e && (n = t.substring(0, e),
    n += "..."),
    n
}),
Handlebars.registerHelper("getSummaryLinkURL", function(t) {
    var e = "";
    return $(t).find("span").each(function() {
        "_linkurl" == $(this).attr("title") && (e = $(this).find("a").attr("href"))
    }),
    e
}),
Handlebars.registerHelper("positiveNegativeFormatter", function(t) {
    var e = "neutral";
    return null !== t && (t > 0 ? e = "positive" : t < 0 && (e = "negative")),
    e
}),
Handlebars.registerHelper("getSummaryLinkClass", function(t) {
    var e = "";
    return $(t).find("span").each(function() {
        "_linkurl" == $(this).attr("title") && ("mp4" == $(this).find("a").attr("href").split(".")[1] ? (e = "btn colorBoxIframe cboxElement",
        console.log(e)) : e = "btn")
    }),
    e
}),
Handlebars.registerHelper("substr", function(t, e, n) {
    return e.length > t ? e.substring(0, t) : e
}),
Handlebars.registerHelper("ifEquals", function(t, e, n) {
    return t == e ? n.fn(this) : n.inverse(this)
}),
Handlebars.registerHelper("divide", function(t, e) {
    if (isNaN(t))
        throw new TypeError("expected the first argument to be a number");
    if (isNaN(e))
        throw new TypeError("expected the second argument to be a number");
    return Number(t) / Number(e)
}),
Handlebars.registerHelper("add", function(t, e) {
    return isNaN(t) || isNaN(e) ? "string" == typeof t && "string" == typeof e ? t + e : "" : Number(t) + Number(e)
}),
Handlebars.registerHelper("each_upto", function(t, e, n) {
    if (!t || 0 == t.length)
        return n.inverse(this);
    for (var r = [], i = 0; i < e && i < t.length; ++i)
        r.push(n.fn(t[i]));
    return r.join("")
});
 i.fn.visible = function(t) {
        var u = i(this)
          , f = i(n)
          , e = f.scrollTop()
          , s = e + f.height()
          , r = u.offset().top
          , o = r + u.height()
          , h = t === !0 ? o : r
          , c = t === !0 ? r : o;
        return c <= s && h >= e
    }
    ;
    i.QueryString = function(n) {
        var r, t, i;
        if (n == "")
            return {};
        for (r = {},
        t = 0; t < n.length; ++t)
            (i = n[t].split("="),
            i.length == 2) && (r[i[0].toLowerCase()] = decodeURIComponent(i[1].replace(/\+/g, " ")));
        return r
    }(n.location.search.substr(1).split("&"));
Handlebars.registerHelper("queryString", function(n, t) {
    return i.QueryString[t]
});
Handlebars.registerHelper("math", function(n, t, i) {
    return n = parseFloat(n),
    i = parseFloat(i),
    {
        "+": n + i,
        "-": n - i,
        "*": n * i,
        "/": n / i,
        "%": n % i
    }[t]
});
var readUploadedFileAsText = function(t) {
    var e = new FileReader;
    return new Promise(function(n, r) {
        e.onerror = function() {
            e.abort(),
            r(new DOMException("Problem parsing input file."))
        }
        ,
        e.onload = function() {
            var r = {
                data: $(t).data(),
                name: t.files[0].name,
                file: window.btoa(e.result)
            };
            n(r)
        }
        ,
        e.readAsBinaryString(t.files[0])
    }
    )
};
