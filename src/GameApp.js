////import logo from './logo.svg';
import { useEffect, useState } from 'react';
import './App.css';
import { gameSubject, initGame, resetGame } from './components/Game';
import Board from './components/Board';
import { useParams, useHistory } from 'react-router-dom';
import { db } from './firebase';

function GameApp() {
  const [board, setBoard] = useState([]);
  const [isGameOver, setIsGameOver] = useState([]);
  const [result, setResult] = useState([]);
  const [turn, setTurn] = useState([]);
  const [initResult, setInitResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('');
  const [game, setGame] = useState({});
  const { id } = useParams();
  const history = useHistory();
  const shareableLink = window.location.href;
  useEffect(() => {
    let subscriber;
    async function init() {
      const initRes = await initGame(id !== 'local' ? db.doc(`games/${id}`) : null);
      setInitResult(initRes);
      setLoading(false);
      if (!initRes) {
        subscriber = gameSubject.subscribe((game) => {
          setBoard(game.board);
          setIsGameOver(game.isGameOver);
          setResult(game.result);
          setTurn(game.turn);
          setStatus(game.status); // control display of 'shareableLink' feature
          setGame(game);
        })
      }
    }

    init();
    
    return () => subscriber && subscriber.unsubscribe();
  }, [id])

  async function copyToClipboard() {
    await navigator.clipboard.writeText(shareableLink);
  }

  if (loading) {
    return 'Loading... ... ...'
  }
  if (initResult === 'not found') {
    console.log("GNF")
    return 'Game Not Found.'
  }
  if (initResult === 'intruder') {
    console.log("I")
    return 'Game Has Two Players Already'
  }


  return (
    <div className="app-container">
      {isGameOver && (
        <h2 className="vertical-text">GAME OVER
          <button onClick={async () => { await resetGame; history.push('/')}}>
            <span className="vertical-text">
              NEW GAME
            </span>
          </button>
        </h2>
      )}
      <div className="board-container">
        {game.opponent && game.opponent.name && <span className="tag is-link">{game.opponent.name}</span>}
        <Board board={board} turn={turn} />
        {game.member && game.member.name && <span className="tag is-link">{game.member.name}</span>}
      </div>
      {result && <p className="vertical-text">{result}</p>}
      {status === 'waiting' && (
        <div className="notificiation is-link share-game">
          <strong>
            Share this link to continue...
          </strong>
          <br />
          <br />
          <div className="field has-addons">
            <div className="control is-expanded">
              <input type="text" name="" id="" className="input" readOnly value={shareableLink} />
            </div>
            <div className="control">
              <button className="button is-info" onClick={copyToClipboard}>Copy</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default GameApp;
