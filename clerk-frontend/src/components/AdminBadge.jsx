import { useRole } from "../hooks/useRole";

function AdminBadge() {
  const { isAdmin } = useRole();
   
  if (!isAdmin) return null;

  return (
    <span
      style={{
        backgroundColor: "#ffcc00",
        color: "#000",
        fontWeight: "bold",
        padding: "0.25rem 0.5rem",
        borderRadius: "0.25rem",
        marginLeft: "0.5rem",
        fontSize: "0.8rem"
      }}
    >
      ADMIN
    </span>
  );
}

export default AdminBadge;
