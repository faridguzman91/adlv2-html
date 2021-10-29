!(function () {
  var r,
    o,
    S,
    w,
    i,
    C = !!(
      "ontouchstart" in window ||
      (window.DocumentTouch && document instanceof DocumentTouch)
    ),
    k = "house",
    E = [],
    U = !1,
    N = { for_sale: "vrij", in_option: "optie", sold: "verkocht" };
  function P(t, e) {
    var n = $(t);
    if (!n.hasClass("active")) {
      var i = n.siblings(".active"),
        r = 0 == i.length;
      i.removeClass("active"), n.addClass("active");
      var o = n.parent().siblings(e);
      o.removeClass("lastactive"),
        o
          .filter(".active")
          .addClass("lastactive")
          .removeClass("active")
          .stop()
          .css("opacity", 1);
      var a = o.eq(n.index()).addClass("active");
      return (
        r ||
          a.find(".unit-content").css({ opacity: 0 }).animate({ opacity: 1 }),
        a
      );
    }
  }
  function M(t, e) {
    var n =
      "./services/?action=log&key=" +
      encodeURIComponent(t) +
      "&value=" +
      encodeURIComponent(e);
    null != i && (n += "&session_id=" + i),
      $.ajax({
        url: n,
        dataType: "json",
        success: function (t) {
          t.session_id && (i = t.session_id);
        },
        error: function (t) {},
      });
  }
  function e(h) {
    var t = a(h),
      e = $("#block-container .pointer");
    if (t) {
      for (var m = {}, n = E.length; n--; )
        if (E[n].id === t) {
          m = E[n];
          break;
        }
      m.id &&
        e.each(function (t, e) {
          var n = $(e),
            i = n.parent();
          n.stop().css("opacity", 1).attr("data-unit-id", m.id),
            $(".value-id", n).html(j(m.id, "id")),
            n.removeClass("arrowright arrowleft").addClass("arrowdown");
          var r,
            o,
            a,
            s,
            l =
              ((r = i),
              (o = h.getBoundingClientRect()),
              (a = r.offset()),
              (s = $(document)),
              (o.x = o.left - (a.left - s.scrollLeft())),
              (o.y = o.top - (a.top - s.scrollTop())),
              o),
            c = n.outerWidth(!1),
            u = n.outerHeight(!1),
            d = i.width() - c + $(document).scrollLeft();
          if (
            ((p = Math.max(0, Math.min(d, l.x + l.width / 2 - c / 2))),
            (miny = 30),
            (y = Math.max(miny, l.y - u)),
            y + u > l.y)
          ) {
            n.removeClass("arrowdown").addClass("arrowright"),
              (y = Math.max(miny, l.y + l.height / 2 - u / 2));
            var f = 0 - (n.outerWidth(!0) - c),
              p = Math.max(f, l.x - c);
            p + c > l.x &&
              ((p = Math.min(l.x + l.width, d)),
              n.removeClass("arrowright").addClass("arrowleft"));
          }
          n.css({ left: Math.round(p) + "px", top: Math.round(y) + "px" }),
            n.fadeIn(200);
        });
    }
  }
  function A() {
    if (window.parent) {
      var t = Math.ceil($("#unit-filter:visible").outerHeight() || 0),
        e = 0,
        n = $("#block-container:visible");
      n.length && (e = n.outerHeight());
      var i = $("#unit-container:visible").outerHeight() || 0;
      (t += Math.ceil(Math.max(e, i))),
        r !== t &&
          ((r = t),
          clearTimeout(o),
          (o = setTimeout(function () {
            parent.postMessage(r, "*");
          }, 100)));
    }
  }
  function V() {
    for (
      var t = [
          "price-from",
          "price-to",
          "livingsurface-from",
          "livingsurface-to",
          "name",
          "level",
          "roomcount",
          "status",
        ],
        e = $.extend(!0, [], E),
        n = S.noUiSlider ? S.noUiSlider.get() : [0, 0],
        i = w.noUiSlider ? w.noUiSlider.get() : [0, 0],
        r = !1,
        o = t.length;
      o--;

    ) {
      var a,
        s,
        l = t[o];
      switch (l) {
        case "price-from":
          (s =
            (a = n[0]) !=
            (S.noUiSlider ? S.noUiSlider.options.range.min[0] : 0)) && (r = s);
          break;
        case "price-to":
          (s =
            (a = n[1]) !=
            (S.noUiSlider ? S.noUiSlider.options.range.max[0] : 0)) && (r = s);
          break;
        case "livingsurface-from":
          (a = i[0]),
            r ||
              (r = a != (w.noUiSlider ? w.noUiSlider.options.range.min[0] : 0));
          break;
        case "livingsurface-to":
          (a = i[1]),
            r ||
              (r = a != (w.noUiSlider ? w.noUiSlider.options.range.max[0] : 0));
          break;
        default:
          null == (a = $('#unit-filter [name="' + l + '"]').val()) ||
            r ||
            (r = 0 < a.length);
      }
      if (a && a.length)
        for (var c = e.length; c--; ) {
          var u = !1;
          switch (l) {
            case "livingsurface-from":
              u = e[c].livingsurface >= parseFloat(a);
              break;
            case "livingsurface-to":
              u = e[c].livingsurface <= parseFloat(a);
              break;
            case "price-from":
              u = 0 == e[c].price || e[c].price >= parseFloat(a);
              break;
            case "price-to":
              u = 0 == e[c].price || e[c].price <= parseFloat(a);
              break;
            case "roomcount":
              u =
                1 == (a = parseInt(a) || 0)
                  ? e[c].roomcount == a
                  : e[c].roomcount >= a;
              break;
            case "level":
              var d = e[c].level;
              $.isArray(d) || (d = [d]), (u = 0 <= d.indexOf(a));
              break;
            default:
              u = e[c][l] === a;
          }
          u || e.splice(c, 1);
        }
    }
    D();
    var f = !1;
    if (r) {
      f = !0;
      var p = { name: [], roomcount: {}, level: {}, status: {} };
      for (var h in p)
        (p[h].$element = $('#unit-filter select[name="' + h + '"]')),
          (p[h].hasValue = "" != p[h].$element.val()),
          (p[h].values = []);
      if (($("#unit-list li[data-id]").addClass("hide"), 0 == (o = e.length)))
        $("#filter-message").show();
      else
        for (; o--; ) {
          for (var h in p)
            p[h].hasValue ||
              -1 != p[h].values.indexOf(String(e[o][h])) ||
              p[h].values.push(String(e[o][h]));
          $('.unit-selector g[id="' + k + e[o].id + '"]').addClass("show"),
            $('#unit-list li[data-id="' + e[o].id + '"]').removeClass("hide"),
            e[o].id === U && (f = !1);
        }
    }
    f && H(!1),
      $("#unit-list li.first").removeClass("first"),
      $("#unit-list li:not(.hide)").first().addClass("first");
  }
  function D() {
    $('.unit-selector g[id^="' + k + '"]').removeClass("show"),
      $("#unit-list li.hide").removeClass("hide"),
      $("#unit-list li.first").removeClass("first"),
      $("#unit-list li:not(.hide)").first().addClass("first"),
      $("#filter-message").hide();
  }
  function T() {
    $("#unit-filter select").val(""),
      w.noUiSlider && w.noUiSlider.reset(),
      S.noUiSlider && S.noUiSlider.reset(),
      $("#unit-filter select").niceSelect("update");
  }
  function O(t) {
    return (t || "").toLowerCase().split("/").join("").split(" ").join("-");
  }
  function j(t, e) {
    if (null == t) return "";
    switch (e) {
      case "id":
        t = "#" + t;
        break;
      case "livingsurface":
      case "terrace":
      case "garden":
      case "roofgarden":
      case "storage":
      case "volume":
        (t = String(t)).length &&
          ($.isNumeric(t) && (t = String(Math.floor(t)).formatNumber(0)),
          (t += "volume" === e ? " m&#179;" : " m&#178;"));
        break;
      case "price":
      case "price_from":
      case "price_to":
        t =
          $.isNumeric(t) && 0 < t
            ? String(Math.floor(t)).formatCurrency(!0) + " <span>v.o.n.</span>"
            : "prijs op aanvraag";
        break;
      case "status":
        t.length && (t = t.charAt(0).toUpperCase() + t.slice(1));
        break;
      case "level":
        $.isArray(t) || (t = [t]),
          (t =
            2 < t.length
              ? t[0] + " t/m " + t[t.length - 1]
              : 2 == t.length
              ? t.join(" en ")
              : t.join(", "));
    }
    return String(t);
  }
  function L(t, e, n, i) {
    return (
      (n = n ? Math.ceil(n / i) * i : 0),
      (e = e ? Math.floor(e / i) * i : 0) == n
        ? ($(t.parentNode).hide(), !1)
        : ($(t.parentNode).show(),
          t.noUiSlider && t.noUiSlider.destroy(),
          noUiSlider.create(t, {
            start: [e, n],
            step: i,
            connect: !0,
            range: { min: [e], max: [n] },
          }),
          !0)
    );
  }
  function H(t) {
    (U = !1),
      $('#unit-info [class^="unit-"]').parent().removeClass("hide"),
      $("#unit-form-btn, #unit-contact-btn").addClass("btn-disabled"),
      $('.unit-selector g[id^="' + k + '"].active').removeClass("active"),
      $("#unit-image img").remove(),
      $("#unit-image .tabbar").empty(),
      $("#unit-image .zoom").hide(),
      $("#unit-info .unit-status").attr("data-status", null);
    for (var e = E.length, n = 0; n < e; n++) {
      E[n].active;
      if (
        (E[n].id === t ? (E[n].active = !0) : E[n].active && (E[n].active = !1),
        E[n].active)
      ) {
        for (var i in ((U = E[n].id), E[n])) {
          var r = j(E[n][i], i) || "",
            o = $("#unit-info .unit-" + i).html(r);
          0 == r.length && o.parent().addClass("hide");
        }
        $("#unit-info .rows .row:not(.hide)").length % 2 &&
          $("#unit-info .rows .row.dummy").addClass("hide"),
          $("#unit-image .zoom").show();
        for (var a = E[n].images, s = a.length, l = 0; l < s; l++)
          $("#unit-image").append(
            '<img id="unit-image-' +
              l +
              '" src="./img/' +
              a[l] +
              '" width="600" height="450">'
          ),
            1 < s &&
              $("#unit-image .tabbar").append(
                '<li data-index="' + l + '">' + (l + 1) + "</li>"
              );
        1 < s
          ? $("#unit-image .tabbar li")
              .click(function (t) {
                t.stopImmediatePropagation(), P(this, "img");
              })
              .eq(0)
              .click()
          : $("#unit-image img").addClass("active"),
          $("#unit-info .unit-status").attr("data-status", O(E[n].status)),
          $("#unit-form-btn").attr("href", E[n].url),
          $("#unit-form-btn, #unit-contact-btn").removeClass(
            "btn-disabled placeholder"
          ),
          $('.unit-selector g[id^="' + k + U + '"]').addClass("active");
      }
    }
    U
      ? ($("#container").attr("unit-id", U),
        $("#unit-info").show(),
        $("#unit-list").hide(),
        M("houseid", U),
        $("#container").removeClass("animation"))
      : ($("#container").removeAttr("unit-id"),
        $("#unit-info").hide(),
        $("#unit-list").show()),
      A();
  }
  function z(t) {
    $(
      '.unit-selector.active svg g[id="' + k + t.currentTarget.dataset.id + '"]'
    ).addClass("hover");
  }
  function F(t) {
    $(
      '.unit-selector.active svg g[id="' + k + t.currentTarget.dataset.id + '"]'
    ).removeClass("hover");
  }
  function R(t) {
    $(t.currentTarget).addClass("hover").closest("div").addClass("hover"),
      $('#unit-list li[data-id="' + a(t.currentTarget) + '"]').addClass(
        "hover"
      ),
      e(t.currentTarget);
  }
  function I(t) {
    $(t.currentTarget).removeClass("hover").closest("div").removeClass("hover"),
      $('#unit-list li[data-id="' + a(t.currentTarget) + '"]').removeClass(
        "hover"
      ),
      $("#block-container .pointer").hide();
  }
  function _(t) {
    t.stopImmediatePropagation(), H(a(t.currentTarget));
  }
  function a(t) {
    return t.id.substr(k.length);
  }
  $(document).ready(function () {
    window.self === window.top && $("#container").addClass("standalone");
    $.getJSON("./services/?action=getdata", function (t) {
      (E = t.house),
        (function () {
          $("body").addClass(C ? "touch" : "no-touch"),
            $("#container").removeClass("init"),
            $("a.btn").click(function (t) {
              if ($(this).hasClass("btn-disabled")) return !1;
            }),
            $(".unit-container-overlay").click(function () {
              H(!1);
            }),
            $(".unit-selector").onSwipe(function (t) {
              1 == t.left
                ? $("#block-next").click()
                : 1 == t.right && $("#block-prev").click();
            }),
            (S = document.getElementById("slider-price")),
            (w = document.getElementById("slider-livingsurface"));
          for (var t = E.length, e = 0; e < t; e++) {
            var n = k + E[e].id,
              i = $(
                '#block-container svg g[id="' +
                  n +
                  '"], #block-container svg g[id^="' +
                  n +
                  '."]'
              );
            1 == E[e].disabled
              ? i.addClass("disabled")
              : E[e].status && i.addClass(O(E[e].status));
            var r = j(E[e].status, "status"),
              o = "<li";
            0 == e && (o += ' class="first"'),
              (o += ' data-id="' + E[e].id + '">'),
              (o += '<div class="item clearfix">'),
              (o += '<div class="image">'),
              E[e].thumb
                ? (o += '<img src="./img/' + E[e].thumb + '">')
                : E[e].images &&
                  E[e].images.length &&
                  (o += '<img src="./img/' + E[e].images[0] + '">'),
              (o += "</div>"),
              (o += '<div class="details">'),
              (o += '<span data-status="' + E[e].status + '">' + r + "</span>"),
              (o +=
                "<h3>" +
                j(E[e].name, "name") +
                " " +
                j(E[e].id, "id") +
                "</h3>"),
              (o +=
                '<span class="price">' + j(E[e].price, "price") + "</span>");
            var a = 1 == (parseInt(E[e].roomcount) || 0) ? "kamer" : "kamers";
            (o +=
              '<div class="info"><span>' +
              j(E[e].roomcount, "roomcount") +
              " " +
              a +
              "</span> · <span>" +
              j(E[e].livingsurface, "livingsurface") +
              "</span></div>"),
              (o += "</div>"),
              (o += "</div>"),
              $("#unit-list ul").append(o);
          }
          $("#unit-list li[data-id]")
            .mouseenter(z)
            .mouseleave(F)
            .click(function (t) {
              H(t.currentTarget.dataset.id);
            });
          var s = $('#block-container svg g[id^="' + k + '"]');
          s.mouseenter(R).mouseleave(I),
            s
              .not(".disabled")
              .click(_)
              .on("touchstart", function (t) {
                return (
                  $("#block-container svg g.hover")
                    .removeClass("hover")
                    .closest("div")
                    .removeClass("hover"),
                  R(t),
                  window.innerWidth <= 1023
                    ? $("body").addClass("touch")
                    : ($("body").removeClass("touch"), _(t)),
                  t.stopImmediatePropagation(),
                  !1
                );
              }),
            $("#block-container .pointer").on("touchstart", function (t) {
              var e = $(t.currentTarget).attr("data-unit-id");
              H(e);
            }),
            window.addEventListener("resize", function () {
              A();
            }),
            $('div[id^="block-"] ul.tabbar li')
              .click(function () {
                $("body").hasClass("touch") &&
                  ($("#block-container svg g.hover")
                    .removeClass("hover")
                    .closest("div")
                    .removeClass("hover"),
                  $("#block-container .pointer").hide());
                P(this, ".unit-selector");
              })
              .filter(":first-child")
              .click(),
            $("#block-next").click(function (t) {
              var e = $('div[id^="block-"] ul.tabbar li'),
                n = Math.max(0, e.filter(".active").index());
              (n += 1) >= e.length && (n = 0), e.eq(n).click();
            }),
            $("#block-prev").click(function () {
              var t = $('div[id^="block-"] ul.tabbar li'),
                e = Math.max(0, t.filter(".active").index());
              (e -= 1) < 0 && (e = t.length - 1), t.eq(e).click();
            }),
            $("#unit-filter select").change(function () {
              V();
            }),
            $(".filter-clear").click(function () {
              return T(), D(), !1;
            });
          var i = $('#unit-filter select[name="status"]');
          for (var l in N)
            i.append($("<option>", { value: N[l] }).text(N[l].capitalize()));
          $("#unit-container #unit-close").click(function () {
            H(!1);
          }),
            $("#unit-form-btn, #unit-contact-btn").click(function () {
              M($(this).text(), U);
            });
          $("#unit-filter .col").length;
          var c,
            u,
            d,
            f,
            p = { name: [], level: [], roomcount: [] },
            e = E.length;
          for (; e--; ) {
            var l = E[e].price,
              h = E[e].livingsurface;
            for (var l in (0 < l &&
              ((c = null == c ? l : Math.min(c, l)),
              (u = null == u ? l : Math.max(u, l))),
            0 < h &&
              ((d = null == d ? h : Math.min(d, h)),
              (f = null == f ? h : Math.max(f, h))),
            p)) {
              var m = E[e][l];
              $.isArray(E[e][l]) || (m = [E[e][l]]);
              for (var g = m.length; g--; ) {
                var v = m[g];
                v && -1 == p[l].indexOf(v) && p[l].push(v);
              }
            }
          }
          var b = 1e4;
          (u = u ? Math.ceil(u / b) * b : 0),
            (c = c ? Math.floor(c / b) * b : 0),
            L(S, c, u, b) || 0;
          S.noUiSlider &&
            (S.noUiSlider.on("update", function (t, e) {
              $("#unit-filter #price-from").text(t[0].formatCurrency()),
                $("#unit-filter #price-to").text(t[1].formatCurrency());
            }),
            S.noUiSlider.on("change", function () {
              V();
            }));
          (b = 5),
            (f = f ? Math.ceil(f / b) * b : 0),
            (d = d ? Math.floor(d / b) * b : 0),
            L(w, d, f, b) || 0;
          w.noUiSlider &&
            (w.noUiSlider.on("update", function (t, e) {
              $("#unit-filter #livingsurface-from").html(
                Math.round(t[0]) + "m&#178;"
              ),
                $("#unit-filter #livingsurface-to").html(
                  Math.round(t[1]) + "m&#178;"
                );
            }),
            w.noUiSlider.on("change", function () {
              V();
            }));
          for (var l in p) {
            var i = $('#unit-filter select[name="' + l + '"]');
            if (($("option", i).slice(1).remove(), 1 < p[l].length)) {
              i.parent().show(),
                p[l].sort(function (t, e) {
                  return t - e;
                });
              var h = p[l].length;
              for (e = 0; e < h; e++) {
                var x = p[l][e];
                "roomcount" == l &&
                  (x = p[l][e] + (1 < p[l][e] ? " of meer" : " kamer")),
                  i.append($("<option>", { value: p[l][e] }).text(x));
              }
            } else i.parent().hide(), 0;
          }
          $("#unit-image").click(function (t) {
            t.stopImmediatePropagation();
            var i = [],
              r = 0;
            $("#unit-image img").each(function (t, e) {
              var n = $(e);
              i.push({
                src: n.attr("src").replace(".jpg", "_large.jpg"),
                type: "image",
              }),
                n.hasClass("active") && (r = t);
            }),
              i.length && $.fancybox.open(i, {}, r);
          }),
            T(),
            V(),
            $("#unit-filter select").niceSelect();
        })();
      for (
        var e = window.location.search.substr(1).split("&"),
          n = {},
          i = !1,
          r = 0;
        r < e.length;
        ++r
      ) {
        var o = e[r].split("=", 2);
        1 == o.length
          ? (n[o[0]] = "")
          : (n[o[0]] = decodeURIComponent(o[1].replace(/\+/g, " ")));
      }
      n.uid && (i = n.uid), H(i);
    });
  });
})(),
  (function (o) {
    o.fn.niceSelect = function (t) {
      if ("string" == typeof t)
        return (
          "update" == t
            ? this.each(function () {
                var t = o(this),
                  e = o(this).next(".nice-select"),
                  n = e.hasClass("open");
                e.length && (e.remove(), i(t), n && t.next().trigger("click"));
              })
            : "destroy" == t
            ? (this.each(function () {
                var t = o(this),
                  e = o(this).next(".nice-select");
                e.length && (e.remove(), t.css("display", ""));
              }),
              0 == o(".nice-select").length && o(document).off(".nice_select"))
            : console.log('Method "' + t + '" does not exist.'),
          this
        );
      function i(t) {
        t.after(
          o("<div></div>")
            .addClass("nice-select")
            .addClass(t.attr("class") || "")
            .addClass(t.attr("disabled") ? "disabled" : "")
            .attr("tabindex", t.attr("disabled") ? null : "0")
            .html('<span class="current"></span><ul class="list"></ul>')
        );
        var i = t.next(),
          e = t.find("option"),
          n = t.find("option:selected");
        i.find(".current").html(n.data("display") || n.text()),
          e.each(function (t) {
            var e = o(this),
              n = e.data("display");
            i.find("ul").append(
              o("<li></li>")
                .attr("data-value", e.val())
                .attr("data-display", n || null)
                .addClass(
                  "option" +
                    (e.is(":selected") ? " selected" : "") +
                    (e.is(":disabled") ? " disabled" : "")
                )
                .html(e.text())
            );
          });
      }
      this.hide(),
        this.each(function () {
          var t = o(this);
          t.next().hasClass("nice-select") || i(t);
        }),
        o(document).off(".nice_select"),
        o(document).on("click.nice_select", ".nice-select", function (t) {
          var e = o(this);
          o(".nice-select").not(e).removeClass("open"),
            e.toggleClass("open"),
            e.hasClass("open")
              ? (e.find(".option"),
                e.find(".focus").removeClass("focus"),
                e.find(".selected").addClass("focus"))
              : e.focus();
        }),
        o(document).on("click.nice_select", function (t) {
          0 === o(t.target).closest(".nice-select").length &&
            o(".nice-select").removeClass("open").find(".option");
        }),
        o(document).on(
          "click.nice_select",
          ".nice-select .option:not(.disabled)",
          function (t) {
            var e = o(this),
              n = e.closest(".nice-select");
            n.find(".selected").removeClass("selected"), e.addClass("selected");
            var i = e.data("display") || e.text();
            n.find(".current").text(i),
              n.prev("select").val(e.data("value")).trigger("change");
          }
        ),
        o(document).on("keydown.nice_select", ".nice-select", function (t) {
          var e = o(this),
            n = o(e.find(".focus") || e.find(".list .option.selected"));
          if (32 == t.keyCode || 13 == t.keyCode)
            return (
              e.hasClass("open") ? n.trigger("click") : e.trigger("click"), !1
            );
          if (40 == t.keyCode) {
            if (e.hasClass("open")) {
              var i = n.nextAll(".option:not(.disabled)").first();
              0 < i.length &&
                (e.find(".focus").removeClass("focus"), i.addClass("focus"));
            } else e.trigger("click");
            return !1;
          }
          if (38 == t.keyCode) {
            if (e.hasClass("open")) {
              var r = n.prevAll(".option:not(.disabled)").first();
              0 < r.length &&
                (e.find(".focus").removeClass("focus"), r.addClass("focus"));
            } else e.trigger("click");
            return !1;
          }
          if (27 == t.keyCode) e.hasClass("open") && e.trigger("click");
          else if (9 == t.keyCode && e.hasClass("open")) return !1;
        });
      var e = document.createElement("a").style;
      return (
        (e.cssText = "pointer-events:auto"),
        "auto" !== e.pointerEvents && o("html").addClass("no-csspointerevents"),
        this
      );
    };
  })(jQuery),
  (function (t) {
    "function" == typeof define && define.amd
      ? define([], t)
      : "object" == typeof exports
      ? (module.exports = t())
      : (window.noUiSlider = t());
  })(function () {
    "use strict";
    var lt = "14.6.2";
    function ct(t) {
      t.parentElement.removeChild(t);
    }
    function s(t) {
      return null != t;
    }
    function ut(t) {
      t.preventDefault();
    }
    function o(t) {
      return "number" == typeof t && !isNaN(t) && isFinite(t);
    }
    function dt(t, e, n) {
      0 < n &&
        (ht(t, e),
        setTimeout(function () {
          mt(t, e);
        }, n));
    }
    function ft(t) {
      return Math.max(Math.min(t, 100), 0);
    }
    function pt(t) {
      return Array.isArray(t) ? t : [t];
    }
    function e(t) {
      var e = (t = String(t)).split(".");
      return 1 < e.length ? e[1].length : 0;
    }
    function ht(t, e) {
      t.classList && !/\s/.test(e)
        ? t.classList.add(e)
        : (t.className += " " + e);
    }
    function mt(t, e) {
      t.classList && !/\s/.test(e)
        ? t.classList.remove(e)
        : (t.className = t.className.replace(
            new RegExp("(^|\\b)" + e.split(" ").join("|") + "(\\b|$)", "gi"),
            " "
          ));
    }
    function gt(t) {
      var e = void 0 !== window.pageXOffset,
        n = "CSS1Compat" === (t.compatMode || "");
      return {
        x: e
          ? window.pageXOffset
          : n
          ? t.documentElement.scrollLeft
          : t.body.scrollLeft,
        y: e
          ? window.pageYOffset
          : n
          ? t.documentElement.scrollTop
          : t.body.scrollTop,
      };
    }
    function u(t, e) {
      return 100 / (e - t);
    }
    function d(t, e, n) {
      return (100 * e) / (t[n + 1] - t[n]);
    }
    function f(t, e) {
      for (var n = 1; t >= e[n]; ) n += 1;
      return n;
    }
    function n(t, e, n) {
      if (n >= t.slice(-1)[0]) return 100;
      var i,
        r,
        o = f(n, t),
        a = t[o - 1],
        s = t[o],
        l = e[o - 1],
        c = e[o];
      return (
        l +
        ((r = n),
        d((i = [a, s]), i[0] < 0 ? r + Math.abs(i[0]) : r - i[0], 0) / u(l, c))
      );
    }
    function i(t, e, n, i) {
      if (100 === i) return i;
      var r,
        o,
        a = f(i, t),
        s = t[a - 1],
        l = t[a];
      return n
        ? (l - s) / 2 < i - s
          ? l
          : s
        : e[a - 1]
        ? t[a - 1] + ((r = i - t[a - 1]), (o = e[a - 1]), Math.round(r / o) * o)
        : i;
    }
    function a(t, e, n) {
      var i;
      if (("number" == typeof e && (e = [e]), !Array.isArray(e)))
        throw new Error(
          "noUiSlider (" + lt + "): 'range' contains invalid value."
        );
      if (
        !o((i = "min" === t ? 0 : "max" === t ? 100 : parseFloat(t))) ||
        !o(e[0])
      )
        throw new Error(
          "noUiSlider (" + lt + "): 'range' value isn't numeric."
        );
      n.xPct.push(i),
        n.xVal.push(e[0]),
        i
          ? n.xSteps.push(!isNaN(e[1]) && e[1])
          : isNaN(e[1]) || (n.xSteps[0] = e[1]),
        n.xHighestCompleteStep.push(0);
    }
    function l(t, e, n) {
      if (e)
        if (n.xVal[t] !== n.xVal[t + 1]) {
          n.xSteps[t] =
            d([n.xVal[t], n.xVal[t + 1]], e, 0) / u(n.xPct[t], n.xPct[t + 1]);
          var i = (n.xVal[t + 1] - n.xVal[t]) / n.xNumSteps[t],
            r = Math.ceil(Number(i.toFixed(3)) - 1),
            o = n.xVal[t] + n.xNumSteps[t] * r;
          n.xHighestCompleteStep[t] = o;
        } else n.xSteps[t] = n.xHighestCompleteStep[t] = n.xVal[t];
    }
    function r(t, e, n) {
      var i;
      (this.xPct = []),
        (this.xVal = []),
        (this.xSteps = [n || !1]),
        (this.xNumSteps = [!1]),
        (this.xHighestCompleteStep = []),
        (this.snap = e);
      var r = [];
      for (i in t) t.hasOwnProperty(i) && r.push([t[i], i]);
      for (
        r.length && "object" == typeof r[0][0]
          ? r.sort(function (t, e) {
              return t[0][0] - e[0][0];
            })
          : r.sort(function (t, e) {
              return t[0] - e[0];
            }),
          i = 0;
        i < r.length;
        i++
      )
        a(r[i][1], r[i][0], this);
      for (
        this.xNumSteps = this.xSteps.slice(0), i = 0;
        i < this.xNumSteps.length;
        i++
      )
        l(i, this.xNumSteps[i], this);
    }
    (r.prototype.getDistance = function (t) {
      var e,
        n = [];
      for (e = 0; e < this.xNumSteps.length - 1; e++) {
        var i = this.xNumSteps[e];
        if (i && (t / i) % 1 != 0)
          throw new Error(
            "noUiSlider (" +
              lt +
              "): 'limit', 'margin' and 'padding' of " +
              this.xPct[e] +
              "% range must be divisible by step."
          );
        n[e] = d(this.xVal, t, e);
      }
      return n;
    }),
      (r.prototype.getAbsoluteDistance = function (t, e, n) {
        var i,
          r = 0;
        if (t < this.xPct[this.xPct.length - 1])
          for (; t > this.xPct[r + 1]; ) r++;
        else
          t === this.xPct[this.xPct.length - 1] && (r = this.xPct.length - 2);
        n || t !== this.xPct[r + 1] || r++;
        var o = 1,
          a = e[r],
          s = 0,
          l = 0,
          c = 0,
          u = 0;
        for (
          i = n
            ? (t - this.xPct[r]) / (this.xPct[r + 1] - this.xPct[r])
            : (this.xPct[r + 1] - t) / (this.xPct[r + 1] - this.xPct[r]);
          0 < a;

        )
          (s = this.xPct[r + 1 + u] - this.xPct[r + u]),
            100 < e[r + u] * o + 100 - 100 * i
              ? ((l = s * i), (o = (a - 100 * i) / e[r + u]), (i = 1))
              : ((l = ((e[r + u] * s) / 100) * o), (o = 0)),
            n
              ? ((c -= l), 1 <= this.xPct.length + u && u--)
              : ((c += l), 1 <= this.xPct.length - u && u++),
            (a = e[r + u] * o);
        return t + c;
      }),
      (r.prototype.toStepping = function (t) {
        return (t = n(this.xVal, this.xPct, t));
      }),
      (r.prototype.fromStepping = function (t) {
        return (function (t, e, n) {
          if (100 <= n) return t.slice(-1)[0];
          var i,
            r = f(n, e),
            o = t[r - 1],
            a = t[r],
            s = e[r - 1],
            l = e[r];
          return (i = [o, a]), ((n - s) * u(s, l) * (i[1] - i[0])) / 100 + i[0];
        })(this.xVal, this.xPct, t);
      }),
      (r.prototype.getStep = function (t) {
        return (t = i(this.xPct, this.xSteps, this.snap, t));
      }),
      (r.prototype.getDefaultStep = function (t, e, n) {
        var i = f(t, this.xPct);
        return (
          (100 === t || (e && t === this.xPct[i - 1])) &&
            (i = Math.max(i - 1, 1)),
          (this.xVal[i] - this.xVal[i - 1]) / n
        );
      }),
      (r.prototype.getNearbySteps = function (t) {
        var e = f(t, this.xPct);
        return {
          stepBefore: {
            startValue: this.xVal[e - 2],
            step: this.xNumSteps[e - 2],
            highestStep: this.xHighestCompleteStep[e - 2],
          },
          thisStep: {
            startValue: this.xVal[e - 1],
            step: this.xNumSteps[e - 1],
            highestStep: this.xHighestCompleteStep[e - 1],
          },
          stepAfter: {
            startValue: this.xVal[e],
            step: this.xNumSteps[e],
            highestStep: this.xHighestCompleteStep[e],
          },
        };
      }),
      (r.prototype.countStepDecimals = function () {
        var t = this.xNumSteps.map(e);
        return Math.max.apply(null, t);
      }),
      (r.prototype.convert = function (t) {
        return this.getStep(this.toStepping(t));
      });
    var c = {
        to: function (t) {
          return void 0 !== t && t.toFixed(2);
        },
        from: Number,
      },
      p = {
        target: "target",
        base: "base",
        origin: "origin",
        handle: "handle",
        handleLower: "handle-lower",
        handleUpper: "handle-upper",
        touchArea: "touch-area",
        horizontal: "horizontal",
        vertical: "vertical",
        background: "background",
        connect: "connect",
        connects: "connects",
        ltr: "ltr",
        rtl: "rtl",
        textDirectionLtr: "txt-dir-ltr",
        textDirectionRtl: "txt-dir-rtl",
        draggable: "draggable",
        drag: "state-drag",
        tap: "state-tap",
        active: "active",
        tooltip: "tooltip",
        pips: "pips",
        pipsHorizontal: "pips-horizontal",
        pipsVertical: "pips-vertical",
        marker: "marker",
        markerHorizontal: "marker-horizontal",
        markerVertical: "marker-vertical",
        markerNormal: "marker-normal",
        markerLarge: "marker-large",
        markerSub: "marker-sub",
        value: "value",
        valueHorizontal: "value-horizontal",
        valueVertical: "value-vertical",
        valueNormal: "value-normal",
        valueLarge: "value-large",
        valueSub: "value-sub",
      };
    function h(t) {
      if (
        "object" == typeof (e = t) &&
        "function" == typeof e.to &&
        "function" == typeof e.from
      )
        return !0;
      var e;
      throw new Error(
        "noUiSlider (" + lt + "): 'format' requires 'to' and 'from' methods."
      );
    }
    function m(t, e) {
      if (!o(e))
        throw new Error("noUiSlider (" + lt + "): 'step' is not numeric.");
      t.singleStep = e;
    }
    function g(t, e) {
      if (!o(e))
        throw new Error(
          "noUiSlider (" + lt + "): 'keyboardPageMultiplier' is not numeric."
        );
      t.keyboardPageMultiplier = e;
    }
    function v(t, e) {
      if (!o(e))
        throw new Error(
          "noUiSlider (" + lt + "): 'keyboardDefaultStep' is not numeric."
        );
      t.keyboardDefaultStep = e;
    }
    function b(t, e) {
      if ("object" != typeof e || Array.isArray(e))
        throw new Error("noUiSlider (" + lt + "): 'range' is not an object.");
      if (void 0 === e.min || void 0 === e.max)
        throw new Error(
          "noUiSlider (" + lt + "): Missing 'min' or 'max' in 'range'."
        );
      if (e.min === e.max)
        throw new Error(
          "noUiSlider (" + lt + "): 'range' 'min' and 'max' cannot be equal."
        );
      t.spectrum = new r(e, t.snap, t.singleStep);
    }
    function x(t, e) {
      if (((e = pt(e)), !Array.isArray(e) || !e.length))
        throw new Error(
          "noUiSlider (" + lt + "): 'start' option is incorrect."
        );
      (t.handles = e.length), (t.start = e);
    }
    function S(t, e) {
      if ("boolean" != typeof (t.snap = e))
        throw new Error(
          "noUiSlider (" + lt + "): 'snap' option must be a boolean."
        );
    }
    function y(t, e) {
      if ("boolean" != typeof (t.animate = e))
        throw new Error(
          "noUiSlider (" + lt + "): 'animate' option must be a boolean."
        );
    }
    function w(t, e) {
      if ("number" != typeof (t.animationDuration = e))
        throw new Error(
          "noUiSlider (" +
            lt +
            "): 'animationDuration' option must be a number."
        );
    }
    function C(t, e) {
      var n,
        i = [!1];
      if (
        ("lower" === e ? (e = [!0, !1]) : "upper" === e && (e = [!1, !0]),
        !0 === e || !1 === e)
      ) {
        for (n = 1; n < t.handles; n++) i.push(e);
        i.push(!1);
      } else {
        if (!Array.isArray(e) || !e.length || e.length !== t.handles + 1)
          throw new Error(
            "noUiSlider (" +
              lt +
              "): 'connect' option doesn't match handle count."
          );
        i = e;
      }
      t.connect = i;
    }
    function $(t, e) {
      switch (e) {
        case "horizontal":
          t.ort = 0;
          break;
        case "vertical":
          t.ort = 1;
          break;
        default:
          throw new Error(
            "noUiSlider (" + lt + "): 'orientation' option is invalid."
          );
      }
    }
    function k(t, e) {
      if (!o(e))
        throw new Error(
          "noUiSlider (" + lt + "): 'margin' option must be numeric."
        );
      0 !== e && (t.margin = t.spectrum.getDistance(e));
    }
    function E(t, e) {
      if (!o(e))
        throw new Error(
          "noUiSlider (" + lt + "): 'limit' option must be numeric."
        );
      if (((t.limit = t.spectrum.getDistance(e)), !t.limit || t.handles < 2))
        throw new Error(
          "noUiSlider (" +
            lt +
            "): 'limit' option is only supported on linear sliders with 2 or more handles."
        );
    }
    function U(t, e) {
      var n;
      if (!o(e) && !Array.isArray(e))
        throw new Error(
          "noUiSlider (" +
            lt +
            "): 'padding' option must be numeric or array of exactly 2 numbers."
        );
      if (Array.isArray(e) && 2 !== e.length && !o(e[0]) && !o(e[1]))
        throw new Error(
          "noUiSlider (" +
            lt +
            "): 'padding' option must be numeric or array of exactly 2 numbers."
        );
      if (0 !== e) {
        for (
          Array.isArray(e) || (e = [e, e]),
            t.padding = [
              t.spectrum.getDistance(e[0]),
              t.spectrum.getDistance(e[1]),
            ],
            n = 0;
          n < t.spectrum.xNumSteps.length - 1;
          n++
        )
          if (t.padding[0][n] < 0 || t.padding[1][n] < 0)
            throw new Error(
              "noUiSlider (" +
                lt +
                "): 'padding' option must be a positive number(s)."
            );
        var i = e[0] + e[1],
          r = t.spectrum.xVal[0];
        if (1 < i / (t.spectrum.xVal[t.spectrum.xVal.length - 1] - r))
          throw new Error(
            "noUiSlider (" +
              lt +
              "): 'padding' option must not exceed 100% of the range."
          );
      }
    }
    function N(t, e) {
      switch (e) {
        case "ltr":
          t.dir = 0;
          break;
        case "rtl":
          t.dir = 1;
          break;
        default:
          throw new Error(
            "noUiSlider (" + lt + "): 'direction' option was not recognized."
          );
      }
    }
    function P(t, e) {
      if ("string" != typeof e)
        throw new Error(
          "noUiSlider (" +
            lt +
            "): 'behaviour' must be a string containing options."
        );
      var n = 0 <= e.indexOf("tap"),
        i = 0 <= e.indexOf("drag"),
        r = 0 <= e.indexOf("fixed"),
        o = 0 <= e.indexOf("snap"),
        a = 0 <= e.indexOf("hover"),
        s = 0 <= e.indexOf("unconstrained");
      if (r) {
        if (2 !== t.handles)
          throw new Error(
            "noUiSlider (" +
              lt +
              "): 'fixed' behaviour must be used with 2 handles"
          );
        k(t, t.start[1] - t.start[0]);
      }
      if (s && (t.margin || t.limit))
        throw new Error(
          "noUiSlider (" +
            lt +
            "): 'unconstrained' behaviour cannot be used with margin or limit"
        );
      t.events = {
        tap: n || o,
        drag: i,
        fixed: r,
        snap: o,
        hover: a,
        unconstrained: s,
      };
    }
    function M(t, e) {
      if (!1 !== e)
        if (!0 === e) {
          t.tooltips = [];
          for (var n = 0; n < t.handles; n++) t.tooltips.push(!0);
        } else {
          if (((t.tooltips = pt(e)), t.tooltips.length !== t.handles))
            throw new Error(
              "noUiSlider (" + lt + "): must pass a formatter for all handles."
            );
          t.tooltips.forEach(function (t) {
            if (
              "boolean" != typeof t &&
              ("object" != typeof t || "function" != typeof t.to)
            )
              throw new Error(
                "noUiSlider (" +
                  lt +
                  "): 'tooltips' must be passed a formatter or 'false'."
              );
          });
        }
    }
    function A(t, e) {
      h((t.ariaFormat = e));
    }
    function V(t, e) {
      h((t.format = e));
    }
    function D(t, e) {
      if ("boolean" != typeof (t.keyboardSupport = e))
        throw new Error(
          "noUiSlider (" + lt + "): 'keyboardSupport' option must be a boolean."
        );
    }
    function T(t, e) {
      t.documentElement = e;
    }
    function O(t, e) {
      if ("string" != typeof e && !1 !== e)
        throw new Error(
          "noUiSlider (" + lt + "): 'cssPrefix' must be a string or `false`."
        );
      t.cssPrefix = e;
    }
    function j(t, e) {
      if ("object" != typeof e)
        throw new Error(
          "noUiSlider (" + lt + "): 'cssClasses' must be an object."
        );
      if ("string" == typeof t.cssPrefix)
        for (var n in ((t.cssClasses = {}), e))
          e.hasOwnProperty(n) && (t.cssClasses[n] = t.cssPrefix + e[n]);
      else t.cssClasses = e;
    }
    function vt(e) {
      var n = {
          margin: 0,
          limit: 0,
          padding: 0,
          animate: !0,
          animationDuration: 300,
          ariaFormat: c,
          format: c,
        },
        i = {
          step: { r: !1, t: m },
          keyboardPageMultiplier: { r: !1, t: g },
          keyboardDefaultStep: { r: !1, t: v },
          start: { r: !0, t: x },
          connect: { r: !0, t: C },
          direction: { r: !0, t: N },
          snap: { r: !1, t: S },
          animate: { r: !1, t: y },
          animationDuration: { r: !1, t: w },
          range: { r: !0, t: b },
          orientation: { r: !1, t: $ },
          margin: { r: !1, t: k },
          limit: { r: !1, t: E },
          padding: { r: !1, t: U },
          behaviour: { r: !0, t: P },
          ariaFormat: { r: !1, t: A },
          format: { r: !1, t: V },
          tooltips: { r: !1, t: M },
          keyboardSupport: { r: !0, t: D },
          documentElement: { r: !1, t: T },
          cssPrefix: { r: !0, t: O },
          cssClasses: { r: !0, t: j },
        },
        r = {
          connect: !1,
          direction: "ltr",
          behaviour: "tap",
          orientation: "horizontal",
          keyboardSupport: !0,
          cssPrefix: "noUi-",
          cssClasses: p,
          keyboardPageMultiplier: 5,
          keyboardDefaultStep: 10,
        };
      e.format && !e.ariaFormat && (e.ariaFormat = e.format),
        Object.keys(i).forEach(function (t) {
          if (!s(e[t]) && void 0 === r[t]) {
            if (i[t].r)
              throw new Error(
                "noUiSlider (" + lt + "): '" + t + "' is required."
              );
            return !0;
          }
          i[t].t(n, s(e[t]) ? e[t] : r[t]);
        }),
        (n.pips = e.pips);
      var t = document.createElement("div"),
        o = void 0 !== t.style.msTransform,
        a = void 0 !== t.style.transform;
      n.transformRule = a ? "transform" : o ? "msTransform" : "webkitTransform";
      return (
        (n.style = [
          ["left", "top"],
          ["right", "bottom"],
        ][n.dir][n.ort]),
        n
      );
    }
    function L(t, b, o) {
      var l,
        c,
        a,
        u,
        r,
        s,
        e,
        d,
        f = window.navigator.pointerEnabled
          ? { start: "pointerdown", move: "pointermove", end: "pointerup" }
          : window.navigator.msPointerEnabled
          ? {
              start: "MSPointerDown",
              move: "MSPointerMove",
              end: "MSPointerUp",
            }
          : {
              start: "mousedown touchstart",
              move: "mousemove touchmove",
              end: "mouseup touchend",
            },
        p =
          window.CSS &&
          CSS.supports &&
          CSS.supports("touch-action", "none") &&
          (function () {
            var t = !1;
            try {
              var e = Object.defineProperty({}, "passive", {
                get: function () {
                  t = !0;
                },
              });
              window.addEventListener("test", null, e);
            } catch (t) {}
            return t;
          })(),
        h = t,
        w = b.spectrum,
        x = [],
        S = [],
        m = [],
        g = 0,
        v = {},
        y = t.ownerDocument,
        C = b.documentElement || y.documentElement,
        $ = y.body,
        k = -1,
        E = 0,
        U = 1,
        N = 2,
        P = "rtl" === y.dir || 1 === b.ort ? 0 : 100;
      function M(t, e) {
        var n = y.createElement("div");
        return e && ht(n, e), t.appendChild(n), n;
      }
      function A(t, e) {
        var n = M(t, b.cssClasses.origin),
          i = M(n, b.cssClasses.handle);
        return (
          M(i, b.cssClasses.touchArea),
          i.setAttribute("data-handle", e),
          b.keyboardSupport &&
            (i.setAttribute("tabindex", "0"),
            i.addEventListener("keydown", function (t) {
              return (function (t, e) {
                if (D() || T(e)) return !1;
                var n = ["Left", "Right"],
                  i = ["Down", "Up"],
                  r = ["PageDown", "PageUp"],
                  o = ["Home", "End"];
                b.dir && !b.ort
                  ? n.reverse()
                  : b.ort && !b.dir && (i.reverse(), r.reverse());
                var a,
                  s = t.key.replace("Arrow", ""),
                  l = s === r[0],
                  c = s === r[1],
                  u = s === i[0] || s === n[0] || l,
                  d = s === i[1] || s === n[1] || c,
                  f = s === o[0],
                  p = s === o[1];
                if (!(u || d || f || p)) return !0;
                if ((t.preventDefault(), d || u)) {
                  var h = b.keyboardPageMultiplier,
                    m = u ? 0 : 1,
                    g = st(e),
                    v = g[m];
                  if (null === v) return !1;
                  !1 === v &&
                    (v = w.getDefaultStep(S[e], u, b.keyboardDefaultStep)),
                    (c || l) && (v *= h),
                    (v = Math.max(v, 1e-7)),
                    (v *= u ? -1 : 1),
                    (a = x[e] + v);
                } else a = p ? b.spectrum.xVal[b.spectrum.xVal.length - 1] : b.spectrum.xVal[0];
                return (
                  nt(e, w.toStepping(a), !0, !0),
                  J("slide", e),
                  J("update", e),
                  J("change", e),
                  J("set", e),
                  !1
                );
              })(t, e);
            })),
          i.setAttribute("role", "slider"),
          i.setAttribute("aria-orientation", b.ort ? "vertical" : "horizontal"),
          0 === e
            ? ht(i, b.cssClasses.handleLower)
            : e === b.handles - 1 && ht(i, b.cssClasses.handleUpper),
          n
        );
      }
      function V(t, e) {
        return !!e && M(t, b.cssClasses.connect);
      }
      function n(t, e) {
        return !!b.tooltips[e] && M(t.firstChild, b.cssClasses.tooltip);
      }
      function D() {
        return h.hasAttribute("disabled");
      }
      function T(t) {
        return c[t].hasAttribute("disabled");
      }
      function O() {
        r &&
          (Q("update.tooltips"),
          r.forEach(function (t) {
            t && ct(t);
          }),
          (r = null));
      }
      function j() {
        O(),
          (r = c.map(n)),
          Y("update.tooltips", function (t, e, n) {
            if (r[e]) {
              var i = t[e];
              !0 !== b.tooltips[e] && (i = b.tooltips[e].to(n[e])),
                (r[e].innerHTML = i);
            }
          });
      }
      function L(e, r, o) {
        var a = y.createElement("div"),
          s = [];
        (s[E] = b.cssClasses.valueNormal),
          (s[U] = b.cssClasses.valueLarge),
          (s[N] = b.cssClasses.valueSub);
        var l = [];
        (l[E] = b.cssClasses.markerNormal),
          (l[U] = b.cssClasses.markerLarge),
          (l[N] = b.cssClasses.markerSub);
        var c = [b.cssClasses.valueHorizontal, b.cssClasses.valueVertical],
          u = [b.cssClasses.markerHorizontal, b.cssClasses.markerVertical];
        function d(t, e) {
          var n = e === b.cssClasses.value,
            i = n ? s : l;
          return e + " " + (n ? c : u)[b.ort] + " " + i[t];
        }
        return (
          ht(a, b.cssClasses.pips),
          ht(
            a,
            0 === b.ort
              ? b.cssClasses.pipsHorizontal
              : b.cssClasses.pipsVertical
          ),
          Object.keys(e).forEach(function (t) {
            !(function (t, e, n) {
              if ((n = r ? r(e, n) : n) !== k) {
                var i = M(a, !1);
                (i.className = d(n, b.cssClasses.marker)),
                  (i.style[b.style] = t + "%"),
                  E < n &&
                    (((i = M(a, !1)).className = d(n, b.cssClasses.value)),
                    i.setAttribute("data-value", e),
                    (i.style[b.style] = t + "%"),
                    (i.innerHTML = o.to(e)));
              }
            })(t, e[t][0], e[t][1]);
          }),
          a
        );
      }
      function H() {
        u && (ct(u), (u = null));
      }
      function z(t) {
        H();
        var m,
          g,
          v,
          b,
          e,
          n,
          x,
          S,
          y,
          i = t.mode,
          r = t.density || 1,
          o = t.filter || !1,
          a = (function (t, e, n) {
            if ("range" === t || "steps" === t) return w.xVal;
            if ("count" === t) {
              if (e < 2)
                throw new Error(
                  "noUiSlider (" +
                    lt +
                    "): 'values' (>= 2) required for mode 'count'."
                );
              var i = e - 1,
                r = 100 / i;
              for (e = []; i--; ) e[i] = i * r;
              e.push(100), (t = "positions");
            }
            return "positions" === t
              ? e.map(function (t) {
                  return w.fromStepping(n ? w.getStep(t) : t);
                })
              : "values" === t
              ? n
                ? e.map(function (t) {
                    return w.fromStepping(w.getStep(w.toStepping(t)));
                  })
                : e
              : void 0;
          })(i, t.values || !1, t.stepped || !1),
          s =
            ((m = r),
            (g = i),
            (v = a),
            (b = {}),
            (e = w.xVal[0]),
            (n = w.xVal[w.xVal.length - 1]),
            (S = x = !1),
            (y = 0),
            (v = v
              .slice()
              .sort(function (t, e) {
                return t - e;
              })
              .filter(function (t) {
                return !this[t] && (this[t] = !0);
              }, {}))[0] !== e && (v.unshift(e), (x = !0)),
            v[v.length - 1] !== n && (v.push(n), (S = !0)),
            v.forEach(function (t, e) {
              var n,
                i,
                r,
                o,
                a,
                s,
                l,
                c,
                u,
                d,
                f = t,
                p = v[e + 1],
                h = "steps" === g;
              if ((h && (n = w.xNumSteps[e]), n || (n = p - f), !1 !== f))
                for (
                  void 0 === p && (p = f), n = Math.max(n, 1e-7), i = f;
                  i <= p;
                  i = (i + n).toFixed(7) / 1
                ) {
                  for (
                    c = (a = (o = w.toStepping(i)) - y) / m,
                      d = a / (u = Math.round(c)),
                      r = 1;
                    r <= u;
                    r += 1
                  )
                    b[(s = y + r * d).toFixed(5)] = [w.fromStepping(s), 0];
                  (l = -1 < v.indexOf(i) ? U : h ? N : E),
                    !e && x && i !== p && (l = 0),
                    (i === p && S) || (b[o.toFixed(5)] = [i, l]),
                    (y = o);
                }
            }),
            b),
          l = t.format || { to: Math.round };
        return (u = h.appendChild(L(s, o, l)));
      }
      function F() {
        var t = l.getBoundingClientRect(),
          e = "offset" + ["Width", "Height"][b.ort];
        return 0 === b.ort ? t.width || l[e] : t.height || l[e];
      }
      function R(i, r, o, a) {
        var e = function (t) {
            return (
              !!(t = (function (t, e, n) {
                var i,
                  r,
                  o = 0 === t.type.indexOf("touch"),
                  a = 0 === t.type.indexOf("mouse"),
                  s = 0 === t.type.indexOf("pointer");
                0 === t.type.indexOf("MSPointer") && (s = !0);
                if ("mousedown" === t.type && !t.buttons && !t.touches)
                  return !1;
                if (o) {
                  var l = function (t) {
                    return (
                      t.target === n ||
                      n.contains(t.target) ||
                      (t.target.shadowRoot && t.target.shadowRoot.contains(n))
                    );
                  };
                  if ("touchstart" === t.type) {
                    var c = Array.prototype.filter.call(t.touches, l);
                    if (1 < c.length) return !1;
                    (i = c[0].pageX), (r = c[0].pageY);
                  } else {
                    var u = Array.prototype.find.call(t.changedTouches, l);
                    if (!u) return !1;
                    (i = u.pageX), (r = u.pageY);
                  }
                }
                (e = e || gt(y)),
                  (a || s) && ((i = t.clientX + e.x), (r = t.clientY + e.y));
                return (
                  (t.pageOffset = e),
                  (t.points = [i, r]),
                  (t.cursor = a || s),
                  t
                );
              })(t, a.pageOffset, a.target || r)) &&
              !(D() && !a.doNotReject) &&
              ((e = h),
              (n = b.cssClasses.tap),
              !(
                (e.classList
                  ? e.classList.contains(n)
                  : new RegExp("\\b" + n + "\\b").test(e.className)) &&
                !a.doNotReject
              ) &&
                !(i === f.start && void 0 !== t.buttons && 1 < t.buttons) &&
                (!a.hover || !t.buttons) &&
                (p || t.preventDefault(),
                (t.calcPoint = t.points[b.ort]),
                void o(t, a)))
            );
            var e, n;
          },
          n = [];
        return (
          i.split(" ").forEach(function (t) {
            r.addEventListener(t, e, !!p && { passive: !0 }), n.push([t, e]);
          }),
          n
        );
      }
      function I(t) {
        var e,
          n,
          i,
          r,
          o,
          a,
          s =
            (100 *
              (t -
                ((e = l),
                (n = b.ort),
                (i = e.getBoundingClientRect()),
                (r = e.ownerDocument),
                (o = r.documentElement),
                (a = gt(r)),
                /webkit.*Chrome.*Mobile/i.test(navigator.userAgent) &&
                  (a.x = 0),
                n ? i.top + a.y - o.clientTop : i.left + a.x - o.clientLeft))) /
            F();
        return (s = ft(s)), b.dir ? 100 - s : s;
      }
      function _(t, e) {
        "mouseout" === t.type &&
          "HTML" === t.target.nodeName &&
          null === t.relatedTarget &&
          q(t, e);
      }
      function B(t, e) {
        if (
          -1 === navigator.appVersion.indexOf("MSIE 9") &&
          0 === t.buttons &&
          0 !== e.buttonsProperty
        )
          return q(t, e);
        var n = (b.dir ? -1 : 1) * (t.calcPoint - e.startCalcPoint);
        Z(0 < n, (100 * n) / e.baseSize, e.locations, e.handleNumbers);
      }
      function q(t, e) {
        e.handle && (mt(e.handle, b.cssClasses.active), (g -= 1)),
          e.listeners.forEach(function (t) {
            C.removeEventListener(t[0], t[1]);
          }),
          0 === g &&
            (mt(h, b.cssClasses.drag),
            et(),
            t.cursor &&
              (($.style.cursor = ""),
              $.removeEventListener("selectstart", ut))),
          e.handleNumbers.forEach(function (t) {
            J("change", t), J("set", t), J("end", t);
          });
      }
      function W(t, e) {
        if (e.handleNumbers.some(T)) return !1;
        var n;
        1 === e.handleNumbers.length &&
          ((n = c[e.handleNumbers[0]].children[0]),
          (g += 1),
          ht(n, b.cssClasses.active));
        t.stopPropagation();
        var i = [],
          r = R(f.move, C, B, {
            target: t.target,
            handle: n,
            listeners: i,
            startCalcPoint: t.calcPoint,
            baseSize: F(),
            pageOffset: t.pageOffset,
            handleNumbers: e.handleNumbers,
            buttonsProperty: t.buttons,
            locations: S.slice(),
          }),
          o = R(f.end, C, q, {
            target: t.target,
            handle: n,
            listeners: i,
            doNotReject: !0,
            handleNumbers: e.handleNumbers,
          }),
          a = R("mouseout", C, _, {
            target: t.target,
            handle: n,
            listeners: i,
            doNotReject: !0,
            handleNumbers: e.handleNumbers,
          });
        i.push.apply(i, r.concat(o, a)),
          t.cursor &&
            (($.style.cursor = getComputedStyle(t.target).cursor),
            1 < c.length && ht(h, b.cssClasses.drag),
            $.addEventListener("selectstart", ut, !1)),
          e.handleNumbers.forEach(function (t) {
            J("start", t);
          });
      }
      function i(t) {
        t.stopPropagation();
        var r,
          o,
          a,
          e = I(t.calcPoint),
          n =
            ((r = e),
            (a = !(o = 100)),
            c.forEach(function (t, e) {
              if (!T(e)) {
                var n = S[e],
                  i = Math.abs(n - r);
                (i < o || (i <= o && n < r) || (100 === i && 100 === o)) &&
                  ((a = e), (o = i));
              }
            }),
            a);
        if (!1 === n) return !1;
        b.events.snap || dt(h, b.cssClasses.tap, b.animationDuration),
          nt(n, e, !0, !0),
          et(),
          J("slide", n, !0),
          J("update", n, !0),
          J("change", n, !0),
          J("set", n, !0),
          b.events.snap && W(t, { handleNumbers: [n] });
      }
      function X(t) {
        var e = I(t.calcPoint),
          n = w.getStep(e),
          i = w.fromStepping(n);
        Object.keys(v).forEach(function (t) {
          "hover" === t.split(".")[0] &&
            v[t].forEach(function (t) {
              t.call(s, i);
            });
        });
      }
      function Y(t, e) {
        (v[t] = v[t] || []),
          v[t].push(e),
          "update" === t.split(".")[0] &&
            c.forEach(function (t, e) {
              J("update", e);
            });
      }
      function Q(t) {
        var i = t && t.split(".")[0],
          r = i && t.substring(i.length);
        Object.keys(v).forEach(function (t) {
          var e = t.split(".")[0],
            n = t.substring(e.length);
          (i && i !== e) || (r && r !== n) || delete v[t];
        });
      }
      function J(n, i, r) {
        Object.keys(v).forEach(function (t) {
          var e = t.split(".")[0];
          n === e &&
            v[t].forEach(function (t) {
              t.call(
                s,
                x.map(b.format.to),
                i,
                x.slice(),
                r || !1,
                S.slice(),
                s
              );
            });
        });
      }
      function G(t, e, n, i, r, o) {
        var a;
        return (
          1 < c.length &&
            !b.events.unconstrained &&
            (i &&
              0 < e &&
              ((a = w.getAbsoluteDistance(t[e - 1], b.margin, 0)),
              (n = Math.max(n, a))),
            r &&
              e < c.length - 1 &&
              ((a = w.getAbsoluteDistance(t[e + 1], b.margin, 1)),
              (n = Math.min(n, a)))),
          1 < c.length &&
            b.limit &&
            (i &&
              0 < e &&
              ((a = w.getAbsoluteDistance(t[e - 1], b.limit, 0)),
              (n = Math.min(n, a))),
            r &&
              e < c.length - 1 &&
              ((a = w.getAbsoluteDistance(t[e + 1], b.limit, 1)),
              (n = Math.max(n, a)))),
          b.padding &&
            (0 === e &&
              ((a = w.getAbsoluteDistance(0, b.padding[0], 0)),
              (n = Math.max(n, a))),
            e === c.length - 1 &&
              ((a = w.getAbsoluteDistance(100, b.padding[1], 1)),
              (n = Math.min(n, a)))),
          !((n = ft((n = w.getStep(n)))) === t[e] && !o) && n
        );
      }
      function K(t, e) {
        var n = b.ort;
        return (n ? e : t) + ", " + (n ? t : e);
      }
      function Z(t, i, n, e) {
        var r = n.slice(),
          o = [!t, t],
          a = [t, !t];
        (e = e.slice()),
          t && e.reverse(),
          1 < e.length
            ? e.forEach(function (t, e) {
                var n = G(r, t, r[t] + i, o[e], a[e], !1);
                !1 === n ? (i = 0) : ((i = n - r[t]), (r[t] = n));
              })
            : (o = a = [!0]);
        var s = !1;
        e.forEach(function (t, e) {
          s = nt(t, n[t] + i, o[e], a[e]) || s;
        }),
          s &&
            e.forEach(function (t) {
              J("update", t), J("slide", t);
            });
      }
      function tt(t, e) {
        return b.dir ? 100 - t - e : t;
      }
      function et() {
        m.forEach(function (t) {
          var e = 50 < S[t] ? -1 : 1,
            n = 3 + (c.length + e * t);
          c[t].style.zIndex = n;
        });
      }
      function nt(t, e, n, i, r) {
        return (
          r || (e = G(S, t, e, n, i, !1)),
          !1 !== e &&
            ((function (t, e) {
              (S[t] = e), (x[t] = w.fromStepping(e));
              var n = "translate(" + K(10 * (tt(e, 0) - P) + "%", "0") + ")";
              (c[t].style[b.transformRule] = n), it(t), it(t + 1);
            })(t, e),
            !0)
        );
      }
      function it(t) {
        if (a[t]) {
          var e = 0,
            n = 100;
          0 !== t && (e = S[t - 1]), t !== a.length - 1 && (n = S[t]);
          var i = n - e,
            r = "translate(" + K(tt(e, i) + "%", "0") + ")",
            o = "scale(" + K(i / 100, "1") + ")";
          a[t].style[b.transformRule] = r + " " + o;
        }
      }
      function rt(t, e) {
        return null === t || !1 === t || void 0 === t
          ? S[e]
          : ("number" == typeof t && (t = String(t)),
            (t = b.format.from(t)),
            !1 === (t = w.toStepping(t)) || isNaN(t) ? S[e] : t);
      }
      function ot(t, e, n) {
        var i = pt(t),
          r = void 0 === S[0];
        (e = void 0 === e || !!e),
          b.animate && !r && dt(h, b.cssClasses.tap, b.animationDuration),
          m.forEach(function (t) {
            nt(t, rt(i[t], t), !0, !1, n);
          });
        for (var o = 1 === m.length ? 0 : 1; o < m.length; ++o)
          m.forEach(function (t) {
            nt(t, S[t], !0, !0, n);
          });
        et(),
          m.forEach(function (t) {
            J("update", t), null !== i[t] && e && J("set", t);
          });
      }
      function at() {
        var t = x.map(b.format.to);
        return 1 === t.length ? t[0] : t;
      }
      function st(t) {
        var e = S[t],
          n = w.getNearbySteps(e),
          i = x[t],
          r = n.thisStep.step,
          o = null;
        if (b.snap)
          return [
            i - n.stepBefore.startValue || null,
            n.stepAfter.startValue - i || null,
          ];
        !1 !== r &&
          i + r > n.stepAfter.startValue &&
          (r = n.stepAfter.startValue - i),
          (o =
            i > n.thisStep.startValue
              ? n.thisStep.step
              : !1 !== n.stepBefore.step && i - n.stepBefore.highestStep),
          100 === e ? (r = null) : 0 === e && (o = null);
        var a = w.countStepDecimals();
        return (
          null !== r && !1 !== r && (r = Number(r.toFixed(a))),
          null !== o && !1 !== o && (o = Number(o.toFixed(a))),
          [o, r]
        );
      }
      return (
        ht((e = h), b.cssClasses.target),
        0 === b.dir ? ht(e, b.cssClasses.ltr) : ht(e, b.cssClasses.rtl),
        0 === b.ort
          ? ht(e, b.cssClasses.horizontal)
          : ht(e, b.cssClasses.vertical),
        ht(
          e,
          "rtl" === getComputedStyle(e).direction
            ? b.cssClasses.textDirectionRtl
            : b.cssClasses.textDirectionLtr
        ),
        (l = M(e, b.cssClasses.base)),
        (function (t, e) {
          var n = M(e, b.cssClasses.connects);
          (c = []), (a = []).push(V(n, t[0]));
          for (var i = 0; i < b.handles; i++)
            c.push(A(e, i)), (m[i] = i), a.push(V(n, t[i + 1]));
        })(b.connect, l),
        (d = b.events).fixed ||
          c.forEach(function (t, e) {
            R(f.start, t.children[0], W, { handleNumbers: [e] });
          }),
        d.tap && R(f.start, l, i, {}),
        d.hover && R(f.move, l, X, { hover: !0 }),
        d.drag &&
          a.forEach(function (t, e) {
            if (!1 !== t && 0 !== e && e !== a.length - 1) {
              var n = c[e - 1],
                i = c[e],
                r = [t];
              ht(t, b.cssClasses.draggable),
                d.fixed && (r.push(n.children[0]), r.push(i.children[0])),
                r.forEach(function (t) {
                  R(f.start, t, W, {
                    handles: [n, i],
                    handleNumbers: [e - 1, e],
                  });
                });
            }
          }),
        ot(b.start),
        b.pips && z(b.pips),
        b.tooltips && j(),
        Y("update", function (t, e, a, n, s) {
          m.forEach(function (t) {
            var e = c[t],
              n = G(S, t, 0, !0, !0, !0),
              i = G(S, t, 100, !0, !0, !0),
              r = s[t],
              o = b.ariaFormat.to(a[t]);
            (n = w.fromStepping(n).toFixed(1)),
              (i = w.fromStepping(i).toFixed(1)),
              (r = w.fromStepping(r).toFixed(1)),
              e.children[0].setAttribute("aria-valuemin", n),
              e.children[0].setAttribute("aria-valuemax", i),
              e.children[0].setAttribute("aria-valuenow", r),
              e.children[0].setAttribute("aria-valuetext", o);
          });
        }),
        (s = {
          destroy: function () {
            for (var t in b.cssClasses)
              b.cssClasses.hasOwnProperty(t) && mt(h, b.cssClasses[t]);
            for (; h.firstChild; ) h.removeChild(h.firstChild);
            delete h.noUiSlider;
          },
          steps: function () {
            return m.map(st);
          },
          on: Y,
          off: Q,
          get: at,
          set: ot,
          setHandle: function (t, e, n, i) {
            if (!(0 <= (t = Number(t)) && t < m.length))
              throw new Error(
                "noUiSlider (" + lt + "): invalid handle number, got: " + t
              );
            nt(t, rt(e, t), !0, !0, i), J("update", t), n && J("set", t);
          },
          reset: function (t) {
            ot(b.start, t);
          },
          __moveHandles: function (t, e, n) {
            Z(t, e, S, n);
          },
          options: o,
          updateOptions: function (e, t) {
            var n = at(),
              i = [
                "margin",
                "limit",
                "padding",
                "range",
                "animate",
                "snap",
                "step",
                "format",
                "pips",
                "tooltips",
              ];
            i.forEach(function (t) {
              void 0 !== e[t] && (o[t] = e[t]);
            });
            var r = vt(o);
            i.forEach(function (t) {
              void 0 !== e[t] && (b[t] = r[t]);
            }),
              (w = r.spectrum),
              (b.margin = r.margin),
              (b.limit = r.limit),
              (b.padding = r.padding),
              b.pips ? z(b.pips) : H(),
              b.tooltips ? j() : O(),
              (S = []),
              ot(e.start || n, t);
          },
          target: h,
          removePips: H,
          removeTooltips: O,
          getTooltips: function () {
            return r;
          },
          getOrigins: function () {
            return c;
          },
          pips: z,
        })
      );
    }
    return {
      __spectrum: r,
      version: lt,
      cssClasses: p,
      create: function (t, e) {
        if (!t || !t.nodeName)
          throw new Error(
            "noUiSlider (" +
              lt +
              "): create requires a single element, got: " +
              t
          );
        if (t.noUiSlider)
          throw new Error(
            "noUiSlider (" + lt + "): Slider was already initialized."
          );
        var n = L(t, vt(e), e);
        return (t.noUiSlider = n);
      },
    };
  }),
  (String.WHITESPACE = " \t\r\n"),
  (String.prototype.capitalize = function (t) {
    function e(t) {
      return t.toUpperCase();
    }
    var n = $.trim(this);
    return t ? n.replace(/^.|\s./g, e) : n.replace(/(^\w)/, e);
  }),
  (String.prototype.camelize = function () {
    return this.replace(/(?:^|[-_])(\w)/g, function (t, e) {
      return e ? e.toUpperCase() : "";
    });
  }),
  (String.prototype.toBoolean = function () {
    if (null == this) return !1;
    return /^(true|1|yes|on)$/i.test(this);
  }),
  (String.prototype.formatCurrency = function (t, e, n, i, r) {
    return $.isNumeric(this)
      ? (0 == t || "" == t ? "" : "€ ") +
          this.formatNumber(e ? 2 : 0, n || ",", i || ".")
      : this.valueOf();
  }),
  (String.prototype.formatNumber = function (t, e, n) {
    if (!$.isNumeric(this)) return this.valueOf();
    var i = parseFloat(this)
      .toFixed(t || 0)
      .split(".");
    return (
      (i[0] = i[0].replace(/(\d)(?=(\d\d\d)+$)/g, "$1" + (n || "."))),
      i.join(e || ",")
    );
  }),
  (String.prototype.trimLeft = function (t) {
    return (
      (t = t || String.WHITESPACE),
      this.replace(new RegExp("^[" + t + "]+", ""), "")
    );
  }),
  (String.prototype.trimRight = function (t) {
    return (
      (t = t || String.WHITESPACE),
      this.replace(new RegExp("[" + t + "]+$", ""), "")
    );
  }),
  (String.prototype.trim = function (t) {
    return (
      (t = t || String.WHITESPACE),
      this.replace(new RegExp("^[" + t + "]+|[" + t + "]+$", "g"), "")
    );
  }),
  (function (n) {
    n.fn.onSwipe = function (l, c, t, e) {
      if (jQuery.isFunction(l)) {
        var u, d, f, p, h;
        null == c && (c = 100), null == t && (t = 30), null == e && (e = 30);
        var m = 0;
        n(this).on("touchstart", function (t) {
          (u = t.touches[0].clientX),
            (d = t.touches[0].clientY),
            (h = setInterval(function () {
              m += 10;
            }, 10));
        }),
          n(this).on("touchend", function (t) {
            var e, n, i, r, o, a, s;
            (f = t.changedTouches[0].clientX),
              (p = t.changedTouches[0].clientY),
              clearInterval(h),
              c <= m &&
                l(
                  ((n = d),
                  (r = p),
                  (s = { up: !(a = o = 30), right: !1, down: !1, left: !1 }),
                  (i = f) < (e = u) && o <= e - i
                    ? (s.left = !0)
                    : e < i && o <= i - e && (s.right = !0),
                  n < r && a <= r - n
                    ? (s.down = !0)
                    : r < n && a <= n - r && (s.up = !0),
                  s)
                ),
              (m = 0);
          });
      } else
        console.error(
          "You need to pass a function in order to process swipe data."
        );
      return n(this);
    };
  })(jQuery);
