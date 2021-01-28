import React from 'react';

class WordCard extends React.Component {
  // constructor(props){
  //   super(props);
  // }

  render() {
    console.log(`this.props:${JSON.stringify(this.props)}`);
    const text = this.props.isFront
      ? this.props.word.front
      : this.props.word.back;
    return (
      <label
        className="wordCard"
        onClick={() => this.props.handleClick(this.props.word.id)}>
        {text}
      </label>
    );
  }
}

export default WordCard;
