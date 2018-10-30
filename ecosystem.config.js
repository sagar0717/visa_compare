module.exports = {
  apps: [
    {
      name: "server",
      script: "./server.js"
    }
  ],
  deploy: {
    production: {
      user: "ubuntu",
      host: "ec2-13-238-159-131.ap-southeast-2.compute.amazonaws.com",
      key: "~/.ssh/visa1.pem",
      ref: "origin/master",
      repo: "git@bitbucket.org:Alireza_Bayat/aip_visa_compare.git",
      path: "/home/ubuntu/aip_visa_compare",
      "post-deploy": "npm install && pm2 startOrRestart ecosystem.config.js"
    }
  }
};
