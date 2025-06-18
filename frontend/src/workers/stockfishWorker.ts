// /// <reference lib="webworker" />
// require('stockfish')
//
// const engine = stockfish();
//
// engine.onmessage = (event: MessageEvent) => {
//     self.postMessage(event.data);
// };
//
// self.onmessage = (event: MessageEvent) => {
//     engine.postMessage(event.data);
// };
//
// export {};
