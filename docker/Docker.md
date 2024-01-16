# Docker

Al llarg del document parlarem sobre imatges i contenidors, pel que convé aclarir aquests
conceptes.

- Una **imatge** és un paquet executable que inclou tot allò necessari per executar una aplicació: el codi, l’entorn d’execució, llibreríes, variables d’entorn i fitxers de configuració.

- Un **contenidor**, per la seua banda és una instància d’una imatge en execució: allò que es crea quan posem en marxa una imatge.

Podríem dir que un contenidor és a una imatge el que un procés a un programa:

> procés = programa en execució -> contenidor = imatge en execució

## Commandos

Mostra la ajuda

```sh
$ sudo docker
```

Mostra informació del sistema

```sh
$ sudo docker info
```

hello-world es un arxiu de imatge

```sh
$ sudo docker run hello-world
```

Si no s'ha descarregat una imatge en executar docker amb el subcomando de `run`, el client `Docker` primer descarregarà la imatge i després executarà un contenidor utilitzant la mateixa.

Podem buscar images amb:

```sh
$ docker search NomImage
```

Y descarregar-la de [docker hub]("https://hub.docker.com/explore/") amb:

```sh
$ docker pull NomImage
```

Per veure les imatges que tenim descarregades:

```sh
$ docker images
```

Parar i reiniciar una instancia d’un contenidor:

```sh
$ docker stop NomContainer
$ docker start -a NomContainer
```

Si tanquem la terminal el docker seguirà corrent, ara hem d executar la comanda per llistar els contenidors actius:

```sh
$ docker ps
```

Per a eliminar un contenidor:

```sh
$ docker rm Nomcontainer
```

Aquest mecanisme és un poc tediós, pel que anem a fer-ho més senzill.

Amb la següent ordre, podem obtenir els ids dels contenidors que ja han acabat:

```sh
toki:/home/joamuran# sudo docker ps -a -q -f status=exited
```

Pel que si combinem aquesta ordre amb docker rm:

```sh
sudo docker rm $(sudo docker ps -aqf status=exited)
```

## Parametros

Si volem llançar més d’una ordre per contenidor, podem fer ús del paràmetre `-it` (flag interactive):

```sh
$ docker run -it busybox sh
```

Amb `ps -a` podem obtindre tots els contenidors de la sessió actual:

```sh
docker ps -a
```

## Life cycle

## docker run vs docker start

Amb l’ordre `docker run`, creem un contenidor a partir de una imatge. Per aturar un contenidor utilitzem `docker stop`.

```sh
$ docker stop NomContainer
$ docker start -a NomContainer
```

Amb `docker stop` aturem el contenidor però no l’eliminem. D’aquesta manera, si intentem tornar a crear de nou el contenidor amb `docker run` , obtindrem el següent error:

```sh
docker: Error response from daemon: Conflict. The container name /
mysql-srv is already in use by container 2
```

Ara tenim dues possibilitats, eliminar aquest contenidor (amb docker rm ) o bé seguir executant-lo amb `docker start`.

Així doncs, i a mode de conclusió, podem establir les següents diferències:

- docker **run** : Crea un nou contenidor a partir d’una imatge i executa les ordre que indiquem.
- docker **start** : Inicia un contenidor aturat, mantenint aquest tal i com estava en el moment d’aturar-lo, pel que manté la informació que aquest estiguera gestionant sense necessitat d’utilitzar volums.
