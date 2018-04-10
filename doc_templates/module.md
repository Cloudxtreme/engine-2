---
title: "module: <%= name %>"
permalink: api_<%= filename %>.html
keywords: documentation, api, lucid
<% if(typeof comment != 'undefined') { %>summary: "<%= comment.shortText %>"<% } %>
tags: [api]
folder: api
---

<% if(interfaces) { %>
## Interfaces
<% interfaces.forEach((interface) => { %>
### <%= interface.name %>
<% }) %>
<% } %>