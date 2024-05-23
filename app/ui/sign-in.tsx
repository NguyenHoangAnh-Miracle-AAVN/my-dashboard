import { signIn } from '@/auth';

export function SignInWitchKeycloak() {
  return (
    <form
      action={async () => {
        await signIn();
      }}
    >
      <button type="submit">Signin with Keycloak</button>
    </form>
  );
}
