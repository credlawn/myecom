## Myecom Frontend Refactoring: Prisma to Frappe API

We are currently refactoring the frontend of the 'myecom' project to replace direct Prisma database calls with API calls to a Frappe backend. This standardizes data access, improves security, and separates the frontend from the database schema.

### Refactoring Process

For each frontend component or data-fetching function that uses Prisma, we are following these steps:

1.  **Identify Prisma Usage:** Locate the file in the `front/src/get-api-data/` directory or other components that directly import and use the Prisma client.

2.  **Analyze Data Requirements:** Examine the frontend component that consumes the data to understand the exact fields and data structure it requires.

3.  **Create/Update Frappe DocType:** In the Frappe backend (`myecom/myecom/doctype`), create a new DocType or modify an existing one to model the required data. This includes defining all necessary fields with their correct types (e.g., Data, Attach Image, Link).

4.  **Create/Update Frappe API Endpoint:** In the `myecom/api/` directory, create a new Python file or update an existing one to add a whitelisted API function (`@frappe.whitelist(allow_guest=True)`). This function is responsible for fetching the data from the corresponding DocType and returning it as a JSON response. If the data includes linked documents, the API endpoint fetches the necessary fields from the linked document as well.

5.  **Update Frontend Data Fetching:** Modify the frontend TypeScript file (e.g., in `front/src/get-api-data/`) to replace the `prisma.*.findMany()` or `prisma.*.findUnique()` call with a `frappeClient.get()` call to the new API endpoint.

6.  **Update Frontend Component Types:** In the React component that uses the data, remove any imports from `@prisma/client` and update the type definitions (e.g., `IProps`) to match the structure of the JSON response from the new Frappe API.

### Progress So Far

We have successfully migrated the following parts of the application:

*   **SEO Settings:**
    *   Created the `SEO Settings` DocType.
    *   Created the `get_seo_settings` API endpoint.
    *   Updated `seo-setting.ts` and `layout.tsx`.
*   **Header Settings:**
    *   Created the `Header Settings` DocType.
    *   Created the `get_header_settings` API endpoint.
    *   Updated `header-setting.ts` and `MainHeader.tsx`.
*   **Hero Section:**
    *   Created the `Hero Section` and `Hero Slider` DocTypes.
    *   Created the `get_hero_details` and `get_hero_sliders` API endpoints.
    *   Updated `hero.ts` and the `Hero` component.

### Next Steps

The immediate goal is to continue this process for any remaining parts of the application that are still using Prisma for data fetching. The next error will indicate which part of the application to work on next.
