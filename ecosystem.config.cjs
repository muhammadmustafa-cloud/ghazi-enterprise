module.exports = {
  apps: [
    {
      name: "ghazi-next",
      cwd: "/var/www/ghazi-enterprise",
      script: "/usr/bin/npm",
      args: "start",
      interpreter: "none",
      env: {
        NODE_ENV: "production",
        PORT: 3000
      },
      autorestart: true,
      watch: false,
      max_memory_restart: "1G"
    }
  ]
};