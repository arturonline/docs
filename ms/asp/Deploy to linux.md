# Deploy ASP to Linux (ubuntu)

Deploying an ASP.NET Core application to an Ubuntu server involves several steps. 

## 1. Install .NET SDK and RuntimeFirst

You need to install the .NET SDK and runtime on your Ubuntu server. You can do this using the following commands:

```sh
wget <https://packages.microsoft.com/config/ubuntu/20.04/packages-microsoft-prod.deb> -O packages-microsoft-prod.deb
sudo dpkg -i packages-microsoft-prod.deb
sudo apt-get update
sudo apt-get install -y apt-transport-https
sudo apt-get update
sudo apt-get install -y dotnet-sdk-6.0
```

## 2. Create and Publish Your ASP.NET Core AppOn your development machine

Create and publish your ASP.NET Core application:

```sh
dotnet new webapp -o MyWebApp
cd MyWebApp
dotnet publish --configuration Release
```

This will generate the published files in the `bin/Release/net6.0/publish` directory.

## 3. Transfer Files to the ServerTransfer the published files to your Ubuntu server 

Using SCP:

```sh
scp -r bin/Release/net6.0/publish/* user@yourserver:/var/www/mywebapp
```

## 4. Configure Nginx as a Reverse ProxyInstall Nginx 

On your Ubuntu server:

```sh
sudo apt-get install nginx
```

Then, configure Nginx to act as a reverse proxy for your ASP.NET Core application. Edit the Nginx configuration file:

```sh
sudo nano /etc/nginx/sites-available/default
```

Add the following configuration:

```sh
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection keep-alive;
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

## 5 Run the ApplicationOn your server

Navigate to the directory where you transferred the files and run the application:

```sh
cd /var/www/mywebapp
dotnet MyWebApp.dll
```

## 6 Set Up a Systemd ServiceTo ensure your application runs as a service and restarts automatically

To create a systemd service file:

```sh
sudo nano /etc/systemd/system/kestrel-mywebapp.service
```

Add the following content:

```sh
[Unit]
Description=ASP.NET Core Web App

[Service]
WorkingDirectory=/var/www/mywebapp
ExecStart=/usr/bin/dotnet /var/www/mywebapp/MyWebApp.dll
Restart=always
RestartSec=10
SyslogIdentifier=dotnet-mywebapp
User=www-data
Environment=ASPNETCORE_ENVIRONMENT=Production

[Install]
WantedBy=multi-user.target

Enable and start the service:

sudo systemctl enable kestrel-mywebapp.service
sudo systemctl start kestrel-mywebapp.service
```

## 7 Finally, restart Nginx to apply the changes

```sh
sudo systemctl restart nginx
```

Your ASP.NET Core application should now be running on your Ubuntu server and accessible via your domain name or server IP address.
If you encounter any issues or need more detailed instructions, feel free to ask!
