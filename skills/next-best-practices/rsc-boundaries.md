# RSC Boundaries

Detect and prevent invalid patterns when crossing Server/Client component boundaries.

## Detection Rules

### 1. Async Client Components Are Invalid

Client components **cannot** be async functions. Only Server Components can be async.

**Detect:** File has `'use client'` AND component is `async function` or returns `Promise`

```tsx
// Bad: async client component
'use client'
export default async function UserProfile() {
  const user = await getUser() // Cannot await in client component
  return <div>{user.name}</div>
}

// Good: Remove async, fetch data in parent server component
// page.tsx (server component - no 'use client')
export default async function Page() {
  const user = await getUser()
  return <UserProfile user={user} />
}

// UserProfile.tsx (client component)
'use client'
export function UserProfile({ user }: { user: User }) {
  return <div>{user.name}</div>
}
```

```tsx
// Bad: async arrow function client component
'use client'
const Dashboard = async () => {
  const data = await fetchDashboard()
  return <div>{data}</div>
}

// Good: Fetch in server component, pass data down
```

### 2. Props must be serializable by React

Project adaptation, 2026-09-11: React serialization is broader than JSON.
Source: https://react.dev/reference/rsc/use-client#serializable-types-returned-by-server-components

Supported values include primitives, globally registered symbols, arrays,
plain objects, Date, Map, Set, TypedArray/ArrayBuffer, Promises, JSX elements,
and Server Functions. Contained values must also be serializable.
Do not flag Date, Map or Set merely because they are not JSON primitives.

Unsupported values include ordinary callback functions crossing the server
boundary, arbitrary class instances, WeakMap/WeakSet, and unregistered symbols.
Define event handlers in a Client Component, pass a Server Function when the
operation belongs on the server, or map unsupported class instances to plain
objects. Pass server-rendered content as children instead of importing server
modules into the client graph.

### 3. Server Actions Are the Exception

Functions marked with `'use server'` CAN be passed to client components.

```tsx
// Valid: Server Action can be passed
// actions.ts
'use server'
export async function submitForm(formData: FormData) {
  // server-side logic
}

// page.tsx (server)
import { submitForm } from './actions'
export default function Page() {
  return <ClientForm onSubmit={submitForm} /> // OK!
}

// ClientForm.tsx (client)
'use client'
export function ClientForm({ onSubmit }: { onSubmit: (data: FormData) => Promise<void> }) {
  return <form action={onSubmit}>...</form>
}
```

## Quick Reference

| Pattern | Valid? | Fix |
|---------|--------|-----|
| `'use client'` + `async function` | No | Fetch in server parent, pass data |
| Pass `() => {}` to client | No | Define in client or use server action |
| Pass `new Date()` to client | Yes | Supported by React |
| Pass `new Map()` / `new Set()` to client | Yes | Entries must be serializable |
| Pass class instance to client | No | Pass plain object |
| Pass server action to client | Yes | - |
| Pass `string/number/boolean` | Yes | - |
| Pass plain object/array | Yes | - |
