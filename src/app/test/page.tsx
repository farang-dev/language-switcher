"use client";

import { useEffect } from "react";

export default function TestPage() {
  useEffect(() => {
    const s = document.createElement("script");
    s.src = "https://language-switcher-two.vercel.app/api/widget/01cf0e566c4b702f8bc34e79e42dc04d.js";
    s.async = true;
    document.head.appendChild(s);
  }, []);

  return (
    <div style={{ padding: 40 }}>
      <h1>Widget Test</h1>
      <p>The language switcher widget should appear in the bottom-left corner.</p>
      <p>Click the flag icons to select a target language and translate the page.</p>
      <div style={{ marginTop: 20 }}>
        <h2>Sample Content</h2>
        <p>This is some sample English text that should be translated when you select a different language from the widget.</p>
        <p>Welcome to our website. We provide the best services for our customers around the world.</p>
      </div>
    </div>
  );
}
