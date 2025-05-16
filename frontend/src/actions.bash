#!/bin/bash

# Create the src/store directory and subdirectories
mkdir -p src/storeActions
mkdir -p src/store/Reducers

# Create empty files in src/store/
touch src/store/hooks.ts
touch src/store/index.ts

# Create empty files in src/store/Actions/
touch src/store/Actions/chessActions.ts

# Create empty files in src/store/Reducers/
touch src/store/Reducers/chessSlice.ts
touch src/store/Reducers/index.ts

echo "Store directory structure created successfully!"