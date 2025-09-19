#!/bin/sh
export NVM_DIR=/home/corpdeploy/.nvm
export NODE_VER=v20.12.1

if [ -z "$1" ]; then
  echo "Usage: $0 staging|production"
  exit 1
fi

if [ "$1" = "staging" ]; then
  export DEPLOY_ENV=staging
elif [ "$1" = "production" ]; then
  export DEPLOY_ENV=production
else
  echo "Invalid deploy environment: $1"
  exit 1
fi

# setup the env
export NODE_ENV=$DEPLOY_ENV

echo "Post-deploy: NODE_ENV=${DEPLOY_ENV} Running..."

export NVM_DIR=/home/corpdeploy/.nvm
. /home/corpdeploy/.nvm/nvm.sh

# build 
if [ "$DEPLOY_ENV" = "staging" ]; then
  cd /data/www/www-staging.getalembic.com/source
else 
  cd /data/www/www-new.getalembic.com/source
fi

# flush next cache
rm -rf .next

# Because we're running a build, but NODE_ENV is production, we also need our
# devDependencies installed for things like tailwindcss and eslint.
npm install --include dev
npm run build

echo "Post-deploy: Restart services..."
if [ "$DEPLOY_ENV" = "staging" ]; then
  #  pm2 reload ecosystem.config.js --env production www-staging
  pm2 reload www-staging
else
  #  pm2 reload ecosystem.config.js --env production www
  pm2 reload www
fi

