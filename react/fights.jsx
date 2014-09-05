/**
 * @jsx React.DOM
 */

var queue = require('queue-async');
var $ = require('jquery');

var App = React.createClass({
  componentDidMount: function() {
    queue()
      .defer(getData('/api/players'))
      .defer(getData('/api/characters'))
      .defer(getData('/api/stages'))
      .await(function(err, players, characters, stages) {
        this.setState({
          playerData: players, 
          characterData: characters, 
          stageData: stages, 
        });
      }.bind(this));
  },
  getInitialState: function() {
    return {
      playerData: [],
      characterData: [],
      stageData: [],
      players: [],
      characters: [],
      stage: '',
      winner: ''
    };
  },
  addPlayer: function(p) {
    if (this.state.players.length < 4) {
      this.setState({
        players: this.state.players.concat([p])
      });
    } 
  },
  removePlayer: function() {
    if (this.state.players.length) {
      this.setState({
        players: this.state.players.slice(0, this.state.players.length - 1)
      });
    }
  },
  resetPlayers: function() {
    this.setState({
      players: []
    });
  },
  addCharacter: function(c) {
    c = _.find(this.state.characterData, {img: c}).id;
    if (this.state.characters.length < 4) {
      this.setState({
        characters: this.state.characters.concat([c])
      });
    } 
  },
  removeCharacter: function() {
    if (this.state.characters.length) {
      this.setState({
        characters: this.state.characters.slice(0, this.state.characters.length - 1)
      });
    }
  },
  resetCharacters: function() {
    this.setState({
      characters: []
    });
  },
  selectStage: function(s) {
    this.setState({
      stage: s 
    });
  },
  selectWinner: function(w) {
    this.setState({
      winner: w 
    });
  },
  render: function() {
    return (
      <div className="app">
        <Characters data={this.state.characterData} selected={this.state.characters} addCharacter={this.addCharacter} removeCharacter={this.removeCharacter} resetCharacters={this.resetCharacters} />
        <Players data={this.state.playerData} selected={this.state.players} addPlayer={this.addPlayer} removePlayer={this.removePlayer} resetPlayers={this.resetPlayers} />
        <Stages data={this.state.stageData} selected={this.state.stage} />
      </div>
    );
  }
})

var Character = React.createClass({
  handleClick: function() {
    this.props.addCharacter(this.props.name);
  },
  render: function() {
    var selects = this.props.players.map(function(p) {
      return (
        <Select player={p} />
      );
    });
    var classes = "character " + (this.props.classes || '')
    return (
      <div className="characterBox box">
        <img src={'img/characters/'+this.props.name+'.png'} className={classes} onClick={this.handleClick} />
        {selects}
      </div>
    );
  }
});

var Characters = React.createClass({
  render: function() {
    var chars = [
      ['drmario', 'mario', 'luigi', 'bowser', 'peach', 'yoshi', 'dk', 'cfalcon', 'ganondorf'],
      ['falco', 'fox', 'ness', 'iceclimbers', 'kirby', 'samus', 'zelda', 'link', 'younglink'],
      ['pichu', 'pikachu', 'jigglypuff', 'mewtwo', 'mrgamewatch', 'marth', 'roy']
    ];
    var selectedChars = this.props.selected.map(function(s) {
      return _.find(this.props.data, {id: s}).img; 
    }.bind(this));

    function makeChar(c) {
      var players = [];
      selectedChars.forEach(function(s, i) {
        if (c == s) {
          players.push(i+1);
        }
      });
      return (<Character name={c} players={players} addCharacter={this.props.addCharacter}/>);
    }
    boundMakeChar = makeChar.bind(this);
    function makeCharRow(row, i) {
      var styles = {
        'padding-left' : (i == 1 ? 4 :
                          i == 2 ? 67 : 0)
      };
      return (
        <div className="characterRow" style={styles}>
          {row.map(boundMakeChar)}
        </div>
      );
    }
    return (
      <div className="characters">
        {chars.map(makeCharRow)}
      </div>
    );
  }
});

var Player = React.createClass({
  render: function() {
    return (
      <div className="playerBox box">
        <img src={'img/players/'+this.props.id+'-display.png'} className="player" />
        <Character name="falco" players={[]} classes="playerChar" />
        <span className="playerText">{this.props.name}</span>
      </div>
    );
  }
})
var Players = React.createClass({
  render: function() {
    var players = ['p1', 'p2', 'p3', 'p4'];
    var selectedPlayers = this.props.selected.map(function(s) {
      return _.find(this.props.data, {id: s}).name; 
    }.bind(this));
    players = _.zip(players, selectedPlayers);

    function makePlayer(p) {
      return (<Player id={p[0]} name={p[1]}/>);
    }
    return (
      <div className="players">
        { players.map(makePlayer) }
      </div>
    );
  }
});

var Select = React.createClass({
  render: function() {
    var classes = 'select + p' + this.props.player;
    return (
      <img src={'img/players/p'+this.props.player+'-select.png'} className={classes} />
    );
  }
})

var Stage = React.createClass({
  render: function() {
    var classes = "stage " + (this.props.selected ? 'selected' : '');
    return (
      <img src={'img/stages/'+this.props.name+'.jpg'} className={classes} />
    );
  }
});
var Stages = React.createClass({
  render: function() {
    var stages = [
      ['icicle-mountain', 'princess-peachs-castle', 'kongo-jungle', 'great-bay', 'yoshis-story', 'fountain-of-dreams', 'corneria'],
      ['rainbow-cruise', 'jungle-japes', 'hyrule-temple', 'yoshis-island', 'green-greens', 'venom', 'flatzone'],
      ['brinstar', 'onett', 'mute-city', 'pokemon-stadium', 'kingdom'],
      ['brinstar-depths', 'fourside', 'big-blue', 'poke-floats', 'kingdom-ii'],
      ['battlefield', 'final-destination', 'past-dream-land', 'past-yoshis-island', 'past-kongo-jungle']
    ]
    var selectedStage =  this.props.selected ? _.find(this.props.data, {id: this.props.selected}).img : null;

    function makeStage(s) {
      return (<Stage name={s} selected={selectedStage == s}/>);
    }
    function makeStageRow(row, i) {
      var styles = {
        'padding-left': (i >= 2 ? 125 : 0)
      };
      return (
        <div className="characterRow" style={styles}>
          {row.map(makeStage)}
        </div>
      );
    }
    return (
      <div>
        { stages.map(makeStageRow) }
      </div>
    );
  }
});

function getData(url) {
  return function(callback) {
    $.getJSON(url, {}, function(data) {
      callback(null, data);
    });
  }
}

React.renderComponent(<App />, document.getElementById('app'));
