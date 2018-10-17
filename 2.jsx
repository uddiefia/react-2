var PLAYERS = [
  {
    name: "udara",
    score: 80,
    id: 1,
  },
  {
    name: "karina",
    score: 35,
    id: 2,
  },
  {
    name: "emily",
    score: 23,
    id: 3,
  },
];
var nextid=4;
var StopWatch=React.createClass({

getInitialState: function (){
return{
  running:false,

  elapsedTime: 0,
  previousTime: 0,
};
},

onStop:function(){
this.setState({running:false});
},
onStart:function(){
 this.setState({
    running:true,
   previousTime: Date.now(),
   });
},
onReset:function(){
this.setState({
  elapsedTime: 0,
  previousTime: Date.now(),
});
},
componentDidMount: function() {
  this.interval = setInterval(this.onTick, 100);
},

componentWillUnmount: function() {
  clearInterval(this.interval);
},

  onTick: function() {
    if (this.state.running) {
      var now = Date.now();
      this.setState({
        previousTime: now,
        elapsedTime: this.state.elapsedTime + (now - this.state.previousTime),
      });
    }

  },






  render:function(){
  var seconds = Math.floor(this.state.elapsedTime / 1000);
  var startStop;

  if(this.state.running){
    startStop=  <button onClick={this.onStop}>Stop</button>;
  }else{
    startStop=  <button onClick={this.onStart}>Start</button>;
  }

    return(
    <div className="stopwatch">
    <h2>Stop watch</h2>
    <div className="stopwatch-time">{seconds}</div>
    {startStop}
      <button onClick={this.onReset}>Reset</button>
    </div>
    );
  }

});

var AddplayerForm=React.createClass({

getInitialState: function (){
return{
  name:"",
};
},

propTypes :{
onAdd:React.PropTypes.func.isRequired,
},

onSubmit:function(e){
  e.preventDefault();
  this.props.onAdd(this.state.name);
  this.setState({name:""});
},
onNameChange:function(e){

  this.setState({name:e.target.value});

},
  render:function(){
    return(
      <div className="add-player-form">
      <form onSubmit={this.onSubmit}>
        <input type="text"value={this.state.name} onChange={this.onNameChange}/>
        <input type="submit" value="Add Player"/>
      </form>
      </div>
    );
    }

});

function Stats(props){
var totalpalyers=props.players.length;

var totlapoints=props.players.reduce(function(total,player){
  return total+player.score;
},0)

return(
  <table className="stats">
    <tbody>
      <tr>
        <td>Players:</td>
        <td>{totalpalyers}</td>
      </tr>
      <tr>
        <td>Total points:</td>
        <td>{totlapoints}</td>
      </tr>

    </tbody>
  </table>

  )
}

Stats.propTypes ={
players:React.PropTypes.array.isRequired,
};

function Header(props){
return(
<div className="header">
<Stats players={props.players} />
<h1>{props.title}</h1>
<StopWatch />
</div>
);
}

Header.propTypes ={
title:React.PropTypes.string.isRequired,
players:React.PropTypes.array.isRequired,
};

function Player(props){
return(
<div className="player">
<div className="player-name">
<a className="remove-player" onClick={props.onRemove}>🗙</a>
{props.name}
</div>
<div className="player-score">
<Counter score={props.score} onChange={props.onScoreChange}/>
</div>
</div>
);
}

Player.propTypes={
name:React.PropTypes.string.isRequired,
score:React.PropTypes.number.isRequired,
 onScoreChange:React.PropTypes.func.isRequired,
  onRemove:React.PropTypes.func.isRequired,
};


 function Counter(props){
 return(
 <div className="counter">
 <button className="counter-action decrement" onClick={function(){props.onChange(-1);}}>-</button>
 <div className="counter-score"> {props.score} </div>
 <button className="counter-action increment"onClick={function(){props.onChange(+1);}}>+</button>
 </div>
 );
 }

 Counter.propTypes={
 score:React.PropTypes.number.isRequired,
 onChange:React.PropTypes.func.isRequired,
 };


var Application = React.createClass({

propTypes: {
  title:React.PropTypes.string,
  initialPlayers:React.PropTypes.arrayOf(React.PropTypes.shape(
  {
      name:React.PropTypes.string.isRequired,
      score:React.PropTypes.number.isRequired,
      id:React.PropTypes.number.isRequired,

    })).isRequired,
},

getInitialState: function (){
return{
  players: this.props.initialPlayers,
};
},

getDefaultProps: function(){
return{
title:"My Scoreboard",
}
},

onScoreChange:function(index,delta){
  console.log("onScoreChange" ,index,delta);
  this.state.players[index].score+=delta;
  this.setState(this.state);
},

onPlayerAdd:function(name){
  this.state.players.push({
    name:name,
    score:0,
    id:nextid,
    });
  this.setState(this.state);
  nextid+=1;
},

onRemovePlayer:function(index){
  this.state.players.splice(index,1);
  this.setState(this.state);
},

render:function(){
return(
<div className="scoreboard">
<Header title={this.props.title} players={this.state.players}/>
<div className="players">

  {this.state.players.map(function(player,index){
    return (
      <Player
       onScoreChange={function(delta){this.onScoreChange(index,delta)}.bind(this)}
       onRemove={function(){this.onRemovePlayer(index)}.bind(this)}
       name={player.name}
       score={player.score}
       key={player.id} />
    );
    }.bind(this))}

  <AddplayerForm onAdd={this.onPlayerAdd}/>
</div>
</div>
);}
}
);

ReactDOM.render(<Application initialPlayers={PLAYERS}/>,document.getElementById('container'));
