import React from "react";

export default class TaskResponse extends React.Component {
  handleChange = e => {
    const { player } = this.props;
    const value = e.currentTarget.valueAsNumber;
    player.round.set("value", value);
  };

  handleSubmit = event => {
    event.preventDefault();
    this.props.player.stage.submit();
  };

  renderSubmitted() {
    return (
      <div className="task-response">
        <div className="response-submitted">
          <h5>Waiting on other players...</h5>
          Please wait until all players are ready
        </div>
      </div>
    );
  }

  renderSlider() {
    const { player } = this.props;
    const value = player.round.get("value") || 0;
    return (
      <input
        type="range"
        id="value"
        name="value"
        min="0"
        max="1"
        onChange={this.handleChange}
        value={value}
        step={0.01}
      />

      // <Slider
      //   min={0}
      //   max={1}
      //   stepSize={0.01}
      //   labelStepSize={0.25}
      //   onChange={this.handleChange}
      //   value={value}
      //   hideHandleOnEmpty
      // />
    );
  }

  render() {
    const { player } = this.props;

    // If the player already submitted, don't show the slider or submit button
    if (player.stage.submitted) {
      return this.renderSubmitted();
    }

    return (
      <div className="task-response">
        <form onSubmit={this.handleSubmit}>
          <p>{this.renderSlider()}</p>
          <p>
            <button type="submit">Submit</button>
          </p>
        </form>
      </div>
    );
  }
}
