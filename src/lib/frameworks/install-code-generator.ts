import type { ComponentType } from "react";
import {
  NextjsIcon,
  ReactIcon,
  VueIcon,
  SvelteIcon,
  AstroIcon,
  AngularIcon,
  RemixIcon,
  NuxtIcon,
  LaravelIcon,
  VanillaIcon,
} from "@/components/icons/frameworks";

export type FrameworkId =
  | "nextjs"
  | "react"
  | "vue"
  | "svelte"
  | "astro"
  | "angular"
  | "remix"
  | "nuxt"
  | "laravel"
  | "vanilla";

export type WidgetType = "popup" | "inline";

export type Framework = {
  id: FrameworkId;
  name: string;
  icon: ComponentType<{ className?: string }>;
  generateCode: (
    projectId: string,
    widgetType: WidgetType,
    appUrl: string,
  ) => string;
  fileLocation: string;
  description: string;
  language: string;
};

const generateNextJsCode = (
  projectId: string,
  widgetType: WidgetType,
  appUrl: string,
): string => {
  if (widgetType === "popup") {
    return `// app/layout.tsx or app/_document.tsx
import Script from 'next/script';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
        <Script
          id="collecty-widget"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: \`
              (function(c,o,l,e,t,y){
                c.collecty=c.collecty||function(){(c.collecty.q=c.collecty.q||[]).push(arguments)};
                var s=o.createElement('script');s.async=1;s.src=l;
                o.head.appendChild(s);
              })(window,document,'${appUrl}/widget/${projectId}/widget.js');
            \`,
          }}
        />
      </body>
    </html>
  );
}`;
  } else {
    return `// In your component where you want the inline form
'use client';

import { useEffect } from 'react';

export default function CollectyForm() {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = '${appUrl}/widget/${projectId}/inline.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return <div data-collecty-inline="${projectId}"></div>;
}`;
  }
};

const generateReactCode = (
  projectId: string,
  widgetType: WidgetType,
  appUrl: string,
): string => {
  if (widgetType === "popup") {
    return `// public/index.html (before closing </body> tag)
<script>
  (function(c,o,l,e,t,y){
    c.collecty=c.collecty||function(){(c.collecty.q=c.collecty.q||[]).push(arguments)};
    var s=o.createElement('script');s.async=1;s.src=l;
    o.head.appendChild(s);
  })(window,document,'${appUrl}/widget/${projectId}/widget.js');
</script>

// Or in a component with useEffect:
import { useEffect } from 'react';

export function CollectyWidget() {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = '${appUrl}/widget/${projectId}/widget.js';
    script.async = true;
    document.head.appendChild(script);
  }, []);

  return null;
}`;
  } else {
    return `// In your component
import { useEffect } from 'react';

export function CollectyForm() {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = '${appUrl}/widget/${projectId}/inline.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return <div data-collecty-inline="${projectId}"></div>;
}`;
  }
};

const generateVueCode = (
  projectId: string,
  widgetType: WidgetType,
  appUrl: string,
): string => {
  if (widgetType === "popup") {
    return `// main.js or App.vue
import { createApp } from 'vue';
import App from './App.vue';

const app = createApp(App);

// Add script to head
const script = document.createElement('script');
script.src = '${appUrl}/widget/${projectId}/widget.js';
script.async = true;
document.head.appendChild(script);

app.mount('#app');

// Or in a component:
<script setup>
import { onMounted } from 'vue';

onMounted(() => {
  const script = document.createElement('script');
  script.src = '${appUrl}/widget/${projectId}/widget.js';
  script.async = true;
  document.head.appendChild(script);
});
</script>`;
  } else {
    return `// In your Vue component
<template>
  <div data-collecty-inline="${projectId}"></div>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue';

let script = null;

onMounted(() => {
  script = document.createElement('script');
  script.src = '${appUrl}/widget/${projectId}/inline.js';
  script.async = true;
  document.body.appendChild(script);
});

onUnmounted(() => {
  if (script && document.body.contains(script)) {
    document.body.removeChild(script);
  }
});
</script>`;
  }
};

const generateSvelteCode = (
  projectId: string,
  widgetType: WidgetType,
  appUrl: string,
): string => {
  if (widgetType === "popup") {
    return `// app.html (before closing </body> tag)
<script>
  (function(c,o,l,e,t,y){
    c.collecty=c.collecty||function(){(c.collecty.q=c.collecty.q||[]).push(arguments)};
    var s=o.createElement('script');s.async=1;s.src=l;
    o.head.appendChild(s);
  })(window,document,'${appUrl}/widget/${projectId}/widget.js');
</script>

// Or in a Svelte component:
<script>
  import { onMount } from 'svelte';

  onMount(() => {
    const script = document.createElement('script');
    script.src = '${appUrl}/widget/${projectId}/widget.js';
    script.async = true;
    document.head.appendChild(script);
  });
</script>`;
  } else {
    return `// In your Svelte component
<script>
  import { onMount, onDestroy } from 'svelte';

  let script = null;

  onMount(() => {
    script = document.createElement('script');
    script.src = '${appUrl}/widget/${projectId}/inline.js';
    script.async = true;
    document.body.appendChild(script);
  });

  onDestroy(() => {
    if (script && document.body.contains(script)) {
      document.body.removeChild(script);
    }
  });
</script>

<div data-collecty-inline="${projectId}"></div>`;
  }
};

const generateAstroCode = (
  projectId: string,
  widgetType: WidgetType,
  appUrl: string,
): string => {
  if (widgetType === "popup") {
    return `// src/layouts/Layout.astro
---
// Layout component
---

<html>
  <head>
    <title>My Astro Site</title>
  </head>
  <body>
    <slot />
    <script is:inline>
      (function(c,o,l,e,t,y){
        c.collecty=c.collecty||function(){(c.collecty.q=c.collecty.q||[]).push(arguments)};
        var s=o.createElement('script');s.async=1;s.src=l;
        o.head.appendChild(s);
      })(window,document,'${appUrl}/widget/${projectId}/widget.js');
    </script>
  </body>
</html>`;
  } else {
    return `// In your Astro component
---
// Component script
---

<div data-collecty-inline="${projectId}"></div>
<script is:inline src="${appUrl}/widget/${projectId}/inline.js" async></script>`;
  }
};

const generateAngularCode = (
  projectId: string,
  widgetType: WidgetType,
  appUrl: string,
): string => {
  if (widgetType === "popup") {
    return `// src/index.html (before closing </body> tag)
<script>
  (function(c,o,l,e,t,y){
    c.collecty=c.collecty||function(){(c.collecty.q=c.collecty.q||[]).push(arguments)};
    var s=o.createElement('script');s.async=1;s.src=l;
    o.head.appendChild(s);
  })(window,document,'${appUrl}/widget/${projectId}/widget.js');
</script>

// Or in a component:
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-collecty',
  template: ''
})
export class CollectyComponent implements OnInit {
  ngOnInit() {
    const script = document.createElement('script');
    script.src = '${appUrl}/widget/${projectId}/widget.js';
    script.async = true;
    document.head.appendChild(script);
  }
}`;
  } else {
    return `// In your Angular component
import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-collecty-form',
  template: '<div [attr.data-collecty-inline]="projectId"></div>'
})
export class CollectyFormComponent implements OnInit, OnDestroy {
  projectId = '${projectId}';
  private script: HTMLScriptElement | null = null;

  ngOnInit() {
    this.script = document.createElement('script');
    this.script.src = '${appUrl}/widget/${projectId}/inline.js';
    this.script.async = true;
    document.body.appendChild(this.script);
  }

  ngOnDestroy() {
    if (this.script && document.body.contains(this.script)) {
      document.body.removeChild(this.script);
    }
  }
}`;
  }
};

const generateRemixCode = (
  projectId: string,
  widgetType: WidgetType,
  appUrl: string,
): string => {
  if (widgetType === "popup") {
    return `// app/root.tsx
import type { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
  return [{ title: "My Remix App" }];
};

export default function App() {
  return (
    <html>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>
        <Outlet />
        <script
          dangerouslySetInnerHTML={{
            __html: \`
              (function(c,o,l,e,t,y){
                c.collecty=c.collecty||function(){(c.collecty.q=c.collecty.q||[]).push(arguments)};
                var s=o.createElement('script');s.async=1;s.src=l;
                o.head.appendChild(s);
              })(window,document,'${appUrl}/widget/${projectId}/widget.js');
            \`,
          }}
        />
      </body>
    </html>
  );
}`;
  } else {
    return `// In your Remix component
export default function CollectyForm() {
  return (
    <>
      <div data-collecty-inline="${projectId}"></div>
      <script
        src="${appUrl}/widget/${projectId}/inline.js"
        async
      />
    </>
  );
}`;
  }
};

const generateNuxtCode = (
  projectId: string,
  widgetType: WidgetType,
  appUrl: string,
): string => {
  if (widgetType === "popup") {
    return `// nuxt.config.ts
export default defineNuxtConfig({
  app: {
    head: {
      scripts: [
        {
          innerHTML: \`
            (function(c,o,l,e,t,y){
              c.collecty=c.collecty||function(){(c.collecty.q=c.collecty.q||[]).push(arguments)};
              var s=o.createElement('script');s.async=1;s.src=l;
              o.head.appendChild(s);
            })(window,document,'${appUrl}/widget/${projectId}/widget.js');
          \`,
          type: 'text/javascript'
        }
      ]
    }
  }
})

// Or in a plugin: plugins/collecty.client.ts
export default defineNuxtPlugin(() => {
  const script = document.createElement('script');
  script.src = '${appUrl}/widget/${projectId}/widget.js';
  script.async = true;
  document.head.appendChild(script);
});`;
  } else {
    return `// In your Nuxt component
<template>
  <div data-collecty-inline="${projectId}"></div>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue';

let script = null;

onMounted(() => {
  script = document.createElement('script');
  script.src = '${appUrl}/widget/${projectId}/inline.js';
  script.async = true;
  document.body.appendChild(script);
});

onUnmounted(() => {
  if (script && document.body.contains(script)) {
    document.body.removeChild(script);
  }
});
</script>`;
  }
};

const generateLaravelCode = (
  projectId: string,
  widgetType: WidgetType,
  appUrl: string,
): string => {
  if (widgetType === "popup") {
    return `// resources/views/layouts/app.blade.php
<!DOCTYPE html>
<html>
<head>
    <title>{{ config('app.name', 'Laravel') }}</title>
</head>
<body>
    @yield('content')
    
    <!-- Collecty Widget -->
    <script>
        (function(c,o,l,e,t,y){
            c.collecty=c.collecty||function(){(c.collecty.q=c.collecty.q||[]).push(arguments)};
            var s=o.createElement('script');s.async=1;s.src=l;
            o.head.appendChild(s);
        })(window,document,'{{ config('app.url') }}/widget/${projectId}/widget.js');
    </script>
</body>
</html>`;
  } else {
    return `// In your Blade template
<div data-collecty-inline="${projectId}"></div>
<script src="{{ config('app.url') }}/widget/${projectId}/inline.js" async></script>

// Or using Laravel's asset helper:
<div data-collecty-inline="${projectId}"></div>
<script src="${appUrl}/widget/${projectId}/inline.js" async></script>`;
  }
};

const generateVanillaCode = (
  projectId: string,
  widgetType: WidgetType,
  appUrl: string,
): string => {
  if (widgetType === "popup") {
    return `<!-- Before closing </body> tag -->
<script>
  (function(c,o,l,e,t,y){
    c.collecty=c.collecty||function(){(c.collecty.q=c.collecty.q||[]).push(arguments)};
    var s=o.createElement('script');s.async=1;s.src=l;
    o.head.appendChild(s);
  })(window,document,'${appUrl}/widget/${projectId}/widget.js');
</script>`;
  } else {
    return `<!-- Where you want the form to appear -->
<div data-collecty-inline="${projectId}"></div>
<script src="${appUrl}/widget/${projectId}/inline.js" async></script>`;
  }
};

export const frameworks: Framework[] = [
  {
    id: "nextjs",
    name: "Next.js",
    icon: NextjsIcon,
    generateCode: generateNextJsCode,
    fileLocation: "app/layout.tsx or app/_document.tsx",
    description: "Next.js App Router or Pages Router",
    language: "tsx",
  },
  {
    id: "react",
    name: "React",
    icon: ReactIcon,
    generateCode: generateReactCode,
    fileLocation: "public/index.html or component",
    description: "Create React App or custom setup",
    language: "tsx",
  },
  {
    id: "vue",
    name: "Vue.js",
    icon: VueIcon,
    generateCode: generateVueCode,
    fileLocation: "main.js or component",
    description: "Vue 3 with Composition API",
    language: "javascript",
  },
  {
    id: "svelte",
    name: "Svelte",
    icon: SvelteIcon,
    generateCode: generateSvelteCode,
    fileLocation: "app.html or component",
    description: "Svelte or SvelteKit",
    language: "html",
  },
  {
    id: "astro",
    name: "Astro",
    icon: AstroIcon,
    generateCode: generateAstroCode,
    fileLocation: "src/layouts/Layout.astro",
    description: "Astro framework",
    language: "tsx",
  },
  {
    id: "angular",
    name: "Angular",
    icon: AngularIcon,
    generateCode: generateAngularCode,
    fileLocation: "src/index.html or component",
    description: "Angular framework",
    language: "typescript",
  },
  {
    id: "remix",
    name: "Remix",
    icon: RemixIcon,
    generateCode: generateRemixCode,
    fileLocation: "app/root.tsx",
    description: "Remix framework",
    language: "tsx",
  },
  {
    id: "nuxt",
    name: "Nuxt",
    icon: NuxtIcon,
    generateCode: generateNuxtCode,
    fileLocation: "nuxt.config.ts or plugin",
    description: "Nuxt 3",
    language: "javascript",
  },
  {
    id: "laravel",
    name: "Laravel",
    icon: LaravelIcon,
    generateCode: generateLaravelCode,
    fileLocation: "resources/views/layouts/app.blade.php",
    description: "Laravel Blade templates",
    language: "php",
  },
  {
    id: "vanilla",
    name: "Vanilla HTML/JS",
    icon: VanillaIcon,
    generateCode: generateVanillaCode,
    fileLocation: "HTML file",
    description: "Plain HTML, JavaScript, or any other framework",
    language: "html",
  },
];

export function getFrameworkById(id: FrameworkId): Framework | undefined {
  return frameworks.find((f) => f.id === id);
}

export function generateInstallCode(
  frameworkId: FrameworkId,
  projectId: string,
  widgetType: WidgetType,
  appUrl: string,
): string {
  const framework = getFrameworkById(frameworkId);
  if (!framework) {
    throw new Error(`Framework ${frameworkId} not found`);
  }
  return framework.generateCode(projectId, widgetType, appUrl);
}
