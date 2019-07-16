import React, { Component } from 'react';
import moment from 'moment';
import { Link } from 'react-router-dom';
import SpeechRecognition from 'react-speech-recognition';
import { Scatter } from 'react-chartjs-2';

import './css/Record.css';

import Card from './Card';

class Record extends Component {
  constructor(props) {
    super(props);

    this.state = {
      date: '',
      writing: false,
      summary: 'Edit this text or press the microphone button',
      lastSentiment: '',
      started: false,
      dreams: []
    }
    fetch('/dreams', {
      method: 'GET',
      credentials: 'same-origin',
    }).then(res => res.json()).then(dreams => {
      this.setState({
        dreams: Array.from(dreams).reverse()
      })
    });
    console.log(this.state);
  }

  componentDidMount() {
    this.props.recognition.lang = 'en-US';
  }

  startListening() {
    this.props.resetTranscript();
    this.props.startListening();
    this.setState({
      started: true
    });
  }

  submit(dreamtext) {
    this.setState({ writing: false })
    fetch('/dream', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      credentials: 'same-origin',
      body: JSON.stringify({ text: dreamtext })
    }).then(res => res.json())
      .then(data => {
        let dreams = this.state.dreams.slice();
        dreams.unshift(data);
        this.setState({
          dreams
        });
      });
  }

  componentWillReceiveProps(nextProps) {
    if (this.state.started) {
      this.setState({ summary: nextProps.transcript });
      if (/finish$/i.test(nextProps.transcript)) {
        if (this.state.started) {
          this.props.stopListening();
          this.props.resetTranscript();
          this.setState({
            started: false
          });
          this.submit(nextProps.transcript.replace("finish", ""));
        }
        this.setState({
          summary: 'Edit this text or press the microphone button',
        });
      }
    } else {
      this.setState({
        summary: 'Edit this text or press the microphone button',
      });
    }
  }

  clickOutside = () => {
    if (this.state.writing) {
      this.setState({
        writing: false
      });
    }
  }

  clickInside = (e) => {
    e.stopPropagation();
  }

  logout = () => {
      fetch('/logout');
  }

  render() {
    const { writing, summary, date } = this.state;
    const { stopListening, listening, browserSupportsSpeechRecognition } = this.props;

    if (!browserSupportsSpeechRecognition) {
      return null;
    }

    return (
      <div className="record" onClick={this.clickOutside}>
        <div className="nav">
          <div className="wrapper">
            <div className="left">
              <Link to="/">
                <h3>Lucid</h3>
              </Link>
            </div>
            <div className="right">
              <Link to="/">
                <h4>Learn More</h4>
              </Link>
              <Link to="/">
                <h4 className="outlined">Sign Out</h4>
              </Link>
            </div>
          </div>
        </div>
        <div className="container">
          <h1>Dream Log</h1>
          {
            writing ?
              <div className="card new" onClick={this.clickInside}>
                {
                  date &&
                  <div className="date">
                    {date}
                  </div>
                }
                <div className="summary">
                  <div contentEditable={!listening} className="input"
                       onChange={({ target }) => this.setState({ summary: target.value })}>{summary}</div>
                  {
                    this.state.started ?
                      <div className="listening stop" onClick={stopListening}>
                        <i class="fa fa-microphone" aria-hidden="true" />
                      </div> :
                      <div className="listening start" onClick={() => this.startListening()}>
                        <i class="fa fa-microphone" aria-hidden="true" />
                      </div>
                  }
                </div>
                <div className="save"></div>
              </div> :
              <div className="tell" onClick={() => this.setState({ writing: true })}>What did you dream about last night?</div>
          }
          {
            this.state.dreams.length > 0 ?
          <div className="chart">
            <Scatter data={{
              datasets: [{
                label: "Happiness",
                data: this.state.dreams.map(dream => {
                  return {
                    x: moment(dream.date).toDate(),
                    y: dream.sentiment.score
                  };
                }),
                backgroundColor: [
                  'rgba(255, 99, 132, 0.2)',
                  'rgba(54, 162, 235, 0.2)',
                  'rgba(255, 206, 86, 0.2)',
                  'rgba(75, 192, 192, 0.2)',
                  'rgba(153, 102, 255, 0.2)',
                  'rgba(255, 159, 64, 0.2)'
                ],
                borderColor: [
                  'rgba(255,99,132,1)',
                  'rgba(54, 162, 235, 1)',
                  'rgba(255, 206, 86, 1)',
                  'rgba(75, 192, 192, 1)',
                  'rgba(153, 102, 255, 1)',
                  'rgba(255, 159, 64, 1)'
                ],
                borderWidth: 1,
                pointBorderWidth: 1,
                pointBorderColor: [
                  'rgba(255,99,132,1)',
                  'rgba(54, 162, 235, 1)',
                  'rgba(255, 206, 86, 1)',
                  'rgba(75, 192, 192, 1)',
                  'rgba(153, 102, 255, 1)',
                  'rgba(255, 159, 64, 1)'
                ],
                pointRadius: 1,
                pointBorderWidth: 1,
                pointBorderRadius: 5,
                pointHitRadius: 10
              }]
            }} options={{
              scales: {
                xAxes: [{
                  type: 'time',
                  time: {
                    displayFormats: {
                     'millisecond': 'MMM DD',
                     'second': 'MMM DD',
                     'minute': 'MMM DD',
                     'hour': 'MMM DD',
                     'day': 'MMM DD',
                     'week': 'MMM DD',
                     'month': 'MMM DD',
                     'quarter': 'MMM DD',
                     'year': 'MMM DD',
                    }
                  }
                }]
              }
            }} width="600" height="250" />
          </div>
            :
            <div></div>
          }
          {
            this.state.dreams.map((dream, i) => {
              return <Card date={dream.date} sentiment={dream.sentiment} text={dream.text} key={i} />;
            })
          }
        </div>
        }
      </div>
    );
  }
}

const options = {
  autoStart: false
};
export default SpeechRecognition(options)(Record);
