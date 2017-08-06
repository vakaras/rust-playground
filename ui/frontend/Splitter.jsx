import React from 'react';
import PropTypes from 'prop-types';
const { Image } = window;

const HorizontalHandle = () => <span className="horizontal-split__handle">===</span>;

export class HorizontalSplitter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      percentage: 0.5,
    };
    this.onPercentageChange = this.onPercentageChange.bind(this);
  }

  render() {
    return (
      <SplitterCore className="horizontal-split"
                    onlyFirst={this.props.onlyFirst}
                    onChange={this.onPercentageChange}
                    percentage={this.state.percentage}
                    handle={HorizontalHandle}>
        { this.props.children }
      </SplitterCore>
    );
  }

  onPercentageChange(percentageX, percentageY) {
      this.setState(state => ({
        ...state,
        percentage: percentageY,
      }));
  }
}

const VerticalHandle = () => <span className="vertical-split__handle">|</span>;

export class VerticalSplitter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      percentage: 0.5,
    };
    this.onPercentageChange = this.onPercentageChange.bind(this);
  }

  render() {
    return (
      <SplitterCore className="vertical-split"
                    onlyFirst={this.props.onlyFirst}
                    onChange={this.onPercentageChange}
                    percentage={this.state.percentage}
                    handle={VerticalHandle}>
        { this.props.children }
      </SplitterCore>
    );
  }

  onPercentageChange(percentageX, percentageY) {
      this.setState(state => ({
        ...state,
        percentage: percentageX,
      }));
  }
}

const TRANSPARENT_GIF = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";

class SplitterCore extends React.Component {
  constructor(props) {
    super(props);
    this.handleImage = new Image();
    this.handleImage.src = TRANSPARENT_GIF;
  }

  render() {
    const { className, handle: Handle, onlyFirst, children } = this.props;
    const [first, second] = children;

    const percentage = onlyFirst ? 1 : this.props.percentage;

    return (
      <div className={className} ref={c => this._container = c}>
        { React.cloneElement(first, {style: { flexBasis: `${percentage * 100}%` }}) }
        { !onlyFirst && Handle &&
            <div draggable ref={h => this._handle = h}>
              <Handle />
            </div>
        }
        { !onlyFirst && second }
      </div>
    );
  }

  componentDidMount() {
    this.watchHandleEvents();
  }

  componentDidUpdate() {
    this.watchHandleEvents();
  }

  watchHandleEvents() {
    if (this._handle === this._handleKnown) { return; }
    this._handleKnown = this._handle;

    if (!this._handle) { return; }

    console.log("running setup");

    this._handle.ondragstart = e => {
      // Do not use the default ghosted drag handle, just let the boxes resize
      e.dataTransfer.setDragImage(this.handleImage, 0, 0);
    };

    this._handle.ondrag = e => {
      if (e.buttons == 0) {
        // No mouse buttons are pressed; user has likely let go
        return;
      }

      const containerBounds = this._container.getBoundingClientRect();
      const handleBounds = this._handle.getBoundingClientRect();

      const handleMiddleX = e.clientX - handleBounds.width / 2;
      const relativePositionX = handleMiddleX - containerBounds.left;
      const rawPercentageX = relativePositionX / containerBounds.width;
      const percentageX = clampToOne(rawPercentageX);

      const handleMiddleY = e.clientY - handleBounds.height / 2;
      const relativePositionY = handleMiddleY - containerBounds.top;
      const rawPercentageY = relativePositionY / containerBounds.height;
      const percentageY = clampToOne(rawPercentageY);

      console.log(percentageX.toFixed(2), percentageY.toFixed(2));

      this.props.onChange(percentageX, percentageY);
    };
  }
}

const clampToOne = val => Math.max(Math.min(val, 1.0), 0);
