# Networking

## IPs

Una IPv4 tiene 32 bits: 4 grupos de 8 bits (octetos). Cada octeto va de 0 a 255.

```sh
192 . 168 . 1 . 34
[8]   [8]  [8]  [8]  = 32 bits
```

El número **/n** (notación CIDR) dice cuántos bits se reservan para la red. Lo que queda es para numerar equipos.

- bits para equipos = 32 − n
- direcciones totales = 2^(bits para equipos)
- equipos utilizables = direcciones totales − 2

Ejemplo:

```
/24 → 32 − 24 = 8 bits → 2^8 = 256 direcciones → 254 equipos
/25 → 32 − 25 = 7 bits → 2^7 = 128 direcciones → 126 equipos
```

### Direcciones reservadas

En cada red hay 2 direcciones que no se asignan a equipos:

- **Dirección de red**: la primera (todos los bits de equipo a 0). Identifica la red. Ej: `192.168.1.0`
- **Broadcast**: la última (todos los bits de equipo a 1). Sirve para enviar a todos los equipos de la red. Ej: `192.168.1.255`

Además, por convención, el **gateway** (router, la salida hacia otras redes) suele ser la primera utilizable: `192.168.1.1`.

## Máscara de subred

La máscara es otra forma de escribir lo mismo que el `/n`: se ponen a 1 los bits de red y a 0 los de equipo.

```
/24 = 11111111.11111111.11111111.00000000 = 255.255.255.0
/26 = 11111111.11111111.11111111.11000000 = 255.255.255.192
```

| CIDR | Máscara         | Direcciones | Equipos |
|------|-----------------|-------------|---------|
| /8   | 255.0.0.0       | 16.777.216  | 16.777.214 |
| /16  | 255.255.0.0     | 65.536      | 65.534  |
| /24  | 255.255.255.0   | 256         | 254     |
| /25  | 255.255.255.128 | 128         | 126     |
| /26  | 255.255.255.192 | 64          | 62      |
| /27  | 255.255.255.224 | 32          | 30      |
| /28  | 255.255.255.240 | 16          | 14      |
| /29  | 255.255.255.248 | 8           | 6       |
| /30  | 255.255.255.252 | 4           | 2       |
| /31  | 255.255.255.254 | 2           | 2 (enlaces punto a punto, sin red ni broadcast) |
| /32  | 255.255.255.255 | 1           | 1 (un único host) |

## Redes

Con `192.168.1.0/24` los primeros tres bloques son la red:

```
192.168.1 | .34
─────────   ───
   red      dispositivo
```

Por eso todos estos equipos pertenecen a la misma red:
`192.168.1.1`
`192.168.1.34`
`192.168.1.200`

En cambio, /8 dice que solo el primer bloque identifica la red:

```
10 | .20.30.40
──   ─────────
red  dispositivo
```

Así, `10.0.0.1`, `10.20.30.40` y `10.255.255.254` estarían en la misma red `10.0.0.0/8`, con unos 16 millones de direcciones posibles.

> **Ojo:** esto de "los bloques son la red" solo cuadra con /8, /16 y /24. Con /25, /26, /27... el corte cae **dentro** de un octeto, y hay que mirar los bits (ver Subnetting).

### ¿Están dos IPs en la misma red?

Se hace un **AND** bit a bit entre la IP y la máscara. Si el resultado (la dirección de red) es igual, están en la misma red.

```
192.168.1.34  /26 → último octeto 34  = 00100010
máscara          → último octeto 192 = 11000000
AND              →                     00000000 = 0   → red 192.168.1.0

192.168.1.100 /26 → último octeto 100 = 01100100
AND 11000000     →                     01000000 = 64  → red 192.168.1.64
```

`.34` y `.100` **no** están en la misma red /26 (aunque sí en la misma /24).

## Rangos especiales

Rangos privados (RFC 1918), no se enrutan por Internet, se usan en redes locales:

| Rango           | CIDR             |
|-----------------|------------------|
| 10.0.0.0 – 10.255.255.255     | 10.0.0.0/8     |
| 172.16.0.0 – 172.31.255.255   | 172.16.0.0/12  |
| 192.168.0.0 – 192.168.255.255 | 192.168.0.0/16 |

Otros:

- `127.0.0.0/8` → loopback (`127.0.0.1` = el propio equipo, `localhost`)
- `169.254.0.0/16` → link-local (el equipo se la asigna solo si no obtiene IP por DHCP)
- `0.0.0.0` → "cualquier dirección" / sin dirección

## Subnetting

Subnetting es partir una red en redes más pequeñas cogiendo bits de la parte de equipos.

- 192.168.1.0/24 -> Red entera

Partimos en 4 subredes /26 (cuartos de red):

- 192.168.1.0/26   -> departamento A
- 192.168.1.64/26  -> libre
- 192.168.1.128/26 -> departamento B
- 192.168.1.192/26 -> libre

(Si solo hicieran falta 2 redes, bastaría con dos /25: `192.168.1.0/25` y `192.168.1.128/25`.)

Tamaños:

- /24 = red grande: 254 equipos
- /25 = media red: 126 equipos
- /26 = cuarto de red: 62 equipos

### Truco del salto

Para saber dónde empieza cada subred: `256 − último octeto de la máscara (distinto de 0)`.

```
/26 → máscara .192 → 256 − 192 = 64 → subredes en .0, .64, .128, .192
/27 → máscara .224 → 256 − 224 = 32 → subredes en .0, .32, .64, .96 ...
```

### Ejemplo práctico

Para crear al menos 6 subredes iguales desde una **/24**, necesitas dividirla en 8, porque el número de subredes siempre es una potencia de 2:

```
2 → 4 → 8 → 16 ...
```

Como 6 no existe como opción y 4 se quedaría corta, tenemos que coger 8.

Para llegar a 8 subredes, tomas 3 bits de la parte de equipos. ¿Por qué 3? Porque 8 = 2^3.

```
/24 + 3 = /27
```

Cada subred **/27** tiene 32 direcciones (salto de 32), de las cuales 30 se pueden asignar a dispositivos.

Desde 192.168.1.0/24, las ocho subredes son:

```
Red                  Equipos           Broadcast
192.168.1.0/27       .1   – .30        .31
192.168.1.32/27      .33  – .62        .63
192.168.1.64/27      .65  – .94        .95
192.168.1.96/27      .97  – .126       .127
192.168.1.128/27     .129 – .158       .159
192.168.1.160/27     .161 – .190       .191
192.168.1.192/27     .193 – .222       .223
192.168.1.224/27     .225 – .254       .255
```

Usarías las primeras seis y te quedarían dos disponibles para ampliar después.

### Al revés: partir según número de equipos

Si necesitas subredes de al menos **50 equipos**:

1. Busca la potencia de 2 que cubra equipos + 2 → 52 → 2^6 = 64
2. Bits de equipo = 6 → 32 − 6 = **/26**
3. Cada /26 da 62 equipos, y de una /24 salen 4.

## IPv6 (resumen)

- 128 bits, escritos en 8 grupos hexadecimales: `2001:0db8:0000:0000:0000:0000:0000:0001`
- Se pueden abreviar quitando ceros a la izquierda y sustituyendo una sola secuencia de grupos a 0 por `::` → `2001:db8::1`
- La red típica de una LAN es **/64** (64 bits de red + 64 de equipo).
- No hay broadcast (se usa multicast).
- `::1` → loopback. `fe80::/10` → link-local. `fc00::/7` → privadas (ULA).
