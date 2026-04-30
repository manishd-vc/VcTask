# Amazon Q – Framework Extraction Rules (Error-Free Skeleton)

## Objective

Whenever the user provides any request that implies **removing business-specific logic**, **extracting a reusable framework skeleton**, or creating a **clean base structure** (frontend/backend/full-stack), apply these rules while preserving:

- Core framework structure and reusable components.
- Both backend and frontend must run successfully without errors after setup.
- Original project remains untouched.

Examples of such requests include (but are not limited to):

- "Extract the generic framework"
- "Remove real estate logic and keep chatbot"
- "Give me a reusable frontend/backend template"
- "Create a skeleton project from this repo"
- "Clean the app to keep only framework structure"

---

## ✅ 1. Preserve Core Structure

- Retain the complete folder structure for backend and frontend.
- Do **NOT** delete folders; replace business logic files with placeholders.

---

## ✅ 2. Remove All Business-Specific Logic

- Identify and remove any feature, module, or code tied to a specific business domain (e.g., e-commerce, real estate, finance, etc.).
- If a route, service, or UI component depends on removed logic:
  - Replace its implementation with a placeholder so the application remains functional.

---

## ✅ 3. Retain Common and Reusable Components

- Keep all shared utilities, middleware, authentication layers, configurations, and other components that are framework-level and not tied to specific business logic.

---

## ✅ 4. Retain Configurations & Boot Files

- Keep all essential configuration and initialization files for backend and frontend.
- Remove sensitive data (API keys, credentials, tokens).
- Provide an `.env.example` with placeholder values.

---

## ✅ 5. Replace Removed Logic with Safe Placeholders

- Backend placeholders should return:

```
{ "message": "Feature not implemented yet" }
```

- Frontend placeholders should display:

```
Feature not implemented yet
```

---

## ✅ 6. Add Default Health Check

- Include at least one default endpoint or page for verification (e.g., `/health` or homepage).
- It should confirm the framework is running successfully.

---

## ✅ 7. Keep Only Required Dependencies

- Remove dependencies tied to removed business logic.
- Keep dependencies needed for:
  - Core backend functionality.
  - Core frontend functionality.

---

## ✅ 8. Handle Frontend (If Present)

- Preserve the overall UI framework structure.
- Keep routing, layouts, and reusable components.
- Replace domain-specific pages/components with placeholders.
- Ensure the frontend runs without errors after setup.

---

## ✅ 9. Provide Developer Hooks

- Maintain empty or placeholder folders for:
  - Adding new backend features.
  - Adding new frontend components or pages.
- Document these extension points in the README.

---

## ✅ 10. Ensure Error-Free Execution

- After extraction, the resulting skeleton must:
  - Run backend successfully without errors.
  - Run frontend successfully without errors.
  - Display placeholder responses for removed features.

---

## ✅ 11. Post-Extraction Validation (Amazon Q Responsibility)

Amazon Q must:

- Verify both backend and frontend start without errors.
- Check for missing files, broken imports, and configuration issues.
- If any issue is found:
  - Generate missing placeholder files.
  - Remove broken references and unused imports.

---

## ✅ 12. Do Not Modify the Original Project

- The original project **must remain untouched**.
- Extract the framework into a **separate directory or repository**.
- No changes should be written back to the source project.

---

## ✅ Output Requirements

- Full-stack skeleton including:
  - Backend structure with configs and placeholders.
  - Frontend structure with placeholder UI components.
- Clean dependency files.
- A `README` explaining:
  - Setup steps for backend and frontend.
  - Where and how to add new business logic.
