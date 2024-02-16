#
# Copyright 2024 Eugene Tkachenko
# Licensor provides the Work (and each
# Contributor provides its Contributions) on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or
# implied, including, without limitation, any warranties or conditions
# of TITLE, NON-INFRINGEMENT, MERCHANTABILITY, or FITNESS FOR A
# PARTICULAR PURPOSE. You are solely responsible for determining the
# appropriateness of using or redistributing the Work and assume any
# risks associated with Your exercise of permissions under this License.
#

sudo apt-get install -y git \
    nodejs \
    npm \
    nginx \
    mariadb-server

sudo npm install pm2@latest -g

sudo mysql_secure_installation

cd ~/openheat/raspberry/

npm i

sudo cp nginx/openheat.local /etc/nginx/sites-available/
sudo cp nginx/openheat.local /etc/nginx/sites-enabled/ 
sudo systemctl restart nginx

pm2 start ecosystem.config.js  --env production
sudo env PATH=$PATH:/usr/bin /usr/local/lib/node_modules/pm2/bin/pm2 startup systemd -u nerdythings --hp /home/nerdythings
pm2 save

