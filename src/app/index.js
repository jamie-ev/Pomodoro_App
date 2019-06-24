var React = require('react');
var ReactDOM = require('react-dom');

// react code
class Display extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
    this.modifyDisplay = this.modifyDisplay.bind(this);
    this.setUpDisplay = this.setUpDisplay.bind(this);
    this.handleReset = this.handleReset.bind(this);
    this.resetDisplay = this.resetDisplay.bind(this);
    this.toggleActive = this.toggleActive.bind(this);
    this.toggleCountDown = this.toggleCountDown.bind(this);
    this.countDown = this.countDown.bind(this);
    this.displayTime = this.displayTime.bind(this);
    this.state = {
      reset: true, // whether the session was just reset
      isSess: true, // whether it's session or break time
      sessTotal: 1500, // default session in seconds for countdown tracking
      sessDisplay: 25, // default session minutes - then controlled by up/down buttons
      breakTotal: 300, // default break in seconds for countdown tracking
      breakDisplay: 5, // default break minutes - then controlled by up/down buttons
      active: false, // is countdown active?
      interval: null // controls the interval timing for the countdown function
    }
  }
  // handle clicks on the session and break up/down icons
  handleClick(event) {
    switch(event.target.id) {
      case 'session-increment':
        if (this.state.sessDisplay <= 59) { // prevent session being set above 60 mins
          this.setState({
            sessDisplay: this.state.sessDisplay + 1
          }, this.modifyDisplay);
        }
        break;
      case 'session-decrement':
        if (this.state.sessDisplay > 1) { // prevent session being set below 1 min
          this.setState({
            sessDisplay: this.state.sessDisplay - 1
          }, this.modifyDisplay);
        }
        break;
      case 'break-increment':
        if (this.state.breakDisplay <= 59) { // prevent break being set above 60 mins
          this.setState({
            breakDisplay: this.state.breakDisplay + 1
          }, this.modifyDisplay);
        }
        break;
      case 'break-decrement':
        if (this.state.breakDisplay > 1) { // prevent session being set below 1 min
          this.setState({
            breakDisplay: this.state.breakDisplay - 1
          }, this.modifyDisplay);
        }
        break;
    }
  }
  // callback function for setState changes made in handleClick()
  modifyDisplay() {
    // modify the numbers being displayed next to the up/down buttons
    document.getElementById('session-length').innerHTML = this.state.sessDisplay;
    document.getElementById('break-length').innerHTML = this.state.breakDisplay;
    if (this.state.reset) {
      // if the timer has been reset, reset the timers and the display
      this.setState({
        sessTotal: this.state.sessDisplay * 60,
        breakTotal: this.state.breakDisplay * 60
      }, this.setUpDisplay);
    }
  }
  // reset display to initial state
  setUpDisplay() {
    document.getElementById('time-left').innerHTML = this.state.sessDisplay + ':00';
  }
  // called when play/pause is clicked
  toggleActive() {
    this.setState({
      active: !this.state.active,
      reset: false // timer should not update while a session/break is active
    }, this.toggleCountDown);
  }
  // callback function for toggleActive(), sets or clears interval for countDown()
  toggleCountDown() {
    if (this.state.active) {
      // console.log('state is active, commence play');
      this.setState({
        interval: setInterval(this.countDown, 1000) // run countDown() every 1 second
      });
    } else {
      // console.log('state is inactive, commence pause');
      this.setState({
        interval: clearInterval(this.state.interval) // stop running countDown()
      });
    }
  }
  // manage countdown timers
  countDown() {
    if (this.state.isSess) { // countdown for session rather than break
        if (this.state.sessTotal > 0) {
          this.setState({
            sessTotal: this.state.sessTotal - 1,  // decrement until you hit 00:00
          }, this.displayTime);                   // update the display after decrementing
        } else if (this.state.sessTotal == 0) {   // when you hit 00:00
          document.getElementById('beep').play(); // play the beep
          this.setState({
            isSess: false,                            // switch to break
            sessTotal: this.state.sessDisplay * 60,   // reset the timer data
            breakTotal: this.state.breakDisplay * 60
          }, this.displayTime);                       // update the display
        }
    } else { // countdown for break rather than session
      // code mirrors session code but swaps out session variables for break variables
        if (this.state.breakTotal > 0) {
          this.setState({
            breakTotal: this.state.breakTotal - 1,
          }, this.displayTime); 
        } else if (this.state.breakTotal == 0) {
          document.getElementById('beep').play();
          this.setState({
            isSess: true,
            sessTotal: this.state.sessDisplay * 60,
            breakTotal: this.state.breakDisplay * 60
          }, this.displayTime);
        }
    }
  }
  // callback for countDown(), update the display as the timer is counting down
  displayTime() {
    let mins;
    let secs;
    if (this.state.isSess) { // display countdown for session timer
      mins = Math.floor(this.state.sessTotal / 60);
      secs = this.state.sessTotal % 60;
    } else {                  // display countdown for break timer
      mins = Math.floor(this.state.breakTotal / 60);
      secs = this.state.breakTotal % 60;
    }
    // add zeros in front of mins and secs if needed, i.e. 5:9 -> 05:09
    if (mins.toString().length == 1) {
       mins = '0' + mins;
    }
    if (secs.toString().length == 1) {
       secs = '0' + secs;
    }
    // update the display element
    document.getElementById("time-left").innerHTML = mins + ":" + secs;
  }
  // called when reset icon is clicked
  handleReset() {
    // pause the beep sound and reset it to the beginning of the audio clip
    document.getElementById('beep').pause();
    document.getElementById('beep').currentTime = 0;
    // reset back to the original state
    this.setState({
      reset: true,
      isSess: true,
      sessTotal: 1500,
      sessDisplay: 25,
      breakTotal: 300,
      breakDisplay: 5,
      active: false,
      interval: clearInterval(this.state.interval) // clear countDown() from being called, similar to when pause is clicked
    }, this.resetDisplay); // reset the display to default once state is updated
  }
  // callback function for handleReset
  resetDisplay() {
    // reset the display to the default state
    document.getElementById('time-left').innerHTML = this.state.sessDisplay + ':00';
  }
  render() {
    return (
    <div className="container" style={ this.state.isSess ? {backgroundColor: "#3e777c"} : {backgroundColor: "#7c3e77"} }>
    <div className="timer-container container-vertical">
      <h1>Pomodoro Timer</h1>
      <div className="flex" style={ this.state.isSess ? {backgroundColor: "#98bfc3"} : {backgroundColor: "#d4aad1"} }> {/* session info plus up/down controls */}
        <p id="session-label" className="label">Session:</p>
        <p id="session-length">{this.state.sessDisplay}</p>
        <p><i className="fas fa-caret-up" id="session-increment" onClick={this.handleClick}></i></p>
        <p><i className="fas fa-caret-down" id="session-decrement" onClick={this.handleClick}></i></p>
      </div>
      <div className="flex" style={ this.state.isSess ? {backgroundColor: "#98bfc3"} : {backgroundColor: "#d4aad1"} }> {/* break info plus up/down controls */}
        <p id="break-label" className="label">Break:</p>
        <p id="break-length">{this.state.breakDisplay}</p>
        <p><i className="fas fa-caret-up" id="break-increment" onClick={this.handleClick}></i></p>
        <p><i className="fas fa-caret-down" id="break-decrement" onClick={this.handleClick}></i></p>
      </div>
      <div className="timer-display"> {/* timer display */}
        <p id="timer-label">{this.state.isSess ? 'Session' : 'Break'}</p>
        <p id="time-left">{this.state.sessDisplay}:00</p>
        {/* audio clip for when timer reaches 00:00 */}
        <audio id="beep">
          <source src="media/bell.mp3" type="audio/mpeg"></source>
        </audio>
      </div>
      <div className="flex controls" style={ this.state.isSess ? {backgroundColor: "#98bfc3"} : {backgroundColor: "#d4aad1"} }> {/* pause/play and reset controls */}
        <div id="start_stop" onClick={this.toggleActive}>{ this.state.active ? <i class="far fa-pause-circle"></i> : <i class="far fa-play-circle"></i> }</div>  {/*conditionally render either a pause or a play icon */}
        <p id="reset" onClick={this.handleReset}><i class="fas fa-redo-alt"></i></p>
      </div>
    </div>
    </div>
    );
  }
}

// render the component to the DOM
ReactDOM.render(<Display />,document.querySelector('#presentational'));