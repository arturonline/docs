# Base de dades

- Crear analisis.
- Crear **List Page** y añadir looper con analisis.
- crear **Form Page** y arrastrar campos del analisis.
- añadir a la action bar de la pagina del looper un boton **add**.
- añadir a la action bar de la pagina form un boton **ok**.



## List Page (with looper)

- **Event**: *closing a child window*

    ```python
    LooperDisplay(looper, tacurrentSelection)
    ```
- **add** button:
    
    ```python
    HReset(item)
    OpenMobileWindow(form_page)
    ```
- Looper **event**:  *Selecting a row of looper*

    ```python
    OpenMobileWindow(form_page)
    ```

## Form page

- **Event**: *End of initialization*

    ```python
    FileToScreen()
    ```
- **ok** button:
    
    ```python
    ScreenToFile()
    HSave(Joke)
    Close()
    ```
- 