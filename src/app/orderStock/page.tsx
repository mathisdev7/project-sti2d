"use client";
import { Progress } from "@/components/ui/progress";
import { Vortex } from "@/components/ui/vortex";
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

export default function OrderStock() {
  const { data: session, status: sessionStatus } = useSession();
  const [stock, setStock] = React.useState<Stock[]>([]);
  const [stockInPercentage, setStockInPercentage] = React.useState<number>(0);
  const [currentModel, setCurrentModel] = React.useState<Stock | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [newWeigth, setNewWeigth] = React.useState<number>(0);
  const [newMaxWeigth, setNewMaxWeigth] = React.useState<number>(0);
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    if (sessionStatus === "loading") return;
    if (sessionStatus === "unauthenticated") {
      window.location.href = "/login";
    }
    getStock();
  }, [sessionStatus, session]);

  const getStock = async () => {
    fetch("/api/getStock")
      .then(async (res) => {
        if (res.ok) {
          const allStockInJson = await res.json();
          setStock(allStockInJson.stocks);
          const totalWeight = allStockInJson.stocks.reduce(
            (acc: number, item: Stock) => acc + item.maxWeight,
            0
          );
          const leftWeight = allStockInJson.stocks.reduce(
            (acc: number, item: Stock) => acc + item.leftWeight,
            0
          );
          setCurrentModel(allStockInJson.stocks[0]);
          setStockInPercentage((leftWeight / totalWeight) * 100);
          return res.json();
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
  };

  const handleSubmit = async (e: React.FormEvent) => {
    await getStock();
    if (!currentModel) {
      setError("Veuillez choisir un modèle");
      return;
    }
    if (newWeigth <= 0) {
      setError("Veuillez entrer un poids valide");
      return;
    }
    if (newWeigth > currentModel.leftWeight) {
      setError("Le poids demandé est supérieur au stock restant");
      return;
    }
    setIsLoading(true);
    fetch("/api/addOrder", {
      method: "POST",
      body: JSON.stringify({
        weight: newWeigth,
        modelName: currentModel.name,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then(async (res) => {
        if (res.ok) {
          return res.json();
        } else {
          throw new Error("Something went wrong");
        }
      })
      .then((data) => {
        setStock((prev) =>
          prev.map((item) => {
            if (item.id === currentModel.id) {
              return {
                ...item,
                leftWeight: item.leftWeight - newWeigth,
              };
            }
            return item;
          })
        );
        setNewWeigth(0);
        alert("Commande ajoutée avec succès");
        setIsLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setIsLoading(false);
      });
  };

  return (
    <main className="flex flex-col items-center xl:h-screen justify-between bg-black overflow-x-hidden h-[150vh]">
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
        className="w-screen h-screen"
      />
      <div className="absolute xl:top-32 top-8 z-50">
        <span
          className="text-5xl text-[#fff]"
          onClick={() => (window.location.href = "/dashboard")}
        >
          Bienvenue
        </span>
      </div>

      <div className="absolute flex xl:flex-row flex-col xl:space-y-0 space-y-28 w-auto h-auto z-20 xl:space-x-40 top-2/3">
        <div className="bg-[#ccc] rounded-2xl w-72 h-72 z-20 text-center p-4">
          <Progress
            value={100 - stockInPercentage}
            max={100}
            className="rounded-xl w-48 h-4 relative top-32 justify-center flex bg-[#fff] m-auto"
          />
          <span className="text-3xl text-[#000] relative top-48">
            {(100 - stockInPercentage).toFixed(2)}%
          </span>
          <span className="text-xl text-[#000] relative w-full h-auto font-bold m-auto justify-center flex bottom-4">
            Pourcentage de Remplissage
          </span>
        </div>
        <div className="bg-[#ccc] rounded-2xl w-72 h-72 z-20 text-center p-4">
          <h1 className="text-center text-xl font-bold relative top-10">
            Stock restant des différents modèles
          </h1>
          <ul className="flex flex-col justify-center items-center w-full h-full">
            {stock.length > 0 &&
              stock.map((item) => (
                <li className="flex flex-row space-x-8" key={item.id}>
                  <span>{item.name} :</span>
                  <span className="font-bold">
                    {item.leftWeight}kg/{item.maxWeight}kg
                  </span>
                </li>
              ))}
          </ul>
        </div>
      </div>
      <div className="h-screen flex justify-center items-center absolute z-40 xl:bottom-28 bottom-40">
        <div className="bg-[#ffffff] opacity-90 w-72 h-auto rounded-xl p-8 pt-6 text-center text-[#000] shadow-2xl z-40 flex flex-col space-y-4 justify-center items-center mt-20">
          <h1 className="text-2xl font-bold z-50 relative">Acheter du stock</h1>
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
            Poids à acheter :
          </label>
          <input
            id="modelWeightInput"
            className="w-full p-2 bg-[#ccc] rounded-sm text-center"
            placeholder="Poids à acheter en kg"
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
            type="text"
            contentEditable={false}
            value={currentModel?.maxWeight + " kg"}
          ></input>

          <label htmlFor="price" className="relative top-4 right-3">
            Prix :
          </label>
          <input
            id="price"
            className="w-full p-2 bg-[#ccc] rounded-sm text-center"
            type="text"
            contentEditable={false}
            value={newWeigth * 10 + " €"}
          ></input>
          <button
            className="bg-[#000] hover:scale-110 transition duration-200 cursor-pointer hover:bg-[#000] text-[#fff] rounded-xl py-2 px-4 w-auto z-50 relative"
            disabled={isLoading}
            onClick={handleSubmit}
          >
            Acheter
          </button>
        </div>
      </div>
    </main>
  );
}
