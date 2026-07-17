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

  // Translation engine - direct text node translation via Google Translate API
  const processedNodes = new WeakSet();
  const translationCache = new Map();
  let currentTargetLanguage = null;

  const EXCLUDED_TAGS = new Set([
    'SCRIPT', 'STYLE', 'CODE', 'TEXTAREA', 'INPUT', 'NOSCRIPT',
    'SVG', 'PATH', 'IFRAME', 'PRE', 'HEAD', 'TITLE', 'OPTION'
  ]);

  const COMMON_WORDS = {
    en: new Set(['the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have', 'i',
      'it', 'for', 'not', 'on', 'with', 'he', 'as', 'you', 'do', 'at',
      'this', 'but', 'his', 'by', 'from', 'they', 'we', 'say', 'her', 'she',
      'or', 'an', 'will', 'my', 'one', 'all', 'would', 'there', 'their', 'what',
      'so', 'up', 'out', 'if', 'about', 'who', 'get', 'which', 'go', 'me']),
    ja: new Set(['の', 'に', 'は', 'を', 'た', 'が', 'で', 'て', 'と', 'し',
      'れ', 'さ', 'ある', 'いる', 'する', 'から', 'こと', 'これ', 'それ', 'もの',
      'です', 'ます', 'ない', 'よう', 'ため', 'その', 'まで', 'なる', 'として', 'いえる']),
    es: new Set(['el', 'la', 'de', 'que', 'y', 'en', 'un', 'ser', 'se', 'no',
      'haber', 'por', 'con', 'para', 'como', 'estar', 'tener', 'leer', 'todo', 'mas',
      'este', 'hacer', 'o', 'poder', 'decir', 'otro', 'ir', 'ver', 'dar', 'saber']),
    fr: new Set(['le', 'la', 'de', 'et', 'les', 'des', 'un', 'une', 'est', 'en',
      'que', 'qui', 'dans', 'du', 'ce', 'il', 'pas', 'pour', 'sur', 'sont',
      'avec', 'tout', 'mais', 'comme', 'ou', 'son', 'elle', 'nous', 'avoir', 'fait']),
    de: new Set(['der', 'die', 'und', 'in', 'den', 'von', 'zu', 'das', 'mit', 'sich',
      'des', 'auf', 'ist', 'ein', 'eine', 'es', 'an', 'auch', 'als', 'werden',
      'dass', 'sie', 'nach', 'noch', 'wie', 'einem', 'uber', 'nur', 'oder', 'aber']),
    pt: new Set(['de', 'que', 'do', 'da', 'em', 'um', 'para', 'e', 'com', 'nao',
      'uma', 'os', 'no', 'se', 'na', 'por', 'mais', 'dos', 'como', 'mas',
      'foi', 'ao', 'ele', 'das', 'tem', 'seu', 'sua', 'ou', 'ser', 'quando']),
    ko: new Set(['이', '가', '은', '는', '을', '를', '에', '의', '도', '로',
      '으로', '와', '과', '한', '할', '하다', '것', '그', '저', '수',
      '있', '없', '되', '같', '때문', '위해', '대한', '보다', '또는', '그리고']),
    zh: new Set(['的', '了', '在', '是', '我', '有', '和', '就', '不', '人',
      '都', '一', '上', '也', '很', '到', '说', '要', '去',
      '你', '会', '着', '没有', '看', '好', '自己', '这']),
    ar: new Set(['في', 'من', 'على', 'إلى', 'أن', 'هذا', 'التي', 'الذي', 'هو', 'هي',
      'لا', 'ما', 'كان', 'بل', 'أو', 'بعد', 'قبل', 'حتى', 'منذ', 'عند']),
    hi: new Set(['के', 'में', 'है', 'की', 'को', 'पर', 'से', 'एक', 'था', 'कि',
      'यह', 'और', 'ने', 'हैं', 'भी', 'तो', 'या', 'अपने', 'इस', 'कर']),
    ru: new Set(['и', 'в', 'на', 'не', 'что', 'с', 'он', 'по', 'это', 'из',
      'за', 'но', 'все', 'как', 'его', 'она', 'был', 'от', 'для', 'ты']),
    it: new Set(['di', 'che', 'il', 'la', 'in', 'un', 'del', 'per', 'con', 'non',
      'una', 'sono', 'al', 'da', 'ha', 'anche', 'piu', 'come', 'si', 'nel']),
    nl: new Set(['de', 'het', 'een', 'van', 'en', 'in', 'is', 'dat', 'op', 'te',
      'zijn', 'voor', 'met', 'niet', 'aan', 'er', 'maar', 'om', 'ook', 'als']),
    th: new Set(['ของ', 'ที่', 'และ', 'ใน', 'เป็น', 'การ', 'ได้', 'ไม่', 'มี', 'จะ',
      'ให้', 'ไป', 'มา', 'ทำ', 'ถ้า', 'แต่', 'กับ', 'ว่า', 'แล้ว', 'อยู่']),
    vi: new Set(['cua', 'la', 'va', 'nhung', 'khong', 'co', 'nguoi', 'nay', 'cac', 'toi',
      'mot', 'ban', 'noi', 'lam', 'nhu', 'day', 'viec', 'nam', 'ngay']),
    pl: new Set(['i', 'w', 'nie', 'na', 'do', 'to', 'jak', 'co', 'za', 'od',
      'tak', 'ale', 'o', 'czy', 'tego', 'ten', 'jest', 'byl', 'po', 'przy']),
    tr: new Set(['bir', 've', 'bu', 'da', 'de', 'ne', 'ben', 'sen', 'o', 'biz',
      'siz', 'onlar', 'icin', 'ile', 'ama', 'daha', 'var', 'yok', 'gibi', 'sonra']),
    sv: new Set(['och', 'att', 'det', 'i', 'en', 'som', 'ar', 'av', 'for', 'med',
      'den', 'till', 'pa', 'har', 'de', 'inte', 'om', 'ett', 'var', 'men']),
  };

  function lswIsInTargetLanguage(text) {
    const trimmed = text.trim();
    if (trimmed.length < 2) return true;
    if (/^\d+$/.test(trimmed)) return true;
    if (/^[0-9\s.,!?'"()\[\]:;\-\/\+\=\*\&\%\$\#\@\<\>\?]+$/.test(trimmed)) return true;

    if (currentTargetLanguage === 'ja') {
      return /[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FFF\u3400-\u4DBF]/.test(trimmed);
    }
    if (currentTargetLanguage === 'zh') {
      const hasChinese = /[\u4E00-\u9FFF\u3400-\u4DBF]/.test(trimmed);
      const hasJapaneseOnly = /[\u3040-\u309F\u30A0-\u30FF]/.test(trimmed);
      return hasChinese && !hasJapaneseOnly;
    }
    if (currentTargetLanguage === 'ko') {
      return /[\uAC00-\uD7AF\u1100-\u11FF]/.test(trimmed);
    }
    if (currentTargetLanguage === 'ar') {
      return /[\u0600-\u06FF\u0750-\u077F]/.test(trimmed);
    }
    if (currentTargetLanguage === 'hi') {
      return /[\u0900-\u097F]/.test(trimmed);
    }
    if (currentTargetLanguage === 'th') {
      return /[\u0E00-\u0E7F]/.test(trimmed);
    }

    const words = COMMON_WORDS[currentTargetLanguage];
    if (words) {
      const lowerWords = trimmed.toLowerCase().split(/\s+/).filter(function (w) { return w.length > 1; });
      if (lowerWords.length >= 3) {
        const matchCount = lowerWords.filter(function (w) { return words.has(w); }).length;
        if (matchCount >= Math.ceil(lowerWords.length * 0.3)) return true;
      }
    }

    return false;
  }

  function lswShouldTranslate(text) {
    const trimmed = text.trim();
    if (trimmed.length < 2) return false;
    if (/^\d+$/.test(trimmed)) return false;
    if (/^[0-9\s.,!?'"()\[\]:;\-\/\+\=\*\&\%\$\#\@\<\>\?]+$/.test(trimmed)) return false;
    return !lswIsInTargetLanguage(trimmed);
  }

  function lswWalkTextNodes(element, callback) {
    const walker = document.createTreeWalker(
      element,
      NodeFilter.SHOW_TEXT,
      {
        acceptNode: function (node) {
          const parent = node.parentNode;
          if (!parent) return NodeFilter.FILTER_REJECT;
          if (EXCLUDED_TAGS.has(parent.tagName)) return NodeFilter.FILTER_REJECT;
          if (parent.isContentEditable) return NodeFilter.FILTER_REJECT;
          if (parent.closest && parent.closest('#lsw-widget')) return NodeFilter.FILTER_REJECT;
          if (processedNodes.has(node)) return NodeFilter.FILTER_REJECT;
          return NodeFilter.FILTER_ACCEPT;
        }
      }
    );

    let node;
    while ((node = walker.nextNode())) {
      callback(node);
    }
  }

  function lswCacheTranslation(text, translation) {
    if (translationCache.size >= 5000) {
      const firstKey = translationCache.keys().next().value;
      translationCache.delete(firstKey);
    }
    translationCache.set(text, translation);
  }

  async function lswTranslateBatchDirect(texts) {
    const allCached = texts.every(function (t) { return translationCache.has(t); });
    if (allCached) {
      return texts.map(function (t) { return translationCache.get(t); });
    }

    const delimiter = '\n---\n';
    const joinedText = texts.join(delimiter);
    const url = 'https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=' + currentTargetLanguage + '&dt=t&q=' + encodeURIComponent(joinedText);

    const response = await fetch(url);
    if (!response.ok) throw new Error('HTTP ' + response.status);
    const data = await response.json();

    if (data && data[0]) {
      const fullTranslation = data[0].map(function (s) { return s[0] || ''; }).join('');
      const isSameLanguage = data[2] === currentTargetLanguage || fullTranslation.trim().toLowerCase() === joinedText.trim().toLowerCase();

      if (isSameLanguage) {
        texts.forEach(function (t) { lswCacheTranslation(t, t); });
        return texts;
      }

      const parts = fullTranslation.split(/[\r\n]+---[\r\n]+/);
      if (parts.length === texts.length) {
        return parts.map(function (p, i) {
          const val = p.trim();
          lswCacheTranslation(texts[i], val);
          return val;
        });
      }
    }

    return texts;
  }

  async function lswBatchTranslateNodes(nodes) {
    const batchSize = 50;
    const batches = [];
    for (let i = 0; i < nodes.length; i += batchSize) {
      batches.push(nodes.slice(i, i + batchSize));
    }

    const concurrencyLimit = 6;

    for (let i = 0; i < batches.length; i += concurrencyLimit) {
      const slice = batches.slice(i, i + concurrencyLimit);
      const results = await Promise.allSettled(
        slice.map(async function (batch) {
          const texts = batch.map(function (n) { return n.nodeValue.trim(); });
          const translations = await lswTranslateBatchDirect(texts);
          return { batch: batch, translations: translations };
        })
      );

      for (const result of results) {
        if (result.status === 'rejected') {
          console.error('[LanguageSwitcher] Batch translation failed:', result.reason);
          continue;
        }

        const { batch, translations } = result.value;
        if (!translations || translations.length !== batch.length) continue;

        batch.forEach(function (node, idx) {
          const originalVal = node.nodeValue;
          const newVal = translations[idx];
          if (newVal && newVal.toLowerCase() !== originalVal.trim().toLowerCase()) {
            node.nodeValue = newVal;
          }
        });
      }
    }
  }

  async function translatePage(targetLang) {
    const widget = document.getElementById("lsw-widget");
    if (!widget) return;

    widget.classList.add("lsw-translating");
    currentTargetLanguage = targetLang;

    // Reset state for new language
    processedNodes.clear();
    translationCache.clear();

    const nodesToTranslate = [];
    lswWalkTextNodes(document.body, function (node) {
      processedNodes.add(node);
      if (lswShouldTranslate(node.nodeValue)) {
        nodesToTranslate.push(node);
      }
    });

    if (nodesToTranslate.length > 0) {
      await lswBatchTranslateNodes(nodesToTranslate);
    }

    widget.classList.remove("lsw-translating");

    // Watch for dynamically added content
    lswSetupMutationObserver();
  }

  function lswSetupMutationObserver() {
    let debounceTimeout;
    const observer = new MutationObserver(function (mutations) {
      if (!currentTargetLanguage) return;

      let hasAddedNodes = false;
      for (const mutation of mutations) {
        if (mutation.addedNodes.length > 0) {
          for (const node of mutation.addedNodes) {
            if (node.nodeType === Node.ELEMENT_NODE && !EXCLUDED_TAGS.has(node.tagName) && !node.closest('#lsw-widget')) {
              hasAddedNodes = true;
              break;
            }
          }
        }
        if (hasAddedNodes) break;
      }

      if (hasAddedNodes) {
        clearTimeout(debounceTimeout);
        debounceTimeout = setTimeout(function () {
          const nodesToTranslate = [];
          lswWalkTextNodes(document.body, function (node) {
            processedNodes.add(node);
            if (lswShouldTranslate(node.nodeValue)) {
              nodesToTranslate.push(node);
            }
          });
          if (nodesToTranslate.length > 0) {
            lswBatchTranslateNodes(nodesToTranslate);
          }
        }, 500);
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
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
