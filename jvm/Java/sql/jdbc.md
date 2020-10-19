# JDBC

## MySQL

### #1: Conexions

```java
package com.ieseljust.ad.BDJugadors;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.SQLException;

public class MySqlConnect {

    public static void main(String[] args) throws SQLException, ClassNotFoundException {

        // Carreguem el driver
        Class.forName("com.mysql.cj.jdbc.Driver");

        String connectionUrl = "jdbc:mysql://localhost:3308/BDJocs?useUnicode=true&characterEncoding=UTF-8&user=root&password=root";


        Connection conn = DriverManager.getConnection(connectionUrl);

        // Preparem la consulta i la executem
        ResultSet rs = conn.prepareStatement("show tables").executeQuery();
        System.out.println("\nTaules de la base de dades: \n");

        while(rs.next()) {
            String s = rs.getString(1);
            System.out.println(s);

        }

        System.out.println("\nRegistres de la taula Genere: \n");
        rs = conn.prepareStatement("select * from Genere").executeQuery();

        while(rs.next()) {
            String id = rs.getString(1);
            String nom = rs.getString(2);
            String desc = rs.getString(3);
            System.out.println(id + " " + nom + " " + desc);

        }
    }
}
```

### #2: Peticions

#### ExecuteUpdate

Executa sentències que no s’espera que retornen dades, sinò que serviran per modificar la base de dades connectada (consultes `INSERT`, `DELETE`, `UPDATE`, `CREATE TABLE`)

```java
package com.ieseljust.ad.BDJugadors;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.sql.Statement;

public class inserirJocs {
    public static void main(String[] args) {
        Connection con = null;
        Statement st = null;
        String sentSQL = null;

        try {
            Class.forName("com.mysql.cj.jdbc.Driver");

            String connectionUrl = "jdbc:mysql://localhost:3308/BDJocs?useUnicode=true&characterEncoding=UTF-8&user=root&password=root";

            con = DriverManager.getConnection(connectionUrl);
            st = con.createStatement();

            sentSQL = "INSERT INTO Joc VALUES (1, 'Double Dragon', 'Dos germans bessons experts en arts marcials s`han de fer camí en un escenari urbà on membres de bandes rivals volen deixar-los fora de combat.', 1);";

            st.executeUpdate(sentSQL);

            sentSQL = "INSERT INTO Joc VALUES (2, 'Tetris', 'Tetris és un videojoc de tipus trencaclosques inventat per l` enginyer informàtic rus Aleksei Pàjitnov l`any 1985 mentre treballava a l`Académia de Ciéncies de Moscou', 4);";
            st.executeUpdate(sentSQL);

        } catch (SQLException ex) {

            System.out.println("Error " + ex.getMessage());
        } catch (ClassNotFoundException ex) {
            System.out.println("No s'ha trobat el controlador JDBC (" + ex.getMessage() + ")");

        } finally {
            try {
                if (st != null && !st.isClosed()) {
                st.close();
                }
            } catch (SQLException ex) {
                System.out.println("No s'ha pogut tancar el Statement");
            }

            try {
                if (con != null && !con.isClosed()) {
                con.close();
                }
            } catch (SQLException ex) {
                System.out.println("No s'ha pogut tancar la connexió");
            }
        }
    }
}
```

#### ExecuteQuery

Executa sentències de les que esperem que tornen dades (consultes SELECT). Aquests resultats es guarden en un objecte de la classe `ResultSet`, que representa un conjunt de resultats.

```java
package com.ieseljust.ad.BDJugadors;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.sql.Statement;

public class inserirJocs {
    public static void main(String[] args) {
        Connection con = null;
        Statement st = null;
        String sentSQL = null;
        ResultSet rs = null;

        try {
            Class.forName("com.mysql.cj.jdbc.Driver");

            String connectionUrl = "jdbc:mysql://localhost:3308/BDJocs?useUnicode=true&characterEncoding=UTF-8&user=root&password=root";

            con = DriverManager.getConnection(connectionUrl);
            st = con.createStatement();

            sentSQL = "select * from Genere";
            rs = st.executeQuery(sentSQL);

            System.out.println("\nRegistres de la taula Genere: \n");

            while(rs.next()) {
                String id = rs.getString(1);
                String nom = rs.getString(2);
                String desc = rs.getString(3);
                System.out.println(id + " " + nom + " " + desc);

            }

        } catch (SQLException ex) {

            System.out.println("Error " + ex.getMessage());
        } catch (ClassNotFoundException ex) {
            System.out.println("No s'ha trobat el controlador JDBC (" + ex.getMessage() + ")");

        } finally {
            try {
                if (st != null && !st.isClosed()) {
                st.close();
                }
            } catch (SQLException ex) {
                System.out.println("No s'ha pogut tancar el Statement");
            }

            try {
                if (con != null && !con.isClosed()) {
                con.close();
                }
            } catch (SQLException ex) {
                System.out.println("No s'ha pogut tancar la connexió");
            }
        }
    }
}
```

#### Alliberament dels recursos

```java
try {

    // tot el codi

} catch (SQLException ex) {

            System.out.println("Error " + ex.getMessage());
        } catch (ClassNotFoundException ex) {
            System.out.println("No s'ha trobat el controlador JDBC (" + ex.getMessage() + ")");

        } finally {
            try {
                if (st != null && !st.isClosed()) {
                st.close();
                }
            } catch (SQLException ex) {
                System.out.println("No s'ha pogut tancar el Statement");
            }

            try {
                if (con != null && !con.isClosed()) {
                con.close();
                }
            } catch (SQLException ex) {
                System.out.println("No s'ha pogut tancar la connexió");
            }
        }
```
