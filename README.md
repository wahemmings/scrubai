
# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/624eb621-7c88-467f-81ad-71c9fcebbdc6

## Environment Variables

This project uses environment variables for configuration. You need to set the following variables:

| Variable | Description | Location |
|----------|-------------|----------|
| `VITE_SUPABASE_URL` | Supabase project URL | Client-side |
| `VITE_SUPABASE_ANON_KEY` | Supabase anonymous key | Client-side |
| `VITE_CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name | Client-side |
| `CLOUDINARY_API_KEY` | Cloudinary API key | Server-side only |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret | Server-side only |
| `OPENAI_API_KEY` | OpenAI API key | Server-side only |
| `SUPABASE_URL` | Supabase URL (for edge functions) | Server-side only |
| `SUPABASE_ANON_KEY` | Supabase anon key (for edge functions) | Server-side only |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key | Server-side only |

For local development, create a `.env` file based on `.env.example` and add your values.

## Local Development

Follow these steps to set up your local development environment:

1. Clone the repository
   ```sh
   git clone <YOUR_GIT_URL>
   cd <YOUR_PROJECT_NAME>
   ```

2. Install dependencies
   ```sh
   npm i
   ```

3. Create a `.env` file based on `.env.example` and add your environment variables
   ```sh
   cp .env.example .env
   ```

4. Start the development server
   ```sh
   npm run dev
   ```

## Supabase Edge Functions

This project uses Supabase Edge Functions for secure operations like:
- Generating signed Cloudinary upload URLs
- Purging old files automatically
- Processing sensitive data server-side

To test edge functions locally, install Supabase CLI and run:
```sh
supabase start
supabase functions serve
```

## Cloudinary Setup

1. Create a Cloudinary account if you don't have one
2. Create an unsigned upload preset named `scrubai_secure` with:
   - Signing Mode: Signed
   - Folder: `scrubai`
   - Access Mode: Authenticated
   - Allowed Formats: pdf,docx,txt,png,jpg,webp
3. Set up your environment variables as described above

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/624eb621-7c88-467f-81ad-71c9fcebbdc6) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS
- Supabase (authentication, database)
- Cloudinary (secure file storage)

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/624eb621-7c88-467f-81ad-71c9fcebbdc6) and click on Share -> Publish.

For production deployments, make sure to set all environment variables in your hosting platform's settings.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)

