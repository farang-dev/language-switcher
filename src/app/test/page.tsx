"use client";

import { useEffect } from "react";

export default function TestPage() {
  useEffect(() => {
    const s = document.createElement("script");
    s.src = "/api/widget/4d61d18213ba1ae241c1512e7e91f97e.js";
    s.async = true;
    document.head.appendChild(s);
  }, []);

  return (
    <div style={{ padding: 40 }}>
      <h1>Widget Test</h1>
      <p>右下にウィジェットが表示されるはず</p>
    </div>
  );
}
