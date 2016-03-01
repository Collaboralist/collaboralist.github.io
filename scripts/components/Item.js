import React from "react";
import autobind from 'autobind-decorator';

@autobind
class Item extends React.Component {
  onButtonClick() {
    var key = this.props.index;
    this.props.checkItem(key);
  }

  render() {
    var details = this.props.details;
    return (
      <li className="list-item" onClick={this.onButtonClick}>
        <div>
          <div className="checkmark-space" dangerouslySetInnerHTML={{ __html: `<svg
        version="1.1"
        id="Layer_1"
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
        x="0px"
        y="0px"
        viewBox="0 0 98.5 98.5"
        enable-background="new 0 0 98.5 98.5"
        xml:space="preserve">
          <path
          class="${details.checked ? "checkmark" : ""}"
          fill="none"
          stroke-width="8"
          stroke-miterlimit="10"
          d="M81.7,17.8C73.5,9.3,62,4,49.2,
          4C24.3,4,4,24.3,4,49.2s20.3,45.2,
          45.2,45.2s45.2-20.3,
          45.2-45.2c0-8.6-2.4-16.6-6.5-23.4l0,0L45.6,
          68.2L24.7,47.3"/>
      </svg>` }}></div>
          <div className="item-count" style={{borderColor: details.checked ? "#99ff8c" : ""}}>{details.count}</div>
          <div className="item-name">{details.name}</div>
        </div>
      </li>
    )
  }
}

export default Item;