import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

// Widget配信
export async function GET(
  request: Request,
  { params }: { params: Promise<{ key: string }> }
) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { key } = await params;
  const apiKey = key.replace(".js", "");

  // APIキーからサイト情報を取得
  const { data: site, error } = await supabase
    .from("sites")
    .select("*")
    .eq("api_key", apiKey)
    .eq("is_active", true)
    .single();

  if (error || !site) {
    return new NextResponse("Not found", { status: 404 });
  }

  // Widget JSを返す（設定を埋め込み）
  const widgetJS = `
(function(){
  console.log("[LanguageSwitcher] Widget loaded");
  var CONFIG = {
    supabaseUrl: "${process.env.NEXT_PUBLIC_SUPABASE_URL}",
    supabaseAnonKey: "${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}",
    apiEndpoint: "${process.env.NEXT_PUBLIC_APP_URL}/api/widget",
    site_id: "${site.id}",
    allowed_languages: ${JSON.stringify(site.allowed_languages)},
    default_target_language: "${site.default_target_language}",
    widget_position: "${site.user_profiles?.widget_position || "bottom-right"}",
    widget_theme: "${site.user_profiles?.widget_theme || "light"}",
    widget_size: "${site.user_profiles?.widget_size || "medium"}"
  };

  ${getWidgetCode()}
})();`;

  return new NextResponse(widgetJS, {
    headers: {
      "Content-Type": "application/javascript",
      "Cache-Control": "public, max-age=3600",
      "Access-Control-Allow-Origin": "*",
    },
  });
}

function getWidgetCode(): string {
  // Widget code is inlined here for simplicity
  // In production, you might want to read from a file
  return `
  var LANGUAGES = {
    en: { name: "English", flag: "\\u{1F1FA}\\u{1F1F8}" },
    ja: { name: "\\u65E5\\u672C\\u8A9E", flag: "\\u{1F1EF}\\u{1F1F5}" },
    es: { name: "Espa\\u00F1ol", flag: "\\u{1F1EA}\\u{1F1F8}" },
    fr: { name: "Fran\\u00E7ais", flag: "\\u{1F1EB}\\u{1F1F7}" },
    de: { name: "Deutsch", flag: "\\u{1F1E9}\\u{1F1EA}" },
    zh: { name: "\\u4E2D\\u6587", flag: "\\u{1F1E8}\\u{1F1F3}" },
    ko: { name: "\\uD55C\\uAD6D\\uC5B4", flag: "\\u{1F1F0}\\u{1F1F7}" },
    pt: { name: "Portugu\\u00EAs", flag: "\\u{1F1E7}\\u{1F1F7}" },
    it: { name: "Italiano", flag: "\\u{1F1EE}\\u{1F1F9}" },
    ru: { name: "\\u0420\\u0443\\u0441\\u0441\\u043A\\u0438\\u0439", flag: "\\u{1F1F7}\\u{1F1FA}" },
    ar: { name: "\\u0627\\u0644\\u0639\\u0631\\u0628\\u064A\\u0629", flag: "\\u{1F1F8}\\u{1F1E6}" },
    hi: { name: "\\u0939\\u093F\\u0928\\u094D\\u0926\\u0940", flag: "\\u{1F1EE}\\u{1F1F3}" },
    th: { name: "\\u0E44\\u0E17\\u0E22", flag: "\\u{1F1F9}\\u0E48" },
    vi: { name: "Ti\\u1EBFng Vi\\u1EC7t", flag: "\\u{1F1FB}\\u{1F1F3}" },
    id: { name: "Bahasa Indonesia", flag: "\\u{1F1EE}\\u{1F1E9}" },
    ms: { name: "Bahasa Melayu", flag: "\\u{1F1F2}\\u{1F1FE}" },
    tr: { name: "T\\u00FCrk\\u00E7e", flag: "\\u{1F1F9}\\u{1F1F7}" },
    pl: { name: "Polski", flag: "\\u{1F1F5}\\u{1F1F1}" },
    nl: { name: "Nederlands", flag: "\\u{1F1F3}\\u{1F1F1}" },
    sv: { name: "Svenska", flag: "\\u{1F1F8}\\u{1F1EA}" }
  };

  var translateElementCreated = false;

  function getVisitorId() {
    var visitorId = localStorage.getItem("lswitcher_visitor_id");
    if (!visitorId) {
      visitorId = "v_" + Date.now().toString(36) + "_" + Math.random().toString(36).substring(2, 9);
      localStorage.setItem("lswitcher_visitor_id", visitorId);
    }
    return visitorId;
  }

  function detectPageLanguage() {
    var htmlLang = document.documentElement.lang;
    if (htmlLang) return htmlLang.substring(0, 2).toLowerCase();
    var metaTag = document.querySelector('meta[name="language"]');
    if (metaTag) return (metaTag.getAttribute("content") || "en").substring(0, 2).toLowerCase();
    return "en";
  }

  function logTranslation(targetLang) {
    try {
      fetch(CONFIG.apiEndpoint + "/log-translation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          site_id: CONFIG.site_id,
          visitor_id: getVisitorId(),
          source_language: detectPageLanguage(),
          target_language: targetLang,
          page_url: window.location.href
        })
      });
    } catch(e) {}
  }

  function createWidget() {
    var sourceLang = detectPageLanguage();
    var sourceLangInfo = LANGUAGES[sourceLang] || LANGUAGES["en"];
    var defaultTarget = CONFIG.default_target_language || "en";
    var targetLangInfo = LANGUAGES[defaultTarget] || LANGUAGES["en"];

    var style = document.createElement("style");
    style.textContent = "#lsw-widget{position:fixed;z-index:999999;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;font-size:14px}#lsw-widget *{box-sizing:border-box;margin:0;padding:0}.lsw-container{display:flex;align-items:center;gap:8px;background:#fff;border-radius:50px;padding:8px 12px;box-shadow:0 4px 20px rgba(0,0,0,.15);cursor:pointer;transition:all .2s}.lsw-container:hover{box-shadow:0 6px 24px rgba(0,0,0,.2);transform:translateY(-2px)}.lsw-source-lang,.lsw-target-lang{display:flex;align-items:center;justify-content:center;width:36px;height:36px;border-radius:50%;border:none;background:#f3f4f6;cursor:pointer;transition:all .2s;position:relative}.lsw-source-lang:hover,.lsw-target-lang:hover{background:#e5e7eb}.lsw-target-lang{background:#3b82f6}.lsw-target-lang:hover{background:#2563eb}.lsw-flag{font-size:20px;line-height:1}.lsw-arrow{color:#9ca3af;font-size:16px}.lsw-dropdown{position:absolute;bottom:100%;left:50%;transform:translateX(-50%);margin-bottom:8px;background:#fff;border-radius:12px;box-shadow:0 4px 20px rgba(0,0,0,.15);min-width:200px;max-height:300px;overflow:hidden;display:none}.lsw-dropdown-header{padding:12px 16px;font-weight:600;color:#374151;border-bottom:1px solid #e5e7eb}.lsw-lang-list{max-height:250px;overflow-y:auto;padding:8px}.lsw-lang-option{display:flex;align-items:center;gap:12px;width:100%;padding:10px 12px;border:none;background:0 0;cursor:pointer;border-radius:8px;transition:all .15s;text-align:left}.lsw-lang-option:hover{background:#f3f4f6}.lsw-lang-option .lsw-flag{font-size:24px}.lsw-lang-option .lsw-lang-name{font-size:14px;color:#374151}#lsw-widget.lsw-translating .lsw-container{opacity:.7;pointer-events:none}#lsw-widget.lsw-translating .lsw-target-lang::after{content:\"\";position:absolute;width:16px;height:16px;border:2px solid #fff;border-top-color:transparent;border-radius:50%;animation:lsw-spin .8s linear infinite}@keyframes lsw-spin{to{transform:rotate(360deg)}}" + getThemeCSS() + getSizeCSS();
    document.head.appendChild(style);

    var langOptionsHTML = CONFIG.allowed_languages.map(function(langCode) {
      var lang = LANGUAGES[langCode];
      if (!lang) return "";
      return '<button class="lsw-lang-option" data-lang="' + langCode + '" title="' + lang.name + '"><span class="lsw-flag">' + lang.flag + '</span><span class="lsw-lang-name">' + lang.name + '</span></button>';
    }).join("");

    var widgetHTML = '<div id="lsw-widget" class="lsw-widget lsw-theme-' + CONFIG.widget_theme + '" style="' + getPositionStyle() + '">' +
      '<div class="lsw-container">' +
        '<button class="lsw-source-lang" title="Source: ' + sourceLangInfo.name + '"><span class="lsw-flag">' + sourceLangInfo.flag + '</span></button>' +
        '<div class="lsw-arrow">\\u2192</div>' +
        '<button class="lsw-target-lang" title="Translate to: ' + targetLangInfo.name + '"><span class="lsw-flag">' + targetLangInfo.flag + '</span></button>' +
      '</div>' +
      '<div class="lsw-dropdown">' +
        '<div class="lsw-dropdown-header">Select target language</div>' +
        '<div class="lsw-lang-list">' + langOptionsHTML + '</div>' +
      '</div>' +
    '</div>';

    var wrapper = document.createElement("div");
    wrapper.innerHTML = widgetHTML;
    document.body.appendChild(wrapper);

    var widget = document.getElementById("lsw-widget");
    var container = widget.querySelector(".lsw-container");
    var dropdown = widget.querySelector(".lsw-dropdown");
    var targetLangBtn = widget.querySelector(".lsw-target-lang");

    container.addEventListener("click", function(e) {
      e.stopPropagation();
      dropdown.style.display = dropdown.style.display === "none" ? "block" : "none";
    });

    document.addEventListener("click", function() {
      dropdown.style.display = "none";
    });

    dropdown.addEventListener("click", function(e) {
      e.stopPropagation();
    });

    widget.querySelectorAll(".lsw-lang-option").forEach(function(option) {
      option.addEventListener("click", function() {
        var targetLang = this.dataset.lang;
        var langInfo = LANGUAGES[targetLang];
        targetLangBtn.querySelector(".lsw-flag").textContent = langInfo.flag;
        targetLangBtn.title = "Translate to: " + langInfo.name;
        dropdown.style.display = "none";
        translatePage(targetLang);
        logTranslation(targetLang);
      });
    });
  }

  function getPositionStyle() {
    var pos = CONFIG.widget_position || "bottom-right";
    var styles = {
      "bottom-right": "bottom:20px;right:20px",
      "bottom-left": "bottom:20px;left:20px",
      "top-right": "top:20px;right:20px",
      "top-left": "top:20px;left:20px"
    };
    return styles[pos] || styles["bottom-right"];
  }

  function getThemeCSS() {
    if (CONFIG.widget_theme === "dark") {
      return "#lsw-widget.lsw-theme-dark .lsw-container{background:#1f2937}#lsw-widget.lsw-theme-dark .lsw-source-lang{background:#374151}#lsw-widget.lsw-theme-dark .lsw-source-lang:hover{background:#4b5563}#lsw-widget.lsw-theme-dark .lsw-dropdown{background:#1f2937}#lsw-widget.lsw-theme-dark .lsw-dropdown-header{color:#f9fafb;border-color:#374151}#lsw-widget.lsw-theme-dark .lsw-lang-option:hover{background:#374151}#lsw-widget.lsw-theme-dark .lsw-lang-option .lsw-lang-name{color:#f9fafb}";
    }
    return "";
  }

  function getSizeCSS() {
    var size = CONFIG.widget_size || "medium";
    if (size === "small") {
      return "#lsw-widget.lsw-small .lsw-container{padding:6px 10px;gap:6px}#lsw-widget.lsw-small .lsw-source-lang,#lsw-widget.lsw-small .lsw-target-lang{width:28px;height:28px}#lsw-widget.lsw-small .lsw-flag{font-size:16px}#lsw-widget.lsw-small .lsw-arrow{font-size:12px}";
    }
    if (size === "large") {
      return "#lsw-widget.lsw-large .lsw-container{padding:12px 16px;gap:12px}#lsw-widget.lsw-large .lsw-source-lang,#lsw-widget.lsw-large .lsw-target-lang{width:44px;height:44px}#lsw-widget.lsw-large .lsw-flag{font-size:28px}#lsw-widget.lsw-large .lsw-arrow{font-size:20px}";
    }
    return "";
  }

  function translatePage(targetLang) {
    var widget = document.getElementById("lsw-widget");
    widget.classList.add("lsw-translating");

    var container = document.getElementById("lsw-translate-container");
    if (!container) {
      container = document.createElement("div");
      container.id = "lsw-translate-container";
      container.style.height = "0";
      container.style.overflow = "hidden";
      container.style.position = "absolute";
      container.style.left = "-9999px";
      document.body.appendChild(container);
    }

    function applyTranslation() {
      var select = document.querySelector("#lsw-translate-container .goog-te-combo-simple")
        || document.querySelector(".goog-te-combo-simple");
      if (select) {
        for (var i = 0; i < select.options.length; i++) {
          if (select.options[i].value === targetLang) {
            select.value = targetLang;
            select.dispatchEvent(new Event("change", { bubbles: true }));
            break;
          }
        }
      }
      setTimeout(function() { widget.classList.remove("lsw-translating"); }, 1500);
    }

    function pollForCombo(callback, maxWait) {
      var start = Date.now();
      (function check() {
        var select = document.querySelector("#lsw-translate-container .goog-te-combo-simple")
          || document.querySelector(".goog-te-combo-simple");
        if (select && select.options.length > 1) {
          callback();
        } else if (Date.now() - start < maxWait) {
          setTimeout(check, 150);
        } else {
          translateElementCreated = false;
          widget.classList.remove("lsw-translating");
        }
      })();
    }

    function doInit() {
      container.innerHTML = "";
      var allowedLangs = CONFIG.allowed_languages.join(",");
      new google.translate.TranslateElement({
        pageLanguage: detectPageLanguage(),
        includedLanguages: allowedLangs,
        layout: google.translate.TranslateElement.InlineLayout.SIMPLE,
        autoDisplay: false
      }, "lsw-translate-container");
      translateElementCreated = true;
      pollForCombo(applyTranslation, 5000);
    }

    if (translateElementCreated) {
      container.innerHTML = "";
      var allowedLangs = CONFIG.allowed_languages.join(",");
      new google.translate.TranslateElement({
        pageLanguage: detectPageLanguage(),
        includedLanguages: allowedLangs,
        layout: google.translate.TranslateElement.InlineLayout.SIMPLE,
        autoDisplay: false
      }, "lsw-translate-container");
      pollForCombo(applyTranslation, 5000);
      return;
    }

    if (!window.google || !window.google.translate) {
      var s = document.createElement("script");
      s.src = "//translate.google.com/translate_a/element.js?cb=lswGtInit";
      window.lswGtInit = function() { doInit(); };
      document.head.appendChild(s);
    } else {
      doInit();
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", createWidget);
  } else {
    createWidget();
  }
`;
}
