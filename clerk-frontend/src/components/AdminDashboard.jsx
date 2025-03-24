import { useEffect, useState } from "react";
import { useAuth } from "@clerk/clerk-react";
import SignOutButton from "./SignOutButton";

function AdminDashboard() {
  const { getToken } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ customer_name: "", service: "", booking_time: "" });

  //URL: https://your-backend.onrender.com/api/bookings
  // Fetch bookings
  useEffect(() => {
    const fetchBookings = async () => {
      const token = await getToken();
      console.log("Clerk token:", token);
      const res = await fetch(`http://localhost:${import.meta.env.PORT_CONNECTION}/api/bookings`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      setBookings(data);
    };
    fetchBookings();
  });

  // Timezone conversion helper
  const formatTime = (utcString) => {
    return new Date(utcString).toLocaleString(); // local browser time
  };

  const startEdit = (booking) => {
    setEditing(booking.id);
    setForm({
      customer_name: booking.customer_name,
      service: booking.service,
      booking_time: new Date(booking.booking_time).toISOString().slice(0, 16), // for datetime-local input
    });
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    const token = await getToken();
    const res = await fetch(`http://localhost:${import.meta.env.PORT_CONNECTION}/api/bookings/${editing}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(form),
    });
    const updated = await res.json();
    setBookings((prev) =>
      prev.map((b) => (b.id === editing ? updated[0] : b))
    );
    setEditing(null);
  };

  const handleDelete = async (id) => {
    const token = await getToken();
    await fetch(`http://localhost:${import.meta.env.PORT_CONNECTION}/api/bookings/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setBookings((prev) => prev.filter((b) => b.id !== id));
  };

  return (
    <div>
      <h2>Admin Dashboard</h2>
      <SignOutButton />
      {bookings.map((b) => (
        <div key={b.id} style={{ border: "1px solid #ccc", marginBottom: "1rem", padding: "1rem" }}>
          {editing === b.id ? (
            <>
              <input
                name="customer_name"
                value={form.customer_name}
                onChange={handleChange}
              />
              <input
                name="service"
                value={form.service}
                onChange={handleChange}
              />
              <input
                name="booking_time"
                type="datetime-local"
                value={form.booking_time}
                onChange={handleChange}
              />
              <button onClick={handleUpdate}>Save</button>
              <button onClick={() => setEditing(null)}>Cancel</button>
            </>
          ) : (
            <>
              <p><strong>{b.customer_name}</strong> — {b.service}</p>
              <p>Time: {formatTime(b.booking_time)}</p>
              <p>Status: {b.status}</p>
              <button onClick={() => startEdit(b)}>Edit</button>
              <button onClick={() => handleDelete(b.id)}>Delete</button>
            </>
          )}
        </div>
      ))}
    </div>
  );
}

export default AdminDashboard;
