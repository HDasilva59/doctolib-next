import Link from "next/link";

export default function Login(props: { props: any }) {
  return (
      <div>
        <main className="text-center">
          <h1>Login</h1>
          <Link href="/api/auth/login"><a ><button>Connexion Pro</button></a></Link>
          <Link href="/api/auth/loginPatients"><a><button>Connexion Patient</button></a></Link>
          <h2>Bonne visite !</h2>
        </main>
      </div>
  )
}

