![Civil Services Logo](https://cdn.civil.services/common/github-logo.png "Civil Services Logo")

**[↤ Developer Overview](../README.md)**

Troubleshooting
===

This document will contain a list of known issues, and how to solve them.


Seed Errors
---

#### `ER_NET_PACKET_TOO_LARGE`

The following error can happen on machines with low memory settings for MySQL.

```
× SEED ERROR ER_NET_PACKET_TOO_LARGE: Got a packet bigger than 'max_allowed_packet' bytes
```

To fix this issue, connect as a `root` user to MySQL and run this query:

```sql
set global net_buffer_length=1000000; 
set global max_allowed_packet=1000000000;
```