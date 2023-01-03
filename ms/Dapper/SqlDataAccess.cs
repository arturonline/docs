using System.Data;
using System.Data.SqlClient;
using Dapper;
using Microsoft.Extensions.Configuration;

namespace DatabaseLibrary;

public class SqlDataAccess : ISqlDataAccess
{
    private readonly IConfiguration _config;

    public SqlDataAccess(IConfiguration config)
    {
        _config = config;
    }

    #region Consultas SQL

    /// <summary>
    /// Ejecuta una consulta en la base de datos.
    /// </summary>
    /// <typeparam name="T">Tipo de datos devueltos</typeparam>
    /// <typeparam name="U">Tipo de los parametros pasados</typeparam>
    /// <param name="query">Consulta que lanzamos</param>
    /// <param name="parameters">Parametros de la consulta</param>
    /// <example>
    /// Ejemplo:
    /// <code>
    /// public Task<List<Usuario>> GetUsuarios()
    /// {
    ///     var sql = "SELECT * FROM Usuarios";
    ///     return _db.LoadData<Usuario, dynamic>(sql, new { });
    /// }
    /// </code>
    /// </example>
    /// <returns>Lista de filas que hemos preguntado.</returns>
    public async Task<List<T>> Query<T, U>(string query, U parameters, string connectionId = "Default")
    {
        using IDbConnection connection = new SqlConnection(_config.GetConnectionString(connectionId));
        var data = await connection.QueryAsync<T>(query, parameters);

        return data.ToList();
    }

    /// <summary>
    /// Ejecuta una consulta en la base de datos y devuelve el primer resultado
    /// </summary>
    /// <param name="query">Consulta ejecutada</param>
    /// <typeparam name="T">Tipo del parametro devuelto</typeparam>
    /// <param name="parameters">Parametros de la consulta</param>
    /// <returns>El primer resultado de la primera columna</returns>
    public async Task<T> QueryScalar<T>(string query, T parameters, string connectionId = "Default")
    {
        using IDbConnection connection = new SqlConnection(_config.GetConnectionString(connectionId));

        return await connection.ExecuteScalarAsync<T>(query, parameters);
    }

    /// <summary>
    /// Ejecuta una sentencia SQL en la base de datos.
    /// </summary>
    /// <typeparam name="T">Tipo de los parametros</typeparam>
    /// <param name="query">Consulta que ejecutamos</param>
    /// <param name="parameters">Parametros pasados en la sentencia SQL</param>
    /// <example>
    /// Ejemplo:
    /// <code>
    /// public Task InsertUsuario(Usuario usuario)
    /// {
    ///     var sql = "INSERT INTO Usuarios (Nombre, Apellidos, Edad) VALUES (@Nombre, @Apellidos, @Edad)";
    ///     return _db.Execute(sql, usuario);
    /// }
    /// </code>
    /// </example>
    /// <returns>Número de filas afectadas</returns>
    public async Task<int> Execute<T>(string query, T parameters, string connectionId = "Default")
    {
        using IDbConnection connection = new SqlConnection(_config.GetConnectionString(connectionId));

        return await connection.ExecuteAsync(query, parameters);
    }

    #endregion

    #region Consultas mediante Procemientos


    /// <summary>
    /// Lanza una consulta a la base de datos en forma de procedimiento
    /// </summary>
    /// <param name="storedProcedure">Nombre del procedimiento</param>
    /// <param name="parameters">parametros del procedimiento</param>
    /// <param name="connectionId">Identifcador de la cadena de conexión</param>
    /// <typeparam name="T">Parametro genérico</typeparam>
    /// <typeparam name="U">Parametro genérico</typeparam>
    /// /// <example>
    /// Ejemplo con varios executes en uno:
    /// <code>
    /// public Task<UserModel?> GetUser(int id)
    /// {     
    ///    var results = await _db.LoadData<UserModel, dynamic>("dbo.spUserGet", new { Id = id });
    ///    return results.FirstOrDefault();
    /// }
    /// </code>
    /// results in <c>p</c>'s having the value (2,8).
    /// </example>
    /// <returns>Lista con resultados</returns>
    public async Task<IEnumerable<T>> QueryProcedure<T, U>(string storedProcedure, U parameters, string connectionId = "Default")
    {
        using IDbConnection connection = new SqlConnection(_config.GetConnectionString(connectionId));
        
        return await connection.QueryAsync<T>(storedProcedure, parameters, commandType: CommandType.StoredProcedure);
    }


    /// <summary>
    /// Lanza una operación de modificación a la base de datos en forma de procedimiento
    /// La operación podrá ser: insert, update, delete 
    /// </summary>
    /// <param name="query">Nombre del procedimiento</param>
    /// <param name="parameters">parametros del procedimiento</param>
    /// <param name="connectionId">Identifcador de la cadena de conexión</param>
    /// <typeparam name="T">Parametro genérico</typeparam>
    /// <example>
    /// Ejemplo con varios executes en uno:
    /// <code>
    /// public Task InsertUser(UserModel user)
    /// {     
    ///    _db.Execute("dbo.sp_AddUser", new { user.Name, user.LastName });
    /// }
    /// </code>
    /// results in <c>p</c>'s having the value (2,8).
    /// </example>
    /// <returns>El número de filas afectadas</returns>
    public async Task<int> ExecuteProcedure<T>(string query, T parameters, string connectionId = "Default")
    {
        using IDbConnection connection = new SqlConnection(_config.GetConnectionString(connectionId));

        return await connection.ExecuteAsync(query, parameters, commandType: CommandType.StoredProcedure);
    }

    #endregion

}