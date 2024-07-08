import './App.css'
import ChessBoard from './components/chessBoard/ChessBoard';
import styles from './App.module.css';
import { DEFAULT_POSITION } from './utils/constants/initialPosition';

function App() {


  return (
    <div className={styles.mainOuterCtn}>
      <ChessBoard player='white' initialPosition={DEFAULT_POSITION}/>
    </div>
  )
}

export default App
