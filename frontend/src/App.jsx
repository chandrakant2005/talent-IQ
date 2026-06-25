import { useAuth, useUser } from "@clerk/clerk-react";
import { useEffect } from "react";
import { Navigate, Route, Routes } from "react-router";
import HomePage from "./pages/HomePage";

import { Toaster } from "react-hot-toast";
import { setAuthTokenGetter } from "./lib/axios";
import DashboardPage from "./pages/DashboardPage";
import ProblemPage from "./pages/ProblemPage";
import ProblemsPage from "./pages/ProblemsPage";
import SessionPage from "./pages/SessionPage";

function App() {
  const { isSignedIn, isLoaded } = useUser();
  const { getToken } = useAuth();

  // give axios a way to fetch a fresh Clerk token on every request,
  // since cookies don't reliably cross the frontend/backend Render domains
  useEffect(() => {
    setAuthTokenGetter(getToken);
  }, [getToken]);

  // this will get rid of the flickering effect
  if (!isLoaded) return null;

  return (
    <>
      <Routes>
        <Route path="/" element={!isSignedIn ? <HomePage /> : <Navigate to={"/dashboard"} />} />
        <Route path="/dashboard" element={isSignedIn ? <DashboardPage /> : <Navigate to={"/"} />} />

        <Route path="/problems" element={isSignedIn ? <ProblemsPage /> : <Navigate to={"/"} />} />
        <Route path="/problem/:id" element={isSignedIn ? <ProblemPage /> : <Navigate to={"/"} />} />
        <Route path="/session/:id" element={isSignedIn ? <SessionPage /> : <Navigate to={"/"} />} />
      </Routes>

      <Toaster toastOptions={{ duration: 3000 }} />
    </>
  );
}

export default App;

// import { useUser } from "@clerk/clerk-react";
// import { Toaster } from "react-hot-toast";
// import { Navigate, Route, Routes } from "react-router";
// import DashboardPage from "./pages/DashboardPage";
// import HomePage from "./pages/HomePage";
// import ProblemPage from "./pages/ProblemPage";
// import ProblemsPage from "./pages/ProblemsPage";

// function App() {
//   const {isSignedIn,isLoaded }=useUser();
//   // this will get rid of the flickering effect
//   if (!isLoaded) return null;
  
//   return (
//     <>
//     <Routes>
//       <Route path="/" element={!isSignedIn ? <HomePage/> : <Navigate to={"/dashboard"}/>} />
//       <Route path="/dashboard" element={isSignedIn ? <DashboardPage /> : <Navigate to={"/"}/>} />
//       <Route path="/problems" element={isSignedIn ? <ProblemsPage/> : <Navigate to={"/"}/>}/>
//       <Route path="/problem/:id" element={isSignedIn ? <ProblemPage /> : <Navigate to={"/"}/>}/>
//       <Route path="/session/:id" element={isSignedIn ? <SessionPage /> : <Navigate to={"/"} />} />
//     </Routes>
//     <Toaster position="top-center" toastOptions={{duration:3000}}/>
//     </>
//   );
// }

// export default App;














// import { useUser } from "@clerk/clerk-react";
// import { Navigate, Route, Routes } from "react-router";
// import HomePage from "./pages/HomePage";

// import { Toaster } from "react-hot-toast";
// import DashboardPage from "./pages/DashboardPage";
// import ProblemPage from "./pages/ProblemPage";
// import ProblemsPage from "./pages/ProblemsPage";
// import SessionPage from "./pages/SessionPage";

// function App() {
//   const { isSignedIn, isLoaded } = useUser();

//   // this will get rid of the flickering effect
//   if (!isLoaded) return null;

//   return (
//     <>
//       <Routes>
//         <Route path="/" element={!isSignedIn ? <HomePage /> : <Navigate to={"/dashboard"} />} />
//         <Route path="/dashboard" element={isSignedIn ? <DashboardPage /> : <Navigate to={"/"} />} />

//         <Route path="/problems" element={isSignedIn ? <ProblemsPage /> : <Navigate to={"/"} />} />
//         <Route path="/problem/:id" element={isSignedIn ? <ProblemPage /> : <Navigate to={"/"} />} />
//         <Route path="/session/:id" element={isSignedIn ? <SessionPage /> : <Navigate to={"/"} />} />
//       </Routes>

//       <Toaster toastOptions={{ duration: 3000 }} />
//     </>
//   );
// }

// export default App;

