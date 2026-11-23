import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <main style={{ display: 'flex', minHeight: '100vh', alignItems: 'center', justifyContent: 'center', backgroundColor: '#09090b' }}>
      {/* After login / signup go to the dashboard (not back to the front page) */}
      <SignUp fallbackRedirectUrl="/dashboard" />
    </main>
  );
}
