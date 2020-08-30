#! /bin/sh
# https://www.digitalocean.com/community/tutorials/how-to-install-nginx-on-ubuntu-18-04

# setup nginx
sudo apt install nginx
sudo ufw app list
sudo ufw allow 'Nginx HTTP'
sudo ufw allow 22
sudo ufw enable
sudo ufw status
