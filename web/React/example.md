# Auth example

```jsx
import React, { useState } from "react";
import ReactDOM from "react-dom";

function Contact() {
  const [password] = useState("swordfish");
  const [authorized, setAuthorized] = useState(false);

  const authorize = (e) => {
    e.preventDefault();
    const inputPassword = e.target.querySelector('input[type="password"]').value;
    setAuthorized(inputPassword === password);
  };

  const login = (
    <form action="#" onSubmit={authorize}>
      <input type="password" placeholder="Password" />
      <input type="submit" />
    </form>
  );

  const contactInfo = (
    <ul>
      <li>client@example.com</li>
      <li>555.555.5555</li>
    </ul>
  );

  return (
    <div id="authorization">
      <h1>{authorized ? "Contact" : "Enter the Password"}</h1>
      {authorized ? contactInfo : login}
    </div>
  );
}

ReactDOM.render(<Contact />, document.getElementById("app"));
```
