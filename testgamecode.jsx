class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isJumping: false,
      isGameOver: false,
      score: 0,
      obstacleLeft: [1000, 1500, 2000], // Initialize with multiple cactuses
    };
    this.jump = this.jump.bind(this);
    this.reset = this.reset.bind(this);
  }

  componentDidMount() {
    this.intervalId = setInterval(() => {
      this.setState(prevState => {
        let newScore = prevState.score;
        // Check if dinosaur has jumped over a cactus
        if (prevState.obstacleLeft.some(left => left < 50 && left > 40) && this.state.isJumping) {
        
         newScore += 1;
        }
        let newObstacleLeft = prevState.obstacleLeft.map(left => left - 5);
        // If a cactus has moved off screen, add a new one at the end
        if (newObstacleLeft[0] < 0) {
          newObstacleLeft.shift();
          newObstacleLeft.push(1000 + Math.random() * 500);
        }
        return {
          score: newScore,
          obstacleLeft: newObstacleLeft,
        };
      });
      if (this.state.obstacleLeft.some(left => left < 50 && left > 0) && !this.state.isJumping) {
        this.setState({ isGameOver: true });
        clearInterval(this.intervalId);
      }
    }, 12.5); // Update more frequently
    window.addEventListener('keydown', this.jump);
  }

  componentWillUnmount() {
    clearInterval(this.intervalId);
    window.removeEventListener('keydown', this.jump);
  }

  jump(event) {
    if (event.code === 'Space' && !this.state.isJumping) {
      this.setState({ isJumping: true });
      setTimeout(() => this.setState({ isJumping: false }), 500); 
    }
  }

  reset() {
    this.setState({ isJumping: false, isGameOver: false, score: 0, obstacleLeft: [1000, 1500, 2000] });
    this.componentDidMount();
  }

  render() {
    return (
      <div className="game-container">
        <div className={`dinosaur ${this.state.isJumping ? 'jumping' : ''}`} />
        {this.state.obstacleLeft.map((left, index) => (
          <div key={index} className="cactus" style={{ left: `${left}px` }} />
        ))}
        {this.state.isGameOver && (
          <div>
            <h1>Game Over</h1>
            <button onClick={this.reset}>Restart</button>
          </div>
        )}
        <div>Score: {Math.floor(this.state.score)}</div>
      </div>
    );
  }
}

ReactDOM.render(<Game />, document.getElementById('root'));