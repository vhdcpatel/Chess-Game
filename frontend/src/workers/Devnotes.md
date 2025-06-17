- Main Issue which I encounter in development was that worker was trying to load was from it's own dir and other added 
middle ware was not working.
- Added wasm in worker dir and it is working fine for now. 
- But in letter fixes try to move it in public dir. 
- Also file name need to be match with the worker name and not the glue code.
- Look for solution letter on but for now fix the Custom hook that is causing not working for now.

Also, I am adding all dir with 