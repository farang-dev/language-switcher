/**
 * Language Switcher Widget / 言語切り替えくん
 * Vanilla JS widget for embedding on user websites
 */

(function () {
  "use strict";

  const CONFIG = {
    supabaseUrl: "__SUPABASE_URL__",
    supabaseAnonKey: "__SUPABASE_ANON_KEY__",
    apiEndpoint: "__API_ENDPOINT__",
  };

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
    af: { name: "Afrikaans", flag: "🇿🇦" },
    am: { name: "አማርኛ", flag: "🇪🇹" },
    az: { name: "Azərbaycan", flag: "🇦🇿" },
    be: { name: "Беларуская", flag: "🇧🇾" },
    bg: { name: "Български", flag: "🇧🇬" },
    bn: { name: "বাংলা", flag: "🇧🇩" },
    bs: { name: "Bosanski", flag: "🇧🇦" },
    ca: { name: "Català", flag: "🇪🇸" },
    ceb: { name: "Cebuano", flag: "🇵🇭" },
    co: { name: "Corsu", flag: "🇫🇷" },
    cs: { name: "Čeština", flag: "🇨🇿" },
    cy: { name: "Cymraeg", flag: "🏴󠁧󠁢󠁷󠁬󠁳󠁿" },
    da: { name: "Dansk", flag: "🇩🇰" },
    el: { name: "Ελληνικά", flag: "🇬🇷" },
    eo: { name: "Esperanto", flag: "🌍" },
    et: { name: "Eesti", flag: "🇪🇪" },
    eu: { name: "Euskara", flag: "🇪🇸" },
    fa: { name: "فارسی", flag: "🇮🇷" },
    fi: { name: "Suomi", flag: "🇫🇮" },
    fj: { name: "Fijian", flag: "🇫🇯" },
    fy: { name: "Frysk", flag: "🇳🇱" },
    ga: { name: "Gaeilge", flag: "🇮🇪" },
    gd: { name: "Gàidhlig", flag: "🏴󠁧󠁢󠁳󠁣󠁴󠁿" },
    gl: { name: "Galego", flag: "🇪🇸" },
    gu: { name: "ગુજરાતી", flag: "🇮🇳" },
    ha: { name: "Hausa", flag: "🇳🇬" },
    haw: { name: "ʻŌlelo Hawaiʻi", flag: "🇺🇸" },
    he: { name: "עברית", flag: "🇮🇱" },
    hmn: { name: "Hmoob", flag: "🇱🇦" },
    hr: { name: "Hrvatski", flag: "🇭🇷" },
    ht: { name: "Kreyòl Ayisyen", flag: "🇭🇹" },
    hu: { name: "Magyar", flag: "🇭🇺" },
    hy: { name: "Հայերեն", flag: "🇦🇲" },
    ig: { name: "Igbo", flag: "🇳🇬" },
    is: { name: "Íslenska", flag: "🇮🇸" },
    jw: { name: "Jawa", flag: "🇮🇩" },
    ka: { name: "ქართული", flag: "🇬🇪" },
    kk: { name: "Қазақша", flag: "🇰🇿" },
    km: { name: "ភាសាខ្មែរ", flag: "🇰🇭" },
    kn: { name: "ಕನ್ನಡ", flag: "🇮🇳" },
    ku: { name: "Kurdî", flag: "🇮🇷" },
    ky: { name: "Кыргызча", flag: "🇰🇬" },
    la: { name: "Latina", flag: "🇻🇦" },
    lb: { name: "Lëtzebuergesch", flag: "🇱🇺" },
    lo: { name: "ລາວ", flag: "🇱🇦" },
    lt: { name: "Lietuvių", flag: "🇱🇹" },
    lv: { name: "Latviešu", flag: "🇱🇻" },
    mg: { name: "Malagasy", flag: "🇲🇬" },
    mi: { name: "Māori", flag: "🇳🇿" },
    mk: { name: "Македонски", flag: "🇲🇰" },
    ml: { name: "മലയാളം", flag: "🇮🇳" },
    mn: { name: "Монгол", flag: "🇲🇳" },
    mr: { name: "मराठी", flag: "🇮🇳" },
    mt: { name: "Malti", flag: "🇲🇹" },
    my: { name: "မြန်မာ", flag: "🇲🇲" },
    ne: { name: "नेपाली", flag: "🇳🇵" },
    no: { name: "Norsk", flag: "🇳🇴" },
    ny: { name: "Chichewa", flag: "🇲🇼" },
    or: { name: "ଓଡ଼ିଆ", flag: "🇮🇳" },
    pa: { name: "ਪੰਜਾਬੀ", flag: "🇮🇳" },
    ps: { name: "پښتو", flag: "🇦🇫" },
    ro: { name: "Română", flag: "🇷🇴" },
    rw: { name: "Ikinyarwanda", flag: "🇷🇼" },
    sd: { name: "سنڌي", flag: "🇵🇰" },
    si: { name: "සිංහල", flag: "🇱🇰" },
    sk: { name: "Slovenčina", flag: "🇸🇰" },
    sl: { name: "Slovenščina", flag: "🇸🇮" },
    sm: { name: "Gagana Samoa", flag: "🇼🇸" },
    sn: { name: "Shona", flag: "🇿🇼" },
    so: { name: "Soomaali", flag: "🇸🇴" },
    sq: { name: "Shqip", flag: "🇦🇱" },
    sr: { name: "Српски", flag: "🇷🇸" },
    st: { name: "Sesotho", flag: "🇱🇸" },
    su: { name: "Sunda", flag: "🇮🇩" },
    sw: { name: "Kiswahili", flag: "🇹🇿" },
    ta: { name: "தமிழ்", flag: "🇮🇳" },
    te: { name: "తెలుగు", flag: "🇮🇳" },
    tg: { name: "Тоҷикӣ", flag: "🇹🇯" },
    tk: { name: "Türkmen", flag: "🇹🇲" },
    tl: { name: "Tagalog", flag: "🇵🇭" },
    to: { name: "Lea Faka-Tonga", flag: "🇹🇴" },
    ug: { name: "ئۇيغۇرچە", flag: "🇨🇳" },
    uk: { name: "Українська", flag: "🇺🇦" },
    ur: { name: "اردو", flag: "🇵🇰" },
    uz: { name: "Oʻzbek", flag: "🇺🇿" },
    xh: { name: "isiXhosa", flag: "🇿🇦" },
    yi: { name: "ייִדיש", flag: "🇮🇱" },
    yo: { name: "Yorùbá", flag: "🇳🇬" },
    zu: { name: "isiZulu", flag: "🇿🇦" },
  };

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

  function createWidgetHTML(config, sourceLanguage) {
    const allowedLanguages = config.allowed_languages || Object.keys(LANGUAGES);
    const defaultTarget = config.default_target_language || "en";
    const position = config.widget_position || "bottom-right";
    const theme = config.widget_theme || "light";
    const size = config.widget_size || "medium";

    const positionStyles = {
      "bottom-right": "bottom: 24px; right: 24px;",
      "bottom-left": "bottom: 24px; left: 24px;",
      "top-right": "top: 24px; right: 24px;",
      "top-left": "top: 24px; left: 24px;",
    };

    const sourceLangInfo = LANGUAGES[sourceLanguage] || LANGUAGES["en"];
    const targetLangInfo = LANGUAGES[defaultTarget] || LANGUAGES["en"];

    const languageOptions = allowedLanguages
      .map((langCode) => {
        const lang = LANGUAGES[langCode];
        if (!lang) return "";
        const selected = langCode === defaultTarget ? ` lsw-lang-selected` : "";
        return `<button class="lsw-lang-option${selected}" data-lang="${langCode}">
          <span class="lsw-flag">${lang.flag}</span>
          <span class="lsw-lang-name">${lang.name}</span>
        </button>`;
      })
      .join("");

    return `
      <div id="lsw-widget" class="lsw-theme-${theme} lsw-size-${size}" style="${positionStyles[position]}">
        <div class="lsw-container" role="button" tabindex="0" aria-label="Translate">
          <button class="lsw-source-lang" title="Source: ${sourceLangInfo.name}">
            <span class="lsw-flag">${sourceLangInfo.flag}</span>
          </button>
          <span class="lsw-arrow">→</span>
          <button class="lsw-target-lang" title="Translate to: ${targetLangInfo.name}">
            <span class="lsw-flag">${targetLangInfo.flag}</span>
          </button>
        </div>
        <div class="lsw-dropdown">
          <div class="lsw-dropdown-header">Select target language</div>
          <div class="lsw-lang-list">
            ${languageOptions}
          </div>
        </div>
      </div>
    `;
  }

  function createWidgetStyles() {
    const brandColor = "#00a67e";
    const brandLight = "#e6f7f1";

    const style = document.createElement("style");
    style.textContent = `
      #lsw-widget {
        position: fixed;
        z-index: 999999;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
        font-size: 14px;
        -webkit-font-smoothing: antialiased;
      }
      #lsw-widget * { box-sizing: border-box; margin: 0; padding: 0; }

      .lsw-container {
        display: flex;
        align-items: center;
        gap: 6px;
        background: ${brandColor};
        border-radius: 100px;
        padding: 7px 14px 7px 10px;
        box-shadow: 0 4px 16px rgba(0,166,126,0.3);
        cursor: pointer;
        transition: all 0.25s ease;
        position: relative;
      }
      .lsw-container:hover {
        box-shadow: 0 8px 28px rgba(0,166,126,0.45);
        transform: translateY(-1px);
      }
      .lsw-container:active {
        transform: scale(0.97);
      }

      .lsw-source-lang, .lsw-target-lang {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 30px;
        height: 30px;
        border-radius: 50%;
        border: none;
        background: rgba(255,255,255,0.2);
        cursor: pointer;
        transition: all 0.2s;
        position: relative;
        flex-shrink: 0;
      }
      .lsw-source-lang:hover, .lsw-target-lang:hover {
        background: rgba(255,255,255,0.3);
      }
      .lsw-target-lang { background: rgba(255,255,255,0.25); }
      .lsw-target-lang:hover { background: rgba(255,255,255,0.35); }

      .lsw-flag { font-size: 17px; line-height: 1; }
      .lsw-arrow { color: rgba(255,255,255,0.7); font-size: 14px; flex-shrink: 0; }

      .lsw-dropdown {
        position: absolute;
        bottom: calc(100% + 12px);
        left: 50%;
        transform: translateX(-50%) translateY(6px);
        min-width: 220px;
        max-height: 360px;
        background: rgba(255,255,255,0.88);
        backdrop-filter: blur(20px);
        -webkit-backdrop-filter: blur(20px);
        border: 1px solid rgba(255,255,255,0.25);
        border-radius: 16px;
        box-shadow: 0 16px 48px rgba(0,0,0,0.18);
        overflow: hidden;
        opacity: 0;
        visibility: hidden;
        transition: all 0.25s ease;
        pointer-events: none;
      }
      #lsw-widget.lsw-open .lsw-dropdown {
        opacity: 1;
        visibility: visible;
        transform: translateX(-50%) translateY(0);
        pointer-events: auto;
      }

      .lsw-dropdown-header {
        padding: 14px 16px 10px;
        font-weight: 700;
        font-size: 12px;
        text-transform: uppercase;
        letter-spacing: 0.8px;
        color: #6b7280;
        border-bottom: 1px solid rgba(0,0,0,0.06);
      }

      .lsw-lang-list {
        overflow-y: auto;
        padding: 6px;
        max-height: 280px;
        scrollbar-width: thin;
        scrollbar-color: #e5e7eb transparent;
      }
      .lsw-lang-list::-webkit-scrollbar { width: 4px; }
      .lsw-lang-list::-webkit-scrollbar-track { background: transparent; }
      .lsw-lang-list::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.12); border-radius: 10px; }

      .lsw-lang-option {
        display: flex;
        align-items: center;
        gap: 12px;
        width: 100%;
        padding: 10px 14px;
        border: none;
        background: transparent;
        cursor: pointer;
        border-radius: 10px;
        transition: all 0.15s ease;
        text-align: left;
        color: #1f2937;
      }
      .lsw-lang-option:hover {
        background: rgba(0,166,126,0.1);
      }
      .lsw-lang-option:active {
        background: rgba(0,166,126,0.18);
      }

      .lsw-lang-option .lsw-flag { font-size: 22px; line-height: 1; }
      .lsw-lang-option .lsw-lang-name {
        font-size: 14px;
        font-weight: 500;
        color: #1f2937;
      }

      .lsw-lang-selected {
        background: ${brandLight} !important;
      }
      .lsw-lang-selected .lsw-lang-name {
        color: ${brandColor};
        font-weight: 600;
      }

      /* Size variants */
      .lsw-size-small .lsw-container { padding: 5px 10px 5px 8px; gap: 4px; }
      .lsw-size-small .lsw-source-lang, .lsw-size-small .lsw-target-lang { width: 24px; height: 24px; }
      .lsw-size-small .lsw-flag { font-size: 14px; }
      .lsw-size-small .lsw-arrow { font-size: 11px; }
      .lsw-size-small .lsw-dropdown { min-width: 190px; max-height: 300px; }

      .lsw-size-large .lsw-container { padding: 10px 18px 10px 14px; gap: 8px; }
      .lsw-size-large .lsw-source-lang, .lsw-size-large .lsw-target-lang { width: 36px; height: 36px; }
      .lsw-size-large .lsw-flag { font-size: 22px; }
      .lsw-size-large .lsw-arrow { font-size: 17px; }
      .lsw-size-large .lsw-dropdown { min-width: 260px; max-height: 420px; }

      /* Dark theme */
      .lsw-theme-dark .lsw-container {
        background: #1f2937;
        box-shadow: 0 4px 16px rgba(0,0,0,0.3);
      }
      .lsw-theme-dark .lsw-container:hover {
        box-shadow: 0 8px 28px rgba(0,0,0,0.4);
      }
      .lsw-theme-dark .lsw-source-lang, .lsw-theme-dark .lsw-target-lang {
        background: rgba(255,255,255,0.1);
      }
      .lsw-theme-dark .lsw-source-lang:hover, .lsw-theme-dark .lsw-target-lang:hover {
        background: rgba(255,255,255,0.16);
      }
      .lsw-theme-dark .lsw-dropdown {
        background: rgba(31,41,55,0.92);
        border-color: rgba(255,255,255,0.1);
      }
      .lsw-theme-dark .lsw-dropdown-header {
        color: #9ca3af;
        border-color: rgba(255,255,255,0.08);
      }
      .lsw-theme-dark .lsw-lang-option { color: #f9fafb; }
      .lsw-theme-dark .lsw-lang-option .lsw-lang-name { color: #f9fafb; }
      .lsw-theme-dark .lsw-lang-option:hover { background: rgba(255,255,255,0.08); }

      /* Translating state */
      #lsw-widget.lsw-translating .lsw-container {
        pointer-events: none;
        opacity: 0.8;
      }
      #lsw-widget.lsw-translating .lsw-target-lang::after {
        content: "";
        position: absolute;
        width: 16px;
        height: 16px;
        border: 2px solid rgba(255,255,255,0.3);
        border-top-color: #fff;
        border-radius: 50%;
        animation: lsw-spin 0.7s linear infinite;
      }
      @keyframes lsw-spin { to { transform: rotate(360deg); } }

      /* Entrance animation */
      #lsw-widget {
        animation: lsw-slide-up 0.4s cubic-bezier(0.16, 1, 0.3, 1);
      }
      @keyframes lsw-slide-up {
        from { opacity: 0; transform: translateY(12px); }
        to { opacity: 1; transform: translateY(0); }
      }
    `;
    return style;
  }

  async function logTranslation(siteId, sourceLang, targetLang, pageUrl) {
    try {
      await fetch(CONFIG.apiEndpoint + "/log-translation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          site_id: siteId,
          visitor_id: getVisitorId(),
          source_language: sourceLang,
          target_language: targetLang,
          page_url: pageUrl,
        }),
      });
    } catch {}
  }

  const processedNodes = new WeakSet();
  const translationCache = new Map();
  let currentTargetLanguage = null;

  const EXCLUDED_TAGS = new Set([
    "SCRIPT", "STYLE", "CODE", "TEXTAREA", "INPUT", "NOSCRIPT",
    "SVG", "PATH", "IFRAME", "PRE", "HEAD", "TITLE", "OPTION",
  ]);

  const COMMON_WORDS = {
    en: new Set(["the","be","to","of","and","a","in","that","have","i","it","for","not","on","with","he","as","you","do","at","this","but","his","by","from","they","we","say","her","she","or","an","will","my","one","all","would","there","their","what","so","up","out","if","about","who","get","which","go","me"]),
    ja: new Set(["の","に","は","を","た","が","で","て","と","し","れ","さ","ある","いる","する","から","こと","これ","それ","もの","です","ます","ない","よう","ため","その","まで","なる","として","いえる"]),
    es: new Set(["el","la","de","que","y","en","un","ser","se","no","haber","por","con","para","como","estar","tener","leer","todo","mas","este","hacer","o","poder","decir","otro","ir","ver","dar","saber"]),
    fr: new Set(["le","la","de","et","les","des","un","une","est","en","que","qui","dans","du","ce","il","pas","pour","sur","sont","avec","tout","mais","comme","ou","son","elle","nous","avoir","fait"]),
    de: new Set(["der","die","und","in","den","von","zu","das","mit","sich","des","auf","ist","ein","eine","es","an","auch","als","werden","dass","sie","nach","noch","wie","einem","uber","nur","oder","aber"]),
    pt: new Set(["de","que","do","da","em","um","para","e","com","nao","uma","os","no","se","na","por","mais","dos","como","mas","foi","ao","ele","das","tem","seu","sua","ou","ser","quando"]),
    ko: new Set(["이","가","은","는","을","를","에","의","도","로","으로","와","과","한","할","하다","것","그","저","수","있","없","되","같","때문","위해","대한","보다","또는","그리고"]),
    zh: new Set(["的","了","在","是","我","有","和","就","不","人","都","一","上","也","很","到","说","要","去","你","会","着","没有","看","好","自己","这"]),
    ar: new Set(["في","من","على","إلى","أن","هذا","التي","الذي","هو","هي","لا","ما","كان","بل","أو","بعد","قبل","حتى","منذ","عند"]),
    hi: new Set(["के","में","है","की","को","पर","से","एक","था","कि","यह","और","ने","हैं","भी","तो","या","अपने","इस","कर"]),
    ru: new Set(["и","в","на","не","что","с","он","по","это","из","за","но","все","как","его","она","был","от","для","ты"]),
    it: new Set(["di","che","il","la","in","un","del","per","con","non","una","sono","al","da","ha","anche","piu","come","si","nel"]),
    nl: new Set(["de","het","een","van","en","in","is","dat","op","te","zijn","voor","met","niet","aan","er","maar","om","ook","als"]),
    th: new Set(["ของ","ที่","และ","ใน","เป็น","การ","ได้","ไม่","มี","จะ","ให้","ไป","มา","ทำ","ถ้า","แต่","กับ","ว่า","แล้ว","อยู่"]),
    vi: new Set(["cua","la","va","nhung","khong","co","nguoi","nay","cac","toi","mot","ban","noi","lam","nhu","day","viec","nam","ngay"]),
    pl: new Set(["i","w","nie","na","do","to","jak","co","za","od","tak","ale","o","czy","tego","ten","jest","byl","po","przy"]),
    tr: new Set(["bir","ve","bu","da","de","ne","ben","sen","o","biz","siz","onlar","icin","ile","ama","daha","var","yok","gibi","sonra"]),
    sv: new Set(["och","att","det","i","en","som","ar","av","for","med","den","till","pa","har","de","inte","om","ett","var","men"]),
  };

  function lswIsInTargetLanguage(text) {
    const trimmed = text.trim();
    if (trimmed.length < 2) return true;
    if (/^\d+$/.test(trimmed)) return true;
    if (/^[0-9\s.,!?'"()\[\]:;\-\/\+\=\*\&\%\$\#\@\<\>\?]+$/.test(trimmed)) return true;

    if (currentTargetLanguage === "ja") return /[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FFF\u3400-\u4DBF]/.test(trimmed);
    if (currentTargetLanguage === "zh") {
      const hasChinese = /[\u4E00-\u9FFF\u3400-\u4DBF]/.test(trimmed);
      const hasJapaneseOnly = /[\u3040-\u309F\u30A0-\u30FF]/.test(trimmed);
      return hasChinese && !hasJapaneseOnly;
    }
    if (currentTargetLanguage === "ko") return /[\uAC00-\uD7AF\u1100-\u11FF]/.test(trimmed);
    if (currentTargetLanguage === "ar") return /[\u0600-\u06FF\u0750-\u077F]/.test(trimmed);
    if (currentTargetLanguage === "hi") return /[\u0900-\u097F]/.test(trimmed);
    if (currentTargetLanguage === "th") return /[\u0E00-\u0E7F]/.test(trimmed);

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
          if (parent.closest && parent.closest("#lsw-widget")) return NodeFilter.FILTER_REJECT;
          if (processedNodes.has(node)) return NodeFilter.FILTER_REJECT;
          return NodeFilter.FILTER_ACCEPT;
        },
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

    const delimiter = "\n---\n";
    const joinedText = texts.join(delimiter);
    const url =
      "https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=" +
      currentTargetLanguage +
      "&dt=t&q=" +
      encodeURIComponent(joinedText);

    const response = await fetch(url);
    if (!response.ok) throw new Error("HTTP " + response.status);
    const data = await response.json();

    if (data && data[0]) {
      const fullTranslation = data[0].map(function (s) { return s[0] || ""; }).join("");
      const isSameLanguage =
        data[2] === currentTargetLanguage ||
        fullTranslation.trim().toLowerCase() === joinedText.trim().toLowerCase();

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
        if (result.status === "rejected") {
          console.error("[LanguageSwitcher] Batch translation failed:", result.reason);
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
    widget.classList.remove("lsw-open");
    currentTargetLanguage = targetLang;

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
            if (
              node.nodeType === Node.ELEMENT_NODE &&
              !EXCLUDED_TAGS.has(node.tagName) &&
              !node.closest("#lsw-widget")
            ) {
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
      subtree: true,
    });
  }

  function hexToRgba(h, a) {
    h = h.replace("#", "");
    if (h.length === 3) h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
    const r = parseInt(h.substring(0, 2), 16);
    const g = parseInt(h.substring(2, 4), 16);
    const b = parseInt(h.substring(4, 6), 16);
    return `rgba(${r},${g},${b},${a})`;
  }

  async function init() {
    const apiKey = getApiKey();
    if (!apiKey) return;

    try {
      const response = await fetch(CONFIG.apiEndpoint + "/config/" + apiKey);
      if (!response.ok) return;

      const config = await response.json();
      const sourceLanguage = detectPageLanguage();

      document.head.appendChild(createWidgetStyles());

      const widgetWrapper = document.createElement("div");
      widgetWrapper.innerHTML = createWidgetHTML(config, sourceLanguage);
      document.body.appendChild(widgetWrapper);

      const widget = document.getElementById("lsw-widget");
      const container = widget.querySelector(".lsw-container");
      const dropdown = widget.querySelector(".lsw-dropdown");
      const targetBtn = widget.querySelector(".lsw-target-lang");

      if (config.widget_bg_color) {
        const bc = config.widget_bg_color;
        container.style.background = bc;
        container.style.boxShadow = `0 4px 16px ${hexToRgba(bc, 0.3)}`;
        container.addEventListener("mouseenter", () => {
          container.style.boxShadow = `0 8px 28px ${hexToRgba(bc, 0.45)}`;
        });
        container.addEventListener("mouseleave", () => {
          container.style.boxShadow = `0 4px 16px ${hexToRgba(bc, 0.3)}`;
        });
      }
      if (config.widget_opacity !== undefined && config.widget_opacity < 1) {
        container.style.opacity = config.widget_opacity;
      }

      container.addEventListener("click", (e) => {
        e.stopPropagation();
        widget.classList.toggle("lsw-open");
      });

      document.addEventListener("click", () => {
        widget.classList.remove("lsw-open");
      });

      dropdown.addEventListener("click", (e) => {
        e.stopPropagation();
      });

      widget.querySelectorAll(".lsw-lang-option").forEach((option) => {
        option.addEventListener("click", () => {
          const targetLang = option.dataset.lang;
          const langInfo = LANGUAGES[targetLang];

          targetBtn.querySelector(".lsw-flag").textContent = langInfo.flag;
          targetBtn.title = "Translate to: " + langInfo.name;

          widget.classList.remove("lsw-open");

          translatePage(targetLang);

          logTranslation(
            config.site_id,
            sourceLanguage,
            targetLang,
            window.location.href
          );
        });
      });
    } catch {}
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
