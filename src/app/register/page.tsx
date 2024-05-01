"use client";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import AutoForm, { AutoFormSubmit } from "@/components/ui/auto-form";
import { Icons } from "@/components/ui/icons";
import { Cross1Icon } from "@radix-ui/react-icons";
import AOS from "aos";
import "aos/dist/aos.css";
import { useSession } from "next-auth/react";
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

  email: z
    .string({
      required_error: "L'email est requis.",
    })
    .describe("Email")
    .email({
      message: "L'email doit être valide.",
    }),

  firstName: z
    .string({
      required_error: "Le prénom est requis.",
    })
    .describe("Prénom"),

  lastName: z
    .string({
      required_error: "Le nom est requis.",
    })
    .describe("Nom"),

  password: z
    .string({
      required_error: "Le mot de passe est requis.",
    })
    .describe("Mot de passe")
    .min(7, {
      message: "Le mot de passe doit contenir au moins 7 caractères.",
    }),

  passwordRepeated: z
    .string({
      required_error: "Le mot de passe est requis.",
    })
    .describe("Répeter le mot de passe")
    .min(7, {
      message: "Le mot de passe doit contenir au moins 7 caractères.",
    }),
});

export default function Register() {
  const session = useSession();
  React.useEffect(() => {
    if (session.status === "loading") return;
    if (session.status === "unauthenticated") router.push("/login");
    if (session.data?.user?.admin === false) router.push("/dashboard");
  }, [session.status, session.data]);
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleSubmit = async (formData: {
    username: string;
    password: string;
    firstName: string;
    lastName: string;
    email: string;
    passwordRepeated: string;
  }) => {
    setIsLoading(true);
    const loginRequest = await fetch("/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });
    const hasSucceed = loginRequest?.ok;
    if (hasSucceed) {
      setIsLoading(false);
      alert("Le compte client a été créé avec succès.");
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

      <div className="absolute top-64 h-auto flex space-y-4 flex-col">
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
            email: {
              inputProps: {
                placeholder: "E-mail",
                disabled: isLoading,
                className: "border-black",
                type: "text",
              },
            },
            firstName: {
              inputProps: {
                placeholder: "Prénom",
                disabled: isLoading,
                className: "border-black",
                type: "text",
              },
            },
            lastName: {
              inputProps: {
                placeholder: "Nom",
                disabled: isLoading,
                className: "border-black",
                type: "text",
              },
            },
            passwordRepeated: {
              inputProps: {
                placeholder: "Répeter le mot de passe",
                disabled: isLoading,
                className: "border-black",
                type: "password",
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
          className="bg-[#ffffff] opacity-90 w-96 h-auto rounded-xl p-12 pt-24 text-center text-[#000] shadow-2xl"
        >
          <div className="absolute top-2 flex justify-center mx-auto w-full right-2">
            <h1 className="text-2xl font-bold">Création compte client</h1>
          </div>
          <AutoFormSubmit
            disabled={isLoading}
            className="bg-[#000000] hover:bg-[#030205] text-white relative px-4 top-8 py-2 text-lg shadow-2xl font-JetBrainsMono"
          >
            {isLoading && (
              <Icons.spinner className="animate-spinner relative right-3" />
            )}
            Créer
          </AutoFormSubmit>
        </AutoForm>
      </div>
    </main>
  );
}
