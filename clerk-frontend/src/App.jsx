import React from "react";
import { SignIn, SignUp, SignedIn, SignedOut, UserButton } from "@clerk/clerk-react";
import { useAuth } from "@clerk/clerk-react";
import { Routes, Route, Link } from "react-router-dom";
//import { useNavigate } from "react-router"; //enable if manual logout
import AdminDashboard from "./components/AdminDashboard";
import AdminBadge from "./components/AdminBadge";
import { useRole } from "./hooks/useRole";

//Retrieval troubleshoot
function Dashboard() {
  const { userId, getToken } = useAuth();
  //const navigate = useNavigate(); //enable if manual logout

  const url = import.meta.env.VITE_API_URL;
  console.log(url, "the local url to fetch from the BE")

  //failsafe w/o auth protection - manual logout
  /*
   const handleLogout = () => {
    fetch(`${url}/logout`)
      .then((response) => response.json())
      .then((result) => {
        console.log("result :>> ", result);
        localStorage.removeItem("user");
        navigate("/");
      })
      .catch((error) => {
        console.log("error :>> ", error);
        navigate("/admin");
      });
  };
  */
 
  const callProtectedRoute = async () => {
    const token = await getToken(); // this is your Bearer token, the session JWT
    console.log("Gen: ", token)
    try {
      const res = await fetch(`${url}/api/bookings`,  //call the back end locally
      // const res = await fetch(`${import.meta.env.VITE_API_URL}/api/bookings`, //call the back end on Render
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      console.log("Raw response:", res);
  
      if (!res.ok) {
        const text = await res.text(); // <- DON'T parse as JSON yet
        console.error("Server error:", text);
        throw new Error("Backend error");
      }
      //Error handle the res before showing data
  
      const data = await res.json();
      console.log("Protected response:", data);
    } catch (error) {
      console.error("Fetch failed:", error)
    }
  
  };

  return (
    <div>
      <h2>Clerk Auth Dashboard</h2>
      <span>
        <p>This user ID is generated from the most recent user that has been created.</p>
        <p>User ID: {userId}</p>
        <button onClick={callProtectedRoute}>Check Auth</button>
        <br />
        <br />
        {/* initially, failsafe */}
        <button>
          <UserButton /> Logout via Clerk 
        </button>
      </span>
      
      {/* manual failsafe re: logout */}
        {/* <button style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <a href="#" onClick={handleLogout}>
            LOGOUT
          </a>
        </button> */}
    </div>
  );
}

function App() {
  //const { isAdmin } = useRole();
  return (
    <>
      <h1>Booking Platform Demo</h1>
      <p>This application has been developed with React-Vite as the Front End framework and Node/Express.js in the Back End ecosystem.</p>
      <BaseNav />
       <ClerkNav/>
       <hr />
      <div className="card">
        <p>
          This is the index for the Front End.
        </p>
      </div>
    </>
  )
}

function ClerkNav () {
  return (
    <Routes>
      <Route
          path="/admin"
          element={
              <SignedIn>
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
      <Route/>
    </Routes>
  )
}

function BaseNav () {
  return (
    <>
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
      </Routes>
    </>
  )
}

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
