#!/bin/sh

export ENVIRONMENT=$1
export NVM_DIR=/home/corpdeploy/.nvm
export NODE_VER=v20.12.1

. /home/corpdeploy/.nvm/nvm.sh

if [ -z "$ENVIRONMENT" ]
then
      echo "No enviroment supplied"
      exit 1
fi

npm install -g pm2

# datadog
pm2 install pm2-datadog

# log rotate
pm2 install pm2-logrotate
pm2 set pm2-logrotate:compress true
pm2 set pm2-logrotate:max_size 500M

# slack posts - post pm2 stuff to slack #site_alerts
# install our patched version if and only if we are not running in staging

# last install the startup scripts
#sudo env PATH=$PATH:/home/corpdeploy/.nvm/versions/node/${NODE_VER}/bin pm2 startup systemd -u alembic --hp /home/corpdeploy

