import { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import { toast } from "sonner";

import { api } from "../lib/api";
import EmptyState from "../components/ui/EmptyState";

export default function Notifications() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      const { data } = await api.get(
        "/notifications"
      );

      setItems(
        Array.isArray(data) ? data : []
      );
    } catch (err) {
      console.error(
        "Notification load error:",
        err
      );

      setItems([]);

      toast.error(
        err.response?.data?.message ||
          "Could not load notifications"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let active = true;

    const fetchNotifications =
      async () => {
        try {
          const { data } =
            await api.get(
              "/notifications"
            );

          if (active) {
            setItems(
              Array.isArray(data)
                ? data
                : []
            );
          }
        } catch (err) {
          console.error(
            "Notification load error:",
            err
          );

          if (active) {
            setItems([]);
          }
        } finally {
          if (active) {
            setLoading(false);
          }
        }
      };

    fetchNotifications();

    return () => {
      active = false;
    };
  }, []);

  const mark = async (id) => {
    try {
      await api.patch(
        `/notifications/${id}/read`
      );

      setItems((current) =>
        current.map((item) =>
          item._id === id
            ? {
                ...item,
                read: true,
              }
            : item
        )
      );
    } catch (err) {
      console.error(
        "Mark notification error:",
        err
      );

      toast.error(
        err.response?.data?.message ||
          "Could not update notification"
      );
    }
  };

  return (
    <section className="container page-section narrow">
      <div className="page-hero compact">
        <p className="eyebrow">
          Inbox
        </p>

        <h1>
          Notifications
        </h1>
      </div>

      {loading ? (
        <div className="notification-list">
          <div className="panel">
            Loading notifications...
          </div>
        </div>
      ) : items.length > 0 ? (
        <div className="notification-list">
          {items.map((notification) => (
            <button
              type="button"
              key={notification._id}
              className={`notification-item ${
                notification.read
                  ? ""
                  : "unread"
              }`}
              onClick={() =>
                mark(
                  notification._id
                )
              }
            >
              <span className="notification-icon">
                <Bell size={18} />
              </span>

              <span>
                <strong>
                  {notification.title ||
                    "Notification"}
                </strong>

                <p>
                  {notification.message ||
                    ""}
                </p>

                <small>
                  {notification.createdAt
                    ? new Date(
                        notification.createdAt
                      ).toLocaleString()
                    : ""}
                </small>
              </span>
            </button>
          ))}
        </div>
      ) : (
        <EmptyState
          title="All quiet"
          text="Application updates and hiring activity will appear here."
        />
      )}
    </section>
  );
}

