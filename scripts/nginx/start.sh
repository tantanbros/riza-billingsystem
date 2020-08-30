#! /bin/sh
# setup the reverse proxy
sudo unlink /etc/nginx/sites-enabled/default
sudo cp ./reverse-proxy.conf /etc/nginx/sites-available/reverse-proxy.conf
sudo ln -s /etc/nginx/sites-available/reverse-proxy.conf /etc/nginx/sites-enabled/reverse-proxy.conf
sudo nginx -t
sudo service nginx restart
