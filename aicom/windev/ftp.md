# FTP
```java
currentServer is string = newServer
STC_ruta_label = newServer
Ficheros is array of string

// currentFilesNFolders is array of File = getFilesNFolders(newCurrentFolder)

gNumDirectorios, gNumArchivos is int
STC_Num_Archivos_Label = gNumArchivos + " Archivos"
STC_Num_Directorios_Label = gNumDirectorios + " Directorios"
```


```java
serverName, Response, sResult are string = ""
nConnection is int
res, nPNG is int = 0

IF (newServer = "") THEN
	SWITCH Input("Dirección del servidor:", serverName)
		CASE 1:
			nConnection = FTPConnect(serverName, "demo", "password")
			IF FTPCommand(nConnection, "SYST", Response) = True THEN
				Info("Information about the server system: " + CR + Response)
			ELSE
				Info("The server does not support the SYST command." +
				"No information about the server system is available")
			END
//			FTPCurrentDir(nConnection, "/pub/example")
//			res = FTPCommand(nConnection, "PWD", Response)
//			info("Response: " + Response)
//
			// List the files found in the current directory
			res = FTPListFile(nConnection, "/pub/example", Listar, ftpFile)
			Info("There are " + res + " files")
			Trace("nPNG: " + nPNG)
			
			INTERNAL PROCEDURE Listar(Name, nSize, sAttribute, sDate, sTime)
				Add(Ficheros,Name)
				Trace("Nombre: " + Name + ", Size: " + nSize + ", Atributo: " + sAttribute + ", Fecha: " + sDate + ", Time: "+  sTime)
				// Nombre: imap-console-client.png, Size: 19156, Atributo: , Fecha: 20070216, Time: 190000
				
				RESULT True
				END			

//			FOR i = 1 TO res
//				Trace(Ficheros[i])
//			END
			FTPDisconnect(nConnection)
	END
END	
```