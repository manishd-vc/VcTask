import React from "react";


function LoginButton(props) {
  return (
    <button onClick={props.onClick}>
      Login
    </button>
  );
}

function LogoutButton(props) {
  return (
    <button onClick={props.onClick}>
      Logout
    </button>
  );
}

class App extends React.Component {
  constructor(props) {
    super(props);
    // this.handleLoginClick = this.handleLoginClick.bind(this);
    // this.handleLogoutClick = this.handleLogoutClick.bind(this);
    this.state = { isLoggedIn: false };
  }

  handleLoginClick() {
    console.log('this is:', this);
    this.setState({ isLoggedIn: true });
  }

  handleLogoutClick() {
    console.log('this is:', this);
    this.setState({ isLoggedIn: false });
  }

  render() {
    const isLoggedIn = this.state.isLoggedIn;
    let button;
    if (isLoggedIn) {
      button = <LogoutButton onClick={(e) => this.handleLogoutClick()} />;
    } else {
      button = <LoginButton onClick={(e) => this.handleLoginClick()} />;
    }
    return (
      <div>
        {/* <Greeting isLoggedIn={isLoggedIn} /> */}
        {button}
      </div>
    );
  }
}

export default App;
