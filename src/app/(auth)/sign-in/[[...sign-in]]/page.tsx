import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <main className="center size-full">
      <SignIn />
    </main>
  );
}
