# Team AI Prompt & Audit Log

**Project Name:** Nappy  
**Team Members:** Nestor Ramirez, Alvaro Perez  
**SDG Goal Target:** SDG 3 — Good Health and Well-Being

---

## Backend Error Analysis & Testing Log Entry

### 1. High-Level Goal

We wanted to check whether our Express API could connect to MongoDB Atlas, reject incorrect input, and return the expected responses. We also asked for a review of errors in the interaction between the page and the backend.

This entry covers error analysis and testing only. It is not a complete record of AI use for the beta: implementation, simplification, design, and deployment guidance were also discussed separately. Our beta is a shared classroom demo using fictional data, with no private accounts.

### 2. The Interaction Log

**Interaction 1 — MongoDB authentication errors**

**AI Tool Used:** Codex  
**Context and Prompts:** We configured Atlas and placed the connection string in our local `.env`. We asked for help when a password contained a `#`, then requested connection checks with messages such as “listo pruebalo”.  
**What the AI Reported:** The first connection checks returned an authentication error. Codex explained that `#` must be encoded as `%23` inside the connection URL and suggested checking that the password belonged to `nappy-app`, rather than the administrator. When authentication continued to fail, it suggested resetting that user's password and updating `.env`.  
**Test Result:** After we updated the credentials, the connection succeeded. The model and unique date index initialized, and the database contained zero records at the time of the check. These results do not establish which specific credential mistake caused the earlier failures. No credentials are included in this log.

**Interaction 2 — API and connection checks**

**AI Tool Used:** Codex  
**Context and Prompts:** We asked Codex to check the connection after updating `.env`. Later, during the Vercel preparation, the adjusted server was tested with two simultaneous read requests.  
**What the AI Reported:** The page returned HTTP 200, and both simultaneous API reads returned HTTP 200. This checked that the local application could use the shared Atlas connection.  
**Test Limit:** This was a local test. It did not prove that the application was already deployed or that Vercel could connect through the Atlas network access rules.

**Interaction 3 — Read-only backend audit**

**AI Tool Used:** Codex with two Luna subagents  
**Context and Prompts (summarized):** “Vuelve a correr pruebas que abarquen toda la parte del backend con los cambios que yo hice en las APIs y dime el status actual. No hagas ningún cambio, solo mantente explorando el proyecto y a ver que su funcionalidad continúe correctamente.” We also requested the review to use Luna subagents.  
**What the AI Reported:** One subagent checked the API and another reviewed the frontend code and delivery requirements. The API audit used read-only requests and invalid requests that were rejected before any record could be written.

| Check | Observed result |
| --- | --- |
| JavaScript syntax for server, model, and browser script | Passed |
| GET all check-ins from Atlas | 200 with an empty array |
| GET a valid date with no record | 404 |
| GET an impossible date, such as February 30 | 400 |
| Unknown API and site routes | 404 |
| POST with malformed JSON | 400 |
| POST with an invalid date | 400 |
| PUT with negative sleep hours | 400 |
| `.env` Git exclusion | Confirmed ignored |

**Test Limit:** This audit did not create, edit, or delete Atlas records. Its successful responses confirm read access and rejection of those invalid inputs; they do not replace a full CRUD test against the deployed application.

### 3. The Human Audit & Modifications

We configured the Atlas project, database users, and local environment file. After the failed authentication checks, we updated the application user's credentials and asked Codex to test again. We asked that the audit avoid changes to project files and database records.

The code review identified these issues:

- Selecting Edit in the history changed the form date without refreshing the dashboard and weekly information. This was subsequently adjusted, and isolated frontend checks passed; a full browser test is still needed.
- A successful write followed by a failed reload could show a success message while the page remained outdated. This remained a reported issue in the review.
- Resource links were placeholders, and some documentation described an older server startup flow. Documentation was later partly updated; it still needs a final review against the submitted version.

### 4. Integration & Learnings

We learned how to distinguish a database authentication error from an invalid API input. We also learned why the API validates data even when HTML inputs already have limits, why zero is different from an empty field, and why one record per date needs a database index.

The API uses HTTP 200 for successful reads and updates, 201 for creation, 400 for invalid input, 404 for missing records, 409 for duplicate dates, and 503 when the database connection is unavailable. Tests must check both the response code and the returned data.

The local checks ran with Node 26.8.1, while the project declares Node 24. Public deployment, the target Node runtime, and a complete browser workflow still require verification. Before submission, we need to create a fictional check-in from the public URL, reload it, edit it, delete it, and confirm the expected results.

### 5. Oral Defense Self-Check

- [ ] We can explain how `.env` provides the database connection without committing credentials.
- [ ] We can explain the difference between authentication, validation, and network errors.
- [ ] We can explain why the server rejects invalid dates, negative values, and incorrect data types.
- [ ] We can explain how POST, GET, PUT, and DELETE relate to a daily check-in.
- [ ] We can explain the purpose of the unique date index and the duplicate-date response.
- [ ] We can distinguish a real Atlas read, a temporary MongoDB test, and a model-substitute test.
- [ ] We can explain the remaining limitations and demonstrate the complete workflow from the public URL.
