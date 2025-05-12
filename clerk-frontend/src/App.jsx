import React, {useState} from "react";
import { SignIn, SignUp, SignedIn, SignedOut, UserButton } from "@clerk/clerk-react";
import { useAuth } from "@clerk/clerk-react";
import { Routes, Route, Link } from "react-router-dom";
//import { useNavigate } from "react-router"; //enable if manual logout
import AdminDashboard from "./components/AdminDashboard";
import AdminBadge from "./components/AdminBadge";
import { useRole } from "./hooks/useRole";
import { useApiFetchWithSearch } from "./hooks/useApiFetchWithSearch";
import Layout from "./layouts/Layout";

//Note: consolidate AdminDashboard into logged in components re Clerk

//Retrieval between Full Stack Established
function ClerkDashboard() {
  const {
    data: bookings,
    //error, //can be disabled for production
    // loading, //can be disabled for production
    searchTerm,
    setSearchTerm,
    currentPage,
    setCurrentPage,
    totalPages,
    refetch,
  } = useApiFetchWithSearch("/api/bookings", {}, 5);
  const { userId, getToken } = useAuth();
  const [booked, setBookings] = useState([]);
  const [searchTermRetrieval, setSearchTermRetrieval] = useState("");
  //const navigate = useNavigate(); //enable if manual logout
  
  //intermediate- manual logout
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
 
  //functional, do not touch or edit
  const callProtectedRoute = async (e) => {
    e.preventDefault();
    const token = await getToken(); // this is your Bearer token, the session JWT
    //console.log("Gen: ", token)
    const body = {
      token: e.target.token
    }

    //Route Establishment
    const localURL = `${import.meta.env.VITE_API_URL}`;
    const prodURL = `${import.meta.env.VITE_CLERK_FRONTEND_API}`;
    const renderURL = `${import.meta.env.VITE_RENDER}`;
    console.log(localURL, "the local url to fetch from the BE");
    console.log(prodURL, "prod url");
    const backEndURL = `${renderURL}/api/bookings`;
    console.log(backEndURL, "back end fetch check");

    const allowedOrigins = [
      localURL,
      renderURL,
      prodURL
    ];

    //Assessing if URLs can be retrieved and then if the origins are active, the logger callback will render a follow-up response
    console.log("Allowed origins", allowedOrigins);
    const backEndNetworkScan = (allowedOrigins, logger) => {
      if (!allowedOrigins || allowedOrigins.includes(allowedOrigins)) {
        logger(null, "Origin not detected, review retrieved URLs");
      } else {
        logger(new Error("Not allowed by CORS, check Back End logs."));
      }
    };
    backEndNetworkScan();

    try {
      const res = await fetch(backEndURL,  //call the back end locally
      // const res = await fetch(`${import.meta.env.VITE_API_URL}/api/bookings`, //call the back end on Render
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          accept: 'application/json',
          body: JSON.stringify(body),
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

      setBookings(data)//save the res
      localStorage.removeItem("user");
  
      
    } catch (error) {
      console.error("Fetch failed:", error)
    }
  
  };

  return (
    <div className="container">
      <h2>Clerk Auth Dashboard</h2>
      <span>
        <p>This user ID is generated from the most recent user that has been created.</p>
        <p>User ID: {userId}</p>
        {/* <button onClick={callProtectedRoute}>Check Auth</button> */}
        {/* initially, failsafe */}
        <button>
          <UserButton /> Logout via Clerk 
        </button>
      </span>
      <hr />
      <span style={{ columns: 2 }}>
        <h3>Protected Bookings Viewer</h3>
        <button onClick={callProtectedRoute}>Load Bookings</button>
        <button onClick={refetch}>Refresh</button>
        <input
        type="text"
        placeholder="Search bookings by name or service"
        value={searchTermRetrieval}
        onChange={(e) => setSearchTermRetrieval(e.target.value)}
        style={{ marginTop: "1rem", padding: "0.5rem", width: "100%" }}
      />

      {/* loading and error state for local testing */}
      {/* {loading && <p>Loading...</p>} */}
      {/* {error && <p style={{ color: "red" }}>Error: {error}</p>} */}

      <ul style={{ marginTop: "1rem" }}>
        {bookings
          .filter((customer) =>
            `${customer.customer_name} ${customer.service}`.toLowerCase().includes(searchTermRetrieval.toLowerCase())
          )
          .map((customer) => (
            <li className="card" key={customer.id}>
              <strong>{customer.customer_name}</strong> – {customer.service} –{" "}
              {new Date(customer.booking_time).toLocaleString()}
            </li>
          ))}
      </ul>

      </span>
      <div className="pagination">
        <p>
          Page {currentPage} of {totalPages}
        </p>
        <button onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1}>
          Prev
        </button>
        <button onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>
          Next
        </button>
      </div>
      
      {/* manual failsafe re: logout */}
        {/* <button style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <a href="#" onClick={handleLogout}>
            LOGOUT
          </a>
        </button> */}
    </div>
  );
}

//Logged In Interface
function App() {
  //const { isAdmin } = useRole();
  return (
    <div className="card">
      <h1>Booking Platform Demo</h1>
      <p>This application has been developed with React-Vite as the Front End framework and Node/Express.js in the Back End ecosystem.</p>
     
      <hr />
      <BaseNav />
       <ClerkNav/>
       <hr />
      </div>
  )
}

// MVP 
/*
function BaseSearchForm({ searchCallbackHandler }) {
  
  const [searchTerm, setSearchTerm] = useState("");

  const handleChange = (e) => {
    setSearchTerm(e.target.value);

    searchCallbackHandler(e);
  };

  return (
    <div className="Search">
      <label htmlFor="searchTerm">Search: </label>
      <input name="searchTerm" id="searchTerm" value={searchTerm} type="text" onChange={handleChange} />
      <p>
        Searching for <strong>{searchTerm}</strong>.
      </p>
    </div>
  );
}
*/

//triggers after successful Clerk logging 
function BaseNav () {
  return (
    <Layout>
      <Routes>
      <Route
          path="/"
          element={
            <>
              <SignedOut>
                <p>Please sign in to continue.</p>
                <p>
                  To login, <a href="https://outgoing-crab-23.accounts.dev/sign-in">use this link</a>. To sign-up, <a href="https://outgoing-crab-23.accounts.dev/sign-up">use this link</a>.     
                </p>
              </SignedOut>
              <SignedIn>
                <ClerkDashboard />
              </SignedIn>
            </>
          }
        />
        <Route path="/sign-in" element={<SignIn routing="path" path="/sign-in" />} />
        <Route path="/sign-up" element={<SignUp routing="path" path="/sign-up" />} />
      </Routes>
    </Layout>
  )
}

//to log into Clerk manually, wrapper
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

//maintain admin state
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
export default App;