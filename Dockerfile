# Build Stage
FROM node:20-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

# Pass in external configuration at build time
ARG VITE_API_BASE_URL
ARG VITE_VENDOR_API_BASE_URL
ARG VITE_RECAPTCHA_SITE_KEY

ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
ENV VITE_VENDOR_API_BASE_URL=$VITE_VENDOR_API_BASE_URL
ENV VITE_RECAPTCHA_SITE_KEY=$VITE_RECAPTCHA_SITE_KEY

RUN npm run build

# Production Stage
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
