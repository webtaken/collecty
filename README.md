# Collecty

An email collection plugin built with Next.js 15, Tailwind CSS, shadcn/ui, Drizzle ORM, and Auth.js.

## Features

- **OAuth Authentication** - Sign in with Google or GitHub
- **Project Management** - Create and manage multiple email collection projects
- **Customizable Popup Widgets** - Design widgets that match your brand
- **Smart Triggers** - Show popups on delay, scroll, or exit-intent
- **Subscriber Dashboard** - View and export collected emails
- **Easy Integration** - Single script tag to embed on any website

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Auth.js v5 (NextAuth)

## Getting Started

### Prerequisites

- Node.js 22+
- PostgreSQL database
- Google and/or GitHub OAuth credentials

### Installation

1. Clone the repository:
   ```bash
   git clone <repo-url>
   cd collecty
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env.local
   ```

   Edit `.env.local` with your values:
   ```env
   # Database
   DATABASE_URL="postgresql://user:password@localhost:5432/collecty"

   # Auth.js - Generate with: openssl rand -base64 32
   AUTH_SECRET="your-auth-secret"

   # Google OAuth
   AUTH_GOOGLE_ID="your-google-client-id"
   AUTH_GOOGLE_SECRET="your-google-client-secret"

   # GitHub OAuth
   AUTH_GITHUB_ID="your-github-client-id"
   AUTH_GITHUB_SECRET="your-github-client-secret"

   # App URL
   NEXT_PUBLIC_APP_URL="http://localhost:3000"
   ```

4. Push the database schema:
   ```bash
   npm run db:push
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000)

### Database Commands

```bash
# Generate migrations from schema changes
npm run db:generate

# Apply migrations
npm run db:migrate

# Push schema directly (development)
npm run db:push

# Open Drizzle Studio
npm run db:studio
```

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── (auth)/             # Auth pages (login)
│   ├── (dashboard)/        # Dashboard pages
│   ├── api/                # API routes
│   └── widget/             # Widget script endpoint
├── components/
│   ├── ui/                 # shadcn/ui components
│   └── features/           # Feature-specific components
├── db/
│   └── schema/             # Drizzle schema definitions
├── lib/                    # Utility functions
└── actions/                # Server actions
```

## Widget Integration

To add Collecty to your website, copy the embed code from your project's dashboard and paste it before the closing `</body>` tag:

```html
<script>
  (function(w,d,s,o,f,js,fjs){
    w['CollectyWidget']=o;w[o]=w[o]||function(){(w[o].q=w[o].q||[]).push(arguments)};
    js=d.createElement(s),fjs=d.getElementsByTagName(s)[0];
    js.id=o;js.src=f;js.async=1;fjs.parentNode.insertBefore(js,fjs);
  }(window,document,'script','collecty','YOUR_APP_URL/widget/PROJECT_ID/widget.js'));
  collecty('init', 'PROJECT_ID');
</script>
```

### Manual Trigger

To show the widget programmatically:

```javascript
collecty('show');
```

To hide the widget:

```javascript
collecty('hide');
```

## API

### Subscribe Endpoint

`POST /api/v1/subscribe`

```json
{
  "email": "user@example.com",
  "projectId": "uuid",
  "metadata": {
    "userAgent": "...",
    "referrer": "...",
    "pageUrl": "..."
  }
}
```

Headers:
- `x-api-key` (optional): API key for authenticated requests

## License

MIT
