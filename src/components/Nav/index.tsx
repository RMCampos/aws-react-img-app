import viteLogo from '../../assets/vite.svg';

export default function Nav() {
  return (
    <nav className="navbar navbar-expand-lg bg-dark border-bottom" data-bs-theme="dark">
      <div className="container-fluid">
        <a className="navbar-brand" href={`/`}>
          <img src={viteLogo} alt="Vite" width="30" height="24" />
        </a>
        <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
          <div className="navbar-nav">
            <a className="nav-link active" aria-current="page" href={`/`}>Home</a>
            <a className="nav-link active" aria-current="page" href={`/upload`}>Upload Image</a>
          </div>
        </div>
      </div>
    </nav>
  );
}