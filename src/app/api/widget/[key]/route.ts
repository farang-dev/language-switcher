import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

let cachedMinified: string | null = null;

function minifyJS(code: string): string {
  let out = "";
  let inStr = false;
  let strCh = "";
  let i = 0;
  while (i < code.length) {
    const ch = code[i];
    if (inStr) {
      out += ch;
      if (ch === "\\" && i + 1 < code.length) { out += code[i + 1]; i += 2; continue; }
      if (ch === strCh) inStr = false;
      i++;
    } else if (ch === '"' || ch === "'" || ch === "`") {
      inStr = true; strCh = ch; out += ch; i++;
    } else if (ch === "/" && i + 1 < code.length && code[i + 1] === "/") {
      i++; while (i < code.length && code[i] !== "\n") i++;
    } else if (ch === "/" && i + 1 < code.length && code[i + 1] === "*") {
      i += 2; while (i + 1 < code.length && !(code[i] === "*" && code[i + 1] === "/")) i++; i += 2;
    } else if (ch === " " || ch === "\t" || ch === "\n" || ch === "\r") {
      i++;
      while (i < code.length && (code[i] === " " || code[i] === "\t" || code[i] === "\n" || code[i] === "\r")) i++;
      if (out.length > 0 && i < code.length) {
        const prev = out[out.length - 1];
        const next = code[i];
        const isWord = (c: string) => /[a-zA-Z0-9_$]/.test(c);
        if (isWord(prev) && isWord(next)) out += " ";
      }
    } else {
      out += ch; i++;
    }
  }
  return out;
}

async function getMinifiedWidgetCode(): Promise<string> {
  if (cachedMinified) return cachedMinified;

  const raw = `(function(){var C=__CONF__;${getWidgetCode()})();`;

  cachedMinified = minifyJS(raw);
  return cachedMinified;
}

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

  const { data: site, error } = await supabase
    .from("sites")
    .select("*")
    .eq("api_key", apiKey)
    .eq("is_active", true)
    .single();

  if (error || !site) {
    return new NextResponse("Not found", { status: 404 });
  }

  const { data: profile } = await supabase
    .from("user_profiles")
    .select("widget_position, widget_theme, widget_size")
    .eq("id", site.user_id)
    .single();

  const minified = await getMinifiedWidgetCode();

  const widgetJS = minified.replace(
    "__CONF__",
    `{site_id:"${site.id}",allowed_languages:${JSON.stringify(site.allowed_languages)},default_target_language:"${site.default_target_language}",widget_position:"${profile?.widget_position || "bottom-right"}",widget_theme:"${profile?.widget_theme || "light"}",widget_size:"${profile?.widget_size || "medium"}",supabaseUrl:"${process.env.NEXT_PUBLIC_SUPABASE_URL}",supabaseAnonKey:"${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}",apiEndpoint:"${process.env.NEXT_PUBLIC_APP_URL}/api/widget"}`
  );

  return new NextResponse(widgetJS, {
    headers: {
      "Content-Type": "application/javascript",
      "Cache-Control": "public, max-age=300",
      "Access-Control-Allow-Origin": "*",
    },
  });
}

function getWidgetCode(): string {
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

  var _p = new WeakSet();
  var _c = new Map();
  var _t = null;

  var _e = new Set([
    "SCRIPT", "STYLE", "CODE", "TEXTAREA", "INPUT", "NOSCRIPT",
    "SVG", "PATH", "IFRAME", "PRE", "HEAD", "TITLE", "OPTION"
  ]);

  var _w = {
    en: new Set(["the","be","to","of","and","a","in","that","have","i","it","for","not","on","with","he","as","you","do","at","this","but","his","by","from","they","we","say","her","she","or","an","will","my","one","all","would","there","their","what","so","up","out","if","about","who","get","which","go","me"]),
    ja: new Set(["\\u306E","\\u306B","\\u306F","\\u3092","\\u305F","\\u304C","\\u3067","\\u3066","\\u3068","\\u3057","\\u308C","\\u3055","\\u3042\\u308B","\\u3044\\u308B","\\u3059\\u308B","\\u304B\\u3089","\\u3053\\u3068","\\u3053\\u308C","\\u305D\\u308C","\\u3082\\u306E","\\u3067\\u3059","\\u307E\\u3059","\\u306A\\u3044","\\u3088\\u3046","\\u305F\\u3081","\\u305D\\u306E","\\u307E\\u3067","\\u306A\\u308B","\\u3068\\u3057\\u3066","\\u3044\\u3048\\u308B"]),
    es: new Set(["el","la","de","que","y","en","un","ser","se","no","haber","por","con","para","como","estar","tener","leer","todo","mas","este","hacer","o","poder","decir","otro","ir","ver","dar","saber"]),
    fr: new Set(["le","la","de","et","les","des","un","une","est","en","que","qui","dans","du","ce","il","pas","pour","sur","sont","avec","tout","mais","comme","ou","son","elle","nous","avoir","fait"]),
    de: new Set(["der","die","und","in","den","von","zu","das","mit","sich","des","auf","ist","ein","eine","es","an","auch","als","werden","dass","sie","nach","noch","wie","einem","uber","nur","oder","aber"]),
    pt: new Set(["de","que","do","da","em","um","para","e","com","nao","uma","os","no","se","na","por","mais","dos","como","mas","foi","ao","ele","das","tem","seu","sua","ou","ser","quando"]),
    ko: new Set(["\\uC774","\\uAC00","\\uC740","\\uB294","\\uC744","\\uB97C","\\uC5D0","\\uC758","\\uB3C4","\\uB85C","\\uC73C\\uB85C","\\uC640","\\uACFC","\\uD558","\\uD560","\\uD558\\uB2E4","\\uAC83","\\uADF8","\\uC800","\\uC218","\\uC788","\\uC5B4","\\uB418","\\uAC19","\\uB540\\uBB38","\\uC704\\uD574","\\uB300\\uD55C","\\uBE44\\uB824","\\uB3C4\\uB294","\\uADF8\\uB9AC\\uACE0"]),
    zh: new Set(["\\u7684","\\u4E86","\\u5728","\\u662F","\\u6211","\\u6709","\\u548C","\\u5C31","\\u4E0D","\\u4EBA","\\u90FD","\\u4E00","\\u4E0A","\\u4E5F","\\u5F88","\\u5230","\\u8BF4","\\u8981","\\u53BB","\\u4F60","\\u4F1A","\\u7740","\\u6CA1\\u6709","\\u770B","\\u597D","\\u81EA\\u5DF1","\\u8FD9"]),
    ar: new Set(["\\u0641\\u064A","\\u0645\\u0646","\\u0639\\u0644\\u0649","\\u0625\\u0644\\u0649","\\u0623\\u0646","\\u0647\\u0630\\u0627","\\u0627\\u0644\\u062A\\u064A","\\u0627\\u0644\\u0630\\u064A","\\u0647\\u0648","\\u0647\\u064A","\\u0644\\u0627","\\u0645\\u0627","\\u0639\\u0646\\u062F","\\u0628\\u0644","\\u0623\\u0648","\\u0628\\u0639\\u062F","\\u0642\\u0628\\u0644","\\u062D\\u062A\\u0649","\\u0645\\u0646\\u0630","\\u0643\\u0627\\u0646"]),
    hi: new Set(["\\u0915\\u0947","\\u092E\\u0947\\u0902","\\u0939\\u0948","\\u0915\\u0940","\\u0915\\u094B","\\u092A\\u0930","\\u0938\\u0947","\\u090F\\u0915","\\u0925\\u093E","\\u0915\\u093F","\\u092F\\u0939","\\u0914\\u0930","\\u0928\\u0947","\\u0939\\u0948\\u0902","\\u092D\\u0940","\\u0924\\u094B","\\u092F\\u093E","\\u0905\\u092A\\u0928\\u0947","\\u0907\\u0938","\\u0915\\u0930"]),
    ru: new Set(["\\u0438","\\u0432","\\u043D\\u0430","\\u043D\\u0435","\\u0447\\u0442\\u043E","\\u0441","\\u043E\\u043D","\\u043F\\u043E","\\u044D\\u0442\\u043E","\\u0438\\u0437","\\u0437\\u0430","\\u043D\\u043E","\\u0432\\u0441\\u0435","\\u043A\\u0430\\u043A","\\u0435\\u0433\\u043E","\\u043E\\u043D\\u0430","\\u0431\\u044B\\u043B","\\u043E\\u0442","\\u0434\\u043B\\u044F","\\u0442\\u044B"]),
    it: new Set(["di","che","il","la","in","un","del","per","con","non","una","sono","al","da","ha","anche","piu","come","si","nel"]),
    nl: new Set(["de","het","een","van","en","in","is","dat","op","te","zijn","voor","met","niet","aan","er","maar","om","ook","als"]),
    th: new Set(["\\u0E02\\u0E2D\\u0E07","\\u0E17\\u0E35\\u0E48","\\u0E41\\u0E25\\u0E49\\u0E27","\\u0E43\\u0E19","\\u0E40\\u0E1B\\u0E34\\u0E14","\\u0E01\\u0E32\\u0E23","\\u0E44\\u0E14\\u0E48\\u0E44\\u0E21\\u0E48","\\u0E44\\u0E21\\u0E48","\\u0E21\\u0E35","\\u0E08\\u0E30","\\u0E43\\u0E2B\\u0E49","\\u0E44\\u0E1B","\\u0E21\\u0E32","\\u0E17\\u0E33","\\u0E2B\\u0E32\\u0E14\\u0E40\\u0E25\\u0E47\\u0E01","\\u0E41\\u0E15\\u0E30","\\u0E01\\u0E31\\u0E1A","\\u0E27\\u0E48\\u0E32\\u0E07","\\u0E41\\u0E25\\u0E49\\u0E27\\u0E40\\u0E25\\u0E34\\u0E22","\\u0E2D\\u0E48\\u0E32\\u0E19"]),
    vi: new Set(["cua","la","va","nhung","khong","co","nguoi","nay","cac","toi","mot","ban","noi","lam","nhu","day","viec","nam","ngay"]),
    pl: new Set(["i","w","nie","na","do","to","jak","co","za","od","tak","ale","o","czy","tego","ten","jest","byl","po","przy"]),
    tr: new Set(["bir","ve","bu","da","de","ne","ben","sen","o","biz","siz","onlar","icin","ile","ama","daha","var","yok","gibi","sonra"]),
    sv: new Set(["och","att","det","i","en","som","ar","av","for","med","den","till","pa","har","de","inte","om","ett","var","men"])
  };

  function _v() {
    var v = localStorage.getItem("lsw_v");
    if (!v) { v = "v_" + Date.now().toString(36) + "_" + Math.random().toString(36).substring(2, 9); localStorage.setItem("lsw_v", v); }
    return v;
  }

  function _d() {
    var h = document.documentElement.lang;
    if (h) return h.substring(0, 2).toLowerCase();
    var m = document.querySelector('meta[name="language"]');
    if (m) return (m.getAttribute("content") || "en").substring(0, 2).toLowerCase();
    return "en";
  }

  function _l(t) {
    try {
      fetch(C.apiEndpoint + "/log-translation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ site_id: C.site_id, visitor_id: _v(), source_language: _d(), target_language: t, page_url: window.location.href })
      });
    } catch(e) {}
  }

  function _i(text) {
    var s = text.trim();
    if (s.length < 2) return true;
    if (/^\\d+$/.test(s)) return true;
    if (/^[0-9\\s.,!?'"\\(\\)\\[\\]:;\\-\\/\\+\\=\\*\\&\\%\\$\\#\\@\\<\\>\\?]+$/.test(s)) return true;
    if (_t === "ja") return /[\\u3040-\\u309F\\u30A0-\\u30FF\\u4E00-\\u9FFF\\u3400-\\u4DBF]/.test(s);
    if (_t === "zh") { var a = /[\\u4E00-\\u9FFF\\u3400-\\u4DBF]/.test(s); var b = /[\\u3040-\\u309F\\u30A0-\\u30FF]/.test(s); return a && !b; }
    if (_t === "ko") return /[\\uAC00-\\uD7AF\\u1100-\\u11FF]/.test(s);
    if (_t === "ar") return /[\\u0600-\\u06FF\\u0750-\\u077F]/.test(s);
    if (_t === "hi") return /[\\u0900-\\u097F]/.test(s);
    if (_t === "th") return /[\\u0E00-\\u0E7F]/.test(s);
    var w = _w[_t];
    if (w) {
      var ls = s.toLowerCase().split(/\\s+/).filter(function(x) { return x.length > 1; });
      if (ls.length >= 3) { var m = ls.filter(function(x) { return w.has(x); }).length; if (m >= Math.ceil(ls.length * 0.3)) return true; }
    }
    return false;
  }

  function _s(text) {
    var s = text.trim();
    if (s.length < 2) return false;
    if (/^\\d+$/.test(s)) return false;
    if (/^[0-9\\s.,!?'"\\(\\)\\[\\]:;\\-\\/\\+\\=\\*\\&\\%\\$\\#\\@\\<\\>\\?]+$/.test(s)) return false;
    return !_i(s);
  }

  function _walk(el, cb) {
    var w = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, {
      acceptNode: function(n) {
        var p = n.parentNode;
        if (!p) return NodeFilter.FILTER_REJECT;
        if (_e.has(p.tagName)) return NodeFilter.FILTER_REJECT;
        if (p.isContentEditable) return NodeFilter.FILTER_REJECT;
        if (p.closest && p.closest("#lsw-widget")) return NodeFilter.FILTER_REJECT;
        if (_p.has(n)) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      }
    });
    var n; while ((n = w.nextNode())) { cb(n); }
  }

  function _cache(a, b) { if (_c.size >= 5000) { var k = _c.keys().next().value; _c.delete(k); } _c.set(a, b); }

  function _fetch(texts) {
    if (texts.every(function(t) { return _c.has(t); })) return Promise.resolve(texts.map(function(t) { return _c.get(t); }));
    var j = texts.join("\\n---\\n");
    var url = "https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=" + _t + "&dt=t&q=" + encodeURIComponent(j);
    return fetch(url).then(function(r) { if (!r.ok) throw 0; return r.json(); }).then(function(d) {
      if (d && d[0]) {
        var ft = d[0].map(function(s) { return s[0] || ""; }).join("");
        if (d[2] === _t || ft.trim().toLowerCase() === j.trim().toLowerCase()) { texts.forEach(function(t) { _cache(t, t); }); return texts; }
        var p = ft.split(/[\\r\\n]+---[\\r\\n]+/);
        if (p.length === texts.length) return p.map(function(x, i) { var v = x.trim(); _cache(texts[i], v); return v; });
      }
      return texts;
    });
  }

  function _batch(nodes) {
    var bs = 50, bs2 = [];
    for (var i = 0; i < nodes.length; i += bs) bs2.push(nodes.slice(i, i + bs));
    function proc(idx) {
      if (idx >= bs2.length) return Promise.resolve();
      return Promise.all(bs2.slice(idx, idx + 6).map(function(b) {
        return _fetch(b.map(function(n) { return n.nodeValue.trim(); })).then(function(t) { return { b: b, t: t }; });
      })).then(function(rs) {
        rs.forEach(function(r) { if (!r || !r.t || r.t.length !== r.b.length) return; r.b.forEach(function(n, i) { var o = n.nodeValue, v = r.t[i]; if (v && v.toLowerCase() !== o.trim().toLowerCase()) n.nodeValue = v; }); });
        return proc(idx + 6);
      });
    }
    return proc(0);
  }

  function translatePage(lang) {
    var w = document.getElementById("lsw-widget");
    w.classList.add("lsw-translating");
    _t = lang;
    _p = new WeakSet();
    _c = new Map();
    var ns = [];
    _walk(document.body, function(n) { _p.add(n); if (_s(n.nodeValue)) ns.push(n); });
    (ns.length > 0 ? _batch(ns) : Promise.resolve()).then(function() {
      w.classList.remove("lsw-translating");
      _obs();
    });
  }

  var _oa = false;
  function _obs() {
    if (_oa) return; _oa = true;
    var dt;
    new MutationObserver(function(ms) {
      if (!_t) return;
      var h = false;
      for (var i = 0; i < ms.length; i++) { if (ms[i].addedNodes.length > 0) { for (var j = 0; j < ms[i].addedNodes.length; j++) { var n = ms[i].addedNodes[j]; if (n.nodeType === Node.ELEMENT_NODE && !_e.has(n.tagName) && !n.closest("#lsw-widget")) { h = true; break; } } } if (h) break; }
      if (h) { clearTimeout(dt); dt = setTimeout(function() { var ns = []; _walk(document.body, function(n) { _p.add(n); if (_s(n.nodeValue)) ns.push(n); }); if (ns.length > 0) _batch(ns); }, 500); }
    }).observe(document.body, { childList: true, subtree: true });
  }

  function createWidget() {
    var sl = _d(), si = LANGUAGES[sl] || LANGUAGES["en"], dt = C.default_target_language || "en", ti = LANGUAGES[dt] || LANGUAGES["en"];
    var st = document.createElement("style");
    st.textContent = "#lsw-widget{position:fixed;z-index:999999;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;font-size:14px}#lsw-widget *{box-sizing:border-box;margin:0;padding:0}.lsw-container{display:flex;align-items:center;gap:8px;background:#fff;border-radius:50px;padding:8px 12px;box-shadow:0 4px 20px rgba(0,0,0,.15);cursor:pointer;transition:all .2s}.lsw-container:hover{box-shadow:0 6px 24px rgba(0,0,0,.2);transform:translateY(-2px)}.lsw-source-lang,.lsw-target-lang{display:flex;align-items:center;justify-content:center;width:36px;height:36px;border-radius:50%;border:none;background:#f3f4f6;cursor:pointer;transition:all .2s;position:relative}.lsw-source-lang:hover,.lsw-target-lang:hover{background:#e5e7eb}.lsw-target-lang{background:#3b82f6}.lsw-target-lang:hover{background:#2563eb}.lsw-flag{font-size:20px;line-height:1}.lsw-arrow{color:#9ca3af;font-size:16px}.lsw-dropdown{position:absolute;bottom:100%;left:50%;transform:translateX(-50%);margin-bottom:8px;background:#fff;border-radius:12px;box-shadow:0 4px 20px rgba(0,0,0,.15);min-width:200px;max-height:300px;overflow:hidden;display:none}.lsw-dropdown-header{padding:12px 16px;font-weight:600;color:#374151;border-bottom:1px solid #e5e7eb}.lsw-lang-list{max-height:250px;overflow-y:auto;padding:8px}.lsw-lang-option{display:flex;align-items:center;gap:12px;width:100%;padding:10px 12px;border:none;background:0 0;cursor:pointer;border-radius:8px;transition:all .15s;text-align:left}.lsw-lang-option:hover{background:#f3f4f6}.lsw-lang-option .lsw-flag{font-size:24px}.lsw-lang-option .lsw-lang-name{font-size:14px;color:#374151}#lsw-widget.lsw-translating .lsw-container{opacity:.7;pointer-events:none}#lsw-widget.lsw-translating .lsw-target-lang::after{content:\\"\\";position:absolute;width:16px;height:16px;border:2px solid #fff;border-top-color:transparent;border-radius:50%;animation:lsw-spin .8s linear infinite}@keyframes lsw-spin{to{transform:rotate(360deg)}}" + getThemeCSS() + getSizeCSS();
    document.head.appendChild(st);
    var lo = C.allowed_languages.map(function(l) { var x = LANGUAGES[l]; if (!x) return ""; return '<button class="lsw-lang-option" data-lang="' + l + '" title="' + x.name + '"><span class="lsw-flag">' + x.flag + '</span><span class="lsw-lang-name">' + x.name + '</span></button>'; }).join("");
    var wh = '<div id="lsw-widget" class="lsw-widget lsw-theme-' + C.widget_theme + '" style="' + getPositionStyle() + '"><div class="lsw-container"><button class="lsw-source-lang" title="Source: ' + si.name + '"><span class="lsw-flag">' + si.flag + '</span></button><div class="lsw-arrow">\\u2192</div><button class="lsw-target-lang" title="Translate to: ' + ti.name + '"><span class="lsw-flag">' + ti.flag + '</span></button></div><div class="lsw-dropdown"><div class="lsw-dropdown-header">Select target language</div><div class="lsw-lang-list">' + lo + '</div></div></div>';
    var wr = document.createElement("div"); wr.innerHTML = wh; document.body.appendChild(wr);
    var w = document.getElementById("lsw-widget"), co = w.querySelector(".lsw-container"), dr = w.querySelector(".lsw-dropdown"), tb = w.querySelector(".lsw-target-lang");
    co.addEventListener("click", function(e) { e.stopPropagation(); dr.style.display = dr.style.display === "none" ? "block" : "none"; });
    document.addEventListener("click", function() { dr.style.display = "none"; });
    dr.addEventListener("click", function(e) { e.stopPropagation(); });
    w.querySelectorAll(".lsw-lang-option").forEach(function(o) { o.addEventListener("click", function() { var tl = this.dataset.lang, li = LANGUAGES[tl]; tb.querySelector(".lsw-flag").textContent = li.flag; tb.title = "Translate to: " + li.name; dr.style.display = "none"; translatePage(tl); _l(tl); }); });
  }

  function getPositionStyle() {
    var p = C.widget_position || "bottom-right";
    return { "bottom-right": "bottom:20px;right:20px", "bottom-left": "bottom:20px;left:20px", "top-right": "top:20px;right:20px", "top-left": "top:20px;left:20px" }[p] || "bottom:20px;right:20px";
  }

  function getThemeCSS() {
    if (C.widget_theme === "dark") return "#lsw-widget.lsw-theme-dark .lsw-container{background:#1f2937}#lsw-widget.lsw-theme-dark .lsw-source-lang{background:#374151}#lsw-widget.lsw-theme-dark .lsw-source-lang:hover{background:#4b5563}#lsw-widget.lsw-theme-dark .lsw-dropdown{background:#1f2937}#lsw-widget.lsw-theme-dark .lsw-dropdown-header{color:#f9fafb;border-color:#374151}#lsw-widget.lsw-theme-dark .lsw-lang-option:hover{background:#374151}#lsw-widget.lsw-theme-dark .lsw-lang-option .lsw-lang-name{color:#f9fafb}";
    return "";
  }

  function getSizeCSS() {
    var s = C.widget_size || "medium";
    if (s === "small") return "#lsw-widget.lsw-small .lsw-container{padding:6px 10px;gap:6px}#lsw-widget.lsw-small .lsw-source-lang,#lsw-widget.lsw-small .lsw-target-lang{width:28px;height:28px}#lsw-widget.lsw-small .lsw-flag{font-size:16px}#lsw-widget.lsw-small .lsw-arrow{font-size:12px}";
    if (s === "large") return "#lsw-widget.lsw-large .lsw-container{padding:12px 16px;gap:12px}#lsw-widget.lsw-large .lsw-source-lang,#lsw-widget.lsw-large .lsw-target-lang{width:44px;height:44px}#lsw-widget.lsw-large .lsw-flag{font-size:28px}#lsw-widget.lsw-large .lsw-arrow{font-size:20px}";
    return "";
  }

  if (document.readyState === "loading") { document.addEventListener("DOMContentLoaded", createWidget); } else { createWidget(); }
`;
}
