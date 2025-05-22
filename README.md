
# Welcome to ScrubAI

## Project info

ScrubAI is a secure data processing application that helps users scrub sensitive information from their documents and images.

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
