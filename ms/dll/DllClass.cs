using RutasWinDesktop.ViewModels;
using System.Windows;
using System.Windows.Controls;

namespace pruebadll1
{
    public class DynamicExample
    {
        public static void Main(string cad, object sender)
        {
            var o = (HomePageViewModel)sender;
            MyWindow myWindow = new(o);
            myWindow.Show();
        }
    }

    public class MyWindow : Window
    {
        HomePageViewModel hp;
        public MyWindow(HomePageViewModel o)
        {
            hp = o;

            Title = "My WPF Window";
            Width = 222;
            Height = 300;

            // Create a Grid layout
            Grid grid = new();
            Content = grid;

            // Define rows and columns
            grid.RowDefinitions.Add(new RowDefinition());
            grid.RowDefinitions.Add(new RowDefinition());
            grid.ColumnDefinitions.Add(new ColumnDefinition());

            // Create a TextBox and add it to the Grid
            TextBox textBox = new()
            {
                Margin = new Thickness(10),
            };
            Grid.SetRow(textBox, 0);
            Grid.SetColumn(textBox, 0);
            grid.Children.Add(textBox);

            // Create a Button and add it to the Grid
            Button button = new()
            {
                Content = "Click Me",
                Margin = new Thickness(10),
            };
            Grid.SetRow(button, 1);
            Grid.SetColumn(button, 0);
            grid.Children.Add(button);

            // Add Click event handler to the Button
            button.Click += Button_Click;
        }

        private void Button_Click(object sender, RoutedEventArgs e)
        {
            hp.resultat = "CAMBIADO!";
            // Llama a metodo de la clase padre para recoger resultados
            hp.RecogerDatos();
        }
    }
}
