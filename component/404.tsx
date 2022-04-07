import Link from "next/link";

export const StopPage: React.FC = () => {
  return (
    <div>
      <Link href="/">
        <a>Return To Home Page, Click here !</a>
      </Link>
      <p>404 not authorise to acccess at this page!</p>
    </div>
  );
};
