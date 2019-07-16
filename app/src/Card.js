import React, { Component } from 'react';
import moment from 'moment';

export default class Card extends Component {
  render() {
    const { text, sentiment } = this.props;
    const arr = text.split(/\b/);
    return (
      <div className="card">
        <div className="date">
          {moment(this.props.date).fromNow()} <span className="score">{sentiment.score}</span>
        </div>
        <div className="summary">
          <p>
            {
              arr.map(token => {
                const isPositive = sentiment.positive.some(keyword => keyword === token.toLowerCase());
                const isNegative = sentiment.negative.some(keyword => keyword === token.toLowerCase());
                return (
                  <span className={[isPositive && 'positive', isNegative && 'negative'].filter(v => v)}>{token == " " ? "\u00A0" : token}</span>
                );
              })
            }
          </p>
        </div>
      </div>
    );
  }
}
