# Testing Metal Syntax Highlighting

This guide covers all the ways to test the Metal language definition for highlight.js.

## Quick Start

```bash
# 1. Install dependencies (if not already done)
npm install

# 2. Build the project
npm run build

# 3. Run tests
npm run test-markup
```

## Testing Methods

### 1. Automated Unit Tests

The project uses Mocha for automated testing. Metal tests are in `test/markup/metal/`:

```bash
# Run all markup tests
npm run test-markup

# Run only Metal tests
ONLY_LANGUAGES="metal" npm run test-markup

# Run all tests (includes markup, detect, parser, etc.)
npm test
```

**Test Structure:**
- `test/markup/metal/default.txt` - Source Metal code
- `test/markup/metal/default.expect.txt` - Expected HTML output with syntax highlighting

To add more tests, create pairs of `.txt` and `.expect.txt` files in the `test/markup/metal/` directory.

### 2. CLI Testing Script

Use the included test script to quickly check syntax highlighting:

```bash
# Test with sample code
node test-metal.js

# Test with your own Metal file
node test-metal.js path/to/your/shader.metal
```

This will show:
- The highlighted HTML output
- Language detection confidence (relevance score)
- All detected token types

### 3. Visual HTML Demo

Open the HTML demo page to see syntax highlighting with different themes:

```bash
# Start a local web server
npm run devtool

# Then open in your browser:
# http://localhost:8080/demo-metal.html
```

The demo includes:
- Vertex shader example
- Fragment shader example  
- Compute kernel example
- Advanced Metal features
- Theme switcher to test with different color schemes

### 4. Using the Demo Page

The project includes a developer demo page:

```bash
# Start the server
npm run devtool

# Open: http://localhost:8080/tools/developer.html
# Select "Metal" from the language dropdown
# Paste your Metal code and see it highlighted
```

### 5. Manual Testing with Node.js

You can test programmatically:

```javascript
const hljs = require('./build');

const metalCode = `
#include <metal_stdlib>
using namespace metal;

kernel void myKernel(device float *data [[buffer(0)]]) {
    // Your code here
}
`;

const result = hljs.highlight(metalCode, { language: 'metal' });
console.log(result.value); // HTML with syntax highlighting
console.log(result.relevance); // Confidence score
```

## Creating New Test Cases

To add a new test case:

1. Create `test/markup/metal/yourtest.txt` with Metal source code
2. Run: `node -e "const hljs = require('./build'); const fs = require('fs'); const source = fs.readFileSync('test/markup/metal/yourtest.txt', 'utf-8'); const result = hljs.highlight(source, { language: 'metal' }); fs.writeFileSync('test/markup/metal/yourtest.expect.txt', result.value);"`
3. Review the generated `.expect.txt` file to ensure highlighting is correct
4. Run `npm run test-markup` to verify the test passes

## What Gets Highlighted

The Metal grammar recognizes:

### Keywords
- Control flow: `if`, `else`, `for`, `while`, `switch`, `case`, `break`, `continue`, `return`
- Type keywords: `struct`, `enum`, `class`, `typedef`, `typename`
- Address space qualifiers: `device`, `constant`, `thread`, `threadgroup`
- Function qualifiers: `vertex`, `fragment`, `kernel`

### Types
- Scalar types: `bool`, `char`, `int`, `uint`, `half`, `float`, `bfloat`
- Vector types: `float2`, `float3`, `float4`, `int2`, `half3`, etc.
- Matrix types: `float3x3`, `float4x4`, `half2x2`, etc.
- Texture types: `texture1d`, `texture2d`, `texture3d`, `texturecube`
- Sampler types: `sampler`
- Atomic types: `atomic_int`, `atomic_uint`

### Attributes
- Function attributes: `[[vertex]]`, `[[fragment]]`, `[[kernel]]`
- Parameter attributes: `[[buffer(n)]]`, `[[texture(n)]]`, `[[position]]`, etc.
- Input attributes: `[[stage_in]]`, `[[thread_position_in_grid]]`, etc.

### Built-in Functions
- Math: `sin`, `cos`, `sqrt`, `pow`, `abs`, `floor`, `ceil`, etc.
- Geometric: `dot`, `cross`, `normalize`, `reflect`, `refract`
- Texture sampling: `sample`, `read`, `write`, `gather`
- Atomic operations: `atomic_fetch_add_explicit`, etc.

### Other Features
- Comments: `//` and `/* */`
- Preprocessor directives: `#include`, `#if`, `#ifdef`, etc.
- String literals
- Numeric literals with suffixes (`0.5h`, `1.0f`)

## Troubleshooting

### Test Failures

If tests fail, check:
1. Did you rebuild after changing `src/languages/metal.js`? Run `npm run build`
2. Is the expected output correct? Review `.expect.txt` files manually
3. Are there syntax errors in the test `.txt` files?

### Highlighting Issues

If something isn't highlighted correctly:
1. Check if the keyword/type is in the lists in `src/languages/metal.js`
2. Verify the regex patterns match your use case
3. Look at similar languages like `cpp.js` or `glsl.js` for reference
4. Test with the CLI script to see what tokens are detected

### Building Issues

If the build fails:
```bash
# Clean and reinstall
rm -rf node_modules build
npm install
npm run build
```

## Useful NPM Scripts

```bash
npm run build              # Build for Node.js
npm run build-browser      # Build for browser
npm run build-cdn          # Build for CDN distribution
npm run test               # Run all tests
npm run test-markup        # Run markup tests only
npm run test-detect        # Run language detection tests
npm run lint               # Check code style
npm run lint-languages     # Lint language definitions
```

## Next Steps

After testing:
1. Consider adding more test cases for edge cases
2. Test language auto-detection by adding samples to `test/detect/`
3. Submit a pull request if you'd like to contribute this to highlight.js
4. Update `SUPPORTED_LANGUAGES.md` if contributing

## Resources

- [highlight.js documentation](https://highlightjs.readthedocs.io/)
- [Language definition guide](https://highlightjs.readthedocs.io/en/latest/language-guide.html)
- [Metal Shading Language Specification](https://developer.apple.com/metal/Metal-Shading-Language-Specification.pdf)

