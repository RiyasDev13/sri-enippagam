import { useEffect, useState } from "react";
import { getContacts, updateContactStatus } from "../../services/api.js";
import Loader from "../../components/common/Loader.jsx";

const statuses = ["New", "Read", "Replied"];

export default function ContactsList() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);

  const loadContacts = async () => {
    try {
      setLoading(true);
      const data = await getContacts();
      setContacts(data);
    } catch (error) {
      console.error("Failed to load enquiries:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadContacts();
  }, []);

  const handleStatusChange = async (id, status) => {
    try {
      setUpdating(id);

      const updated = await updateContactStatus(id, status);

      setContacts((current) =>
        current.map((contact) =>
          contact._id === id ? updated : contact
        )
      );
    } catch (error) {
      console.error("Failed to update enquiry status:", error);
      alert(
        error.response?.data?.message ||
          "Could not update enquiry status."
      );
    } finally {
      setUpdating(null);
    }
  };

  if (loading) {
    return <Loader label="Loading enquiries..." />;
  }

  return (
    <div className="admin-page">
      <div className="admin-page-header"><div><p className="admin-eyebrow">Customer conversations</p><h2 className="admin-section-title">All enquiries</h2></div><span className="admin-count-badge">{contacts.length} total</span></div>

      {contacts.length === 0 ? (
        <div className="admin-empty-state"><i className="bi bi-chat-left-text"></i><h3>No enquiries yet</h3><p>Customer questions will appear here.</p></div>
      ) : (
        <div className="admin-table-wrap"><table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Mobile</th>
              <th>Subject</th>
              <th>Message</th>
              <th>Status</th>
              <th>Received</th>
            </tr>
          </thead>

          <tbody>
            {contacts.map((contact) => (
              <tr key={contact._id}>
                <td>{contact.name}</td>
                <td>{contact.email}</td>
                <td>{contact.mobile}</td>
                <td>{contact.subject}</td>
                <td>{contact.message}</td>

                <td>
                  <select
                    value={contact.status}
                    onChange={(e) =>
                      handleStatusChange(
                        contact._id,
                        e.target.value
                      )
                    }
                    disabled={updating === contact._id}
                  >
                    {statuses.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </td>

                <td>
                  {new Date(contact.createdAt).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table></div>
      )}
    </div>
  );
}