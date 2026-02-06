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
  WordPressIcon,
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
  | "vanilla"
  | "wordpress";

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
  aiPrompt: (
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
              })(window,document,'${appUrl}/widget/${projectId}/popup.js');
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
  })(window,document,'${appUrl}/widget/${projectId}/popup.js');
</script>

// Or in a component with useEffect:
import { useEffect } from 'react';

export function CollectyWidget() {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = '${appUrl}/widget/${projectId}/popup.js';
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
script.src = '${appUrl}/widget/${projectId}/popup.js';
script.async = true;
document.head.appendChild(script);

app.mount('#app');

// Or in a component:
<script setup>
import { onMounted } from 'vue';

onMounted(() => {
  const script = document.createElement('script');
  script.src = '${appUrl}/widget/${projectId}/popup.js';
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
  })(window,document,'${appUrl}/widget/${projectId}/popup.js');
</script>

// Or in a Svelte component:
<script>
  import { onMount } from 'svelte';

  onMount(() => {
    const script = document.createElement('script');
    script.src = '${appUrl}/widget/${projectId}/popup.js';
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
      })(window,document,'${appUrl}/widget/${projectId}/popup.js');
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
  })(window,document,'${appUrl}/widget/${projectId}/popup.js');
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
    script.src = '${appUrl}/widget/${projectId}/popup.js';
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
              })(window,document,'${appUrl}/widget/${projectId}/popup.js');
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
            })(window,document,'${appUrl}/widget/${projectId}/popup.js');
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
  script.src = '${appUrl}/widget/${projectId}/popup.js';
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
        })(window,document,'{{ config('app.url') }}/widget/${projectId}/popup.js');
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
  })(window,document,'${appUrl}/widget/${projectId}/popup.js');
</script>`;
  } else {
    return `<!-- Where you want the form to appear -->
<div data-collecty-inline="${projectId}"></div>
<script src="${appUrl}/widget/${projectId}/inline.js" async></script>`;
  }
};

const generateWordPressCode = (
  projectId: string,
  widgetType: WidgetType,
  appUrl: string,
): string => {
  if (widgetType === "popup") {
    return `//Collecty PopUp on WordPress
add_action('wp_footer', 'collecty_widget_loader', 999);
function collecty_widget_loader() {
?>
<script>
(function(c,o,l,e,t,y){
    c.collecty = c.collecty || function(){
        (c.collecty.q = c.collecty.q || []).push(arguments)
    };
    var s = o.createElement("script");
    s.async = 1;
    s.src = l;
    o.head.appendChild(s);
})(window, document, "${appUrl}/widget/${projectId}/popup.js");
</script>
<?php
}`;
  } else {
    return `<!-- Add a "Custom HTML" block in the Gutenberg editor -->
<div data-collecty-inline="${projectId}"></div>
<script src="${appUrl}/widget/${projectId}/inline.js" async></script>`;
  }
};

const getCommonPromptIntro = (frameworkName: string) => {
  return `Act as an expert ${frameworkName} developer. I need to install the Collecty widget in my application.
Here are the specific details for the installation:`;
};

const generateNextJsPrompt = (
  projectId: string,
  widgetType: WidgetType,
  appUrl: string,
): string => {
  const code = generateNextJsCode(projectId, widgetType, appUrl);
  return `${getCommonPromptIntro("Next.js")}

Context:
- Framework: Next.js (App Router or Pages Router)
- Widget Type: ${widgetType}
- Project ID: ${projectId}
- App URL: ${appUrl}

Task:
Please implement the following code integration. 
${
  widgetType === "popup"
    ? "For the popup widget, it needs to be added to the main layout file (typically \\`app/layout.tsx\\` or \\`app/_document.tsx\\`) using the \\`next/script\\` component for optimal performance."
    : "For the inline widget, create a reusable component that I can place anywhere in my application."
}

Here is the reference implementation code:
\`\`\`tsx
${code}
\`\`\`

Requirements:
1. Use TypeScript.
2. Ensure the script loads asynchronously.
3. ${
    widgetType === "popup"
      ? "Use the \\`afterInteractive\\` strategy for the Script component."
      : "Handle the cleanup of the script when the component unmounts."
  }`;
};

const generateReactPrompt = (
  projectId: string,
  widgetType: WidgetType,
  appUrl: string,
): string => {
  const code = generateReactCode(projectId, widgetType, appUrl);
  return `${getCommonPromptIntro("React")}

Context:
- Framework: React
- Widget Type: ${widgetType}
- Project ID: ${projectId}
- App URL: ${appUrl}

Task:
Please implement the following code integration.
${
  widgetType === "popup"
    ? "For the popup widget, I prefer a component-based approach using \\`useEffect\\` to inject the script, so I can drop it into my App root."
    : "For the inline widget, create a reusable component that utilizes \\`useEffect\\` to manage the script lifecycle."
}

Here is the reference implementation code:
\`\`\`tsx
${code}
\`\`\`

Requirements:
1. Use functional components with hooks.
2. Clean up script tags on unmount to prevent duplicates.
3. Use TypeScript interfaces where appropriate.`;
};

const generateVuePrompt = (
  projectId: string,
  widgetType: WidgetType,
  appUrl: string,
): string => {
  const code = generateVueCode(projectId, widgetType, appUrl);
  return `${getCommonPromptIntro("Vue.js")}

Context:
- Framework: Vue.js (Vue 3)
- Widget Type: ${widgetType}
- Project ID: ${projectId}
- App URL: ${appUrl}

Task:
Please implement the following code integration.
${
  widgetType === "popup"
    ? "For the popup widget, please provide a solution using the Composition API, preferably inside \\`App.vue\\` or a dedicated plugin."
    : "For the inline widget, create a reusable Vue component."
}

Here is the reference implementation code:
\`\`\`vue
${code}
\`\`\`

Requirements:
1. Use Vue 3 Composition API (<script setup>).
2. Ensure proper lifecycle management (onMounted, onUnmounted).
3. Ensure the script is loaded asynchronously.`;
};

const generateSveltePrompt = (
  projectId: string,
  widgetType: WidgetType,
  appUrl: string,
): string => {
  const code = generateSvelteCode(projectId, widgetType, appUrl);
  return `${getCommonPromptIntro("Svelte")}

Context:
- Framework: Svelte
- Widget Type: ${widgetType}
- Project ID: ${projectId}
- App URL: ${appUrl}

Task:
Please implement the following code integration.
${
  widgetType === "popup"
    ? "For the popup widget, add it to \\`app.html\\` or provide a component using \\`onMount\\`."
    : "For the inline widget, create a Svelte component."
}

Here is the reference implementation code:
\`\`\`svelte
${code}
\`\`\`

Requirements:
1. Use Svelte lifecycle functions (onMount, onDestroy).
2. Ensure the script is cleaned up properly if used in a component.`;
};

const generateAstroPrompt = (
  projectId: string,
  widgetType: WidgetType,
  appUrl: string,
): string => {
  const code = generateAstroCode(projectId, widgetType, appUrl);
  return `${getCommonPromptIntro("Astro")}

Context:
- Framework: Astro
- Widget Type: ${widgetType}
- Project ID: ${projectId}
- App URL: ${appUrl}

Task:
Please implement the following code integration.
${
  widgetType === "popup"
    ? "For the popup widget, inject it into the main Layout component (\\`src/layouts/Layout.astro\\`)."
    : "For the inline widget, create an Astro component."
}

Here is the reference implementation code:
\`\`\`astro
${code}
\`\`\`

Requirements:
1. Use strict TypeScript in the frontmatter.
2. Use \`is:inline\` for the script tag to ensure it executes correctly.`;
};

const generateAngularPrompt = (
  projectId: string,
  widgetType: WidgetType,
  appUrl: string,
): string => {
  const code = generateAngularCode(projectId, widgetType, appUrl);
  return `${getCommonPromptIntro("Angular")}

Context:
- Framework: Angular
- Widget Type: ${widgetType}
- Project ID: ${projectId}
- App URL: ${appUrl}

Task:
Please implement the following code integration.
${
  widgetType === "popup"
    ? "For the popup widget, you can either add it to \\`index.html\\` or create a service/component to inject it."
    : "For the inline widget, create a standalone Angular component."
}

Here is the reference implementation code:
\`\`\`typescript
${code}
\`\`\`

Requirements:
1. Use Angular best practices.
2. Manage resource cleanup in \`ngOnDestroy\`.
3. Use strict typing.`;
};

const generateRemixPrompt = (
  projectId: string,
  widgetType: WidgetType,
  appUrl: string,
): string => {
  const code = generateRemixCode(projectId, widgetType, appUrl);
  return `${getCommonPromptIntro("Remix")}

Context:
- Framework: Remix
- Widget Type: ${widgetType}
- Project ID: ${projectId}
- App URL: ${appUrl}

Task:
Please implement the following code integration.
${
  widgetType === "popup"
    ? "For the popup widget, add it to the root layout (\\`app/root.tsx\\`) using \\`dangerouslySetInnerHTML\\`."
    : "For the inline widget, create a React component."
}

Here is the reference implementation code:
\`\`\`tsx
${code}
\`\`\`

Requirements:
1. Ensure the script is treated as a client-side resource.
2. Follow Remix conventions for script injection.`;
};

const generateNuxtPrompt = (
  projectId: string,
  widgetType: WidgetType,
  appUrl: string,
): string => {
  const code = generateNuxtCode(projectId, widgetType, appUrl);
  return `${getCommonPromptIntro("Nuxt")}

Context:
- Framework: Nuxt 3
- Widget Type: ${widgetType}
- Project ID: ${projectId}
- App URL: ${appUrl}

Task:
Please implement the following code integration.
${
  widgetType === "popup"
    ? "For the popup widget, specify it in \\`nuxt.config.ts\\` or create a client-side plugin."
    : "For the inline widget, create a Vue component."
}

Here is the reference implementation code:
\`\`\`typescript
${code}
\`\`\`

Requirements:
1. Use Nuxt 3 conventions.
2. Ensure the script only runs on the client side.`;
};

const generateLaravelPrompt = (
  projectId: string,
  widgetType: WidgetType,
  appUrl: string,
): string => {
  const code = generateLaravelCode(projectId, widgetType, appUrl);
  return `${getCommonPromptIntro("Laravel")}

Context:
- Framework: Laravel
- Widget Type: ${widgetType}
- Project ID: ${projectId}
- App URL: ${appUrl}

Task:
Please implement the following code integration.
${
  widgetType === "popup"
    ? "For the popup widget, add it to the main Blade layout (e.g., \\`resources/views/layouts/app.blade.php\\`)."
    : "For the inline widget, add the HTML and script to the desired Blade view."
}

Here is the reference implementation code:
\`\`\`php
${code}
\`\`\`

Requirements:
1. Use Blade syntax correctly.
2. Ensure proper script placement for performance.`;
};

const generateVanillaPrompt = (
  projectId: string,
  widgetType: WidgetType,
  appUrl: string,
): string => {
  const code = generateVanillaCode(projectId, widgetType, appUrl);
  return `${getCommonPromptIntro("HTML/JavaScript")}

Context:
- Framework: Vanilla HTML/JS
- Widget Type: ${widgetType}
- Project ID: ${projectId}
- App URL: ${appUrl}

Task:
Please implement the following code integration.
${
  widgetType === "popup"
    ? "Place the script tag just before the closing </body> tag."
    : "Place the div and script tag where you want the widget to appear."
}

Here is the reference implementation code:
\`\`\`html
${code}
\`\`\`

Requirements:
1. Minimal and efficient code.
2. Ensure the script loads asynchronously.`;
};

const generateWordPressPrompt = (
  _projectId: string,
  _widgetType: WidgetType,
  _appUrl: string,
): string => {
  return "";
};

export const frameworks: Framework[] = [
  {
    id: "nextjs",
    name: "Next.js",
    icon: NextjsIcon,
    generateCode: generateNextJsCode,
    aiPrompt: generateNextJsPrompt,
    fileLocation: "app/layout.tsx or app/_document.tsx",
    description: "Next.js App Router or Pages Router",
    language: "tsx",
  },
  {
    id: "react",
    name: "React",
    icon: ReactIcon,
    generateCode: generateReactCode,
    aiPrompt: generateReactPrompt,
    fileLocation: "public/index.html or component",
    description: "Create React App or custom setup",
    language: "tsx",
  },
  {
    id: "wordpress",
    name: "WordPress",
    icon: WordPressIcon,
    generateCode: generateWordPressCode,
    aiPrompt: generateWordPressPrompt,
    fileLocation: "functions.php",
    description: "WordPress Site",
    language: "html",
  },
  {
    id: "vue",
    name: "Vue.js",
    icon: VueIcon,
    generateCode: generateVueCode,
    aiPrompt: generateVuePrompt,
    fileLocation: "main.js or component",
    description: "Vue 3 with Composition API",
    language: "javascript",
  },
  {
    id: "svelte",
    name: "Svelte",
    icon: SvelteIcon,
    generateCode: generateSvelteCode,
    aiPrompt: generateSveltePrompt,
    fileLocation: "app.html or component",
    description: "Svelte or SvelteKit",
    language: "html",
  },
  {
    id: "astro",
    name: "Astro",
    icon: AstroIcon,
    generateCode: generateAstroCode,
    aiPrompt: generateAstroPrompt,
    fileLocation: "src/layouts/Layout.astro",
    description: "Astro framework",
    language: "tsx",
  },
  {
    id: "angular",
    name: "Angular",
    icon: AngularIcon,
    generateCode: generateAngularCode,
    aiPrompt: generateAngularPrompt,
    fileLocation: "src/index.html or component",
    description: "Angular framework",
    language: "typescript",
  },
  {
    id: "remix",
    name: "Remix",
    icon: RemixIcon,
    generateCode: generateRemixCode,
    aiPrompt: generateRemixPrompt,
    fileLocation: "app/root.tsx",
    description: "Remix framework",
    language: "tsx",
  },
  {
    id: "nuxt",
    name: "Nuxt",
    icon: NuxtIcon,
    generateCode: generateNuxtCode,
    aiPrompt: generateNuxtPrompt,
    fileLocation: "nuxt.config.ts or plugin",
    description: "Nuxt 3",
    language: "javascript",
  },
  {
    id: "laravel",
    name: "Laravel",
    icon: LaravelIcon,
    generateCode: generateLaravelCode,
    aiPrompt: generateLaravelPrompt,
    fileLocation: "resources/views/layouts/app.blade.php",
    description: "Laravel Blade templates",
    language: "php",
  },
  {
    id: "vanilla",
    name: "Vanilla HTML/JS",
    icon: VanillaIcon,
    generateCode: generateVanillaCode,
    aiPrompt: generateVanillaPrompt,
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

export function generateAIPrompt(
  frameworkId: FrameworkId,
  projectId: string,
  widgetType: WidgetType,
  appUrl: string,
): string {
  const framework = getFrameworkById(frameworkId);
  if (!framework) {
    throw new Error(`Framework ${frameworkId} not found`);
  }
  return framework.aiPrompt(projectId, widgetType, appUrl);
}
