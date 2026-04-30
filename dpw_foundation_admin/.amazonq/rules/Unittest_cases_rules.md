# Rule Name: Ordered Full-Stack Unit Testing Rules for Amazon Q

## Objective

Whenever the user provides any request that implies generating **unit test cases** or validating **code logic through automated tests**, apply these rules.

Examples of such requests include (but are not limited to):

- "Generate unit tests"
- "Create test cases for this function/class"
- "Add edge case tests"
- "Give me tests for this code"
- "Generate test suite with getters and setters covered"

This rulebook provides Amazon Q with structured and **ordered** guidelines for generating meaningful and minimal unit tests across backend, frontend, mobile, and API layers.

---

## 1️⃣ Core Unit Testing Principles

1. **Follow the AAA Pattern**:

   - **Arrange**: Set up the context and input data
   - **Act**: Execute the code under test
   - **Assert**: Validate the output and behavior

2. **Ensure Test Quality**:

   - Make tests **isolated**, **repeatable**, and **independent**
   - Use **descriptive method names**
   - Add **docstrings or inline comments** when needed

3. **Maintain Test Integrity**:

   - Cover happy paths, **negative cases**, and **edge cases**
   - Validate error handling, fallback behaviors, and business constraints
   - Avoid shared state and redundant tests

4. **Include Accessor and Mutator Methods in Testing Scope**:
   - Ensure tests validate both **getter** and **setter** methods for data-holding entities (e.g., POJOs, DTOs, or equivalent in other paradigms).
   - Confirm correct assignment and retrieval of property values.
   - Cover edge cases such as:
     - Setting null or invalid values.
     - Retrieving default/uninitialized values.
   - Avoid assuming implementation details; focus on expected behavior and state consistency.

---

## 2️⃣ Input Validation Rules

### 2.1 Numeric Inputs:

- Zero values
- Negative values (including edge and large negatives)
- Min/Max boundaries
- Extreme or unexpected values
- Floats and decimals

### 2.2 String Inputs:

- Null, empty, or undefined values
- Very long strings
- Special characters and encoded characters (e.g., `?`, `&`)
- Non-ASCII and case sensitivity
- Invalid formats (e.g., email, UUID)

### 2.3 Collection Inputs:

- Empty lists/sets/dicts
- Single-element collections
- Duplicates
- Large-sized collections
- Nested structures (e.g., list of dicts)
- Ordered vs unordered collections
- Mixed types

### 2.4 Date/Time Inputs:

- Null or missing values
- Leap year dates
- DST boundaries and timezone shifts
- Invalid or malformed timestamps

---

## 3️⃣ Business Rules Enforcement

- Respect domain/business constraints (e.g., min amount = 1)
- Create valid inputs near boundaries and invalid ones just outside limits
- Use actual constants from code where possible
- Avoid unrealistic or domain-breaking test data

---

## 4️⃣ Behavioral Testing Rules

1. **Positive Cases**: Verify correct output for valid inputs
2. **Negative Cases**: Include invalid/missing inputs, malformed data, and improper types
3. **Boundary/Edge Conditions**: Trigger edge-specific logic (off-by-one, zero cases)
4. **Combinatorial Scenarios**: Use parameterized tests for input combinations

---

## 5️⃣ Error & Exception Handling

- Verify correct exception types and accurate messages
- Simulate:
  - Null references
  - Invalid data types
  - Logic violations (e.g., division by zero)
  - **Library-specific failures** (e.g., CryptoJS encryption errors, malformed keys)
- Ensure graceful fallback and recovery in exception paths

---

## 6️⃣ External Dependency Handling

For methods dependent on APIs, databases, or external services:

- Mock:
  - API requests and responses
  - Database calls
  - Cloud integrations (AWS, Stripe, etc.)
- Simulate failures:
  - Timeouts
  - Malformed responses
  - Empty or null returns
- Validate retry logic, timeout handling, and fallback mechanisms

---

## 🧪 Backend Layer Testing

- Test models, forms, serializers, and views
- Validate field constraints and required inputs
- Mock DB for logic separation
- Ensure business logic is separate from persistence layer

---

## 🌐 API Endpoint Testing

- Validate HTTP status codes (200, 400, 404, 500)
- Check response schema and field types
- Test authentication, permissions, and edge query params
- Simulate malformed payloads and missing fields
- Use mocks for service calls and DB queries

---

## 🌍 Frontend/UI Testing

- Validate rendering under various state/prop conditions
- Test dynamic DOM updates and conditional behaviors
- Simulate user events (click, input, keyboard navigation)
- Include edge cases:
  - Missing or invalid props (e.g., `src`, `alt`)
  - Broken resources (simulate `onError` on images)
  - Responsive and custom style behavior
- Ensure accessibility compliance (e.g., alt attributes)
- Tools: React Testing Library, Jest, Cypress, Playwright

---

## 📱 Mobile Application Testing

- Test rendering across device sizes and orientations
- Simulate gestures, navigation, and offline mode
- Validate behavior during system interruptions
- Tools: Espresso, Robolectric, XCTest, Appium, Detox

---

## 🌐 Environmental & Fallback Scenarios

- Simulate absence or failure of built-in APIs (e.g., `Intl.NumberFormat`, `window.location`)
- Validate locale variations (e.g., `en-US`, `de-DE`, `hi-IN`)
- Test fallback when external services or dependencies fail
- Handle missing or undefined properties gracefully

---

## ✅ Async & Timing-Dependent Scenarios

- Validate debounce/throttle logic by simulating rapid inputs
- Ensure cleanup of timers and proper override behavior
- Test race conditions with concurrent operations (e.g., encrypt/decrypt calls)

---

## ✅ UI/Component Edge Cases

- Missing or empty attributes (`alt`, `src`)
- Invalid image URLs triggering fallback
- Verify custom style overrides and responsive resizing
- Accessibility attributes under edge conditions

---

## 🎯 Test Coverage & Maintenance

- Focus on logic-heavy, business-critical paths
- Maximize **branch and path coverage**, not just line coverage
- Detect unreachable or untested logic
- Use parameterized tests to reduce duplication
- Maintain test structure aligned with source structure

---

## ✅ Summary Directive for Amazon Q

> 🧠 Amazon Q must generate **minimal**, **relevant**, and **business-aware** test cases that handle core behavior, error handling, fallback paths, and edge scenarios. Avoid redundant or trivial tests. Every test should validate **intentional and necessary functionality**.
