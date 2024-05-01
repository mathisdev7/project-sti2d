"use client";
import { Progress } from "@/components/ui/progress";
import { Vortex } from "@/components/ui/vortex";
import "aos/dist/aos.css";
import { signOut, useSession } from "next-auth/react";
import * as React from "react";

type Stock = {
  id: string;
  name: string;
  leftWeight: number;
  maxWeight: number;
  createdAt: Date;
  updatedAt: Date;
};

export default function Dashboard() {
  const { data: session, status: sessionStatus } = useSession();
  const [stock, setStock] = React.useState<Stock[]>([]);
  const [stockInPercentage, setStockInPercentage] = React.useState<number>(0);

  React.useEffect(() => {
    if (sessionStatus === "loading") return;
    if (sessionStatus === "unauthenticated") {
      window.location.href = "/login";
    }
    fetch("/api/getStock")
      .then(async (res) => {
        if (res.ok) {
          const allStockInJson = await res.json();
          const totalWeight = allStockInJson.stocks.reduce(
            (acc: number, item: Stock) => acc + item.maxWeight,
            0
          );
          const leftWeight = allStockInJson.stocks.reduce(
            (acc: number, item: Stock) => acc + item.leftWeight,
            0
          );
          setStockInPercentage((leftWeight / totalWeight) * 100);
          setStock(allStockInJson.stocks);
        } else {
          throw new Error("Something went wrong");
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }, [sessionStatus, session]);

  return (
    <main className="dashboard-body flex flex-col items-center h-screen justify-between overflow-hidden">
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
      <div className="absolute top-8 left-4 z-50">
        <button
          onClick={() => signOut({ redirect: false, callbackUrl: "/login" })}
          className="relative inline-flex md:h-12 h-14 overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50 w-auto"
        >
          <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
          <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-slate-950 px-3 py-1 text-sm font-medium text-white backdrop-blur-3xl">
            Se déconnecter
          </span>
        </button>
      </div>
      {session?.user.admin === true && (
        <div className="absolute top-8 right-4 z-50">
          <button
            onClick={() => (window.location.href = "/register")}
            className="relative inline-flex md:h-12 h-14 overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50 w-auto"
          >
            <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
            <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-slate-950 px-3 py-1 text-sm font-medium text-white backdrop-blur-3xl">
              Ajouter un compte client
            </span>
          </button>
        </div>
      )}
      <div className="absolute top-32 z-50">
        <span
          className="text-5xl text-[#fff]"
          onClick={() => (window.location.href = "/dashboard")}
        >
          Bienvenue
        </span>
      </div>

      <div className="absolute flex flex-row justify-center items-center w-full h-full z-20 xl:space-x-40 space-x-12">
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
        <div className="bg-[#ccc] rounded-2xl w-72 h-72 z-20 p-4">
          <h1 className="text-center text-xl font-bold relative top-10">
            Stock des différents modèles
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
      <div className="absolute bottom-32 flex flex-row space-x-16 grid-rows-4">
        <div className="flex z-30">
          <button
            onClick={() => (window.location.href = "/orderStock")}
            className="relative inline-flex h-12 overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50"
          >
            <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
            <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-slate-950 px-3 py-1 text-sm font-medium text-white backdrop-blur-3xl">
              Commander du stock
            </span>
          </button>
        </div>

        {session?.user.admin === true && (
          <React.Fragment>
            <div className="flex z-30">
              <button
                onClick={() => (window.location.href = "/addStock")}
                className="relative inline-flex md:h-12 h-14 overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50 w-auto"
              >
                <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
                <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-slate-950 px-3 py-1 text-sm font-medium text-white backdrop-blur-3xl">
                  Ajouter des modèles
                </span>
              </button>
            </div>
            <div className="flex z-30">
              <button
                onClick={() => (window.location.href = "/editStock")}
                className="relative inline-flex h-12 overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50"
              >
                <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
                <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-slate-950 px-3 py-1 text-sm font-medium text-white backdrop-blur-3xl">
                  Modifier le stock
                </span>
              </button>
            </div>
          </React.Fragment>
        )}

        <div className="flex z-30">
          <button
            onClick={() => (window.location.href = "/orders")}
            className="relative inline-flex h-12 overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50 w-auto"
          >
            <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
            <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-slate-950 px-3 py-1 text-sm font-medium text-white backdrop-blur-3xl">
              Consulter vos commandes
            </span>
          </button>
        </div>
      </div>
    </main>
  );
}
