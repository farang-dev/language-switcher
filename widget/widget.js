/**
 * Language Switcher Widget / 言語切り替えくん
 * Vanilla JS widget for embedding on user websites
 */

(function () {
  "use strict";

  // Widget configuration
  const CONFIG = {
    supabaseUrl: "__SUPABASE_URL__",
    supabaseAnonKey: "__SUPABASE_ANON_KEY__",
    apiEndpoint: "__API_ENDPOINT__",
  };

  // Language definitions
  const LANGUAGES = {
    en: { name: "English", flag: "🇺🇸" },
    ja: { name: "日本語", flag: "🇯🇵" },
    es: { name: "Español", flag: "🇪🇸" },
    fr: { name: "Français", flag: "🇫🇷" },
    de: { name: "Deutsch", flag: "🇩🇪" },
    zh: { name: "中文", flag: "🇨🇳" },
    ko: { name: "한국어", flag: "🇰🇷" },
    pt: { name: "Português", flag: "🇧🇷" },
    it: { name: "Italiano", flag: "🇮🇹" },
    ru: { name: "Русский", flag: "🇷🇺" },
    ar: { name: "العربية", flag: "🇸🇦" },
    hi: { name: "हिन्दी", flag: "🇮🇳" },
    th: { name: "ไทย", flag: "🇹🇭" },
    vi: { name: "Tiếng Việt", flag: "🇻🇳" },
    id: { name: "Bahasa Indonesia", flag: "🇮🇩" },
    ms: { name: "Bahasa Melayu", flag: "🇲🇾" },
    tr: { name: "Türkçe", flag: "🇹🇷" },
    pl: { name: "Polski", flag: "🇵🇱" },
    nl: { name: "Nederlands", flag: "🇳🇱" },
    sv: { name: "Svenska", flag: "🇸🇪" },
  };

  // Get visitor ID from localStorage or create new one
  function getVisitorId() {
    let visitorId = localStorage.getItem("lswitcher_visitor_id");
    if (!visitorId) {
      visitorId =
        "v_" +
        Date.now().toString(36) +
        "_" +
        Math.random().toString(36).substring(2, 9);
      localStorage.setItem("lswitcher_visitor_id", visitorId);
    }
    return visitorId;
  }

  // Detect page language
  function detectPageLanguage() {
    const htmlLang = document.documentElement.lang;
    if (htmlLang) {
      return htmlLang.substring(0, 2).toLowerCase();
    }
    const metaTag = document.querySelector('meta[name="language"]');
    if (metaTag) {
      return metaTag.getAttribute("content")?.substring(0, 2).toLowerCase() || "en";
    }
    return "en";
  }

  // Get API key from script tag
  function getApiKey() {
    const scripts = document.querySelectorAll("script[src]");
    for (const script of scripts) {
      const src = script.getAttribute("src") || "";
      const match = src.match(/\/widget\/([a-f0-9]+)\.js/);
      if (match) {
        return match[1];
      }
    }
    return null;
  }

  // Create widget HTML
  function createWidgetHTML(config, sourceLanguage) {
    const allowedLanguages = config.allowed_languages || Object.keys(LANGUAGES);
    const defaultTarget = config.default_target_language || "en";
    const position = config.widget_position || "bottom-right";
    const theme = config.widget_theme || "light";
    const size = config.widget_size || "medium";

    const sizeClasses = {
      small: "lsw-small",
      medium: "lsw-medium",
      large: "lsw-large",
    };

    const positionStyles = {
      "bottom-right": "bottom: 20px; right: 20px;",
      "bottom-left": "bottom: 20px; left: 20px;",
      "top-right": "top: 20px; right: 20px;",
      "top-left": "top: 20px; left: 20px;",
    };

    const sourceLangInfo = LANGUAGES[sourceLanguage] || LANGUAGES["en"];
    const targetLangInfo = LANGUAGES[defaultTarget] || LANGUAGES["en"];

    const languageOptions = allowedLanguages
      .map((langCode) => {
        const lang = LANGUAGES[langCode];
        if (!lang) return "";
        return `<button class="lsw-lang-option" data-lang="${langCode}" title="${lang.name}">
          <span class="lsw-flag">${lang.flag}</span>
          <span class="lsw-lang-name">${lang.name}</span>
        </button>`;
      })
      .join("");

    return `
      <div id="lsw-widget" class="lsw-widget ${sizeClasses[size]} lsw-theme-${theme}" style="${positionStyles[position]}">
        <div class="lsw-container">
          <button class="lsw-source-lang" title="Source: ${sourceLangInfo.name}">
            <span class="lsw-flag">${sourceLangInfo.flag}</span>
          </button>
          <div class="lsw-arrow">→</div>
          <button class="lsw-target-lang" title="Translate to: ${targetLangInfo.name}">
            <span class="lsw-flag">${targetLangInfo.flag}</span>
          </button>
        </div>
        <div class="lsw-dropdown" style="display: none;">
          <div class="lsw-dropdown-header">Select target language</div>
          <div class="lsw-lang-list">
            ${languageOptions}
          </div>
        </div>
      </div>
    `;
  }

  // Create widget styles
  function createWidgetStyles() {
    const style = document.createElement("style");
    style.textContent = `
      #lsw-widget {
        position: fixed;
        z-index: 999999;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        font-size: 14px;
        line-height: 1.5;
      }

      #lsw-widget * {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
      }

      .lsw-container {
        display: flex;
        align-items: center;
        gap: 8px;
        background: white;
        border-radius: 50px;
        padding: 8px 12px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
        cursor: pointer;
        transition: all 0.2s ease;
      }

      .lsw-container:hover {
        box-shadow: 0 6px 24px rgba(0, 0, 0, 0.2);
        transform: translateY(-2px);
      }

      .lsw-source-lang,
      .lsw-target-lang {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 36px;
        height: 36px;
        border-radius: 50%;
        border: none;
        background: #f3f4f6;
        cursor: pointer;
        transition: all 0.2s ease;
      }

      .lsw-source-lang:hover,
      .lsw-target-lang:hover {
        background: #e5e7eb;
      }

      .lsw-target-lang {
        background: #3b82f6;
      }

      .lsw-target-lang:hover {
        background: #2563eb;
      }

      .lsw-flag {
        font-size: 20px;
        line-height: 1;
      }

      .lsw-arrow {
        color: #9ca3af;
        font-size: 16px;
      }

      .lsw-dropdown {
        position: absolute;
        bottom: 100%;
        left: 50%;
        transform: translateX(-50%);
        margin-bottom: 8px;
        background: white;
        border-radius: 12px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
        min-width: 200px;
        max-height: 300px;
        overflow: hidden;
      }

      .lsw-dropdown-header {
        padding: 12px 16px;
        font-weight: 600;
        color: #374151;
        border-bottom: 1px solid #e5e7eb;
      }

      .lsw-lang-list {
        max-height: 250px;
        overflow-y: auto;
        padding: 8px;
      }

      .lsw-lang-option {
        display: flex;
        align-items: center;
        gap: 12px;
        width: 100%;
        padding: 10px 12px;
        border: none;
        background: transparent;
        cursor: pointer;
        border-radius: 8px;
        transition: all 0.15s ease;
        text-align: left;
      }

      .lsw-lang-option:hover {
        background: #f3f4f6;
      }

      .lsw-lang-option .lsw-flag {
        font-size: 24px;
      }

      .lsw-lang-option .lsw-lang-name {
        font-size: 14px;
        color: #374151;
      }

      /* Size variants */
      .lsw-small .lsw-container {
        padding: 6px 10px;
        gap: 6px;
      }
      .lsw-small .lsw-source-lang,
      .lsw-small .lsw-target-lang {
        width: 28px;
        height: 28px;
      }
      .lsw-small .lsw-flag {
        font-size: 16px;
      }
      .lsw-small .lsw-arrow {
        font-size: 12px;
      }

      .lsw-large .lsw-container {
        padding: 12px 16px;
        gap: 12px;
      }
      .lsw-large .lsw-source-lang,
      .lsw-large .lsw-target-lang {
        width: 44px;
        height: 44px;
      }
      .lsw-large .lsw-flag {
        font-size: 28px;
      }
      .lsw-large .lsw-arrow {
        font-size: 20px;
      }

      /* Dark theme */
      .lsw-theme-dark .lsw-container {
        background: #1f2937;
      }
      .lsw-theme-dark .lsw-source-lang {
        background: #374151;
      }
      .lsw-theme-dark .lsw-source-lang:hover {
        background: #4b5563;
      }
      .lsw-theme-dark .lsw-arrow {
        color: #9ca3af;
      }
      .lsw-theme-dark .lsw-dropdown {
        background: #1f2937;
      }
      .lsw-theme-dark .lsw-dropdown-header {
        color: #f9fafb;
        border-color: #374151;
      }
      .lsw-theme-dark .lsw-lang-option:hover {
        background: #374151;
      }
      .lsw-theme-dark .lsw-lang-option .lsw-lang-name {
        color: #f9fafb;
      }

      /* Translating state */
      #lsw-widget.lsw-translating .lsw-container {
        opacity: 0.7;
        pointer-events: none;
      }

      #lsw-widget.lsw-translating .lsw-target-lang::after {
        content: "";
        position: absolute;
        width: 16px;
        height: 16px;
        border: 2px solid #fff;
        border-top-color: transparent;
        border-radius: 50%;
        animation: lsw-spin 0.8s linear infinite;
      }

      @keyframes lsw-spin {
        to {
          transform: rotate(360deg);
        }
      }
    `;
    return style;
  }

  // Log translation
  async function logTranslation(siteId, sourceLang, targetLang, pageUrl) {
    try {
      await fetch(CONFIG.apiEndpoint + "/log-translation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          site_id: siteId,
          visitor_id: getVisitorId(),
          source_language: sourceLang,
          target_language: targetLang,
          page_url: pageUrl,
        }),
      });
    } catch {
      // Silently fail - don't break the widget
    }
  }

  // Translate page using Google Translate
  let translateElementCreated = false;
  let allowedLanguages = [];

  function translatePage(targetLang) {
    const widget = document.getElementById("lsw-widget");
    if (!widget) return;

    widget.classList.add("lsw-translating");

    let container = document.getElementById("lsw-translate-container");
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
      const select =
        document.querySelector("#lsw-translate-container .goog-te-combo-simple") ||
        document.querySelector(".goog-te-combo-simple");
      if (select) {
        for (let i = 0; i < select.options.length; i++) {
          if (select.options[i].value === targetLang) {
            select.value = targetLang;
            select.dispatchEvent(new Event("change", { bubbles: true }));
            break;
          }
        }
      }
      setTimeout(() => {
        widget.classList.remove("lsw-translating");
      }, 1500);
    }

    function pollForCombo(callback, maxWait) {
      const start = Date.now();
      (function check() {
        const select =
          document.querySelector("#lsw-translate-container .goog-te-combo-simple") ||
          document.querySelector(".goog-te-combo-simple");
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
      const langs = allowedLanguages.length > 0 ? allowedLanguages.join(",") : "";
      new window.google.translate.TranslateElement(
        {
          pageLanguage: detectPageLanguage(),
          includedLanguages: langs || undefined,
          layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
          autoDisplay: false,
        },
        "lsw-translate-container"
      );
      translateElementCreated = true;
      pollForCombo(applyTranslation, 5000);
    }

    if (translateElementCreated) {
      container.innerHTML = "";
      const langs = allowedLanguages.length > 0 ? allowedLanguages.join(",") : "";
      new window.google.translate.TranslateElement(
        {
          pageLanguage: detectPageLanguage(),
          includedLanguages: langs || undefined,
          layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
          autoDisplay: false,
        },
        "lsw-translate-container"
      );
      pollForCombo(applyTranslation, 5000);
      return;
    }

    // Use Google Translate element
    if (!window.google || !window.google.translate) {
      // Load Google Translate script
      const script = document.createElement("script");
      script.src =
        "//translate.google.com/translate_a/element.js?cb=lswGoogleTranslateInit";
      window.lswGoogleTranslateInit = function () {
        doInit();
      };
      document.head.appendChild(script);
    } else {
      doInit();
    }
  }

  // Initialize widget
  async function init() {
    const apiKey = getApiKey();
    if (!apiKey) {
      return;
    }

    try {
      // Fetch site configuration
      const response = await fetch(CONFIG.apiEndpoint + "/config/" + apiKey);
      if (!response.ok) {
        return;
      }

      const config = await response.json();
      const sourceLanguage = detectPageLanguage();

      allowedLanguages = config.allowed_languages || [];

      // Create container for Google Translate
      const translateContainer = document.createElement("div");
      translateContainer.id = "lsw-translate-container";
      translateContainer.style.height = "0";
      translateContainer.style.overflow = "hidden";
      translateContainer.style.position = "absolute";
      translateContainer.style.left = "-9999px";
      document.body.appendChild(translateContainer);

      // Add styles
      document.head.appendChild(createWidgetStyles());

      // Add widget HTML
      const widgetWrapper = document.createElement("div");
      widgetWrapper.innerHTML = createWidgetHTML(config, sourceLanguage);
      document.body.appendChild(widgetWrapper);

      // Add event listeners
      const widget = document.getElementById("lsw-widget");
      const container = widget.querySelector(".lsw-container");
      const dropdown = widget.querySelector(".lsw-dropdown");
      const targetLangBtn = widget.querySelector(".lsw-target-lang");
      const langOptions = widget.querySelectorAll(".lsw-lang-option");

      // Toggle dropdown
      container.addEventListener("click", (e) => {
        e.stopPropagation();
        const isVisible = dropdown.style.display !== "none";
        dropdown.style.display = isVisible ? "none" : "block";
      });

      // Close dropdown when clicking outside
      document.addEventListener("click", () => {
        dropdown.style.display = "none";
      });

      dropdown.addEventListener("click", (e) => {
        e.stopPropagation();
      });

      // Language selection
      langOptions.forEach((option) => {
        option.addEventListener("click", () => {
          const targetLang = option.dataset.lang;
          const langInfo = LANGUAGES[targetLang];

          // Update button
          targetLangBtn.querySelector(".lsw-flag").textContent = langInfo.flag;
          targetLangBtn.title = `Translate to: ${langInfo.name}`;

          // Close dropdown
          dropdown.style.display = "none";

          // Translate page
          translatePage(targetLang);

          // Log translation
          logTranslation(
            config.site_id,
            sourceLanguage,
            targetLang,
            window.location.href
          );
        });
      });
    } catch {
      // Widget failed to initialize
    }
  }

  // Initialize when DOM is ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
