/**
 * @jsx React.DOM
 */

var queue = require('queue-async');

function getData(url) {
  return function(callback) {
    $.getJSON(url, {}, function(data) {
      callback(null, data);
    });
  }
}

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
          stageData: stages
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
      stage: 0,
      winner: 0
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
      players: [],
      winner: 0
    });
  },
  addCharacter: function(c) {
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
      characters: [],
      winner: 0
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
  addFight: function() {
    $.post('/api/fights', {
      p1: this.state.players[0],
      p2: this.state.players[1],
      p3: this.state.players[2],
      p4: this.state.players[3],
      c1: this.state.characters[0],
      c2: this.state.characters[1],
      c3: this.state.characters[2],
      c4: this.state.characters[3],
      stage: this.state.stage,
      winner: this.state.winner,
    });
    this.setState({
      players: [],
      characters: [],
      stage: 0,
      winner: 0
    });
  },
  addNewPlayer: function(name) {
    $.post('/api/players', {name: name}, function(id) {
      id.name = name;
      this.setState({
        playerData: this.state.playerData.concat([id])
      });
    }.bind(this));
  },
  clearFight: function() {
    this.setState({
      players: [],
      characters: [],
      stage: 0,
      winner: 0
    });
  },
  render: function() {
    return (
      <div className="app container text-center">
        <Characters data={this.state.characterData} selected={this.state.characters} addCharacter={this.addCharacter} />
        <Buttons reset={this.resetCharacters} back={this.removeCharacter} />
        <Players data={this.state.playerData} addPlayer={this.addPlayer} />
        <Buttons reset={this.resetPlayers} back={this.removePlayer} />
        <Summaries playerData={this.state.playerData} selectedPlayers={this.state.players} 
                   characterData={this.state.characterData} selectedChars={this.state.characters} 
                   winner={this.state.winner} selectWinner={this.selectWinner} />
        <Stages data={this.state.stageData} selected={this.state.stage} selectStage={this.selectStage} />
        <AddPlayer addPlayer={this.addNewPlayer} />
        <Submit addFight={this.addFight} clearFight={this.clearFight} />
      </div>
    );
  }
})

var Character = React.createClass({
  handleClick: function() {
    if (!this.props.summary) {
      this.props.addCharacter(this.props.data.id);
    }
  },
  render: function() {
    var cx = React.addons.classSet;
    var selects = this.props.players.map(function(p, i) {
      return (<Select key={i} player={p} />);
    });
    var classes = cx({
      'character': true,
      'summaryChar': this.props.summary,
      'selected': selects.length
    });
    return (
      <div className="characterBox box" onClick={this.handleClick}>
        <img src={'img/characters/'+this.props.data.img+'.png'} className={classes} />
        {selects}
      </div>
    );
  }
});

var Characters = React.createClass({
  render: function() {
    if (!this.props.data.length) {
      return (<div />);
    }
    var chars = [
      ['drmario', 'mario', 'luigi', 'bowser', 'peach', 'yoshi', 'dk', 'cfalcon', 'ganondorf'],
      ['falco', 'fox', 'ness', 'iceclimbers', 'kirby', 'samus', 'zelda', 'link', 'younglink'],
      ['pichu', 'pikachu', 'jigglypuff', 'mewtwo', 'mrgamewatch', 'marth', 'roy']
    ];
    chars = chars.map(function(row) {
      return row.map(function(c) { return _.find(this.props.data, {img: c}); }.bind(this));
    }.bind(this));

    function makeChar(c) {
      var players = [];
      this.props.selected.forEach(function(s, i) {
        if (c.id == s) {
          players.push(i+1);
        }
      });
      return (<Character key={c.id} data={c} players={players} addCharacter={this.props.addCharacter}/>);
    }
    makeChar = makeChar.bind(this);
    function makeCharRow(row, i) {
      var styles = {
        'padding-left' : (i > 0 ? 4 : 0)
      };
      return (
        <div key={i} className="characterRow" style={styles}>
          {row.map(makeChar)}
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
  handleClick: function() {
    this.props.addPlayer(this.props.data.id);
  },
  render: function() {
    return (
      <button onClick={this.handleClick}>{this.props.data.name}</button>
    );
  }
});

var Players = React.createClass({
  render: function() {
    return (
      <div>{ this.props.data.map(function(p) {return (<Player key={p.id} data={p} addPlayer={this.props.addPlayer} />);}.bind(this)) }</div>
    );
  }
})

var Summary = React.createClass({
  handleClick: function() {
    if (this.props.player) {
      this.props.selectWinner(this.props.player.id);
    }
  },
  render: function() {
    var character = this.props.char ? <Character data={this.props.char} players={[]} summary={true} /> : null
    var classes = "summary " + (this.props.selected ? 'selected' : ''); 
    return (
      <div className="summaryBox box" onClick={this.handleClick} >
        <img src={'img/players/p'+this.props.id+'-display.png'} className={classes} />
        {character}
        <span className="summaryText">{this.props.player ? this.props.player.name : ''}</span>
        {this.props.selected ? <span className="summaryWinner">Winner!!!</span> : ''}
      </div>
    );
  }
})
var Summaries = React.createClass({
  render: function() {
    if (!this.props.playerData.length || !this.props.characterData.length) {
      return (<div />);
    }
    var ids = [1, 2, 3, 4];
    var selectedPlayers = this.props.selectedPlayers.map(function(s) {
      return _.find(this.props.playerData, {id: s}); 
    }.bind(this));
    var selectedChars = this.props.selectedChars.map(function(s) {
      return _.find(this.props.characterData, {id: s}); 
    }.bind(this));
    var summaries = _.zip(ids, selectedPlayers, selectedChars);

    function makeSummary(p) {
      var selected = p[1] && p[1].id == this.props.winner;
      return (<Summary key={p[0]} id={p[0]} player={p[1]} char={p[2]} selected={selected} selectWinner={this.props.selectWinner} />);
    }
    makeSummary = makeSummary.bind(this);
    return (
      <div className="summaries">
        { summaries.map(makeSummary.bind(this)) }
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
  handleClick: function() {
    this.props.selectStage(this.props.data.id);
  },
  render: function() {
    var classes = "stage " + (this.props.selected ? 'selected' : '');
    return (
      <img src={'img/stages/'+this.props.data.img+'.jpg'} className={classes} onClick={this.handleClick} />
    );
  }
});
var Stages = React.createClass({
  render: function() {
    if (!this.props.data.length) {
      return (<div />);
    }
    var stages = [
      ['princess-peachs-castle', 'kongo-jungle', 'great-bay', 'yoshis-story', 'fountain-of-dreams', 'corneria'],
      ['rainbow-cruise', 'jungle-japes', 'temple', 'yoshis-island', 'green-greens', 'venom'],
      ['icicle-mountain', 'flat-zone'],
      ['brinstar', 'onett', 'mute-city', 'pokemon-stadium', 'kingdom'],
      ['brinstar-depths', 'fourside', 'big-blue', 'poke-floats', 'kingdom-ii'],
      ['battlefield', 'final-destination', 'past-dream-land', 'past-yoshis-island', 'past-kongo-jungle']
    ]
    stages = stages.map(function(row) {
      return row.map(function(s) { return _.find(this.props.data, {img: s}); }.bind(this));
    }.bind(this));
    function makeStage(s) {
      return (<Stage key={s.id} data={s} selected={this.props.selected == s.id} selectStage={this.props.selectStage} />);
    }
    makeStage = makeStage.bind(this);
    function makeStageRow(row, i) {
      return (
        <div key={i} className="characterRow">
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

var Buttons = React.createClass({
  reset: function() {
    this.props.reset();
  },
  back: function() {
    this.props.back();
  },
  render: function() {
    return (
      <div>
        <button onClick={this.reset}>Reset</button>
        <button onClick={this.back}>Back</button>
      </div>
    );
  }
});

var AddPlayer = React.createClass({
  handleClick: function() {
    var name = this.refs.name.getDOMNode().value.trim();
    if (!name) return;
    this.props.addPlayer(name);
    this.refs.name.getDOMNode().value = '';
  },
  render: function() {
    return (
      <div className="addPlayer">
        <input type="text" placeholder="New player..." ref="name" />
        <button onClick={this.handleClick}>Add</button>
      </div>
    );
  }
});

var Submit = React.createClass({
  addFight: function() {
    this.props.addFight();
  },
  clearFight: function() {
    this.props.clearFight();
  },
  render: function() {
    return (
      <div className="addFight">
        <button onClick={this.addFight}>Add</button>
        <button onClick={this.clearFight}>Clear</button>
      </div>
    );
  }
});

React.renderComponent(<App />, document.getElementById('app'));
