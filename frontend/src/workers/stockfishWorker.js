importScripts('/stockfish/stockfish-17-lite-single.js');


setTimeout(()=>{
    const engine = Stockfish();

    engine.onmessage = e => {
        self.postMessage(e.data);
    };

    engine.postMessage('uci');

    self.onmessage = e => {
        engine.postMessage(e.data);
    };
},1000)
