## Project Setup Summary

### Technologies Used
- **Frontend**: React + Vite

---

## Frontend Highlights

- ✅ Clerk integrated with `ClerkProvider`, `SignIn`, `SignUp`, `UserButton`
- ✅ Admin Dashboard with view, edit, delete bookings using `fetch()`
- ✅ Local timezone conversion using `new Date().toLocaleString()`
- ✅ Role-based UI hiding using a `useRole()` hook
- ✅ Admin badge shown with `AdminBadge` component
- ✅ CORS configured for cross-origin auth with Clerk

---

## Critical Debug Fixes

- 🛠️ Clerk tokens not passing to backend → fixed with `getToken()` in `fetch()`
- 🛠️ Clarified deployment order: DB → Backend → Frontend

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript and enable type-aware lint rules. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
