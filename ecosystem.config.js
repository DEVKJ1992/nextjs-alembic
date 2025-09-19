module.exports = {
  /**
   * Application configuration section
   * http://pm2.keymetrics.io/docs/usage/application-declaration/
   */
  apps: [
    {
      name: 'www',
      script: './node_modules/.bin/next',
      args: ['start','-p','3000'],
      wait_ready: true,
      watch: false,
      instances: 16,
      exec_mode: 'cluster',
      cwd: '/data/www/www-new.getalembic.com/current',
      env_production: {
        NODE_ENV: 'production',
      },
      env_staging: {
        NODE_ENV: 'staging',
      }
    },
    {
      name: 'www-staging',
      script: './node_modules/.bin/next',
      args: ['start','-p','4000'],
      wait_ready: true,
      watch: false,
      instances: 16,
      exec_mode: 'cluster',
      cwd: '/data/www/www-staging.getalembic.com/current',
      env_production: {
        NODE_ENV: 'production',
      },
      env_staging: {
        NODE_ENV: 'staging',
      }
    }
  ],
  /**
   * Deployment section
   * http://pm2.keymetrics.io/docs/usage/deployment/
   */
  deploy: {
    production: {
      user: 'corpdeploy',
      host: ['www-0.corp.dc1.alb'],
      ref: 'origin/main',
      repo: 'git@github.com:sightbox/alembic.git',
      path: '/data/www/www-new.getalembic.com',
      ssh_options: ['StrictHostKeyChecking=no', 'ForwardAgent=yes'],
      'post-setup': './deploy_scripts/post_setup.sh production',
      'post-deploy': './deploy_scripts/post_deploy.sh production',
      env: {
        NODE_ENV: 'production',
      }
    },
    staging: {
      user: 'corpdeploy',
      host: ['www-0.corp.dc1.alb'],
      ref: 'origin/development',
      repo: 'git@github.com:sightbox/alembic.git',
      path: '/data/www/www-staging.getalembic.com',
      ssh_options: ['StrictHostKeyChecking=no', 'ForwardAgent=yes'],
      'post-setup': './deploy_scripts/post_setup.sh staging',
      'post-deploy': './deploy_scripts/post_deploy.sh staging',
      env: {
        NODE_ENV: 'production',
      }
    }
  }
};
