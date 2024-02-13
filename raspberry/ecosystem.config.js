module.exports = {
  apps : [{
    script: 'index.js',
    watch: '.',
    env_production: {
      "PM2_STARTED": true,
      "MYSQL_USER": "root",
      "MYSQL_PASSWORD": "nerdythings",
      // Hardcoded login and password. I hope nobody from your local network ever try to hack you. Only hardcode, only hardcore!
      "ADMIN_USER": "nerdythings",
      "ADMIN_PASSWORD": "nerdythings"
    }
  }]
};
