import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Configuration from './Configuration';
import Header from './Header';
import Editor from './Editor';
import Output from './Output';
import { VerticalSplitter, HorizontalSplitter } from './Splitter';

function ConfigurationModal() {
  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <Configuration  />
      </div>
    </div>
  );
}

const Wow = ({ splitOrientation, showOutput, children }) => (
  <div className={`xxx xxx--${splitOrientation}`}>
    <div className="xxx__horizontal">
      <HorizontalSplitter disabled={!showOutput}>
        { children[0] }
        { children[1] }
      </HorizontalSplitter>
    </div>
    <div className="xxx__vertical">
      <VerticalSplitter disabled={!showOutput}>
        { children[0] }
        { children[1] }
      </VerticalSplitter>
    </div>
  </div>
);

class Playground extends React.Component {
  render() {
    const { showConfig, focus, splitOrientation } = this.props;

    return (
      <div>
        { showConfig && <ConfigurationModal /> }
        <div className="playground">
          <div className="playground-header">
            <Header />
          </div>
          <Wow splitOrientation={splitOrientation} showOutput={false}>
            <div className="playground-editor">
              <Editor />
            </div>
            <div className="playground-output">
              <Output />
            </div>
          </Wow>
        </div>
      </div>
    );
  }

  componentDidUpdate(prevProps, _prevState) {
    if (this.props.focus !== prevProps.focus) {
      // Inform the ACE editor that its size has changed.
      try {
        window.dispatchEvent(new Event('resize'));
      } catch (ex) {
        // IE 11
        const evt = window.document.createEvent('UIEvents');
        evt.initUIEvent('resize', true, false, window, 0);
        window.dispatchEvent(evt);
      }
    }
  }
}

Playground.propTypes = {
  focus: PropTypes.string,
  showConfig: PropTypes.bool.isRequired,
  splitOrientation: PropTypes.string.isRequired,
};

const mapStateToProps = ({
  configuration: { shown: showConfig, orientation: splitOrientation },
  output: { meta: { focus } },
}) => (
  { showConfig, focus, splitOrientation }
);

const ConnectedPlayground = connect(
  mapStateToProps
)(Playground);

export default ConnectedPlayground;
