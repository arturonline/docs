# Files

Poner la barra correcta:

```python
 [fSep()]
 ```


```python
//  fCurrentDir, fExeDir, fDataDir and fCacheDir.

// sDocuments is String = SysDirExternalStorage(1, sseAppDocument)
// trace(documents)
//
//if fDirExist(documents) then
//	trace("Directorio documentos existe!")
//else 
//	Trace("No existe el directorio documentos, creando...")
//	fmakedir(documents)
//	trace("Directorio creado")
//END

Trace("Directorios:")
sDirectoryList, sDir are string
sDirectoryList = fListDirectory("C:\Users\Arthur\Downloads", frNotRecursive)


FOR EACH STRING sDir OF sDirectoryList SEPARATED BY CR
	Trace(sDir)
END


Trace("Archivos: ")
sFileList, sFile are string
sFileList = fListFile("C:\Users\Arthur\Downloads\*", frNotRecursive)
FOR EACH STRING sFile OF sFileList SEPARATED BY CR
	Trace(sFile)
	path is string = fExtractPath(sFile, fFileName)
	Trace(path)
END
```