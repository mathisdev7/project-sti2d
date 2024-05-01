"use client";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import AutoForm, { AutoFormSubmit } from "@/components/ui/auto-form";
import { Vortex } from "@/components/ui/vortex";
import { Cross1Icon } from "@radix-ui/react-icons";
import "aos/dist/aos.css";
import { useSession } from "next-auth/react";
import * as React from "react";
import * as z from "zod";

const formSchema = z.object({
  modelName: z
    .string({
      required_error: "Le nom du model de feu d'artifice est requis.",
    })
    .describe("Nom du modèle"),
  maxWeight: z
    .number({
      required_error: "Le poids maximum de stockage de ce modèle est requis.",
    })
    .describe("Poids (stockage maximum)"),
});

export default function AddStock() {
  const { data: session, status: sessionStatus } = useSession();
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  type FormData = z.infer<typeof formSchema>;

  const handleSubmit = (data: FormData) => {
    setIsLoading(true);
    fetch("/api/addStock", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else {
          throw new Error("Something went wrong");
        }
      })
      .then(() => {
        setIsLoading(false);
        alert("Stock ajouté avec succès");
      })
      .catch((error) => {
        setIsLoading(false);
        setError(error.message);
      });
  };

  React.useEffect(() => {
    if (sessionStatus === "loading") return;
    if (sessionStatus === "unauthenticated") {
      window.location.href = "/login";
    } else {
      if (session?.user.admin === false) {
        window.location.href = "/dashboard";
      }
    }
  }, [sessionStatus, session]);

  return (
    <main className="dashboard-body flex flex-col items-center h-screen justify-between">
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link href="https://unpkg.com/aos@2.3.1/dist/aos.css" rel="stylesheet" />
      <link
        rel="preconnect"
        href="https://fonts.gstatic.com"
        crossOrigin="anonymous"
      />
      <script src="three.r134.min.js"></script>
      <script src="vanta.halo.min.js"></script>
      <link
        href="https://fonts.googleapis.com/css2?family=Anta&family=Roboto+Condensed:ital,wght@0,100..900;1,100..900&family=JetBrains+Mono:ital,wght@0,100..800;1,100..800&display=swap"
        rel="stylesheet"
      />
      <Vortex
        backgroundColor="black"
        particleCount={300}
        rangeY={900}
        baseHue={220}
        className="w-screen h-screen z-10"
      />
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
      <div className="absolute top-32 z-50">
        <span
          className="text-5xl text-[#fff]"
          onClick={() => (window.location.href = "/dashboard")}
        >
          Bienvenue
        </span>
      </div>
      <div className="h-screen flex justify-center items-center absolute z-40">
        <AutoForm
          formSchema={formSchema}
          onSubmit={(e) => handleSubmit(e)}
          fieldConfig={{
            modelName: {
              inputProps: {
                placeholder: "Nom du modèle",
                disabled: isLoading,
                className: "border-black",
                type: "text",
              },
            },
            maxWeight: {
              inputProps: {
                placeholder: "Poids maximum de stockage",
                disabled: isLoading,
                className: "border-black",
                type: "text",
              },
            },
          }}
          className="bg-[#ffffff] opacity-90 w-72 h-96 rounded-xl p-8 pt-24 text-center text-[#000] shadow-2xl z-40"
        >
          <h1 className="relative bottom-60 text-xl font-bold z-50">
            Ajouter du stock
          </h1>
          <AutoFormSubmit
            className="bg-[#000] hover:scale-110 transition duration-200 cursor-pointer hover:bg-[#000] text-[#fff] rounded-xl p-4 z-50"
            disabled={isLoading}
          >
            Ajouter
          </AutoFormSubmit>
        </AutoForm>
      </div>
    </main>
  );
}
