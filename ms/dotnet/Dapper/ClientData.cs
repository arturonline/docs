public class ClientData : IClientData
{
    private readonly ISqlDataAccess _db;
    
    public ClientData(ISqlDataAccess db)
    {
        _db = db;
    }

    /// <summary>
    /// Obtiene todos los empleados
    /// </summary>
    /// <returns></returns>
    public Task<IEnumerable<Client>?> GetUsers()
    {
        return _db.LoadData<Client, dynamic>("CRM.sp_GetClientes", new { });
    }

    /// <summary>
    /// Obtiene un empleado
    /// </summary>
    /// <param name="id">Parametro que identifica al empleado</param>
    /// <returns></returns>
    public async Task<Client?> GetUser(int id)
    {
        var results = await _db.LoadData<Client, dynamic>("dbo.spGetUser", new { Id = id });

        return results.FirstOrDefault();
    }

    /// <summary>
    /// Añade un empleado a la base de datos
    /// </summary>
    /// <param name="user"></param>
    /// <returns></returns>
    public Task InsertUser(Client user)
    {
        return _db.SaveData("dbo.spAddUser", user ); // Todas las propiedades sin Id
    }

    /// <summary>
    /// Actualiza un empleado
    /// </summary>
    /// <param name="user"></param>
    /// <returns></returns>
    public Task UpdateUser(Client user)
    {
        return _db.SaveData("dbo.spUpdUser", user); 
    }

    /// <summary>
    /// Borra un empleado de la base de datos
    /// </summary>
    /// <param name="id">Identificador del empleado</param>
    /// <returns></returns>
    public Task DeleteUser(int id)
    {
        return _db.SaveData("dbo.spDelUser", new { Id = id });  
    }
}