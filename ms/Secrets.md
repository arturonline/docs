# Manejo de secretos

## Example: Setting the connection string to secret manager

Run the following command from the directory in which the project file exists:

```powershell
# Init 
dotnet user-secrets init

# Examples:

dotnet user-secrets set "password" "1234567a+"

dotnet user-secrets set "ConnectionStrings:Local" "Data Source=Provider=SQLOLEDB.1;Persist Security Info=True;Data Source=172.26.0.12\\AGSOFT_2019;User ID=sa;Password=1234567a+;Initial Catalog=helpproject"

dotnet user-secrets set "ConnectionStrings:AGSoftTrab" "Data Source=Provider=SQLOLEDB.1;Persist Security Info=True;Data Source=172.26.0.14;User ID=sa;Password=1234567a+;Initial Catalog=AGSOFT_TRAB"
```

From this point we can remove the **Local** & **AgsoftTrab** from `appsettings.json`. Dotnet will get this configurations from the secret manager.

## Check secrets

In visual studio:

>`Click project > Manage User Secrets`

With console:

```powershell
# List all secrets
dotnet user-secrets list
```

Check them in file system: 

>`%APPDATA%\Microsoft\UserSecrets\<user_secrets_id>\secrets.json` 

## Remove Secrets

```powershell
# remove 1 secret
dotnet user-secrets remove "Movies:ConnectionString"

# remove all secrets
dotnet user-secrets clear
```

## Links

>🚀 [Secret Manager Microsoft](https://learn.microsoft.com/en-us/aspnet/core/security/app-secrets?view=aspnetcore-7.0&tabs=windows)