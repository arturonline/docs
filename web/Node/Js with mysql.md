# Javascript with mysql

## Install mysql driver

```js
npm install mysql
```

## Connection

```js
const msyql = require("mysql");

const conn = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "1234",
  database: "agenda",
});

conn.connect(() => {
  if (err) throw "Error en la conexión";
  console.log("Connection succesfully!");
});
```

## Operations

### Queries

```js
conn.query(sql, (err, result) => {
  if (err) throw err;
  console.log("Result: " + result);
});
```

```js
conn.query("SELECT * FROM contacte", function (error, result) {
  if (error) {
    console.error("Error en la consulta: " + err.stack);
    return;
  }
  console.log(result);

  //   [
  //       RowDataPacket { id:1, nom: 'Fidel', tfn: '12121212' },
  //       RowDataPacket { id:2, nom: 'Pepe', tfn: '962851236' },
  //       RowDataPacket { id:3, nom: 'Antonio', tfn: '987654329' },

  //   ]

  for (contacte of result) {
    console.log(contacte.id, contacte.nom, contacte.tfn);
  }

  // 1 Fidel 12121212
  // 2 Pepe 962851236
  // 3 Antonio 987654329
});
```

⚠ En este caso, result es un array de objetos.

Exemple, contactes que comencen per "P"

```js
conn.query(
  'SELECT * FROM contacte", WHERE LIKE "P%"',
  function (error, result) {
    if (error) {
      console.error("Error en la consulta: " + err.stack);
      return;
    }
    console.log(result);

    for (contacte of result) {
      console.log(contacte.id, contacte.nom, contacte.tfn);
    }
  }
);

// 2 Pepe 962851236
```

#### Queries with placeholders

```js
var nom = "Pepe";
var tfno = "123123";
var sql = "SELECT * FROM contactes WHERE nom = ? OR tfno = ?";
conn.query(sql, [nom, tfno], function(error, result)...
```

### Insert

#### Insert single values

```js
var cadena='INSERT INTO taula (camp1, camp2...)
VALUES (‘valor1’,’valor2’...)';

conn.query(cadena, function(err,result) {
    if(err) throw err;
    console.log("S’ha inserit la línia");
});
```

```js
var cadena = "INSERT INTO contacte (nom, tfn) VALUES ('Luisa','222222222')";

con.query(cadena, function (error, result) {
  if (error) throw "No s'ha pogut fer la inserció";
  console.log(result);
});

// OkPacket {
//     fieldCount: 0
//     affectedRows: 1,
//     insertId: 20,
//     serverStatus: 2,
//     warningCount: 0,
//     message:'',
//     protocol41: true,
//     changedRows: 0
// }
```

```js
console.log(
  "S'ha inserit " +
    result.affectedRows +
    " linia amb el codi " +
    result.insertId
);
```

#### Insert several value

```js
INSERT INTO taula(camp1, camp2...)
VALUES((valor1, valor2),(valor1,valor2)...)
```

```js
var valors = [
  ["Gonzalo", "43241123"],
  ["Estefanía", "43423221"],
  ["Mercedes", "5434234"],
];

conn.query(cadena, [valors], function (error, result) {
  if (error) throw "Error al afegir els contactes";
  console.log("S'han afegit " + result.affectedRows + " contactes");
});

//S'han afegit 3 contactes
```

### Delete data

Anem a eliminar tots els contactes que tinguen un id major que 20.

```js
var cadena = "DELETE FROM contacte WHERE id > 20";
con.query(cadena, function (error, result) {
  if (error) throw "No s'han pogut eliminar els contactes";

  if (result.affectedRows == 0) {
    console.log("No s'ha eliminat cap contacte");
  } else {
    console.log("S'han eliminat " + result.affectedRows + " contactes");
  }
});

//S'han eliminat 2 contactes
```

With placeholders:

```js
var cadena = 'DELETE FROM contacte WHERE id > ?';
var valorid = 20;
con.query(cadena, [valorid], function(error, result)...
```

### Update data

```js
var cadena = "UPDATE contacte SET tfn='333333333' WHERE nom='Luisa'";
con.query(cadena, function (error, result) {
  if (error) throw "Error al modificar els contactes";

  console.log(
    "S'han trobat " +
      result.affectedRows +
      " contactes i s'han modificat " +
      result.changedRows
  );
});

// S'han trobat 1 i s'han modificat 1
```

With placeholders:

```js
var valorvell = ”123123”;
var valornou = ”321321”;
var sql = ”UPDATE contacte SET tfn = ? WHERE tfn = ?;
con.query(sql, [valornou, valorvell], function(error, result)...
```

With functions:

```js
function canviatfn(tfnvell, tfnnou) {
  var cadena = "UPDATE contacte SET tfn = ? WHERE tfn = ?";
  con.query(cadena, [tfnnou, tfnvell], function (error, result) {
    if (error) throw "Error al modificar els telefons";

    console.log("S'han canviat " + result.changedRows + " contactes");
  });
}

canviatfn("999999", "999999999");
// S'han canviat 1 contacte
```

### Get field names and values

With objects:

```js
for (contacte of result) {
  var linia = ""; // per posar-ho tot en una línia

  // ara llegim els atributs i valors de cada columna
  for (var [clau, valor] of Object.entries(contacte)) {
    // clau serà el nom de la propietat/columna
    // mentre que valor serà el seu valor
    // els anem posant en línia
    linia = linia + " " + clau + ": " + valor;
  }
  // i ho mostrem abans de passar al següent contacte
  console.log(linia);
}

// id: 1 nom: Fidel tfn: 12121212
// id: 2 nom: Pepe tfn: 962851236
// id: 3 nom: Antonio tfn: 987654329
```

With a matrix:

```js
for(fila in result) {
  let numcontacte = parseInt(fila) + 1;

  console.log(“=== Contacte número “+numcontacte+” ===”);

  for(columna in result[fila]) {
    console.log(columna + ": " + result[fila][columna]);
  }
}
// === Contacte 1 ===
// id: 1
// nom: Fidel
// tfn: 12121212
// === Contacte 2 ===
// id: 2
// nom: Pepe
// tfn: 962851236
// === Contacte 3 ===
// id: 3
// nom: Antonio
// tfn: 987654329
```
