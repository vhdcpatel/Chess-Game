import './App.css'
import ChessBoard from './components/chessBoard/ChessBoard';
import styles from './App.module.css';

function App() {


  return (
    <div className={styles.mainOuterCtn}>
      <ChessBoard player='white'/>
    </div>
  )
}

export default App
