using System.Data.Common;
using System.Reflection.Metadata;

public bool TryGetUser(int id, out User user) {
    user = GetUserFromDatabase(id);
    return user != null;
}


if (TrygetUser(1342, out var user)) {
    Console.WriteLine($"User found: {user}");
} else {
    Console.WriteLine("User not found.");
}