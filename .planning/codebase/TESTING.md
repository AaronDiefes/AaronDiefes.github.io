# Testing Patterns

**Analysis Date:** 2026-02-02

## Test Framework

**Runner:**
- Not detected - No test framework currently configured
- No `jest.config.js`, `vitest.config.js`, or similar test runner configurations found
- No `package.json` with test dependencies

**Assertion Library:**
- C++ assertions: `assert()` macro used for validation in `my_final.cpp`
  - Example: `assert(prop <= positions[k]);`, `assert(propC1 >= 0.0f && propC1 <= 1.0f);`
- JavaScript: No assertion library detected
- No dedicated testing framework

**Run Commands:**
```bash
make              # Build graphics engine application
make clean        # Clean build artifacts
make image        # Explicitly build image executable (same as 'all')
```

## Test File Organization

**Location:**
- No test files present in codebase
- Graphics engine built as single application (`image` executable)
- Web UI components are not unit tested

**Naming:**
- Not applicable - no test files detected
- Convention would likely follow: `*_test.cpp`, `*_spec.cpp`, or separate `tests/` directory based on C++ standards

**Structure:**
- Not applicable - no test infrastructure exists

## Test Structure

**Suite Organization:**
- Not applicable - no test framework configured

**Patterns:**
- **Assertion pattern** (C++): Simple `assert()` calls for validation
  ```cpp
  assert(prop <= positions[k]);
  assert(propC1 >= 0.0f && propC1 <= 1.0f);
  ```

- **Parameter validation** (C++): Bounds checking in shader logic
  ```cpp
  if (currX < 0) currX = 0;
  if (currX > count - 1) currX = count - 1;
  ```

- **Event testing** (HTML/JavaScript): Manual browser-based testing via UI controls
  - Shape drawing tested via button clicks and canvas interactions
  - Transformations tested via slider inputs
  - Blend modes tested via dropdown selection

## Mocking

**Framework:** Not applicable

**Patterns:** Not observed

**What to Mock:**
- For future tests: File I/O operations in graphics engine
- External canvas contexts would be mocked for unit testing
- DOM operations would require mocking in Node.js test environment

**What NOT to Mock:**
- Core graphics algorithms (linear gradient shading, coons patching)
- Matrix transformations
- Color blending operations

## Fixtures and Factories

**Test Data:**
- **Hardcoded test cases in HTML**: The graphics demo includes predefined shape types in select element:
  ```html
  <select id="shapeType">
      <option value="rect">Rectangle</option>
      <option value="circle">Circle</option>
      <option value="triangle">Triangle</option>
      <option value="line">Line</option>
      <option value="polygon">Polygon</option>
  </select>
  ```

- **Canvas dimensions**: Fixed test dimensions (700x600) in `graphics-demo.html`
  ```html
  <canvas id="canvas" width="700" height="600"></canvas>
  ```

- **Color fixtures**: Predefined color picker value in demo
  ```html
  <input type="color" id="colorPicker" value="#667eea">
  ```

- **C++ gradient test data**: Hard-coded in shader implementation
  ```cpp
  LinearPosGradientShader(GPoint p0, GPoint p1, const GColor colors[],
                         const float pos[], int count)
  ```

**Location:**
- HTML test fixtures: Embedded in `graphics-demo.html`
- No separate fixtures directory
- Test data constructed on-demand in JavaScript functions

## Coverage

**Requirements:**
- No coverage targets enforced
- No coverage measurement tools configured
- No coverage reports or CI/CD checks

**View Coverage:**
- Not applicable - no coverage tools detected

## Test Types

**Unit Tests:**
- **Status**: Not implemented
- **Scope**: Would test individual functions like:
  - `hexToRgba()` color conversion
  - `unpremult()` color unpremultiplication
  - Gradient interpolation logic in `shadeRow()`
  - Matrix transformation calculations

**Integration Tests:**
- **Status**: Not implemented via automated testing
- **Manual approach**: Interactive demo in `graphics-demo.html` serves as integration test
  - Tests shape rendering pipeline
  - Tests transformation application
  - Tests blend mode switching
  - Tests animation loop

**E2E Tests:**
- **Framework**: Not used
- **Manual testing approach**:
  - Open `graphics-demo.html` in browser
  - Interact with controls to verify:
    - Shape types render correctly
    - Transformations apply properly
    - Opacity/rotation/scale work as expected
    - Blend modes display correctly
    - Animation loop functions
    - Clear canvas resets state
  - Open `admin.html` to test password authentication:
    - Password: `graphics2024`
    - Verifies SHA-256 hashing works
    - Tests session storage persistence
    - Tests logout functionality

## Common Patterns

**Assertion pattern (C++):**
```cpp
if (currX < 0) currX = 0;
if (currX > count - 1) currX = count - 1;

prop = currX / (count - 1);
k = 0;

while (true) {
    if (prop > positions[k]) {
        k++;
    } else {
        break;
    }
}
assert(prop <= positions[k]);
```

**Event-driven testing (JavaScript):**
```javascript
drawBtn.addEventListener('click', drawShape);
clearBtn.addEventListener('click', clearCanvas);
animateBtn.addEventListener('click', toggleAnimation);
canvas.addEventListener('click', drawShape);

opacitySlider.addEventListener('input', (e) => {
    opacityValue.textContent = e.target.value + '%';
});
```

**Password verification pattern (JavaScript):**
```javascript
async function sha256(message) {
    const msgBuffer = new TextEncoder().encode(message);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const password = document.getElementById('password').value;
    const hash = await sha256(password);

    if (hash === PASSWORD_HASH) {
        sessionStorage.setItem('authenticated', 'true');
        showCodeViewer();
    } else {
        error.classList.add('show');
        document.getElementById('password').value = '';
    }
});
```

**Animation testing pattern (JavaScript):**
```javascript
let animating = false;
let animationId;

function animate() {
    if (!animating) return;

    rotationSlider.value = (parseInt(rotationSlider.value) + 5) % 360;
    rotationValue.textContent = rotationSlider.value + '°';
    drawShape();

    animationId = setTimeout(() => {
        requestAnimationFrame(animate);
    }, 100);
}

function toggleAnimation() {
    animating = !animating;
    if (animating) {
        animateBtn.textContent = 'Stop Animation';
        animateBtn.style.background = '#e74c3c';
        animate();
    } else {
        animateBtn.textContent = 'Animate Shapes';
        animateBtn.style.background = '#667eea';
        clearTimeout(animationId);
    }
}
```

## Recommendations for Test Implementation

**Priority 1 - Unit Tests (C++):**
- Create `tests/` directory
- Implement Google Test or Catch2 framework
- Test color conversion utilities
- Test matrix transformations
- Test gradient shader calculations

**Priority 2 - DOM Tests (JavaScript):**
- Implement Jest or Vitest with jsdom
- Test UI event handlers
- Test color picker integration
- Test slider value updates

**Priority 3 - Integration Tests:**
- Canvas rendering validation
- Shape drawing with various parameters
- Transformation pipeline verification

**Priority 4 - E2E Tests:**
- Implement Puppeteer or Playwright
- Automate browser-based demo testing
- Verify interactive features work end-to-end

## Build Verification

**Current validation method**: Makefile compilation
```bash
CC = g++ -g -Wno-narrowing -Wreturn-type -Wunused-function -Wreorder -Wunused-variable -Wfloat-conversion
```

Compiler warnings catch:
- Narrowing conversions: `-Wno-narrowing` (disabled)
- Missing return statements: `-Wreturn-type`
- Unused functions: `-Wunused-function`
- Member variable initialization order: `-Wreorder`
- Unused variables: `-Wunused-variable`
- Float to int conversion: `-Wfloat-conversion`

---

*Testing analysis: 2026-02-02*
