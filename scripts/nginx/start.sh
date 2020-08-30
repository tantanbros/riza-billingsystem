#! /bin/sh
# setup the reverse proxy
unlink /etc/nginx/sites-enabled/default
cp ./nginx/reverse-proxy.conf /etc/nginx/sites-available/reverse-proxy.conf
ln -s /etc/nginx/sites-available/reverse-proxy.conf /etc/nginx/sites-enabled/reverse-proxy.conf
nginx -t
service nginx restart
