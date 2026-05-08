# Security Specification for Learning Situations App

## 1. Data Invariants
- A situation must always have a valid `userId` matching the authenticated user.
- A situation must have a valid string `id` that matches the document ID.
- Access to situations is strictly owner-based. No user can see or modify another user's situations.
- Timestamps (`updatedAt`) must be server-generated.

## 2. The "Dirty Dozen" Payloads
These payloads should be rejected by the security rules:

1. **Identity Spoofing (Create)**:
   ```json
   { "id": "my-id", "userId": "another-user-id", "title": "Hack" }
   ```
2. **Identity Spoofing (Update)**:
   Authenticated as User A, trying to update a document owned by User B.
3. **Identity Spoofing (Update fields)**:
   Trying to change the `userId` of an existing document.
4. **ID Poisoning**:
   Creating a document with an ID that is 1MB long or contains special characters that crawl paths.
5. **State Shortcut**:
   (Not applicable yet, no status workflow)
6. **Ghost Field Injection**:
   Injecting `isAdmin: true` into a situation document.
7. **Resource Exhaustion**:
   Setting `title` to a 10MB string.
8. **PII Leakage**:
   Querying the collection without a `userId` filter (Blanket Read).
9. **Timestamp Spoofing**:
   Providing a client-side `updatedAt` from the past or future.
10. **Orphaned Write**:
    (Not applicable yet, no relational collections)
11. **Type Mismatch**:
    Setting `title` to a boolean or number.
12. **Anonymous Write**:
    Writing to the database without being authenticated.

## 3. Test Runner Results
All payloads above should return `PERMISSION_DENIED`.
