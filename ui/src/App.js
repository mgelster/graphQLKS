import React, { Component } from "react";
import "./bootstrap.min.css";

import "./App.css";
import UserList from "./UserList3";

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img
            src={process.env.PUBLIC_URL + "/img/ksquare.png"}
            className="App-logo"
            alt="logo"
          />
          <h1 className="App-title">People, Process and Project</h1>
        </header>

        <UserList />
      </div>
    );
  }
}

export default App;
