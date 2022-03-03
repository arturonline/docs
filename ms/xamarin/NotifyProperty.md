# INotify Property Change

```c#
 public class FilterCategory : INotifyPropertyChanged
    {
        private string _cNombre;
        public string cNombre
        {
            get => _cNombre;
            set
            {
                _cNombre = value;
                RaisePropertyChanged("cNombre");
            }
        }

        private bool _lSelected;
        public bool lSelected
        {
            get => _lSelected;
            set
            {
                _lSelected = value;
                RaisePropertyChanged("lSelected");
            }
        }

        public FilterCategory(string cNom, bool lIsSlect)
        {
            cNombre = cNom;
            lSelected = lIsSlect;
        }

        public event PropertyChangedEventHandler PropertyChanged;

        public void RaisePropertyChanged(string propertyName)
        {
            PropertyChanged?.Invoke(this, new PropertyChangedEventArgs(propertyName));
        }
    }
```
