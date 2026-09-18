import { redirect } from "next/navigation";
import { isAdminConfigured, isAdminSession } from "../../lib/auth";
import { login } from "../actions";

export default async function AdminLogin({ searchParams }) {
  if (await isAdminSession()) redirect("/admin");
  const { error } = await searchParams;
  const configured = isAdminConfigured();

  return (
    <main className="admin__login">
      <form action={login} className="admin__login-card">
        <p className="section__eyebrow">Kevin Larson Presents</p>
        <h1 className="admin__login-title">Site admin</h1>
        {configured ? (
          <>
            <label htmlFor="password" className="sr-only">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="Admin password"
              autoComplete="current-password"
              autoFocus
              required
            />
            {error ? (
              <p className="admin__error" role="alert">
                That password didn&rsquo;t match.
              </p>
            ) : null}
            <button type="submit" className="btn btn--primary">
              Sign in
            </button>
          </>
        ) : (
          <p className="admin__error" role="alert">
            Admin isn&rsquo;t set up yet: set an <code>ADMIN_PASSWORD</code>{" "}
            environment variable and restart the server.
          </p>
        )}
      </form>
    </main>
  );
}
