# Hooks example

```jsx
// app.js
import React from 'react';
import SongList from './components/SongList';

function App() {
  return (
    <div className="App">
      <SongList />
    </div>
  );
}

export default App;
```

```jsx
// SoppngList.js
import React, { useEffect, useState } from "react";
import uuid from 'uuid/v1';
import NewSongForm from "./NewSongForm";

const SongList = () => {
  const [songs, setSongs] = useState([
    { title: "Almost home", id: 1 },
    { title: "Memory Gospel", id: 2 },
    { title: "This wild darkness", id: 3 }
  ]);
  const [age, setAge] = useState(20)
  const addSong = (title) => {
    setSongs([...songs, {title: title, id: uuid()}]);
  }
  useEffect(() => {
    console.log("use effect run!!");

  }, [songs]);
  return (
    <div className="song-list">
      <ul>
        {songs.map(song => {
          return <li key={song.id}>{song.title}</li>;
        })}
      </ul>
      <NewSongForm addSong={addSong}/>
      <button onClick={() => setAge(age + 1)}>Add 1 to age: {age}</button>
    </div>
  );
};

export default SongList;
```

```jsx
// NewSongForm.js
import React, { useState } from 'react';

const NewSongForm = ({addSong}) => {
  const [title, setTitle] = useState('');
  const handleSubmit = (e) => {
    e.preventDefault();
    addSong(title);
    setTitle('');
  }
  return ( 
    <form onSubmit={handleSubmit}>
      <p><label>Song name:</label></p>
      <p>
        <input type="text" value={title} required onChange={(e) => setTitle(e.target.value)}/>
        <input type="submit" value="add Song" />
      </p>
    </form>
   );
}

export default NewSongForm;
´´´
