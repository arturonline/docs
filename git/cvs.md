# cvs

CVS (Concurrent Versions System) es un control de versiones **centralizado**: el historial está solo en el servidor y en tu PC solo tienes una copia de trabajo. Git es **distribuido**: cada clon tiene el historial completo. Ver [Git](1.git.md).

## Equivalencias

| Git                                  | CVS                                   |
| ------------------------------------ | ------------------------------------- |
| `git clone url`                      | `cvs checkout modulo`                 |
| `git pull`                           | `cvs update -dP`                      |
| `git status`                         | `cvs -n -q update` (o `cvs status archivo`) |
| `git diff`                           | `cvs diff -u`                         |
| `git add archivo`                    | `cvs add archivo` (solo archivos nuevos) |
| `git rm archivo`                     | `rm archivo && cvs remove archivo`    |
| `git commit -m "..."` + `git push`   | `cvs commit -m "..."`                 |
| `git restore archivo`                | `cvs update -C archivo`               |
| `git log archivo`                    | `cvs log archivo`                     |
| `git blame archivo`                  | `cvs annotate archivo`                |
| `git tag v1`                         | `cvs tag v1` (marca la copia local) / `cvs rtag v1 modulo` |
| `git branch rama`                    | `cvs tag -b rama`                     |
| `git switch rama`                    | `cvs update -r rama`                  |
| `git switch main`                    | `cvs update -A` (vuelve al tronco, quita *sticky tags*) |
| `git merge rama`                     | `cvs update -j rama`                  |

- No hay stash
- No hay push
- No hay staging area: `cvs add` solo registra archivos nuevos, los cambios se envían con `commit`.
- Cuando haces commit añade TODOS los cambios (del directorio actual hacia abajo) y los sube al servidor. (commit = commit + push)
- Las versiones van **por archivo** (1.1, 1.2, 1.3...), no hay commits que agrupen varios archivos.
- No hay commits atómicos ni renombrados: renombrar = `cvs remove` del viejo + `cvs add` del nuevo (se pierde el historial).

## Configuración

```bash
export CVSROOT=:pserver:usuario@servidor:/ruta/cvsroot
cvs login
cvs checkout modulo
```

En una copia de trabajo ya existente el CVSROOT se lee de `CVS/Root`, no hace falta exportarlo.

## Estado: `cvs -n -q update`

`-n` = no cambia nada (simulación), `-q` = menos ruido. Muestra una letra por archivo:

| Letra | Significado                                                   | Git aprox.          |
| ----- | ------------------------------------------------------------- | ------------------- |
| `U`   | Hay versión nueva en el servidor (se descargaría)             | behind              |
| `P`   | Igual que `U`, pero se enviaría solo un parche                | behind              |
| `M`   | Modificado en local                                           | modified            |
| `A`   | Añadido con `cvs add`, falta commit                           | new file (staged)   |
| `R`   | Borrado con `cvs remove`, falta commit                        | deleted (staged)    |
| `C`   | Conflicto: cambiado en local y en el servidor                 | both modified       |
| `?`   | No versionado                                                 | untracked           |

Ejemplo:

```text
$ cvs -n -q update
M src/main.c
U src/util.c
? notas.txt
```

## Conflictos

Si al hacer `cvs update` hay conflicto, CVS deja marcas en el archivo (parecidas a Git) y una copia de tu versión en `.#archivo.revision`:

```text
<<<<<<< main.c
tu versión local
=======
versión del servidor
>>>>>>> 1.5
```

Editas el archivo, quitas las marcas y haces `cvs commit`.

## Diff

`cvs diff` sin opciones usa el formato "normal" de diff. Comparación: **servidor** (izquierda) contra **tu PC** (derecha).

- a = add
- c = change
- d = delete
- 111,114 = rango desde la línea 111 hasta la 114 (ambas incluidas: 4 líneas)

Ejemplo:

- **20c20** significa "la línea 20 ha cambiado".
- **1018a1019,1021** significa que has añadido tres líneas localmente (a = add) después de la línea 1018 de la versión del servidor; en tu archivo son las líneas 1019 a 1021.
- **1226,1229d1228** significa que esas cuatro líneas (1226 a 1229) estaban en el servidor y ya no están en tu archivo local (d = delete); en tu archivo irían después de la línea 1228.

- `>` Versión en tu PC.
- `<` Versión del servidor.
- `?` Ignorado o no trackeado. Equivale aproximadamente a archivos "untracked" de Git. No se subirán salvo que ejecutes **cvs add** sobre ellos.

```text
$ cvs diff main.c
20c20
< int x = 1;
---
> int x = 2;
```

Más legible con formato unificado (como `git diff`):

```bash
cvs diff -u archivo          # - servidor, + local
cvs diff -u -r 1.3 -r 1.5 archivo   # entre dos revisiones
```

## Ignorar archivos

Se usa un archivo `.cvsignore` en cada directorio (equivalente a [.gitignore](gitignore%20files.md), pero sin negación de patrones ni `**`; una línea con solo `!` vacía la lista de ignorados).
