import { useState } from 'react'
import './App.css'

function App() {
  const [textVisible, setTextVisible] = useState(false);

  const handleClick = () => {
    setTextVisible(!textVisible);
  }

  return (
    <div>
      <h1>hello world!</h1>
      {textVisible && <p>
        hello from day1.
      </p>}
      <button onClick={handleClick}>
        {textVisible ? 'Hide' : 'Show'}
      </button>
    </div>
  )
}

export default App
