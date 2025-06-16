/// <reference lib="webworker" />

// Type definition for the global `Module` exposed by Stockfish glue code
interface StockfishModule {
    postMessage: (command: string) => void
}

declare let Module: StockfishModule & { postMessage: (msg: string) => void }

// Setup bridge for the Stockfish WebAssembly engine
self.importScripts('/stockfish/stockfish-nnue-17-single.js')

// Intercept messages from the main thread and forward to Stockfish
self.onmessage = (e: MessageEvent<string>) => {
    const command = e.data

    // Override the postMessage function so that Stockfish output is forwarded to main thread
    ;(Module).postMessage = (response: string) => {
        self.postMessage(response)
    }

    // Forward command (UCI, go, position, etc.) to Stockfish engine
    Module.postMessage(command)
}
