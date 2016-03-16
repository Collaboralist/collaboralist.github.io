import React from "react";
import {Motion, spring} from 'react-motion';
import range from 'lodash.range';
import autobind from 'autobind-decorator';

const springConfig = {stiffness: 300, damping: 25};

@autobind
class Item extends React.Component {
  constructor() {
    super();

    this.state = {
      itemHovered: false,
      reorderHovered: false,
      reorderPressed: false
    }
  }

  componentDidMount() {
    window.addEventListener('touchend', this.reorderMouseUp);
    window.addEventListener('mouseup', this.reorderMouseUp);
  }

  itemMouseOver() {
    this.setState({
      itemHovered: true
    });
  }
  itemMouseOut() {
    this.setState({
      itemHovered: false
    });
  }

  reorderMouseOver() {
    this.setState({
      reorderHovered: true
    });
  }
  reorderMouseOut() {
    this.setState({
      reorderHovered: false
    });
  }

  reorderMouseDown(event, orderIndex, order) {
    this.setState({
      reorderPressed: true
    });
    this.props.handleReorderStart(event, orderIndex, order.indexOf(orderIndex) * 50);
  }
  reorderMouseUp() {
    this.setState({
      reorderPressed: false
    });
  }

  chechmarkClick() {
    var props = this.props;
    var key = props.index;
    var orderIndex = props.orderIndex;
    this.props.checkItem(key);
    if (this.props.autoDelete) {
      setTimeout(function() {
        props.deleteItem(key, orderIndex);
      }, 600)
    }
  }

  confirmChange(event) {
    event.preventDefault();
    var details = this.props.details;
    var key = this.props.index;
    this.props.updateItem(key, this.itemText.value);
    this.itemText.value = details.count ? `${details.count} - ${details.name}` : `${details.name}`;
    this.itemText.blur();
  }

  render() {
    const mouse = this.props.mouse;
    const isPressed = this.props.isPressed;
    const initialOrder = this.props.initialOrder;

    const order = this.props.order.length !== 0 ? this.props.order : range(Object.keys(this.props.items).length);
    const lastPressed = this.props.lastPressed;
    const orderIndex = this.props.orderIndex;
    const style = lastPressed === orderIndex && isPressed
      ? {
          scale: spring(1.06, springConfig),
          shadow: spring(12, springConfig),
          y: mouse - (orderIndex * 50)
        }
      : {
          scale: spring(1, springConfig),
          shadow: spring(0, springConfig),
          y: spring((order.indexOf(orderIndex) - initialOrder.indexOf(orderIndex)) * 50, springConfig)
        };

    var details = this.props.details;
    var self = this;
    return (
      <Motion style={style} key={orderIndex}>
        {({scale, shadow, y}) =>
          <li className="list-item"
              onMouseOver={this.itemMouseOver}
              onMouseOut={this.itemMouseOut}
              style={{
                  boxShadow: `rgba(0, 0, 0, 0.2) 0px ${shadow}px ${2 * shadow}px 0px`,
                  transform: `translate3d(0, ${y}px, 0) scale(${scale})`,
                  WebkitTransform: `translate3d(0, ${y}px, 0) scale(${scale})`,
                  zIndex: orderIndex === lastPressed ? 99 : orderIndex
                }}>
            <div>
              <div className={`checkmark-container ${details.checked ? "unselectable" : ""}`}
                   style={{borderColor: details.checked ? "#99ff8c" : "#cfcfcf"}}
                   onClick={!details.checked ? self.chechmarkClick : null}>
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
              </div>
              <form onSubmit={self.confirmChange}>
                <input className={`item-text ${isPressed ? "unselectable" : ""}`}
                       ref={(ref) => this.itemText = ref}
                       disabled={details.checked || isPressed ? "disabled" : ""}
                       onBlur={self.confirmChange}
                       defaultValue={details.count ? `${details.count} - ${details.name}` : `${details.name}`}/>
              </form>
              <div className={`reorder-button ${!(details.checked && this.props.autoDelete) ? "grabbable" : ""}`}
                   onMouseOver={!(details.checked && this.props.autoDelete) ? this.reorderMouseOver : null}
                   onMouseOut={!(details.checked && this.props.autoDelete) ? this.reorderMouseOut : null}
                   onMouseDown={!(details.checked && this.props.autoDelete) ? function(event) {self.reorderMouseDown(event, orderIndex, order)} : null}>
                <span className="glyphicon glyphicon-menu-hamburger"
                      style={{opacity: this.state.reorderHovered || this.state.reorderPressed ? 0.6 : 0.2,
                              display: (this.state.itemHovered || this.state.reorderPressed) && !(details.checked && this.props.autoDelete) ? "initial" : "none"}}></span>
              </div>
            </div>
          </li>
        }
      </Motion>
    )
  }
}

export default Item;