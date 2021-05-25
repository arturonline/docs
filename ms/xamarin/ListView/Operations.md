# CRUD Operations

<https://www.youtube.com/watch?v=mBlzs5owIEY&t=7s>

```xml
<?xml version="1.0" encoding="utf-8" ?>
<ContentPage xmlns="http://xamarin.com/schemas/2014/forms"
             xmlns:x="http://schemas.microsoft.com/winfx/2009/xaml"
             xmlns:local="clr-namespace:ListMVVM"
             x:Class="ListMVVM.MainPage">

    <ContentPage.BindingContext>
        <local:EmployeeListViewModel />
    </ContentPage.BindingContext>

    <ContentPage.Content>
        <StackLayout>
            <Entry Placeholder="Employee name" Text="{Binding EmployeeName}"/>
            <Button Text="Add" Command="{Binding AddEmployeeCommand}"/>
            <Button Text="Remove" Command="{Binding RemoveEmployeeCommand}" />
            <Button Text="Update" Command="{Binding UpdateEmployeeCommand}" />

            <ListView x:Name="lvEmployees"
                      ItemsSource="{Binding Employees}"
                      SelectedItem="{Binding SelectedEmployee}">

            </ListView>

        </StackLayout>
    </ContentPage.Content>

</ContentPage>
```

```cs
// EmployeeListViewModel.cs
class EmployeeListViewModel
{
    public ObservableCollection<string> Employees { get; set; }
    public string EmployeeName { get; set; }
    public string SelectedEmployee { get; set; }

    public ICommand AddEmployeeCommand => new Command(AddEmployee);
    public ICommand RemoSelectedEmployeeveEmployeeCommand => new Command(RemoveEmployee);
    public ICommand UpdateEmployeeCommand => new Command(UpdateEmployee);

    public EmployeeListViewModel()
    {
        Employees = new ObservableCollection<string>
        {
            "Artur",
            "Ana",
            "Paco",
            "Carmina",
            "Pepe"
        };
    }

    public void AddEmployee()
    {
        Employees.Add(EmployeeName);
    }

    public void RemoveEmployee()
    {
        Employees.Remove(SelectedEmployee);
    }

    public void UpdateEmployee()
    {
        int NewIndex = Employees.IndexOf(SelectedEmployee);
        Employees.Remove(SelectedEmployee);

        Employees.Add(EmployeeName);
        int OldIndex = Employees.IndexOf(EmployeeName);

        Employees.Move(OldIndex, NewIndex);
    }
}
```