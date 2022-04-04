export default function Login(props: { props: any }) {
  return (
      <div>
        <main className="text-center">
          <h1>Login</h1>
          <a href="/api/auth/login"><button>Connexion Pro</button></a>
          <button>Connexion Patient</button>
          <h2>Bonne visite !</h2>
        </main>
      </div>
  )
}

