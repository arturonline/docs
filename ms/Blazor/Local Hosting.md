# Local hosting

Los proyectos de blazor server pueden funcionar de dos maneras: desde un servidor externo (IIS, Apache...) o lanzando su propio servidor (kestrel).

## 1. Servidor externo

Este es el modo que gastem ara mateixa en el control de presencia. Tenim un servidor local que servix pagines dins de la intranet. 

## 2. Servidor interno

En este modo el propi blazor llança un servidor web propi per a funcionar. 

Per a utilitzar este servidor hem de visitar la carpeta on esta instalat el project (ex: `\\servidor02\DEMOS\rwDashboard`) y llançar el comando: 

```sh
nom_del_projecte.exe --urls http://*:3002
```

