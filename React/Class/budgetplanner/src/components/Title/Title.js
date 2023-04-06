import react from "react";
import Style from "./Title.style";

class Title extends react.Component {
  render() {
    return (
      <div className="title" style={Style.title}>{this.props.text}</div>
    );
  }
}
export default Title;