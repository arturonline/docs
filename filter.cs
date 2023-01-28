using System.Collections.Generic;
using GESMOBILE_Inventory.Models;
using GESMOBILE_Inventory.Src.T;
using GESMOBILE_Inventory.ViewModels;
using Syncfusion.ListView.XForms;
using Xamarin.Forms;
using DryIoc;
using Prism.Ioc;

namespace GESMOBILE_Inventory.Behaviors
{
    public class FilterBehavior : Behavior<ContentView>
    {
        #region Bindable Properties

        /// <summary>
        /// El listview donde se mostraran los resultados del filtro
        /// </summary>
        public static readonly BindableProperty FilterListViewProperty = BindableProperty.Create(
        nameof(ListViewToFilter),
        typeof(string),
        typeof(FilterBehavior),
        "Lista");

        public string ListViewToFilter
        {
            get => (string)GetValue(FilterListViewProperty);
            set => SetValue(FilterListViewProperty, value);
        }

        /// <summary>
        /// La barra de busqueda que hara de filtro
        /// </summary>
        public static readonly BindableProperty SearchBarProperty = BindableProperty.Create(
        nameof(FilterEntry),
        typeof(string),
        typeof(FilterBehavior),
        "FilterEntry");

        public string FilterEntry
        {
            get => (string)GetValue(SearchBarProperty);
            set => SetValue(SearchBarProperty, value);
        }
        #endregion Bindable Properties

        private SfListView oListView;
        private Entry oSearchBar;
        private TCfgFiltros filtros;

        public FilterBehavior() { }

        protected override void OnAttachedTo(ContentView bindable)
        {
            oListView = bindable.FindByName<SfListView>(ListViewToFilter);
            oSearchBar = bindable.FindByName<Entry>(FilterEntry);
            oSearchBar.TextChanged += SearchBar_TextChanged;

            filtros = ((App)Application.Current).Container.Resolve<TCfgFiltros>();

            base.OnAttachedTo(bindable);
        }

        private void SearchBar_TextChanged(object sender, TextChangedEventArgs e)
        {

            if (oListView.DataSource != null)
            {
                oListView.DataSource.Filter = FilterData;
                oListView.DataSource.RefreshFilter();
            }
            oListView.RefreshView();
        }

        private bool FilterData(object obj)
        {
            if (oSearchBar?.Text == null) return true;

            var stringSearched = oSearchBar.Text.ToLower();

            switch (obj)
            {
                case Articulo xarticulo:
                    return FiltroArticulo(xarticulo, stringSearched);
                case ItemModel itemModel:
                    return FiltroItemModel(itemModel, stringSearched);

                // Aquí más Filtros
            }

            return false;
        }

        // TODO: Implementar filtros
        private bool FiltroArticulo(Articulo xarticulo, string stringSearched)
        {
            bool resultado = false;
            filtros = ((App)Application.Current).Container.Resolve<TCfgFiltros>();
            foreach (var filtro in filtros.aFiltroArticulos)
            {
                switch (filtro.cNombre)
                {
                    case "Codigo":
                        resultado = resultado || xarticulo.Codigo.ToLower().Contains(stringSearched);
                        break;
                    case "Nombre":
                        resultado = resultado || xarticulo.Nombre.ToLower().Contains(stringSearched);
                        break;
                    case "CodigoFamilia":
                        resultado = resultado || xarticulo.CodigoFamilia.ToLower().Contains(stringSearched);
                        break;
                    case "NombreFamilia":
                        resultado = resultado || xarticulo.NombreFamilia.ToLower().Contains(stringSearched);
                        break;
                }
            }

            //var result = xarticulo.Codigo.ToLower().Contains(stringSearched)
            //               || xarticulo.Nombre.ToLower().Contains(stringSearched)
            //               || xarticulo.CodigoFamilia.ToLower().Contains(stringSearched)
            //               || xarticulo.NombreFamilia.ToLower().Contains(stringSearched);

            return resultado;
        }

        private bool FiltroItemModel(ItemModel itemModel, string stringSearched)
        {
            bool resultado = false;
            foreach (var filtro in filtros.aFiltroArticulos)
            {
                switch (filtro.cNombre)
                {
                    case "Codigo":
                        resultado = resultado || itemModel.Codigo.ToLower().Contains(stringSearched);
                        break;
                    case "Nombre":
                        resultado = resultado || itemModel.Nombre.ToLower().Contains(stringSearched);
                        break;
                }
            }

            //var result = itemModel.Codigo.ToLower().Contains(stringSearched)
            //              || itemModel.Nombre.ToLower().Contains(stringSearched);

            return resultado;
        }
    }
}
