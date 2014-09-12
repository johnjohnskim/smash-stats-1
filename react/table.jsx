/**
 * @jsx React.DOM
 */

var queue = require('queue-async');

var Table = React.createClass({
  render: function() {
    return (
      <table>
        <tr>
          <th>test></th>
        </tr>
      </table>
    );
  }
})

React.renderComponent(<Table />, document.getElementById('app'));
