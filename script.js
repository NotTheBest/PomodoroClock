'use strict';
//Inefficient code -> Would be much cleaner/concise if redid

function Wrapper(props) {
  return (
    React.createElement("div", { className: "wrapper" },
    React.createElement("span", { id: "title" }, "Pomodoro Clock"),
    React.createElement(BreakBox, null),
    React.createElement(SessionBox, null),
    React.createElement(Controls, null),
    React.createElement(TimerBox, null)));


}

function BreakBox(props) {
  return (
    React.createElement("div", { id: "break-box" },
    React.createElement("span", { id: "break-label" }, "Break Length"),


    React.createElement("i", { id: "break-increment", class: "fas fa-arrow-alt-circle-up", onClick: props.incrementBreak }),
    React.createElement("span", { id: "break-number" },
    props.breakLength),

    React.createElement("i", { id: "break-decrement", class: "fas fa-arrow-alt-circle-down", onClick: props.decrementBreak })));


}

function SessionBox(props) {
  return (
    React.createElement("div", { id: "session-box" },
    React.createElement("span", { id: "session-label" }, "Session Length"),


    React.createElement("i", { id: "session-increment", class: "fas fa-arrow-alt-circle-up", onClick: props.incrementSession }),
    React.createElement("span", { id: "session-number" },
    props.sessionLength),

    React.createElement("i", { id: "session-decrement", class: "fas fa-arrow-alt-circle-down", onClick: props.decrementSession })));


}

function Controls(props) {
  return (
    React.createElement("div", { id: "controls-box" },
    React.createElement("span", { id: "controls-label" }, "Controls"),


    React.createElement("div", { id: "controls-pause", onClick: props.pause },
    React.createElement("i", { class: "fas fa-play-circle" }), "/", React.createElement("i", { class: "fas fa-pause-circle" })),

    React.createElement("i", { id: "controls-restart", class: "fas fa-redo-alt", onClick: props.reset })));


}

//const sessionLength = 25*60000;
//const countTime = new Date().getTime() + sessionLength;

class TimerBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      current: 'Session',
      intervalCreated: false,
      minute: props.sessionLength,
      second: '00',
      sessionLength: props.sessionLength,
      breakLength: props.breakLength };

    this.getTime = this.getTime.bind(this);
  }

  getTime() {
    if (this.state.minute == 0 && this.state.second == '00') {
      document.getElementById('beep').play();
      if (this.state.current == 'Session') {
        this.setState({
          current: 'Break',
          minute: this.props.breakLength,
          second: '00' });

      } else
      {
        this.setState({
          current: 'Session',
          minute: this.props.sessionLength,
          second: '00' });

      }
    }
    let minute = this.state.minute;
    let second = this.state.second;

    if (second == '00') {
      second = 60;
      minute--;
    }
    second--;
    if (second.toString().length == 1)
    second = '0' + second;

    this.setState({
      minute: minute,
      second: second });

  }

  render() {

    if (!this.props.paused.paused && !this.state.intervalCreated) {//If not paused and interval not created yet -> make interval and start timer
      this.intervalID = setInterval(this.getTime, 1000);
      this.setState({
        intervalCreated: true });

    } else
    if (this.props.paused.paused && this.state.intervalCreated) {//If paused and interval is created -> clear interval and pause
      clearInterval(this.intervalID);
      this.setState({
        intervalCreated: false });

    } else
    if (this.props.paused.paused && this.state.sessionLength != this.props.sessionLength && this.state.current == 'Session') {
      this.setState({
        minute: this.props.sessionLength,
        second: '00',
        sessionLength: this.props.sessionLength });

    } else
    if (this.props.paused.paused && this.state.breakLength != this.props.breakLength && this.state.current == 'Break') {
      this.setState({
        minute: this.props.breakLength,
        second: '00',
        breakLength: this.props.breakLength });

    } else
    if (this.props.paused.reset) {//If reset = true, reset to session length
      clearInterval(this.intervalID);
      this.setState({
        current: 'Session',
        minute: this.props.sessionLength,
        second: '00' });

      this.props.reset();
    }

    return (
      React.createElement("div", { id: "timer-box" },
      React.createElement("audio", { id: "beep" },
      React.createElement("source", { src: "https://goo.gl/65cBl1", type: "audio/mp3" })),

      React.createElement("div", { id: "timer-label" },
      this.state.current),

      React.createElement("div", { id: "timer-time" },
      this.state.minute, ":", this.state.second)));



  }}


const PAUSE = 'PAUSE';
const RESET = 'RESET';
const INCREMENTBREAK = 'INCREMENTBREAK';
const DECREMENTBREAK = 'DECREMENTBREAK';
const INCREMENTSESSION = 'INCREMENTSESSION';
const DECREMENTSESSION = 'DECREMENTSESSION';

const initialState = {
  paused: { paused: true, reset: false },
  breakLength: 5,
  sessionLength: 25 };


const rootReducer = (state, action) => {
  switch (action.type) {
    case PAUSE:
      return Object.assign({}, state, { paused: { paused: !state.paused.paused, reset: state.paused.reset } });
    case RESET:
      return { paused: { paused: true, reset: !state.paused.reset }, breakLength: 5, sessionLength: 25 };
    case INCREMENTBREAK:
      if (state.breakLength < 60 && state.paused.paused)
      return Object.assign({}, state, { breakLength: state.breakLength + 1 });
    case DECREMENTBREAK:
      if (state.breakLength > 1 && state.paused.paused)
      return Object.assign({}, state, { breakLength: state.breakLength - 1 });
    case INCREMENTSESSION:
      if (state.sessionLength < 60 && state.paused.paused)
      return Object.assign({}, state, { sessionLength: state.sessionLength + 1 });
    case DECREMENTSESSION:
      if (state.sessionLength > 1 && state.paused.paused)
      return Object.assign({}, state, { sessionLength: state.sessionLength - 1 });
    default:
      return state;}

};

const pause = () => {
  return {
    type: PAUSE };

};

const reset = () => {
  return {
    type: RESET };

};

const incrementBreak = () => {
  return {
    type: INCREMENTBREAK };

};

const decrementBreak = () => {
  return {
    type: DECREMENTBREAK };

};

const incrementSession = () => {
  return {
    type: INCREMENTSESSION };

};

const decrementSession = () => {
  return {
    type: DECREMENTSESSION };

};

const store = Redux.createStore(rootReducer, initialState);

const mapStateToProps = state => {
  return {
    paused: state.paused,
    breakLength: state.breakLength,
    sessionLength: state.sessionLength };

};

const mapDispatchToProps = dispatch => {
  return {
    pause: () => dispatch(pause()),
    reset: () => dispatch(reset()),
    incrementBreak: () => dispatch(incrementBreak()),
    decrementBreak: () => dispatch(decrementBreak()),
    incrementSession: () => dispatch(incrementSession()),
    decrementSession: () => dispatch(decrementSession()) };

};

SessionBox = ReactRedux.connect(mapStateToProps, mapDispatchToProps)(SessionBox);
BreakBox = ReactRedux.connect(mapStateToProps, mapDispatchToProps)(BreakBox);
TimerBox = ReactRedux.connect(mapStateToProps, mapDispatchToProps)(TimerBox);
Controls = ReactRedux.connect(null, mapDispatchToProps)(Controls);

ReactDOM.render(React.createElement(ReactRedux.Provider, { store: store }, React.createElement(Wrapper, null)), document.getElementById('root'));