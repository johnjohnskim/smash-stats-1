/**
 * @jsx React.DOM
 */

var queue = require('queue-async');

function isNum(x) {
  return !isNaN(x);
}
function isPct(x) {
  return x.substring(x.length - 1) == '%';
}

var Table = React.createClass({
  getInitialState: function() {
    return {
      data: [],
      sortBy: -1,
      order: '+'
    };
  },
  componentDidMount: function() {
    $.getJSON(this.props.url, {}, function(data) {
      if (!data || !data.length) return;
      data = _.sortBy(data, 'winpct').reverse();
      data.forEach(function(d) {
        d.winpct = Math.round(d.winpct * 100) + '%';
      });
      data = data.map(function(d) {
        return this.props.headers.map(function(h) {
          return d[h[0]];
        });
      }.bind(this));
      this.setState({
        data: data
      });
    }.bind(this));
  },
  sort: function(index) {
    if (this.state.sortBy == index) {
      this.setState({
        order: this.state.order == '+' ? '-' : '+'
      });
    } else {
      this.setState({
        sortBy: index,
        order: '+'
      });
    }
  },
  render: function() {
    if (!this.state.data.length) return (<div />);
    var data = this.state.data;
    var first;
    if (this.state.sortBy > -1) {
      first = data[0][this.state.sortBy];
      if (isNum(first)) {
        data = _.sortBy(data, function(d) {
          return (this.state.order == '-' ? 1 : -1) * d[this.state.sortBy];
        }.bind(this));
      } else if (isPct(first)) {
        data = _.sortBy(data, function(d) {
          return (this.state.order == '-' ? 1 : -1) * parseInt(d[this.state.sortBy], 10);
        }.bind(this));
      } else {
        data = _.sortBy(data, function(d) { return d; }.bind(this));
        data = this.state.order == '+' ? data.reverse() : data;
      }
    }

    var trs = data.map(function(d, i) {
      return (
        <tr key={i}>
          { d.map(function(x, i) {return (<td key={i}>{x}</td>);}) }
        </tr>
      );
    }.bind(this));

    return (
      <table className="table table-hover">
        <thead>
          <tr>
            { this.props.headers.map(function(h, i) {return (<Header key={i} name={h[1]} sort={this.sort} />);}.bind(this)) }
          </tr>
        </thead>
        <tbody>
          {trs}
        </tbody>
      </table>
    );
  }
});

var Header = React.createClass({
  handleClick: function() {
    this.props.sort(this.props.key);
  },
  render: function() {
    return (
      <th onClick={this.handleClick}>{this.props.name}</th>
    );
  }
});

var headers = [
  ['name', 'Name'],
  ['total', 'Total Fights'],
  ['wins', 'Wins'],
  ['winpct', 'Win %']
];
React.renderComponent(<Table url='/api/playermeta' headers={headers} />, document.getElementById('app'));
