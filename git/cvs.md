# cvs

| Git                   | CVS                   |
| --------------------- | --------------------- |
| `git clone`           | `cvs checkout modulo` |
| `git pull`            | `cvs update`          |
| `git status`          | `cvs diff`            |
| `git add archivo`     | `cvs add archivo`     |
| `git commit -m "..."` | `cvs commit -m "..."` |
| `git push`            | `cvs commit -m "..."` |


- No hay stash
- No hay push 
- Cuando haces commit añade TODOS los cambios y los sube al servidor. (commit = commit + push)

## Diff

- a = add
- c = change
- d = delete
- 111,114 = rango desde 111 hasta 114 (3 lineas)

Ejemplo:

- **20c20** significa “la línea 20 ha cambiado”.
- **1018a1019,1021** significa que has añadido tres líneas localmente(a = add) despues de la línea 1018 de la versión del servidor.
- **1226,1229d1228** significa que esas cuatro líneas estaban en el servidor y ya no están en esa posición de tu archivo local (d = delete).

- `>` Versión en tu PC.
- `<` Versión del servidor.
- `?` Ignorado o no trackeado. Equivale aproximadamente a archivos “untracked” de Git. No se subirán salvo que ejecutes **cvs add** sobre ellos.