"use client";

import { useEffect } from "react";

export default function CollectyForm() {
  useEffect(() => {
    const script = document.createElement("script");
    script.src =
      "https://collecty.dev/widget/f28b9501-b655-4ce9-b054-8d06071d53aa/inline.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div data-collecty-inline="f28b9501-b655-4ce9-b054-8d06071d53aa"></div>
  );
}
