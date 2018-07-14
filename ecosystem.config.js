// Target server hostname or IP address
const TARGET_SERVER_HOST = '178.128.61.100';
// Target server username
const TARGET_SERVER_USER = 'root';
// Target server application path
const TARGET_SERVER_APP_PATH = `/home/178.128.61.100/app`;
// Your repository
const REPO = 'https://gitlab.com/casolution/internals/pos.git';

module.exports = {
  /**
   * Application configuration section
   * http://pm2.keymetrics.io/docs/usage/application-declaration/
   */
  apps: [
    {
      name: 'StoreVIEN',
      script: 'dist/app/bundle.js',
      env: {
        NODE_ENV: 'development'
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 3000
      }
    }
  ],

  /**
   * Deployment section
   * http://pm2.keymetrics.io/docs/usage/deployment/
   */
  deploy: {
    production: {
      user: TARGET_SERVER_USER,
      host: TARGET_SERVER_HOST,
      ref: 'origin/master',
      repo: REPO,
      ssh_options: 'StrictHostKeyChecking=no',
      path: TARGET_SERVER_APP_PATH,
      'post-deploy': 'npm install --production'
        + ' && pm2 startOrRestart ecosystem.config.js --env=production'
        + ' && pm2 save'
    }
  }
};