# DP-SkiGlideTestingServer
Provides API for mobile application

## Environment variables 
Create .env file for config vars

| Environment variable | Description |     
| :---: | :---: | 
| `env` | type `development` for print full error stacktrace   |
| `DEBUG` | debug tag for console e.g. `myApp` |
| `DB_CONNECTION` | connection string for Mongoose |
| `PORT` | Port for web app e.g.`2022`, default value `3000` |
| `Auth_domain` | [Auth0 domain](https://manage.auth0.com/dashboard) e.g. `xxx.us.auth0.com`|
| `Auth_clientId`| [Auth0 web client ID](https://manage.auth0.com/dashboard) |
| `API_IDENTIFIER` | Custom API Identifier, usually url |

## Instalation on VPS 
*Instructions for Linux Ubuntu 20*
Check os version in Linux: `cat /etc/os-release`
Connect to the server (key is required when using ssh protocol)
1. In terminal update the system repository index: `sudo apt update`
1.1 Install ssh `sudo apt install openssh-server`
1.2 check if port 22 is open: `sudo lsof -i -P -n | grep LISTEN` or allow it by `sudo ufw allow ssh`

2. **Install Apache:** `sudo apt-get install apache2`
2.1. Test in your browser that the `/var/www/index.html` file is displayed when you open the server URL 
2.2. If you get a 404 error you will need to configure `apache2.conf` in `/etc/apache2`
3. **Install FTP server**
3.1.  install VSFTPD using the following command: `sudo apt install -y vsftpd`
3.2.  Configure VSFTPD: `sudo nano /etc/vsftpd`
*CTRL + O saves a Nano file, CTRL + X exits Nano*
Example of /etc/vsftpd.conf file:
    >listen=NO
    anonymous_enable=NO
    local_enable=YES
    write_enable=YES
    local_umask=022
    dirmessage_enable=YES
    use_localtime=YES
    xferlog_enable=YES
    connect_from_port_20=YES
    chroot_local_user=YES
    secure_chroot_dir=/var/run/vsftpd/empty
    pam_service_name=vsftpd
    rsa_cert_file=/etc/ssl/certs/ssl-cert-snakeoil.pem
    rsa_private_key_file=/etc/ssl/private/ssl-cert-snakeoil.key
    ssl_enable=Yes
    pasv_enable=Yes
    pasv_min_port=10000
    pasv_max_port=10100
    allow_writeable_chroot=YES
    ssl_tlsv1=YES
    ssl_sslv2=NO
    ssl_sslv3=NO 
    >    
    3.3. Allow ports in firewall `sudo ufw allow 20/tcp` and `sudo ufw allow 21/tcp`
3.4. Enable the VSFTPD service to start on boot: `sudo systemctl enable vsftpd.service`
3.5. Start VSFTPD: `sudo systemctl start vsftpd.service` 
or restart: `sudo systemctl restart vsftpd.service`
3.6. Check if it is active: `sudo systemctl status vsftpd.service`
4. **Create an FTP user and connect** 
4.1  Create a user: `sudo adduser <username>`
4.2. Set password `sudo passwd <password>` 
NOTE: check if the user has write rights to the `/var/www` folder 
if not run: `sudo chown -R <username>:root /var/www`
4.3.(Optional) Connect: `ftp <ip-address or domain name>`
4.4 (Optional) Escape from ftp by `quit` command
4.5 Now you can use the [FTP client](https://filezilla-project.org/) for uploading files
5. **Install Node.js**
5.1 install the latest available package `sudo apt-get install nodejs`
5.2 test if it worked using `node -v` 
5.3 install npm `sudo apt-get install npm`
5.4 test it `npm -v`
NOTE: for specific version node.js install curl
`sudo snap install curl` and `curl -sL https://deb.nodesource.com/setup_<version e.g 16>.x | sudo -E bash -sudo apt-get install -y nodejs` or for current version:
`curl -fsSL https://deb.nodesource.com/setup_current.x | sudo -E bash -sudo apt-get install -y nodejs` 
6. **[Create and setup MongoDB database](https://www.mongodb.com/docs/manual/tutorial/install-mongodb-on-ubuntu/)**
 *Note: alternatively you can use [Atlas cloud database](https://www.mongodb.com/atlas/database)*
6.1. Import the public key: `wget -qO - https://www.mongodb.org/static/pgp/server-4.4.asc | sudo apt-key add -` 
6.2 Create a list file for Ubuntu 20.04: `echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/4.4 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-4.4.list`  
6.3. Reload local package: `sudo apt-get update`
6.4. Install the MongoDB: `sudo apt-get install mongodb-org=4.4.8 mongodb-org-server=4.4.8 mongodb-org-shell=4.4.8 mongodb-org-mongos=4.4.8 mongodb-org-tools=4.4.8`
6.5. (Optinonal) Use `mongod --version` to check its succesfully installed
6.6. Start the mongod process: `sudo systemctl start mongod` 
6.7. Verify that MongoDB has started successfully: `sudo systemctl status mongod`
6.8. MongoDB will start following a system reboot by issuing the following command: `sudo systemctl enable mongod`
6.9. **[Configure a public bind IP](https://www.digitalocean.com/community/tutorials/how-to-configure-remote-access-for-mongodb-on-ubuntu-18-04)**
6.9.1  open `sudo nano /etc/mongod.conf`
6.9.2 change `bindIp:` to `bindIp: 127.0.0.1,<mongodb_server_ip>` or `bindIp: 0.0.0.0` (not recommend) 
6.9.3 check if port 27017 is open `sudo lsof -i | grep mongo` or allow it by `sudo ufw allow 27017`
6.9.4 restart MongoDB: `sudo systemctl restart mongod`
6.9.5 connect with a connection string URI, e.g: `mongo "mongodb://<mongo_server_ip>:27017"`
6.10. **[Secure MongoDB](https://www.digitalocean.com/community/tutorials/how-to-secure-mongodb-on-ubuntu-20-04)**
6.10.1  type `mongo`
6.10.2  switch to db admin: `use admin`
6.10.3 Adding an user: `db.createUser(`
6.10.4 Fill user data and enter a closing parenthesis to close and execute the db.createUser method:
    >db.createUser(
        &ensp;{
        &ensp;user: `"<mongoUser>"`,
        &ensp;pwd: `passwordPrompt()`,
    &ensp;roles: [ { role: "userAdminAnyDatabase", db: "admin" }, "readWriteAnyDatabase" ]
       &ensp; }
        )
    >
    6.10.5 exit the MongoDB client: `exit`
    6.10.6 Enabling Authentication: `sudo nano /etc/mongod.conf`
    6.10.7 Add the authorization parameter: 
    >security:
    &ensp; authorization: enabled
    >
    6.10.8 restart the daemon: `sudo systemctl restart mongod`
    6.10.9 (Optional) check status: `sudo systemctl status mongod`
    6.10.10 (Optional) test user account: `mongo -u <mongoUser> -p --authenticationDatabase admin`
    6.10.11 (Optional) list of all the databases currently on the server:`show dbs`
    6.10.12 `exit`
6.11 **[Connect to database](https://www.mongodb.com/docs/manual/reference/connection-string/)**
6.11.1 Now you can use the [Compass client](https://www.mongodb.com/products/compass) for acces to database
6.11.2 Create new connection
6.11.3 Insert standard connection string format: `mongodb://<mongoUser>:<mongo_password>@<server-ip-address or localhost>:<port>/?authSource=admin` e.g.: `mongodb://mongoUser:psw@localhost:27000/?authSource=admin`
6.12. Type connection string to .env file  for config var `DB_CONNECTION`
7. **Deploy App**
7.1 upload files from the repository to `/var/www` using ftp
7.2 install all modules listed as dependencies in package.json using command `npm install `
7.3 run app using `node <file>` e.g.`node app.js`
7.4 (Optional) open in browser
8. **Set up a production environment**
8.1 install PM2 a process manager for Node.js applications: `sudo npm install pm2@latest -g`
8.2 run application in the background:`pm2 start <file>` e.g. `pm2 start app.js`
Usefull command: 
    - PM2 can automatically restart application when a file is modified `pm2 start app.js --watch`
    - list the applications currently managed by PM2: `pm2 list`,
    - monitor CPU and memory usage: `pm2 monit`, 
    - stop app using: `pm2 stop <app_name_or_id>`,   
    - restart an application: `pm2 restart <app_name_or_id>`,
    - delete:  `pm2 delete <app_name_or_id>` 
    - rename process: `pm2 restart <id> --name <newName>` 

<!---{::comment}
8.4 Set PM2 to start on boot: `pm2 startup systemd`
8.5 Copy displayed command 
8.6 Freeze a process list on reboot via: `pm2 save`
NOTE *You can remove init script via: `pm2 unstartup systemd`* 
8.7 Start the service with systemctl: `sudo systemctl start pm2-sammy`
{:/comment}--->
After all type `exit`



<!---{::comment}
https://www.mongodb.com/docs/manual/tutorial/install-mongodb-on-ubuntu/
{:/comment}--->

