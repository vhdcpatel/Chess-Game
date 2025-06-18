// public/stockfishWorker.js

// 1. Tell Emscripten how to find the .wasm file:
self.Module = {
    locateFile: (path) =>
        path.endsWith('.wasm')
            ? '/stockfish/{WASM Name}'
            : `/stockfish/${path}`,
    onRuntimeInitialized: () => {
        // 2. As soon as the runtime is ready, start UCI
        Module.ccall('command', null, ['string'], ['uci']);
    }
};

// 3. Load the Stockfish glue + .wasm
importScripts('/stockfish/stockfish-17-lite-single.js');

// 4. Hook Emscripten’s print() to forward to main thread:
Module.print = (text) => {
    self.postMessage({ type: 'log', text });
    // automatically send 'isready' when uciok arrives
    if (text === 'uciok') {
        self.postMessage({ type: 'ready' });
    }
};

// 5. Receive commands from main thread & pass to Stockfish:
self.onmessage = (e) => {
    const cmd = e.data;
    Module.ccall('command', null, ['string'], [cmd]);
};
