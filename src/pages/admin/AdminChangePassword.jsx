import { useState } from "react";
import { useNavigate } from "react-router-dom";
import SEO from "../../components/SEO";
import Button from "../../components/ui/Button";
import { useAuth } from "../../context/AuthContext";

const fieldClasses =
  "w-full border border-edge bg-surface px-3.5 py-2.5 text-sm text-content focus:border-emerald-700 focus:outline-none";

export default function AdminChangePassword({ forced = false }) {
  const { changePassword, admin, logout } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (form.newPassword !== form.confirmPassword) {
      setError("New password and confirmation don't match.");
      return;
    }
    setSubmitting(true);
    const result = await changePassword(form.currentPassword, form.newPassword);
    setSubmitting(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    if (forced) {
      navigate("/admin", { replace: true });
    } else {
      setDone(true);
      setForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    }
  };

  const formEl = (
    <form onSubmit={handleSubmit} className="mt-7 space-y-4">
      <div className="space-y-1.5">
        <label htmlFor="currentPassword" className="text-xs uppercase tracking-wide text-content-muted">
          Current password
        </label>
        <input
          id="currentPassword"
          type="password"
          required
          value={form.currentPassword}
          onChange={set("currentPassword")}
          className={fieldClasses}
        />
      </div>
      <div className="space-y-1.5">
        <label htmlFor="newPassword" className="text-xs uppercase tracking-wide text-content-muted">
          New password
        </label>
        <input
          id="newPassword"
          type="password"
          required
          minLength={8}
          value={form.newPassword}
          onChange={set("newPassword")}
          className={fieldClasses}
        />
        <p className="text-xs text-content-muted">At least 8 characters.</p>
      </div>
      <div className="space-y-1.5">
        <label htmlFor="confirmPassword" className="text-xs uppercase tracking-wide text-content-muted">
          Confirm new password
        </label>
        <input
          id="confirmPassword"
          type="password"
          required
          minLength={8}
          value={form.confirmPassword}
          onChange={set("confirmPassword")}
          className={fieldClasses}
        />
      </div>
      {error && <p className="text-sm text-[#c0453a]">{error}</p>}
      {done && <p className="text-sm text-emerald-700">Password updated.</p>}
      <div className="flex gap-3">
        <Button type="submit" variant="primary" disabled={submitting}>
          {submitting ? "Saving…" : "Update password"}
        </Button>
        {forced && (
          <Button type="button" variant="ghost" onClick={logout}>
            Log out instead
          </Button>
        )}
      </div>
    </form>
  );

  if (forced) {
    return (
      <>
        <SEO title="Set a New Password" description="You must set a new password before continuing." />
        <div className="flex min-h-screen items-center justify-center bg-ink px-4 py-16">
          <div className="w-full max-w-sm border border-paper/15 bg-ink-soft p-8">
            <h1 className="font-admin font-display text-2xl text-paper">Set a new password</h1>
            <p className="mt-2 text-sm text-paper/60">
              For security, {admin?.email} must choose a new password before accessing the admin panel.
            </p>
            <div className="text-paper [&_label]:text-paper/60 [&_input]:border-paper/20 [&_input]:bg-transparent [&_input]:text-paper [&_p.text-content-muted]:text-paper/50">
              {formEl}
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <SEO title="Change Password" description="Update your Avatar Realty Group admin password." />
      <h1 className="font-display text-2xl text-content">Change password</h1>
      <p className="mt-1 text-sm text-content-muted">Update the password used to sign in to the admin panel.</p>
      <div className="mt-8 max-w-md border border-edge bg-surface p-6">{formEl}</div>
    </>
  );
}
