public class Parent
{
    public async Task CargarUno()
    {
        AssemblyLoadContext loadContext = null;

        try
        {
            // Create a new context and mark it as 'collectible'.
            string tempLoadContextName = Guid.NewGuid().ToString();
            loadContext = new AssemblyLoadContext(tempLoadContextName, true);

            // Load the assembly we wish to use into the new context.
            const string pathToAssembly = @"D:\source\dll1\pruebadll1.dll";
            Assembly assembly = loadContext.LoadFromAssemblyPath(pathToAssembly);

            // Create an instance of a class from the assembly.
            Type classType = assembly.GetType("pruebadll1.DynamicExample");
            dynamic classInstance = Activator.CreateInstance(classType);

            // Get the Main method
            MethodInfo mainMethod = classType.GetMethod("Main", BindingFlags.Public | BindingFlags.Static);

            // create parameters
            object[] parameters = [_app.ConnectionStringLocal, this];

            // Call the Main method with parameters on the object and get the result. 
            object result = mainMethod.Invoke(null, parameters);
        }
        finally
        {
            // Unload the context.
            loadContext.Unload();
        }
    }

    // Recoge los datos desde la dll
    public void RecogerDatos()
    {
        System.Windows.MessageBox.Show(resultat);

    }
}