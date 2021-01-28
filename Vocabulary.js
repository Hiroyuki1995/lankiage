import React, { Component } from 'react';
// import Todoitems from './Todoitems';
import {TextInput} from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import { Button, Grid, Text } from 'native-base';
import WordCard from './WordCard';
import ReactCardFlip from 'react-native-card-flip';
import Speech from 'react-native-speech';
import Validation from './Validation';
import soundButton  from './sound.svg';
// import * as Scroll from 'react-scroll';
// import {Element, scroller}  from 'react-scroll';

class Vocabulary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      words: [],
      isFront: true,
      isFlipped: false,
      info: {
        frontWord: "",
        backWord: "",
        frontLang: "",
        backLang: ""
      },
      message : {
        frontWord: "",
        backWord: "",
        frontLang: "",
        backLang: ""
      },
      loading: false
    }
    this.handleClick = this.handleClick.bind(this);
    this.handleClick2 = this.handleClick2.bind(this);
    this.registNewWord = this.registNewWord.bind(this);
    this.handleWordChange = this.handleWordChange.bind(this);
    this.canSubmit = this.canSubmit.bind(this);
    this.handleLangChange = this.handleLangChange.bind(this);
    this.translate = this.translate.bind(this);
    this.canTranslate = this.canTranslate.bind(this);
    this.move = this.move.bind(this);
  }

  async componentDidMount() {
    const response = await fetch("http://localhost:8080/api/words");
    const json = await response.json();
    this.setState({
      words: json
    })
  }

  // サブミットできるときtrueを返す
  canSubmit = () => {
    const { info, message, loading } = this.state;

    const validInfo =
      Object.values(info).filter(value => {
        return value === '';
      }).length === 0;
    const validMessage =
      Object.values(message).filter(value => {
        return value !== '';
      }).length === 0;
    return validInfo && validMessage && !loading;
  };

  // 翻訳できるときtrueを返す
  canTranslate = () => {
    const target = ["frontWord", "frontLang", "backLang"];
    const { info } = this.state;
    console.log("clicked");

    for (let i = 0; i < target.length; i++) {
      if (info[target[i]] === "" ) {
        console.log(info[target[i]]);
        return false;
      }
      console.log("can translate");
      return true;
    }
  };

  move(isForward = true) {
    const movingDistance = 240;
    // if (isForward) {
    //   Scroll.scroller.scrollTo('words-area', {
    //     duration: 1500,
    //     delay: 100,
    //     smooth: true,
    //     // containerId: 'ContainerElementID',
    //     offset: 50,
    //   });
    //   // document.getElementById("words-area").scrollBy(movingDistance,0);
    // } else {
    //   document.getElementById("words-area").scrollBy(-movingDistance,0);
    // }
    
  }

  async translate(isForword = true) {
    const { info } = this.state;
    const frontWord = info.frontWord;
    const frontLang = info.frontLang;
    const backLang = info.backLang;
    const backWord = info.backWord;
    const query = isForword ? `beforeWord=${frontWord}&beforeLang=${frontLang}&afterLang=${backLang}` : 
        `beforeWord=${backWord}&beforeLang=${backLang}&afterLang=${frontLang}`;
    const answer = isForword ? `backWord` : `frontWord`;
    const response = await fetch(`http://localhost:8080/api/translate?${query}`);
    const json = await response.json();
    this.setState({
      info: {...info, [answer]: json.text}
    });
  }

  async registNewWord() {
    this.setState({ loading: true });
    var fd = new FormData(document.getElementById("form"));
    fd.append("isFront", true);
    var object = {};
    fd.forEach(function(value, key){
      object[key] = value;
    });
    console.log(JSON.stringify(object))
    const url = "http://localhost:8080/api/words";
    const response = await fetch(url, {
      method: 'POST',
      mode: 'cors',
      cache: 'no-cache',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json'
      },
      redirect: 'follow',
      referrerPolicy: 'no-referrer',
      body: JSON.stringify(object)
    })
    const response2 = await fetch("http://localhost:8080/api/words");
    const json = await response2.json();
    this.setState({
      words: json
    })
    this.setState({ loading: true });
  }

  handleClick(id) {
    this.setState(prevState => {
      console.log(id);
      return {
        isFront: !prevState.isFront
      }
    })
  }

  handleSoundButtonClick(word) {
    this.state.words.map(prevWord => {
      if (prevWord.id === word.id) {
        // let uttr = new SpeechSynthesisUtterance();
        let uttr;
        if (prevWord.isFront) {
          uttr.text = word.frontWord;
          uttr.voice = word.frontLang;
        } else {
          uttr.text = word.backWord;
          uttr.voice = word.backLang; 
        }
        console.log(`uttr.text=${uttr.text}`);
        
        Speech.speak(uttr);
        }
      });
  }

  handleLangChange= (event) => {
    const key = event.target.name;
    const value = event.target.value;
    const { info, message } = this.state
    this.setState({
      info: {...info, [key]: value}
    });
    console.log(this.state.info);
  }

  handleClick2(word) {
    this.setState(prevState => {
      const updatedWords = prevState.words.map(prevWord => {
        if (prevWord.id === word.id) {
          prevWord.isFront = !prevWord.isFront;
          // let uttr = new SpeechSynthesisUtterance();
          let uttr = {};
          if (prevWord.isFront) {
            uttr.text = word.frontWord;
            uttr.voice = word.frontLang;
          } else {
            uttr.text = word.backWord;
            uttr.voice = word.backLang; 
          }
          Speech.speak(uttr);
          }
        return prevWord;
      })
      return {
        words: updatedWords
      }
    })
  }

  handleChange(id) {
    this.setState(prevState => {
      console.log(`prevState.todos ${JSON.stringify(prevState.todos)}`);
      const updatedTodos = prevState.todos.map(todo => {
        if (todo.id === id) {
          todo.done = !todo.done;
        }
        return todo;
      })
      return {
        todos: updatedTodos
      }
    })
  }

  onChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value
    })
  }

  handleWordChange = (event) => {
    const key = event.target.name;
    const value = event.target.value;
    const { info, message } = this.state
    this.setState({
      info: {...info, [key]: value}
    });
    this.setState({
      message: {
        ...message,
        [key]: Validation.formValidate(key, value)
      }
    });
  }

  render() {
    const wordCards = this.state.words.map(word => {
      return (
        <div key={word.id} className="oneCard">
          <ReactCardFlip isFlipped={!word.isFront} flipDirection="horizontal">
            <div className="card">
              <div className="wordCard" onClick={() => this.handleClick2(word)}>
                {word.frontWord}
              </div>
              <button className="soundButton" onClick={() => this.handleSoundButtonClick(word)}/>
            </div>
    
            <div className="card">
              <div className="wordCard" onClick={() => this.handleClick2(word)}>
                {word.backWord}
              </div>
              <button className="soundButton" onClick={() => this.handleSoundButtonClick(word)}/>
            </div>
          </ReactCardFlip>
        </div>
        // <WordCard key={word.id} word={word} handleClick={this.handleClick} isFront={this.state.isFront}/>
      )
    });
    const { message } = this.state;
    const registNewWord = 
    <form id="form" autoComplete="off">
      <div className="input-area">
        <Grid container>
          <Grid container xs={4}>
            <Grid item xs={12}>
              <div className="form-area">
                <TextInput required label="front" name="frontWord" value={this.state.info.frontWord} onChange={this.handleWordChange} className="text-field" />
                {message.frontWord && (
                    <div style={{ color: 'red', fontSize: 8 }}>{message.frontWord}</div>
                  )}
              </div>
            </Grid>
            <Grid item xs={12}>
              <div className="select-area">
                <Text id="demo-simple-select-label" required>frontLang</Text>
                <RNPickerSelect
                  labelId="demo-simple-select-label"
                  value={this.state.info.frontLang}
                  onChange={this.handleLangChange}
                  name="frontLang"
                  defaultValue="zh-CN"
                  className="select-box"
                  items={[
                    { label: '日本語', value: 'ja-JP' },
                    { label: '中文', value: 'zh-CN' },
                    { label: 'English', value: 'en-US' },
                  ]}
                />
              </div>
            </Grid>
          </Grid>
          <Grid container xs={1} className="translate-button-area">
            <div className="translate-buttons">
              <img className="translate-button" src="../svg/right_arrow.svg" disabled={!this.canTranslate()} onClick={this.translate}/>
              <img className="translate-button" src="../svg/left_arrow.svg" onClick={() => this.translate(false)}/>
            </div>            
          </Grid>
          <Grid container xs={4}>
            <Grid item xs={12}>
              <div className="form-area">
                <TextInput required label="back" name="backWord" value={this.state.info.backWord} onChange={this.handleWordChange} className="text-field" />
                {message.backWord && (
                    <div style={{ color: 'red', fontSize: 8 }}>{message.backWord}</div>
                  )}
              </div>
            </Grid>
            <Grid item xs={12}>
              <div className="select-area">
              <Text id="demo-simple-select-label" required>backLang</Text>
              <RNPickerSelect
                labelId="demo-simple-select-label"
                value={this.state.info.backLang}
                onChange={this.handleLangChange}
                name="backLang"
                defaultValue="ja-JP"
                className="select-box"
                items={[
                  { label: '日本語', value: 'ja-JP' },
                  { label: '中文', value: 'zh-CN' },
                  { label: 'English', value: 'en-US' },
                ]}
              />
              </div>
            </Grid>
          </Grid>
        </Grid>
        <Grid container>
          <Grid item xs={4} />
          <Grid item xs={1} className="submit-button-area">
            {/* <Button variant="contained" color="primary" onClick={this.translate}>Transalte</Button> */}
            <Button variant="contained" color="primary" disabled={!this.canSubmit()} onClick={this.registNewWord}>Send</Button>
          </Grid>
        </Grid>
      </div>
    </form>;
    return (
      // <Grid container component="main">
      <div>
        <Element id="words-area" name="words-area" className="words-area">
          {wordCards}
        </Element>
        <img className="move-button" src="../svg/backward_arrow.svg" onClick={() => this.move(false)}/>
        <img className="move-button" src="../svg/forward_arrow.svg" onClick={() => this.move()}/>
        {registNewWord}
        {/* <div className="css-rotate css-animation">
          <div className="css-hidden css-front">ＦＲＯＮＴ</div>
          <div className="css-hidden css-back">ＢＡＣＫ</div>
        </div> */}
      </div>
    );
  };
}
export default Vocabulary;