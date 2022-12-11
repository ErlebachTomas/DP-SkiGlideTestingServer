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
*Instructions for Linux Mint 21*
Connect to the server (key is required when using ssh protocol)
1. In terminal update the system repository index: `sudo apt update`
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
4.3.(Optional) Connect: `ftp <ip-address or domain name>`
4.4 (Optional) Escape from ftp by `quit` command
4.5 Now you can use the [FTP client](https://filezilla-project.org/) for uploading files
5. **Install Node.js**
5.1 install the latest available package `sudo apt-get install nodejs`
5.2 test if it worked using `node -v` 
5.3 install npm `sudo apt-get install npm`
5.4 test it `npm -v`
6. **[Create and setup MongoDB database](https://www.mongodb.com/atlas/database)**
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


