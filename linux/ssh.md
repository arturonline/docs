# ssh

## 1. List ssh keys on your pc

**Authorized keys for current user:**

```bash
cat ~/.ssh/authorized_keys
```

**Authorized keys for a specific user:**

```bash
cat /home/artur/.ssh/authorized_keys
# or for root:
cat /root/.ssh/authorized_keys
```

**See active SSH connections right now:**

```bash
who
# or more detail:
ss -tnp | grep :22
```

**SSH server config:**

```bash
cat /etc/ssh/sshd_config
```

**Your SSH client config:**

```bash
cat ~/.ssh/config
```

## Añadir keys a servidor para conectar sin password

**En tu máquina local** (Mac/Linux):

**1. Crear la key:**

```bash
ssh-keygen -t ed25519 -C "tu@email.com"
```

**2. Subir la key al servidor:**

```bash
ssh-copy-id artur@ip-del-servidor
```

Esto copia automáticamente tu clave pública al `~/.ssh/authorized_keys` del servidor.

---

**Si no tienes `ssh-copy-id` (raro en Mac, pero por si acaso):**

```bash
cat ~/.ssh/id_ed25519.pub | ssh artur@ip-del-servidor "mkdir -p ~/.ssh && cat >> ~/.ssh/authorized_keys"
```

---

**Verificar que funciona:**

```bash
ssh artur@ip-del-servidor
```

Si entra sin pedir contraseña, todo correcto.

---