/**
 * SharePoint WebMCP Engine & Multi-Skill Toolset
 * Runs entirely client-side via a SharePoint Site Assets library.
 */
(function () {
    'use strict';

    const AUDIT_KEY = 'webmcp_audit_log';
    const AUDIT_LIMIT = 50;

    function getPageContext() {
        if (!window._spPageContextInfo || !window._spPageContextInfo.webAbsoluteUrl) {
            throw new Error('SharePoint page context is unavailable. Load this script from a SharePoint page.');
        }
        return window._spPageContextInfo;
    }

    function readAuditLog() {
        try {
            const stored = JSON.parse(localStorage.getItem(AUDIT_KEY) || '[]');
            return Array.isArray(stored) ? stored : [];
        } catch (_) {
            return [];
        }
    }

    function recordAudit(toolName, payload, status, responseData) {
        const logs = readAuditLog();
        const pageContext = window._spPageContextInfo || {};
        logs.unshift({
            timestamp: new Date().toISOString(),
            subsite: pageContext.webServerRelativeUrl || '',
            tool: toolName,
            payload: payload || {},
            status: status,
            response: responseData
        });
        localStorage.setItem(AUDIT_KEY, JSON.stringify(logs.slice(0, AUDIT_LIMIT)));
        window.dispatchEvent(new Event('webmcp_logged'));
    }

    function listUrl(baseUrl, listTitle) {
        if (typeof listTitle !== 'string' || !listTitle.trim()) {
            throw new Error('listTitle must be a non-empty string.');
        }
        // Quote escaping prevents a title containing an apostrophe from breaking OData.
        return baseUrl + "/_api/web/lists/getbytitle('" + encodeURIComponent(listTitle.replace(/'/g, "''")) + "')";
    }

    async function getFormDigest(baseUrl) {
        const response = await fetch(baseUrl + '/_api/contextinfo', {
            method: 'POST',
            headers: { Accept: 'application/json;odata=verbose' },
            credentials: 'same-origin'
        });
        if (!response.ok) {
            throw new Error('Failed to acquire SharePoint Form Digest (HTTP ' + response.status + ').');
        }
        const data = await response.json();
        const digest = data && data.d && data.d.GetContextWebInformation && data.d.GetContextWebInformation.FormDigestValue;
        if (!digest) throw new Error('SharePoint returned no Form Digest.');
        return digest;
    }

    function toolResult(value) {
        return { content: [{ type: 'text', text: typeof value === 'string' ? value : JSON.stringify(value, null, 2) }] };
    }

    function xmlEscape(value) {
        return String(value).replace(/[&<>'"]/g, function (character) {
            return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&apos;', '"': '&quot;' })[character];
        });
    }

    function createInternalName(value) {
        const name = String(value || '').trim().replace(/[^A-Za-z0-9_]/g, '_').replace(/^_+|_+$/g, '');
        if (!name) throw new Error('Each column needs a displayName or name containing letters or numbers.');
        if (!/^[A-Za-z_]/.test(name)) throw new Error('Column internal names must start with a letter or underscore.');
        return name;
    }

    function booleanAttribute(name, value) {
        return value === undefined ? '' : ' ' + name + "='" + (value ? 'TRUE' : 'FALSE') + "'";
    }

    // Produces list-field XML accepted by Fields/createFieldAsXml. This endpoint lets
    // one tool provision field types that cannot be expressed by SP.FieldTypeKind alone.
    function buildFieldXml(column) {
        if (!column || typeof column !== 'object' || Array.isArray(column)) {
            throw new Error('Each column must be an object.');
        }
        const supportedTypes = ['text', 'note', 'number', 'currency', 'datetime', 'boolean', 'choice', 'multichoice', 'url', 'lookup', 'user'];
        const requestedType = String(column.type || '').toLowerCase();
        if (!supportedTypes.includes(requestedType)) {
            throw new Error('Unsupported column type "' + column.type + '". Supported types: ' + supportedTypes.join(', ') + '.');
        }
        const displayName = String(column.displayName || column.name || '').trim();
        if (!displayName) throw new Error('Each column requires displayName or name.');
        const internalName = createInternalName(column.name || displayName);
        if (internalName.toLowerCase() === 'title') throw new Error('Do not include Title in columns; every custom list already has a Title field.');

        const fieldTypes = {
            text: 'Text', note: 'Note', number: 'Number', currency: 'Currency', datetime: 'DateTime',
            boolean: 'Boolean', choice: 'Choice', multichoice: 'MultiChoice', url: 'URL', lookup: 'Lookup', user: 'User'
        };
        let fieldType = fieldTypes[requestedType];
        if ((requestedType === 'lookup' || requestedType === 'user') && column.allowMultiple) fieldType += 'Multi';
        const attributes = " Type='" + fieldType + "' DisplayName='" + xmlEscape(displayName) + "' Name='" + xmlEscape(internalName) + "'"
            + booleanAttribute('Required', column.required)
            + booleanAttribute('EnforceUniqueValues', column.enforceUniqueValues);

        if (requestedType === 'choice' || requestedType === 'multichoice') {
            if (!Array.isArray(column.choices) || column.choices.length === 0) {
                throw new Error('Choice and MultiChoice columns require a non-empty choices array.');
            }
            const choiceAttributes = booleanAttribute('FillInChoice', column.allowFillIn);
            return '<Field' + attributes + choiceAttributes + '><CHOICES>'
                + column.choices.map(function (choice) { return '<CHOICE>' + xmlEscape(choice) + '</CHOICE>'; }).join('')
                + '</CHOICES></Field>';
        }
        if (requestedType === 'lookup') {
            if (!column.lookupListId) throw new Error('Lookup columns require lookupListId (the target list GUID).');
            return '<Field' + attributes + " List='" + xmlEscape(column.lookupListId) + "' ShowField='" + xmlEscape(column.lookupField || 'Title') + "' />";
        }
        if (requestedType === 'user') {
            const selectionMode = Number(column.userSelectionMode);
            if (column.userSelectionMode !== undefined && selectionMode !== 0 && selectionMode !== 1) {
                throw new Error('userSelectionMode must be 0 (people only) or 1 (people and groups).');
            }
            return '<Field' + attributes + " List='UserInfo' ShowField='Name' UserSelectionMode='" + (selectionMode || 0) + "' />";
        }
        if (requestedType === 'text' && column.maxLength !== undefined) {
            const length = Number(column.maxLength);
            if (!Number.isInteger(length) || length < 1 || length > 255) throw new Error('Text maxLength must be an integer from 1 to 255.');
            return '<Field' + attributes + " MaxLength='" + length + "' />";
        }
        if ((requestedType === 'number' || requestedType === 'currency') && column.decimals !== undefined) {
            const decimals = Number(column.decimals);
            if (!Number.isInteger(decimals) || decimals < 0 || decimals > 5) throw new Error('decimals must be an integer from 0 to 5.');
            return '<Field' + attributes + " Decimals='" + decimals + "' />";
        }
        if (requestedType === 'datetime') {
            return '<Field' + attributes + " Format='" + (column.dateOnly ? 'DateOnly' : 'DateTime') + "' />";
        }
        if (requestedType === 'note') {
            return '<Field' + attributes + booleanAttribute('RichText', column.richText) + ' />';
        }
        if (requestedType === 'url') {
            const format = column.urlFormat || 'Hyperlink';
            if (format !== 'Hyperlink' && format !== 'Image') throw new Error('urlFormat must be Hyperlink or Image.');
            return '<Field' + attributes + " Format='" + format + "' />";
        }
        return '<Field' + attributes + ' />';
    }

    async function createListField(listId, fieldXml, digest, addToDefaultView) {
        const response = await fetch(getPageContext().webAbsoluteUrl + "/_api/web/lists(guid'" + encodeURIComponent(listId) + "')/fields/createfieldasxml", {
            method: 'POST',
            headers: {
                Accept: 'application/json;odata=verbose',
                'Content-Type': 'application/json;odata=verbose',
                'X-RequestDigest': digest
            },
            credentials: 'same-origin',
            body: JSON.stringify({
                parameters: {
                    __metadata: { type: 'SP.XmlSchemaFieldCreationInformation' },
                    SchemaXml: fieldXml,
                    AddToDefaultView: addToDefaultView !== false,
                    Options: 0
                }
            })
        });
        if (!response.ok) throw new Error('Column creation failed (HTTP ' + response.status + ').');
        return response.json();
    }

    async function registerSharePointTools() {
        if (!document.modelContext || typeof document.modelContext.provideContext !== 'function') {
            console.warn('WebMCP (document.modelContext) is unavailable. Enable the WebMCP testing flag in your Chromium browser.');
            return;
        }

        document.modelContext.provideContext({
            tools: [
                {
                    name: 'create_list',
                    description: 'Creates a custom SharePoint list, then provisions its columns. Supported column types: Text, Note, Number, Currency, DateTime, Boolean, Choice, MultiChoice, URL, Lookup, and User.',
                    inputSchema: {
                        type: 'object',
                        properties: {
                            title: { type: 'string', description: 'New list title.' },
                            description: { type: 'string', description: 'Optional list description.' },
                            columns: {
                                type: 'array',
                                description: 'Optional columns. A column needs displayName (or name), type, and type-specific properties: choices for Choice/MultiChoice; lookupListId and optional lookupField for Lookup; allowMultiple for Lookup/User; dateOnly for DateTime; maxLength for Text; decimals for Number/Currency.',
                                items: { type: 'object' }
                            }
                        },
                        required: ['title']
                    },
                    handler: async function (args) {
                        try {
                            if (typeof args.title !== 'string' || !args.title.trim()) throw new Error('title must be a non-empty string.');
                            if (args.columns !== undefined && !Array.isArray(args.columns)) throw new Error('columns must be an array.');
                            const baseUrl = getPageContext().webAbsoluteUrl;
                            const digest = await getFormDigest(baseUrl);
                            const createResponse = await fetch(baseUrl + '/_api/web/lists', {
                                method: 'POST',
                                headers: {
                                    Accept: 'application/json;odata=verbose',
                                    'Content-Type': 'application/json;odata=verbose',
                                    'X-RequestDigest': digest
                                },
                                credentials: 'same-origin',
                                body: JSON.stringify({
                                    __metadata: { type: 'SP.List' },
                                    AllowContentTypes: true,
                                    BaseTemplate: 100,
                                    ContentTypesEnabled: true,
                                    Description: args.description || '',
                                    Title: args.title.trim()
                                })
                            });
                            if (!createResponse.ok) throw new Error('List creation failed (HTTP ' + createResponse.status + ').');
                            const list = (await createResponse.json()).d;
                            const columns = args.columns || [];
                            const createdColumns = [];
                            for (let index = 0; index < columns.length; index += 1) {
                                const column = columns[index];
                                const fieldXml = buildFieldXml(column);
                                await createListField(list.Id, fieldXml, digest, column.addToDefaultView);
                                createdColumns.push({ name: column.name || column.displayName, type: column.type });
                            }
                            const result = { id: list.Id, title: list.Title, columnsCreated: createdColumns };
                            recordAudit('create_list', args, 'SUCCESS', result);
                            return toolResult(result);
                        } catch (error) {
                            recordAudit('create_list', args, 'ERROR', error.message);
                            throw error;
                        }
                    }
                },
                {
                    name: 'get_site_context',
                    description: 'Retrieves current SharePoint subsite metadata, URL, and active user details.',
                    inputSchema: { type: 'object', properties: {} },
                    handler: async function () {
                        try {
                            const context = getPageContext();
                            const result = {
                                webTitle: context.webTitle,
                                webAbsoluteUrl: context.webAbsoluteUrl,
                                userDisplayName: context.userDisplayName,
                                userId: context.userId,
                                isModern: context.isAppWeb
                            };
                            recordAudit('get_site_context', {}, 'SUCCESS', result);
                            return toolResult(result);
                        } catch (error) {
                            recordAudit('get_site_context', {}, 'ERROR', error.message);
                            throw error;
                        }
                    }
                },
                {
                    name: 'query_list_items',
                    description: 'Queries items from a specified SharePoint list using an optional OData filter within the current subsite.',
                    inputSchema: {
                        type: 'object',
                        properties: {
                            listTitle: { type: 'string', description: 'Display name of the SharePoint list.' },
                            filterQuery: { type: 'string', description: "Optional OData filter, for example: Status eq 'Open'." }
                        },
                        required: ['listTitle']
                    },
                    handler: async function (args) {
                        try {
                            const baseUrl = getPageContext().webAbsoluteUrl;
                            let endpoint = listUrl(baseUrl, args.listTitle) + '/items';
                            if (args.filterQuery) endpoint += '?$filter=' + encodeURIComponent(args.filterQuery);
                            const response = await fetch(endpoint, {
                                headers: { Accept: 'application/json;odata=verbose' },
                                credentials: 'same-origin'
                            });
                            if (!response.ok) throw new Error('Query failed (HTTP ' + response.status + ').');
                            const data = await response.json();
                            const results = (data.d && data.d.results) || [];
                            recordAudit('query_list_items', args, 'SUCCESS', { count: results.length });
                            return toolResult(results);
                        } catch (error) {
                            recordAudit('query_list_items', args, 'ERROR', error.message);
                            throw error;
                        }
                    }
                },
                {
                    name: 'create_list_item',
                    description: 'Creates a new item in a target SharePoint list using a fresh form digest.',
                    inputSchema: {
                        type: 'object',
                        properties: {
                            listTitle: { type: 'string', description: 'Display name of the SharePoint list.' },
                            itemFields: { type: 'object', description: "Column values, for example: { Title: 'New Task', Priority: 'High' }." }
                        },
                        required: ['listTitle', 'itemFields']
                    },
                    handler: async function (args) {
                        try {
                            if (!args.itemFields || Array.isArray(args.itemFields) || typeof args.itemFields !== 'object') {
                                throw new Error('itemFields must be an object containing SharePoint column values.');
                            }
                            const baseUrl = getPageContext().webAbsoluteUrl;
                            const baseListUrl = listUrl(baseUrl, args.listTitle);
                            const metadataResponse = await fetch(baseListUrl + '?$select=ListItemEntityTypeFullName', {
                                headers: { Accept: 'application/json;odata=verbose' },
                                credentials: 'same-origin'
                            });
                            if (!metadataResponse.ok) throw new Error('List metadata lookup failed (HTTP ' + metadataResponse.status + ').');
                            const metadata = await metadataResponse.json();
                            const entityType = metadata.d && metadata.d.ListItemEntityTypeFullName;
                            if (!entityType) throw new Error('SharePoint returned no list item entity type.');

                            const digest = await getFormDigest(baseUrl);
                            const payload = Object.assign({ __metadata: { type: entityType } }, args.itemFields);
                            const createResponse = await fetch(baseListUrl + '/items', {
                                method: 'POST',
                                headers: {
                                    Accept: 'application/json;odata=verbose',
                                    'Content-Type': 'application/json;odata=verbose',
                                    'X-RequestDigest': digest
                                },
                                credentials: 'same-origin',
                                body: JSON.stringify(payload)
                            });
                            if (!createResponse.ok) throw new Error('Creation failed (HTTP ' + createResponse.status + ').');
                            const result = await createResponse.json();
                            const item = result.d;
                            recordAudit('create_list_item', args, 'SUCCESS', item);
                            return toolResult('Successfully created item ID: ' + item.Id);
                        } catch (error) {
                            recordAudit('create_list_item', args, 'ERROR', error.message);
                            throw error;
                        }
                    }
                }
            ]
        });
        console.log('WebMCP SharePoint toolkit successfully registered.');
    }

    function renderLogs() {
        const list = document.getElementById('webmcp-log-list');
        if (!list) return;
        const logs = readAuditLog();
        list.replaceChildren();
        logs.forEach(function (log) {
            const item = document.createElement('div');
            item.className = 'webmcp-log-item ' + String(log.status || '').toLowerCase();
            const time = document.createElement('span');
            time.className = 'time';
            time.textContent = String(log.timestamp || '').split('T')[1]?.substring(0, 8) || '';
            const tool = document.createElement('span');
            tool.className = 'tool';
            tool.textContent = log.tool || 'unknown_tool';
            const status = document.createElement('span');
            status.className = 'status';
            status.textContent = log.status || 'UNKNOWN';
            const payload = document.createElement('pre');
            payload.textContent = JSON.stringify(log.payload || {}, null, 2);
            item.append(time, tool, status, payload);
            list.appendChild(item);
        });
    }

    async function initUI() {
        const pageContext = getPageContext();
        const siteAssets = pageContext.webAbsoluteUrl + '/SiteAssets/WebMCP-Agent';
        const stylesheet = document.createElement('link');
        stylesheet.rel = 'stylesheet';
        stylesheet.href = siteAssets + '/styles.css';
        document.head.appendChild(stylesheet);

        const response = await fetch(siteAssets + '/panel.html', { credentials: 'same-origin' });
        if (!response.ok) throw new Error('Unable to load WebMCP audit panel (HTTP ' + response.status + ').');
        const container = document.createElement('div');
        container.innerHTML = await response.text();
        document.body.appendChild(container);

        const drawer = document.getElementById('webmcp-audit-drawer');
        const toggle = document.getElementById('webmcp-toggle-btn');
        toggle.addEventListener('click', function () {
            const isOpen = drawer.classList.toggle('open');
            toggle.setAttribute('aria-expanded', String(isOpen));
        });
        document.getElementById('webmcp-clear-btn').addEventListener('click', function () {
            localStorage.setItem(AUDIT_KEY, '[]');
            renderLogs();
        });
        window.addEventListener('webmcp_logged', renderLogs);
        renderLogs();
    }

    function bootstrap() {
        if (!localStorage.getItem(AUDIT_KEY)) localStorage.setItem(AUDIT_KEY, '[]');
        registerSharePointTools();
        initUI().catch(function (error) { console.error('WebMCP audit UI failed to initialize:', error); });
    }

    if (document.readyState === 'loading') {
        window.addEventListener('DOMContentLoaded', bootstrap, { once: true });
    } else {
        bootstrap();
    }
})();
