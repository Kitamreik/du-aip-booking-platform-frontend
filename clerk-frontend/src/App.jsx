import { SignIn, SignUp, SignedIn, SignedOut, UserButton, useAuth } from "@clerk/clerk-react";
import { Routes, Route, Link } from "react-router-dom";
import AdminDashboard from "./components/AdminDashboard";
import AdminBadge from "./components/AdminBadge";
import { useRole } from "./hooks/useRole";


function Navigation() {
  const { isAdmin } = useRole();

  return (
    <nav style={{ display: "flex", gap: "1rem" }}>
      <Link to="/">Home</Link>
      <SignedIn>
        {isAdmin && <Link to="/admin">Admin Dashboard</Link>}
        <UserButton />
        <AdminBadge />
      </SignedIn>
      <SignedOut>
        <Link to="/sign-in">Sign In</Link>
        <Link to="/sign-up">Sign Up</Link>
      </SignedOut>
    </nav>
  );
}

//Retrieval troubleshoot
function Dashboard() {
  const { userId, getToken } = useAuth();

  const callProtectedRoute = async () => {
    const token = await getToken(); // this is your Bearer token

    const res = await fetch(`"http://localhost:${import.meta.env.PORT_CONNECTION}/auth-state"`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    console.log("Protected response:", data);
  };


  return (
    <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
      <h2>Dashboard</h2>
      <p>User ID: {userId}</p>
      <button onClick={callProtectedRoute}>Call Protected Route</button>
      <UserButton />
    </div>
  );
}

function App() {
  //const { isAdmin } = useRole();
  return (
    <>
      <h1>Clerk + Vite + Express Demo</h1>
      <nav>
        <Link to="/">Home</Link> | <Link to="/sign-in">Sign In</Link> | <Link to="/sign-up">Sign Up</Link>
        <br />
        <Link to="/admin">Admin Dashboard</Link>
      </nav>
      <Routes>
      <Route
          path="/"
          element={
            <>
              <SignedOut>
                <p>Please sign in to continue.</p>
              </SignedOut>
              <SignedIn>
                <Dashboard />
              </SignedIn>
            </>
          }
        />
        <Route path="/sign-in" element={<SignIn routing="path" path="/sign-in" />} />
        <Route path="/sign-up" element={<SignUp routing="path" path="/sign-up" />} />
        <Route
          path="/admin"
          element={
              <SignedIn>
                {/* {isAdmin ? <AdminDashboard /> : <Navigate to="/" replace />} */}
                <AdminDashboard />
              </SignedIn>
            //formerly
            // <>
            //   <SignedIn>
            //     <AdminDashboard />
            //   </SignedIn>
            //   <SignedOut>
            //     <SignIn />
            //   </SignedOut>
            // </>
          }
        />
      </Routes>
      <div className="card">
        <p>
          This is the index for the Front End.
        </p>
      </div>
    </>
  )
}
/*
function App() {
  const { isAdmin } = useRole();
  return (
    <div>
      <h1>Clerk + Vite + Express Demo</h1>

      <nav>
        <Link to="/">Home</Link> | <Link to="/sign-in">Sign In</Link> | <Link to="/sign-up">Sign Up</Link>
        <Link to="/">Home</Link> | <Link to="/admin">Admin Dashboard</Link>
      </nav>

      <Routes>
        <Route
          path="/"
          element={
            <>
              <SignedOut>
                <p>Please sign in to continue.</p>
              </SignedOut>
              <SignedIn>
                <Dashboard />
              </SignedIn>
            </>
          }
        />
        <Route path="/sign-in" element={<SignIn routing="path" path="/sign-in" />} />
        <Route path="/sign-up" element={<SignUp routing="path" path="/sign-up" />} />
        <Route
          path="/admin"
          element={
              <SignedIn>
                {isAdmin ? <AdminDashboard /> : <Navigate to="/" replace />}
              </SignedIn>
            //formerly
            // <>
            //   <SignedIn>
            //     <AdminDashboard />
            //   </SignedIn>
            //   <SignedOut>
            //     <SignIn />
            //   </SignedOut>
            // </>
          }
        />
      </Routes>
    </div>
  );
}
*/


export default App;

//Functional Template
/*
function App() {
  return (
    <>
      <h1>Vite + React</h1>
      <div className="card">
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}
export default App

*/
