import react from "react";

class App extends react.Component {
  constructor(props) {
    super(props);
    this.state = {
      x: 0,
      y: 0,
      color: "pink",
    };
  }

  componentDidMount() {
    console.log("component mount");
    document.addEventListener("mousemove", this.onMousePositionChange);
  }

  componentWillUnmount() {
    console.log("component unmount");
    document.removeEventListener("mousemove", this.onMousePositionChange);
  }

  onMousePositionChange = (event) => {
    let coordinateX = event.clientX;
    let coordinateY = event.clientY;
    console.log("x=", coordinateX, " y=", coordinateY);
    this.setState({
      x: coordinateX,
      y: coordinateY,
    });
    if (coordinateX > coordinateY) {
      this.setState({
        color: "yellow",
      });
    } else if (coordinateY > coordinateX) {
      this.setState({
        color: "green",
      });
    } else if (coordinateY === coordinateX) {
      this.setState({
        color: "white",
      });
    }
  };

  render() {
    return (
      <div style={{ backgroundColor: this.state.color, height: "100vh", width: "100vw" }}>
        <div>
          coordinateX:{this.state.x}
          <br />
          coordinateY:{this.state.y}
        </div>
      </div>
    );
  }
}

export default App;
