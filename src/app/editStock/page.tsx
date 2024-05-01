"use client";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Vortex } from "@/components/ui/vortex";
import { Cross1Icon } from "@radix-ui/react-icons";
import "aos/dist/aos.css";
import { useSession } from "next-auth/react";
import * as React from "react";

type Stock = {
  id: string;
  name: string;
  leftWeight: number;
  maxWeight: number;
  createdAt: Date;
  updatedAt: Date;
};

export default function EditStock() {
  const { data: session, status: sessionStatus } = useSession();
  const [isLoading, setIsLoading] = React.useState(false);
  const [stock, setStock] = React.useState<Stock[]>([]);
  const [currentModel, setCurrentModel] = React.useState<Stock | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [newWeigth, setNewWeigth] = React.useState<number>(0);
  const [newMaxWeigth, setNewMaxWeigth] = React.useState<number>(0);

  const handleSubmit = () => {
    if (newMaxWeigth) {
      if (newMaxWeigth < newWeigth) {
        setError("Le poids maximum doit être supérieur au poids restant");
        return;
      }
    }
    if (!currentModel) return setError("Erreur.");
    if (newWeigth > currentModel?.maxWeight) {
      setError("Le poids restant ne peut pas être supérieur au poids maximum");
      return;
    }
    setIsLoading(true);
    fetch("/api/editStock", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        newWeight: newWeigth,
        modelName: currentModel?.name,
      }),
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
        alert("Stock modifié avec succès");
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
      fetch("/api/getStock")
        .then(async (res) => {
          if (res.ok) {
            const allStockInJson = await res.json();
            setCurrentModel(allStockInJson.stocks[0]);
            return allStockInJson;
          } else {
            throw new Error("Something went wrong");
          }
        })
        .then((data) => {
          setStock(data.stocks);
        })
        .catch((error) => {
          console.error(error);
        });
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
      <div className="absolute top-60">
        {error && (
          <Alert className="w-80 bg-[#181818] border-none text-[#eee] z-40">
            <Cross1Icon
              onClick={() => setError(null)}
              className="h-4 w-4 bg-white rounded-full p-1 z-50"
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
        <div className="bg-[#ffffff] opacity-90 w-72 h-96 rounded-xl p-8 pt-6 text-center text-[#000] shadow-2xl z-40 flex flex-col space-y-4 justify-center items-center mt-20">
          <h1 className="text-2xl font-bold z-50 relative">
            Modifier du stock
          </h1>
          <label htmlFor="modelSelect" className="relative top-4 right-12">
            Nom du modèle :
          </label>
          <select
            id="modelSelect"
            onChange={(e) =>
              setCurrentModel(
                stock.find((model) => model.id === e.target.value) as Stock
              )
            }
            className="w-full p-2 bg-[#ccc] rounded-sm text-center"
          >
            {stock.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
          <label htmlFor="modelWeightInput" className="relative top-4 right-12">
            Poids du modèle :
          </label>
          <input
            id="modelWeightInput"
            className="w-full p-2 bg-[#ccc] rounded-sm text-center"
            placeholder={currentModel?.leftWeight + " kg"}
            type="number"
            onChange={(e) => setNewWeigth(parseInt(e.target.value))}
            value={newWeigth ? newWeigth : ""}
          ></input>

          <label
            htmlFor="modelWeightMaxInput"
            className="relative top-4 right-3"
          >
            Poids maximum du modèle :
          </label>
          <input
            id="modelWeightMaxInput"
            className="w-full p-2 bg-[#ccc] rounded-sm text-center"
            placeholder={currentModel?.maxWeight + " kg"}
            onChange={(e) => setNewMaxWeigth(parseInt(e.target.value))}
            type="number"
            value={newMaxWeigth ? newMaxWeigth : ""}
          ></input>
          <button
            className="bg-[#000] hover:scale-110 transition duration-200 cursor-pointer hover:bg-[#000] text-[#fff] rounded-xl py-2 px-4 w-auto z-50 relative"
            disabled={isLoading}
            onClick={handleSubmit}
          >
            Modifier
          </button>
        </div>
      </div>
    </main>
  );
}
