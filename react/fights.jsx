/** @jsx React.DOM */
var React = require('react');

var Characters = React.createClass({
  render: function() {
    var chars = [
      ['drmario', 'mario', 'luigi', 'bowser', 'peach', 'yoshi', 'dk', 'cfalcon', 'ganondorf'],
      ['falco', 'fox', 'ness', 'iceclimbers', 'kirby', 'samus', 'zelda', 'link', 'younglink'],
      ['pichu', 'pikachu', 'jigglypuff', 'mewtwo', 'mrgamewatch', 'marth', 'roy']
    ];
    function getChar(c) {
      return (<img src={'img/characters/'+c+'.png'} />);
    }
    return (
      <div>
        { chars[0].map(getChar) }
        <br />
        { chars[1].map(getChar) }
        <br />
        { chars[2].map(getChar) }
      </div>
    );
  }
})

React.renderComponent(<Characters />, document.getElementById('example'));
