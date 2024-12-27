### Project ideas

- PrefilledBoard (const)
  - Prefilled cell
- PuzzleBoard (const) 
  - Prefilled or empty cell
- ResolvingBoard (var)
  - Cell state:
    - Prefilled (int);
    - Resolved (int);
    - Resolving (int list);
- Resolver:
  - Resolve: Take a PuzzleBoard, returns a list of PrefilledBoard
- Validator:
  - Validate: Take a Board, returns whether the board is validate
- PartialResolver:
  - Resolve: Take a ResolvingBoard, returns a list of ResolveAction
- ResolveAction:
  - CellCoordinate
  - Clues: A list of Clues which provides the context of this action
  - Action: EliminateState, FillInNumber


- Functionalities?
  - Play with up to 4 friends? (need to check if we need an additional server for webrtc here)
