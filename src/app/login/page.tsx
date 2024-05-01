"use client";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import AutoForm, { AutoFormSubmit } from "@/components/ui/auto-form";
import { Icons } from "@/components/ui/icons";
import { Cross1Icon } from "@radix-ui/react-icons";
import AOS from "aos";
import "aos/dist/aos.css";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import * as React from "react";
import * as z from "zod";

const formSchema = z.object({
  username: z
    .string({
      required_error: "Le nom d'utilisateur est requis.",
    })
    .describe("Nom d'utilisateur")
    .min(2, {
      message: "Le nom d'utilisateur doit contenir au moins 2 caractères.",
    }),

  password: z
    .string({
      required_error: "Le mot de passe est requis.",
    })
    .describe("Mot de passe")
    .min(7, {
      message: "Le mot de passe doit contenir au moins 7 caractères.",
    }),
});

export default function Login() {
  const session = useSession();
  React.useEffect(() => {
    if (session.status === "loading") return;
    if (session.status === "authenticated") router.push("/dashboard");
  }, [session.status, session.data]);
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleSubmit = async (formData: {
    username: string;
    password: string;
  }) => {
    setIsLoading(true);
    const loginRequest = await signIn("credential", {
      username: formData.username,
      password: formData.password,
      callbackUrl: "/dashboard",
      redirect: false,
    });
    const hasSucceed = loginRequest?.ok;
    if (hasSucceed) {
      setIsLoading(false);
      router.push("/dashboard");
    } else {
      setError("Vos identifiants sont incorrects. Veuillez réessayer.");
      return setIsLoading(false);
    }
  };
  React.useEffect(() => {
    AOS.init({ duration: 1200 });
  });
  return (
    <main className="login-body flex h-screen w-screen justify-center items-center">
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link href="https://unpkg.com/aos@2.3.1/dist/aos.css" rel="stylesheet" />
      <link
        rel="preconnect"
        href="https://fonts.gstatic.com"
        crossOrigin="anonymous"
      />
      <link
        href="https://fonts.googleapis.com/css2?family=Anta&family=Roboto+Condensed:ital,wght@0,100..900;1,100..900&family=JetBrains+Mono:ital,wght@0,100..800;1,100..800&display=swap"
        rel="stylesheet"
      />
      <div className="wave absolute z-50"></div>
      <div className="wave absolute z-50"></div>
      <div className="wave absolute z-50"></div>

      <div className="absolute top-36">
        {error && (
          <Alert className="w-80 bg-[#181818] border-none text-[#eee]">
            <Cross1Icon
              onClick={() => setError(null)}
              className="h-4 w-4 bg-white rounded-full p-1"
            />
            <AlertTitle>Erreur</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
      </div>

      <div className="absolute top-64 h-96 flex space-y-4 flex-col">
        <AutoForm
          onSubmit={(e) => handleSubmit(e)}
          formSchema={formSchema}
          fieldConfig={{
            username: {
              inputProps: {
                placeholder: "Nom d'utilisateur",
                disabled: isLoading,
                className: "border-black",
                type: "text",
              },
            },
            password: {
              inputProps: {
                placeholder: "Mot de passe",
                disabled: isLoading,
                className: "border-black",
                type: "password",
              },
            },
          }}
          className="bg-[#ffffff] opacity-90 w-96 h-96 rounded-xl p-8 pt-24 text-center text-[#000] shadow-2xl"
        >
          <div className="absolute top-2 left-24 text-center w-1/2">
            <h1 className="text-2xl mx-auto font-bold">Connexion</h1>
          </div>
          <AutoFormSubmit
            disabled={isLoading}
            className="bg-[#000000] hover:bg-[#030205] text-white relative px-4 top-8 py-2 text-lg shadow-2xl font-JetBrainsMono"
          >
            {isLoading && (
              <Icons.spinner className="animate-spinner relative right-3" />
            )}
            Se connecter
          </AutoFormSubmit>
        </AutoForm>
      </div>
    </main>
  );
}
