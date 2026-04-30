# Rule Name: SonarScan Rule

## Objective

Whenever the user provides any request that implies running a **SonarQube scan** or **fetching issues** (even if the wording is different), apply these rules.

Examples of such requests include (but are not limited to):

- "Run sonar scan"
- "Perform SonarQube analysis"
- "Analyze code using Sonar"
- "Fetch issues from sonar"
- "Run scan and give JSON output"

---

## 🚨 IMPORTANT RULES - MUST FOLLOW BEFORE RUNNING SONAR SCAN

- 🔍 **Always check if the project is Maven-based** by detecting the presence of `pom.xml` in the project root before doing any Maven-related actions.
- 🔧 Always use the global Maven command (mvn) for Maven-based projects.
- 🛠️ Ensure Maven is pre-installed and available in the system PATH.
- ❌ If `mvn` is not found:

  ```
  [ERROR] Maven is not available please install it first.
  ```

  - **Stop execution immediately if `mvn` not found .**

- ✅ Do not install Maven dynamically. Fail fast if required tools are missing.
- ❌ **Do NOT create any new script files.** Execute commands directly.
- ⚠️ Always confirm that `sonar-scanner` is available in system PATH before running.

---

### 0. Maven Project Detection (Pre-check)

- Before running any scan, **detect if the current project is Maven-based** by checking for the presence of a `pom.xml` file in the root directory.

- ✅ If `pom.xml` is present:

  - Proceed to Section 1 to check for the **Maven (`mvn`)**.

- ❌ If `pom.xml` is NOT found:
  - **Do NOT attempt to run any Maven commands**.
  - Skip Maven checks and move on to the next rule.directly to running `sonar-scanner` if appropriate (e.g., for frontend/JavaScript projects).
  - Ensure that the Sonar scan does not reference `sonar.java.binaries`, unless the `target/` folder actually exists.

---

### 1. Sonar Scan Execution

- Execute the Sonar Scan using **shell commands**.

- Do NOT attempt to modify the script or add unnecessary logic. Only run the scan as intended.
- **Do NOT create any new script files. Execute commands directly.**

- Pre-requisite: The user will manually download and install `sonar-scanner` and add it to the system PATH.

- **Check if `sonar-scanner` is available in PATH** before running.

- If `sonar-scanner` is NOT available:

  - Notify the user:
    ```
    [ERROR] sonar-scanner is not installed or not available in PATH. Please install it and set PATH before running the process.
    ```
  - **Stop execution immediately.**

- **Maven-based Project (`pom.xml` was detected** in Step 0):

  - **check if (`mvn`) is installed** :

    - If `mvn` is available :

      - Run the appropriate command:

      ```bash
      mvn clean compile
      sonar:sonar
      -D sonar.projectKey=<PROJECT_KEY> \
      -D sonar.sources=. \
      -D sonar.host.url=<SONAR_HOST_URL> \
      -D sonar.login=<SONAR_TOKEN>
      ```

      - **Wait until the mvn command finishes execution before proceeding.**

    - If `mvn` is not available :

      ```
      [ERROR] Maven is not available. Please install it and set PATH before running the process:
      ```

      - **Stop execution. Do NOT proceed with scan.**
      - **This means no fallback to sonar-scanner for Maven projects — you simply fail.**

- **Non-Maven Project (`pom.xml` was not detected** in Step 0):

  - Run Sonar scan directly:

  ```bash
  sonar-scanner \
      -D sonar.projectKey=<PROJECT_KEY> \
      -D sonar.sources=. \
      -D sonar.host.url=<SONAR_HOST_URL> \
      -D sonar.login=<SONAR_TOKEN>
  ```

  - **Wait until the sonar-scanner command finishes execution before proceeding.**

---

### 2. Configuration Source

- **Read the `sonar-project.properties` file every time** before running `sonar-scanner` or fetching issues.
- Do not cache or assume values; always refresh from the file.

---

### 3. Fetching Issues and JSON Handling

- After the scan completes, **fetch all unresolved issues** from SonarQube.

- If the user specifies a **severity level in the prompt**, fetch only issues of that severity (e.g., `BLOCKER`, `CRITICAL`, `MAJOR`, `MINOR`, `INFO`).

- Save the issues in a **JSON file** with the following naming format:

  ```
  Sonar_issues_[SEVERITY]_[TIMESTAMP].json
  ```

  ✅ Example:

  ```
  SonarResults/Sonar_issues_CRITICAL_2025-07-24T11-45-00.json
  ```

- Ensure:
  - File integrity (no truncation or partial data).
  - Complete content from SonarQube API.

---

### 4. Directory Management

- All Sonar Scan JSON files **and any dependencies (like `sonar-scanner` binaries)** must be stored in:

  ```
  SonarResults
  ```

- If this folder does not exist, **create it automatically** before saving files or downloading dependencies.

---

### 5. Large File Handling

- If the JSON file or any file exceeds **filesystem read limits**, do NOT read partially.

- Use an appropriate **command-line tool** (e.g., `cat`, `less`, `more`) or chunked reading approach to read the entire file accurately.

- **Never provide false or incomplete data due to size limitations.**
- If the JSON output from SonarQube is too large to be safely read into memory or displayed in the terminal:
  - Use a streaming or chunked reading mechanism (e.g., `jq`, `more`, `split`, or line-by-line parsing).
  - Avoid loading the entire file into shell variables or memory at once.
  - Use file redirection or pagination tools for output inspection.
  - Never read large JSON content directly using shell substitution like `output=$(cat file.json)` for files larger than 1 MB.

---

### 6. Path Resolution

- If there is a **path issue**:
  - Attempt multiple possible resolutions automatically (e.g., relative path, absolute path, environment variable).
  - Do NOT stop execution and wait for user input unless all automated attempts fail.

---

### 7. Reliability Principle

- Always prioritize **accuracy and completeness** over speed.
- Do not guess or generate fake data.
- Follow **SonarQube API response exactly**.

---

### 8. User Input: @<file> Format

- When user provides file references using `@<filename>` syntax, automatically include those specific files in the scan scope.
- Parse `@` references from user input and add them to the scan parameters.
- Support both individual files and multiple file references in a single request.

**✅ Supported Input Patterns**

- @MyClass.java
- @src/utils/helper.py
- Run scan on @MyClass.java and @AnotherClass.java
- @workspace run sonar scanner and fetch issues from @models.py

**🔁 General Behavior**

- Support both single and multiple file references in the same request.
- Accept both relative paths and simple file names.
- Automatically glob-match file names (e.g., \*\*/MyClass.java) if full path is not provided.

---

### 9. File-Based Inclusion for Scan

- Allow users to specify individual files or file patterns for targeted scanning.
- Support relative and absolute file paths in scan requests.
- Automatically validate file existence before initiating scan.
- If specified files don't exist, notify user and continue with available files.
- If the user wants to scan only a specific file using inclusion (e.g., @file.py), the following rule applies:
  - In the sonar-scanner command, append:
    ```
    -D sonar.inclusions=**/<filename>
    ```
  - Only the file name is needed (not full path), assuming it exists somewhere in the scanned directory tree.
  - Example:
    ```bash
    -D sonar.inclusions=**/models.py
    ```

---

### 10. File Naming Flexibility (Automatic JSON Names)

- Generate JSON filenames automatically based on scan parameters and timestamp.
- Use format: `Sonar_issues_[SEVERITY]_[TIMESTAMP].json` for severity-specific scans.
- Use format: `Sonar_issues_ALL_[TIMESTAMP].json` for complete scans.
- If custom filename provided by user, Use format: `Sonar_issues_[FILENAME}_[TIMESTAMP].json`.
- Ensure filename uniqueness by appending incremental numbers if conflicts exist.

---
