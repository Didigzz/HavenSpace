# Serverless API Functions

This directory contains serverless function implementations for the BHMS API.

## Overview

The `/apps/api` has been converted to support serverless deployment on platforms like:
- Vercel
- AWS Lambda
- Cloudflare Workers
- Netlify Functions

## Available Functions

### 1. tRPC API Handler
- **File**: `src/api/index.ts`
- **Endpoint**: `/api/trpc/*`
- **Methods**: GET, POST, PUT, DELETE, PATCH
- **Description**: Main tRPC API handler for all data operations

### 2. NextAuth Handler
- **File**: `src/api/auth.ts`
- **Endpoint**: `/api/auth/*`
- **Methods**: GET, POST
- **Description**: Authentication handler for NextAuth.js

### 3. Health Check
- **File**: `src/api/health.ts`
- **Endpoint**: `/api/health`
- **Methods**: GET
- **Description**: Health check endpoint for monitoring

## Building for Serverless

To build the serverless functions:

```bash
cd apps/api
npm run build:serverless
```

This will compile TypeScript files to JavaScript in the `dist/` directory.

## Deployment

### Vercel

The `vercel.json` configuration file is set up for Vercel deployment. Simply push to your Git repository and connect to Vercel.

### AWS Lambda

For AWS Lambda deployment:

1. Build the functions: `npm run build:serverless`
2. Package the `dist/` directory
3. Upload to AWS Lambda
4. Set up API Gateway routes

### Cloudflare Workers

For Cloudflare Workers deployment:

1. Build the functions: `npm run build:serverless`
2. Use `wrangler` to deploy
3. Configure routes in `wrangler.toml`

### Netlify Functions

For Netlify Functions deployment:

1. Build the functions: `npm run build:serverless`
2. Place the compiled files in `netlify/functions/`
3. Deploy to Netlify

## Environment Variables

The serverless functions require the same environment variables as the Next.js app:

- `DATABASE_URL` - PostgreSQL connection string
- `NEXTAUTH_SECRET` - Secret for NextAuth.js
- `NEXTAUTH_URL` - URL of your application
- Additional authentication provider credentials (OAuth, etc.)

## Local Development

To test serverless functions locally:

```bash
npm run dev
```

This will start the Next.js development server which includes the API routes.

## Next.js vs Serverless

The original Next.js API routes in `src/app/api/` are still available and can be used for Next.js deployments. The serverless functions in `src/api/` are alternatives for dedicated serverless platforms.

Both implementations use the same:
- tRPC routers (`@bhms/api`)
- Authentication system (`@bhms/auth`)
- Database client (`@bhms/database`)
- Shared types and utilities (`@bhms/shared`)