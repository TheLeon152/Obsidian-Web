import logo from "../../assets/branding/obsidian-web-logo.png";

import {
  useState,
  type FormEvent,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import {
  useAuth,
} from "../../auth/AuthContext";

import "./LoginPage.css";


export function LoginPage() {

  const { login } = useAuth();

  const navigate = useNavigate();

  const [username, setUsername] = useState("");

  const [password, setPassword] = useState("");

  const [error, setError] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);


  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {

    event.preventDefault();

    setError(null);
    setLoading(true);


    try {

      await login({
        username,
        password,
      });

      navigate(
        "/",
        {
          replace: true,
        },
      );

    } catch (error) {

      console.error(
        "LOGIN FAILED:",
        error,
      );

      setError(
        error instanceof Error
          ? error.message
          : "Login failed.",
      );

    } finally {

      setLoading(false);

    }
  }


  return (
    <main className="login-page">

      <div className="login-background">
        <div className="login-glow login-glow-one" />
        <div className="login-glow login-glow-two" />

        <div className="network network-one" />
        <div className="network network-two" />
      </div>


      <section className="login-card">

        <div className="login-brand">

          <div className="login-logo">
            <img
              src={logo}
              alt="Obsidian Web"
            />
          </div>

          <div className="login-brand-text">

            <h1>
              Obsidian Web
            </h1>

            <p>
              Your vault, everywhere.
            </p>

          </div>

        </div>


        <div className="login-divider" />


        <div className="login-heading">

          <h2>
            Welcome back
          </h2>

          <p>
            Sign in to access your vault.
          </p>

        </div>


        <form
          className="login-form"
          onSubmit={handleSubmit}
        >

          <div className="form-field">

            <label htmlFor="username">
              Username
            </label>

            <input
              id="username"
              type="text"
              value={username}
              onChange={
                event =>
                  setUsername(
                    event.target.value,
                  )
              }
              autoComplete="username"
              autoFocus
              required
              disabled={loading}
              placeholder="Enter your username"
            />

          </div>


          <div className="form-field">

            <label htmlFor="password">
              Password
            </label>

            <input
              id="password"
              type="password"
              value={password}
              onChange={
                event =>
                  setPassword(
                    event.target.value,
                  )
              }
              autoComplete="current-password"
              required
              disabled={loading}
              placeholder="Enter your password"
            />

          </div>


          {error && (

            <div
              className="login-error"
              role="alert"
            >
              <span className="login-error-icon">
                !
              </span>

              <span>
                {error}
              </span>
            </div>

          )}


          <button
            className="login-button"
            type="submit"
            disabled={loading}
          >

            {loading ? (
              <>
                <span className="login-spinner" />
                Signing in...
              </>
            ) : (
              <>
                Sign in
                <span className="login-button-arrow">
                  →
                </span>
              </>
            )}

          </button>

        </form>


        <p className="login-footer">
          Obsidian Web
        </p>

      </section>

    </main>
  );
}