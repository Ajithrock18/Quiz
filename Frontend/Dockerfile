FROM nginx:alpine
WORKDIR /usr/share/nginx/html
COPY . .
RUN cp index.html quiz.html && \
    cp login.html index.html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
