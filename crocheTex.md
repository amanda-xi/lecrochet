
# Crochetex: A Modern Crochet Pattern Language and Compiler

## 1. Introduction

This document outlines the specification for **Crochetex**, a new language for defining 3D crochet patterns, and the architecture of its companion compiler. The goal of Crochetex is to provide an intuitive, human-readable syntax that mirrors traditional crochet patterns while retaining the power and precision required for accurate 3D rendering.

This system is designed to be written entirely in **TypeScript** and will compile `.crochetex` files into interactive 3D models rendered with Three.js.

The core philosophy is to move complexity away from the user and into the compiler. The user should describe *what* they are making in a familiar way, and the compiler should be responsible for figuring out the complex geometry, stitch placement, and yarn physics.

## 2. The Crochetex Language (`.crochetex`)

Crochetex is designed to be simple, declarative, and visually similar to standard written crochet patterns.

### 2.1. Basic Syntax

- **Rounds/Rows**: Are denoted by `R1:`, `R2:`, etc. for rounds, and `Row 1:`, `Row 2:` for rows.
- **Stitches**: Use standard abbreviations (e.g., `sc`, `dc`, `hdc`, `sl st`, `ch`).
- **Repetitions**: Use `[ ... ] * N` for repeating a sequence `N` times.
- **Stitch Counts**: End a round/row definition with the total stitch count in parentheses, e.g., `(12)`. This is used for validation.
- **Comments**: Start a line with `#` for comments.

### 2.2. Example `.crochetex` file: A simple sphere (amigurumi)

```crochetex
# A simple sphere pattern

# Stitches are worked in a continuous spiral
# 'mr' is a special keyword for Magic Ring

R1: 6 sc in mr (6)
R2: [inc] * 6 (12)
R3: [sc, inc] * 6 (18)
R4: [2 sc, inc] * 6 (24)
R5: [3 sc, inc] * 6 (30)
R6-R9: sc in each st (30)
R10: [3 sc, dec] * 6 (24)
R11: [2 sc, dec] * 6 (18)
R12: [sc, dec] * 6 (12)
R13: [dec] * 6 (6)
# 'fo' is a special keyword for Fasten Off
R14: fo
```

### 2.3. Advanced Concepts

While the goal is simplicity, Crochetex supports advanced constructions through intuitive syntax.

#### Color Changes

Color changes are specified inline using `{color name}`.

```crochetex
R5: [2 sc, {red} sc, {white} inc] * 6 (30)
```

#### Working in Rows

Use the `Row` keyword and the `turn` instruction.

```crochetex
Row 1: ch 11 (10)
Row 2: sc in 2nd ch from hook, 9 sc, turn (10)
Row 3: ch 1, 10 sc, turn (10)
```

#### Special Stitches and Placement

- **Increases/Decreases**: `inc` and `dec` are aliases for `2 sc in next st` and `sc2tog` respectively. The compiler can be configured for different stitch types (e.g., `hdc-inc`).
- **Front/Back Loop**: `sc-blo` or `sc-flo`.
- **Working into chain spaces**: A special syntax will be used for granny squares and other patterns that work into spaces rather than specific stitches.

```crochetex
# Example for a granny square
R1: mr, ch 3, 2 dc, ch 2, [3 dc, ch 2] * 3, sl st to top of ch 3
R2: ch 3, 2 dc in same sp, ch 2, 3 dc in same sp, [ch 1, (3 dc, ch 2, 3 dc) in next ch-2 sp] * 3, sl st
```
The compiler will recognize `in same sp` and `in next ch-2 sp` as instructions to target chain spaces.

## 3. Compiler Architecture

The Crochetex compiler is a TypeScript-based pipeline that transforms a `.crochetex` source file into a renderable 3D model.

**Pipeline Stages:**

1.  **Lexer (Tokenizer)**: `source text` -> `Token[]`
2.  **Parser**: `Token[]` -> `AST (Abstract Syntax Tree)`
3.  **Semantic Analyzer / Graph Builder**: `AST` -> `CrochetGraph`
4.  **Geometry Engine**: `CrochetGraph` -> `Three.js Scene`

### 3.1. Project Structure

The project will be organized as follows:

```
.
├── package.json
├── tsconfig.json
├── src/
│   ├── index.ts            # Main compiler entry point
│   ├── types.ts            # Core data structures (Token, AST, Graph)
│   ├── lexer.ts            # Lexer implementation
│   ├── parser.ts           # Parser implementation
│   ├── graphBuilder.ts     # Semantic Analyzer & Graph Builder
│   └── geometry.ts         # 3D Model Generation
│   └── renderer.ts         # Three.js scene setup and rendering
└── patterns/
    └── sphere.crochetex    # Example pattern files
```

### 3.2. File Responsibilities and Detailed Implementation

#### `src/types.ts`

This file defines the core data structures used throughout the compiler.

- **Tokens**:
  ```typescript
  export enum TokenType {
    // Keywords
    Round, Row, Turn, In, Mr, Fo,
    // Stitches
    Sc, Dc, Hdc, SlSt, Ch, Inc, Dec,
    // Syntax
    Identifier, Number, LeftBracket, RightBracket, Asterisk, Comma,
    // Color
    Color,
    // Other
    EOL, EOF,
  }

  export interface Token {
    type: TokenType;
    lexeme: string;
    line: number;
  }
  ```

- **Abstract Syntax Tree (AST)**:
  ```typescript
  export type ASTNode = PatternNode | InstructionNode;

  export interface PatternNode {
    type: 'Pattern';
    instructions: InstructionNode[];
  }

  export type InstructionNode = RoundNode | RowNode | FastenOffNode;

  export interface RoundNode {
    type: 'Round';
    roundNumber: number;
    stitches: StitchGroupNode[];
    stitchCount: number;
  }
  // ... similar nodes for RowNode, StitchGroupNode, RepeatNode, StitchNode etc.
  ```

- **Crochet Graph**:
  ```typescript
  export interface CrochetGraph {
    nodes: StitchNode[];
    edges: StitchConnection[];
  }

  export interface StitchNode {
    id: number;
    type: StitchType; // e.g., 'sc', 'dc'
    round: number;
    position: THREE.Vector3; // Calculated by Geometry Engine
    color: string;
  }

  export interface StitchConnection {
    from: number; // stitch id
    to: number;   // stitch id
  }
  ```

#### `src/lexer.ts`

The lexer (or tokenizer) scans the source code and converts it into a sequence of tokens.

- **`Lexer` class**:
  - `constructor(source: string)`
  - `scanTokens(): Token[]`: The main public method. It iterates through the source string character by character and produces tokens.
  - It will use a `Map<string, TokenType>` to map keywords and stitch names to token types for easy lookup.

#### `src/parser.ts`

The parser takes the token stream from the lexer and builds an AST. It will use a recursive descent parsing strategy.

- **`Parser` class**:
  - `constructor(tokens: Token[])`
  - `parse(): PatternNode`: The main public method.
  - Private methods for each grammar rule, e.g., `parsePattern()`, `parseInstruction()`, `parseRound()`, `parseStitchGroup()`.
  - It will handle operator precedence (if any) and gracefully report syntax errors.

#### `src/graphBuilder.ts`

This is the core "brain" of the compiler. It walks the AST and performs semantic analysis, creating a `CrochetGraph`. This is where the logic of stitch connections is implemented.

- **`GraphBuilder` class**:
  - `constructor(ast: PatternNode)`
  - `buildGraph(): CrochetGraph`: The main method.
  - It maintains the state of the crochet piece, including the current round, the stitches in the previous round, and the current attachment point.
  - For spirals (amigurumi), it will connect each stitch to the corresponding stitch in the round below it.
  - It will calculate the number of stitches per round and validate it against the user-provided count.
  - It will expand `inc` and `dec` into their base stitches.
  - It will handle `turn` instructions by reversing the attachment order for the next row.

#### `src/geometry.ts`

This engine takes the `CrochetGraph` and calculates the 3D position of each stitch. It then generates the visible 3D geometry.

- **`GeometryEngine` class**:
  - `constructor(graph: CrochetGraph)`
  - `generateScene(): THREE.Scene`: The main method.
  - **Stitch Placement**: This is the most complex part.
    - For flat circles/spirals, it will use polar coordinates. For a stitch `s` in a round `r` with `N` stitches:
      - `angle = (s / N) * 2 * PI`
      - `radius = r * YARN_THICKNESS`
      - The `z` coordinate will be incremented slightly for each round to create the 3D shape.
    - It will implement a simple physics-based relaxation algorithm to adjust stitch positions for a more natural look, preventing bunching and stretching. This replaces the need for an external C++/WASM module. Stitches can be modeled as nodes with spring-like forces (the yarn connections) between them.
  - **Yarn Generation**:
    - For each connection in the graph, it will create a `THREE.CatmullRomCurve3` between the `position` vectors of the connected `StitchNode`s.
    - It will use `THREE.TubeGeometry` to create a mesh along this curve, representing the yarn. The radius of the tube will be a configurable parameter.
    - It will assign materials (`THREE.MeshStandardMaterial`) to the tubes based on the color information in the graph.

#### `src/renderer.ts`

Sets up the Three.js environment and renders the scene.

- **`Renderer` class**:
  - `constructor(canvas: HTMLCanvasElement)`
  - `render(scene: THREE.Scene)`: Renders the given scene.
  - It will set up a `PerspectiveCamera`, `WebGLRenderer`, `OrbitControls`, and lighting (e.g., `AmbientLight`, `DirectionalLight`).
  - It will contain the `animate` loop to re-render the scene on each frame.

#### `src/index.ts`

This is the main entry point that ties everything together.

- It will have a main `compile` function:
  ```typescript
  function compile(sourceCode: string, canvas: HTMLCanvasElement) {
    // 1. Lex
    const lexer = new Lexer(sourceCode);
    const tokens = lexer.scanTokens();

    // 2. Parse
    const parser = new Parser(tokens);
    const ast = parser.parse();

    // 3. Build Graph
    const graphBuilder = new GraphBuilder(ast);
    const graph = graphBuilder.buildGraph();

    // 4. Generate Geometry
    const geoEngine = new GeometryEngine(graph);
    const scene = geoEngine.generateScene();

    // 5. Render
    const renderer = new Renderer(canvas);
    renderer.render(scene);
  }
  ```

## 4. Build and Run

- **Dependencies**: `three`, `@types/three`, `typescript`, `ts-node`.
  - These would be listed in `package.json`.
- **Configuration**: `tsconfig.json` will be set up to compile TypeScript to modern JavaScript (e.g., ES2020).
- **Running**: A simple web page (`index.html`) would host a `<textarea>` for the Crochetex code and a `<canvas>` for the 3D output. A button would trigger the `compile` function in `index.ts`.

This document provides a complete blueprint for the Crochetex language and compiler. The design prioritizes a simple user experience while leveraging the power of TypeScript and Three.js to handle the complex underlying calculations, creating a powerful tool for modern crochet pattern design. 