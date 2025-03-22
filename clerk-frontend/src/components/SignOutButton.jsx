import { useClerk } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";

function SignOutButton() {
  const { signOut } = useClerk();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut(); // ends session
    navigate("/");   // redirect to home or login
  };

  return <button onClick={handleSignOut}>Sign Out</button>;
}

export default SignOutButton;
