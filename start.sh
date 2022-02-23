#!/bin/sh
sed -i  "s|<body>|<body baseurl=\"$BASE_URL\">|"  /usr/share/nginx/html/index.html
nginx -g "daemon off;"