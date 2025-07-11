Of course. Here is a dissected, step-by-step plan to build the **Crochetex** project.

This plan breaks the work into logical, sequential stages. Each stage focuses on a distinct part of the compiler pipeline and includes a **progress check** to ensure the implementation is solid before moving on. This incremental approach will prevent errors and make the project much more manageable.

### **Step 1: Project Setup and Core Types**

This foundational step prepares the development environment and defines the essential data structures that will be used across the entire project.

* **Goal:** Create the project structure, install dependencies, and define all the custom types in `src/types.ts`.
* **Tasks:**
    1.  Create the directory structure as outlined in the documentation (`src/`, `patterns/`).
    2.  Initialize a `package.json` file (`npm init -y`).
    3.  Install the necessary dependencies: `npm install typescript ts-node three` and `npm install -D @types/three`.
    4.  Create a `tsconfig.json` file with appropriate settings for ES2020 output and module resolution.
    5.  Populate the `src/types.ts` file with the complete definitions for `TokenType`, `Token`, all `ASTNode` interfaces (`PatternNode`, `RoundNode`, `StitchGroupNode`, etc.), and the `CrochetGraph` structures (`StitchNode`, `StitchConnection`).

* **Progress Check:** ✅ All files and directories are in place. The `src/types.ts` file is fully populated, and the project can be compiled without errors (`npx tsc`). There is no functional output yet.

---

### **Step 2: Implement the Lexer (Tokenizer)**

This step focuses on converting the raw `.crochetex` source text into a flat list of tokens. This is the first stage of the compilation pipeline.

* **Goal:** Implement the `Lexer` class in `src/lexer.ts` to correctly tokenize a crochet pattern.
* **Tasks:**
    1.  Create the `Lexer` class in `src/lexer.ts`.
    2.  Implement the constructor and the main `scanTokens(): Token[]` method.
    3.  Use a `Map` to store keywords (`R1`, `mr`, `sc`, `inc`, etc.) and their corresponding `TokenType`.
    4.  Implement logic to scan for different token types: single-character tokens (`[`, `]`, `*`, `,`), numbers, identifiers (stitch names), and comments.
    5.  Write a temporary test snippet in `src/index.ts` to read the `patterns/sphere.crochetex` file, pass it to the lexer, and `console.log` the resulting array of tokens.

* **Progress Check:** ✅ When you run the test snippet, it should log an array of tokens that accurately represents the `sphere.crochetex` pattern, including line numbers. For example, `R1:` becomes a `Round` token, `6` becomes a `Number` token, and `sc` becomes an `Sc` token.

---

### **Step 3: Implement the Parser**

With a stream of tokens, the next step is to build an Abstract Syntax Tree (AST) that represents the pattern's hierarchical structure.

* **Goal:** Implement the `Parser` class in `src/parser.ts` to convert a token stream into a structured `ASTNode`.
* **Tasks:**
    1.  Create the `Parser` class in `src/parser.ts`.
    2.  Implement the main `parse(): PatternNode` method.
    3.  Use a recursive descent strategy by creating private methods for each part of the grammar (e.g., `parseInstruction()`, `parseRound()`, `parseStitchGroup()`).
    4.  Start with the simplest structure: parsing a single round/row definition.
    5.  Add logic to handle repetitions (`[ ... ] * N`).
    6.  Implement error handling for basic syntax mistakes (e.g., a missing parenthesis).
    7.  Modify the test snippet in `src/index.ts` to pipe the lexer's output into the parser and `console.log` the resulting AST.

* **Progress Check:** ✅ The test script should now log a structured JSON object representing the AST for the sphere pattern. You should be able to clearly see the hierarchy: a `Pattern` node containing a list of `Round` nodes, which in turn contain `StitchGroup` and `Repeat` nodes.

---

### **Step 4: Implement the Graph Builder**

This is the semantic analysis phase. Here, you'll walk the AST and build a logical graph of how stitches are connected, enforcing the rules of crochet.

* **Goal:** Implement the `GraphBuilder` class in `src/graphBuilder.ts` to convert the AST into a `CrochetGraph`.
* **Tasks:**
    1.  Create the `GraphBuilder` class.
    2.  Implement the `buildGraph(): CrochetGraph` method that iterates through the AST's `InstructionNode`s.
    3.  Maintain the state of the previous round's stitches to know where to connect the current round's stitches.
    4.  Implement the logic for expanding stitch aliases (e.g., an `inc` node in the AST becomes two `sc` `StitchNode`s in the graph).
    5.  For each stitch created, create the `StitchConnection` edges that link it to the appropriate stitch(es) in the previous round.
    6.  Perform semantic validation: check if the calculated stitch count for a round matches the count provided in the pattern (e.g., `(12)`).
    7.  Update the test snippet in `src/index.ts` to pass the AST to the `GraphBuilder` and `console.log` the final `CrochetGraph`.

* **Progress Check:** ✅ The console output should be a graph object containing a list of `StitchNode`s and `StitchConnection`s. For the sphere pattern, you should see 6 nodes for R1, 12 nodes for R2, and the `edges` array should show each of the 12 stitches in R2 connecting back to the 6 stitches in R1.

---

### **Step 5: Geometry Engine (Stitch Placement)**

Now it's time to give the abstract graph a physical form by calculating the 3D coordinates for each stitch.

* **Goal:** Implement the `GeometryEngine` class in `src/geometry.ts` to calculate the `THREE.Vector3` position for every stitch in the `CrochetGraph`.
* **Tasks:**
    1.  Create the `GeometryEngine` class.
    2.  In a method like `calculateStitchPositions()`, iterate through the graph's nodes.
    3.  Implement the polar coordinate logic for placing stitches in a spiral. For a stitch `s` out of `N` in round `r`:
        * `angle = (s / N) * 2 * Math.PI`
        * `radius = r * YARN_THICKNESS` (use a constant for `YARN_THICKNESS` for now)
        * `x = radius * Math.cos(angle)`
        * `y = radius * Math.sin(angle)`
        * `z = r * STITCH_HEIGHT` (use a constant for `STITCH_HEIGHT` to create vertical separation)
    4.  Store the calculated `THREE.Vector3` in the `position` property of each `StitchNode` in the graph.
    5.  For now, do not implement the physics-based relaxation. A simple geometric placement is sufficient for this step.

* **Progress Check:** ✅ After this stage, the `CrochetGraph` object passed out of the geometry engine should have every `StitchNode.position` property populated with a `THREE.Vector3`. A simple `console.log` will verify this.

---

### **Step 6: Geometry Engine (Yarn Generation & Rendering)**

With stitch positions calculated, you can now generate the visible 3D yarn and render it on screen.

* **Goal:** Generate `THREE.TubeGeometry` for each yarn connection and render the final scene using the `Renderer` class.
* **Tasks:**
    1.  In `src/geometry.ts`, implement the main `generateScene(): THREE.Scene` method.
    2.  Inside this method, create a new `THREE.Scene`.
    3.  Iterate through the `StitchConnection` edges of the graph. For each edge, find the `from` and `to` stitch nodes and their `position` vectors.
    4.  Create a `THREE.CatmullRomCurve3` between the two stitch positions.
    5.  Use `THREE.TubeGeometry` to create a mesh from the curve. Use a `THREE.MeshStandardMaterial` for the color.
    6.  Add the generated tube mesh to the scene.
    7.  Implement the `Renderer` class in `src/renderer.ts`. This class will set up the camera, lighting, `WebGLRenderer`, and `OrbitControls`.
    8.  Implement the final `compile` function in `src/index.ts` to orchestrate the full pipeline from source text to rendering.
    9.  Create a basic `index.html` with a `<canvas>` and a `<textarea>` to run the application.

* **Progress Check:** ✅ **It's alive!** 🚀 You should now see a 3D model of the sphere pattern rendered in the browser. You should be able to rotate and zoom around the object. The shape will be a bit flat and mechanical, but it will be a complete, rendered 3D model.

---

### **Step 7: Expansion and Refinement**

With the core pipeline fully functional, you can now begin implementing the more advanced features.

* **Goal:** Incrementally add the advanced language features.
* **Tasks (choose one at a time):**
    1.  **Color Changes:** Modify the lexer, parser, and graph builder to handle `{color}` syntax. In the `GeometryEngine`, assign different `Material` instances based on the `StitchNode.color` property.
    2.  **Working in Rows:** Update the graph builder to handle the `turn` keyword by reversing the connection order for the subsequent row. Adjust the geometry engine to place rows linearly instead of in a circle.
    3.  **Advanced Stitches:** Implement logic for `flo/blo` and working in chain spaces (`ch-2 sp`). This will require significant new logic in the graph builder and geometry engine to identify and target these non-standard connection points.
    4.  **Physics Relaxation:** As an enhancement to the geometry engine, implement a simple iterative loop that treats yarn connections as springs, slightly adjusting stitch positions to create a more natural, relaxed fabric look.

* **Progress Check:** ✅ After each new feature is added, test it with a new `.crochetex` pattern file to verify that it is parsed, built, and rendered correctly.