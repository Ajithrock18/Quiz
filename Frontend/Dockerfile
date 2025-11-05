FROM nginx:alpine
WORKDIR /usr/share/nginx/html
COPY . .
RUN mv index.html quiz.html && mv login.html index.html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
