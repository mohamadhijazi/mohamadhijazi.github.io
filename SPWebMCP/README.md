# SPWebMCP

SPWebMCP is a client-side WebMCP agent for SharePoint. Host the supplied files in a SharePoint site's **Site Assets** library to let an enabled WebMCP-capable browser expose SharePoint list actions to an agent. Each tool invocation is recorded in a local, on-page audit drawer.

## What it does

The agent registers these tools through `document.modelContext.provideContext`:

- `create_list` creates a custom list and can add Text, Note, Number, Currency, DateTime, Boolean, Choice, MultiChoice, URL, Lookup, and User columns.
- `get_site_context` returns the current site and user metadata.
- `query_list_items` returns items from a list, optionally filtered with OData.
- `create_list_item` creates an item with a fresh SharePoint form digest.

All SharePoint calls use the current user's session and the current site's REST API. The floating **WebMCP Agent Audit** drawer stores the 50 newest tool outcomes in `localStorage`; it is an activity aid, not a server-side compliance audit trail.

## Project layout

```text
SPWebMCP/
├── index.html                         # Simple page that loads the agent
└── SiteAssets/WebMCP-Agent/
    ├── loader.js                      # WebMCP tools, SharePoint REST calls, and audit UI bootstrap
    ├── panel.html                     # Audit drawer markup
    └── styles.css                     # Audit drawer styles
```

## Deploy to SharePoint

1. In the target site, create `Site Assets/WebMCP-Agent`.
2. Upload `loader.js`, `panel.html`, and `styles.css` from `SiteAssets/WebMCP-Agent`.
3. Add the loader to a page with a supported script-hosting mechanism and use the URL for your site:

   ```html
   <script src="/sites/your-subsite/SiteAssets/WebMCP-Agent/loader.js"></script>
   ```

4. Enable the browser's WebMCP testing capability, then reload the SharePoint page.
5. Open the page and invoke the exposed tools from your WebMCP-capable agent. Use the bottom-right drawer to review recent calls.

## Example: create a list from an agent

```json
{
  "title": "Project Requests",
  "description": "Requests created by the WebMCP agent",
  "columns": [
    {
      "displayName": "Status",
      "type": "choice",
      "choices": ["New", "In review", "Completed"]
    },
    {
      "displayName": "Due date",
      "type": "datetime",
      "dateOnly": true
    },
    {
      "displayName": "Request details",
      "type": "note"
    }
  ]
}
```

The agent returns the new list ID and the columns it created. It also writes a `create_list` success or error entry to the audit drawer.

## Prerequisites and limitations

- The script must run on a SharePoint page that exposes `_spPageContextInfo`.
- The current user needs permission to create lists, fields, or items as appropriate.
- The browser must expose `document.modelContext`; otherwise the script logs a warning and does not register tools.
- This is designed for SharePoint-hosted static assets and uses no build process or server component.

## Development notes

`loader.js` validates tool input, acquires a SharePoint form digest for write operations, escapes field XML, and limits the browser audit log to 50 records. Test in a non-production site before enabling write actions for users.
