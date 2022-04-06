import Link from "next/link";

export const Layout: React.FC = ({ children }) => {
  return (
    <div>
      <nav className="navbar navbar-expand-sm bg-primary navbar-dark">
        <div className="container-fluid">
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#collapsibleNavbar"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <Link href="/">
            <a className="navbar-brand">Home</a>
          </Link>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav">
              <Link href="/login">
                <a className="nav-link active">
                  <li className="nav-item">Login</li>
                </a>
              </Link>
              <Link href="/api/auth/logout">
                <a className="nav-link active">
                  <li className="nav-item">Logout</li>
                </a>
              </Link>
              <Link href="/myProfile">
                <a className="nav-link active">
                  <li className="nav-item">My profile</li>
                </a>
              </Link>
            </ul>
          </div>
        </div>
      </nav>

      {children}
    </div>
  );
};
