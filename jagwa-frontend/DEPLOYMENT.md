# Deployment Guide

This guide covers various deployment options for JAGWA.

## Static Hosting (Recommended)

Since JAGWA is a client-side application, it can be deployed to any static hosting service.

### Vercel (Recommended)

1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Build and deploy:
   ```bash
   npm run build
   vercel --prod
   ```

3. Set environment variables in Vercel dashboard:
   - `VITE_WEATHER_API_KEY`: Your OpenWeatherMap API key

### Netlify

1. Build the project:
   ```bash
   npm run build
   ```

2. Deploy the `dist` folder to Netlify
3. Set environment variables in Netlify dashboard

### GitHub Pages

1. Install gh-pages:
   ```bash
   npm install --save-dev gh-pages
   ```

2. Add to package.json scripts:
   ```json
   {
     "scripts": {
       "deploy": "gh-pages -d dist"
     }
   }
   ```

3. Build and deploy:
   ```bash
   npm run build
   npm run deploy
   ```

### Docker

Create a `Dockerfile`:

```dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

Create `nginx.conf`:

```nginx
events {
    worker_connections 1024;
}

http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;

    server {
        listen 80;
        server_name localhost;
        root /usr/share/nginx/html;
        index index.html;

        location / {
            try_files $uri $uri/ /index.html;
        }
    }
}
```

Build and run:
```bash
docker build -t jagwa .
docker run -p 8080:80 jagwa
```

## Environment Variables

Set these environment variables in your deployment platform:

- `VITE_WEATHER_API_KEY`: Your OpenWeatherMap API key (required for live data)

## Performance Optimization

The app is already optimized with:
- Code splitting
- Tree shaking
- Minification
- Gzip compression (configure on server)

## Security Considerations

- API keys are only exposed to the client (this is expected for client-side apps)
- Consider implementing rate limiting on your hosting platform
- Use HTTPS in production (most platforms provide this automatically)

## Monitoring

Consider adding:
- Error tracking (Sentry)
- Analytics (Google Analytics, Plausible)
- Performance monitoring (Web Vitals)