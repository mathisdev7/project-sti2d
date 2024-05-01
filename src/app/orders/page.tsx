"use client";
import { Vortex } from "@/components/ui/vortex";
import "aos/dist/aos.css";
import { useSession } from "next-auth/react";
import * as React from "react";

type Order = {
  id: string;
  userId: string;
  modelName: string;
  quantity: number;
  price: number;
  createdAt: Date;
  updatedAt: Date;
};

export default function Orders() {
  const { data: session, status: sessionStatus } = useSession();
  const [orders, setOrders] = React.useState<Order[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    if (sessionStatus === "loading") return;
    if (sessionStatus === "unauthenticated") {
      window.location.href = "/login";
    }
    setIsLoading(true);
    fetch("/api/getOrders")
      .then(async (res) => {
        if (res.ok) {
          return res.json();
        } else {
          throw new Error("Something went wrong");
        }
      })
      .then((data) => {
        setIsLoading(false);
        setOrders(data.orders);
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
      <div className="absolute top-32 z-50">
        <span
          className="text-5xl text-[#fff]"
          onClick={() => (window.location.href = "/dashboard")}
        >
          Bienvenue
        </span>
      </div>
      {isLoading ? (
        <p>Chargement en cours...</p>
      ) : (
        <div className="absolute flex justify-center items-center w-screen h-screen z-20 p-0">
          {orders.length > 0 ? (
            <>
              <table className="border-collapse rounded-sm bg-[#fff]">
                <tr>
                  <th className="p-2" scope="col">
                    Modèle
                  </th>
                  <th className="p-2" scope="col">
                    Quantité
                  </th>
                  <th className="p-2" scope="col">
                    Prix
                  </th>
                  <th className="p-2" scope="col">
                    Date de création
                  </th>
                </tr>
                {orders.map((order) => (
                  <React.Fragment>
                    <tr key={order.id} className="rounded-sm">
                      <td
                        className="p-2"
                        style={{ border: "2px solid rgb(140 140 140)" }}
                      >
                        {order.modelName}
                      </td>
                      <td
                        className="p-2"
                        style={{ border: "2px solid rgb(140 140 140)" }}
                      >
                        {order.quantity}
                      </td>
                      <td
                        className="p-2"
                        style={{ border: "2px solid rgb(140 140 140)" }}
                      >
                        {order.price}€
                      </td>
                      <td
                        className="p-2"
                        style={{ border: "2px solid rgb(140 140 140)" }}
                      >
                        {new Date(order.createdAt).getDate()}/
                        {new Date(order.createdAt).getMonth()}/
                        {new Date(order.createdAt).getFullYear()}{" "}
                        {new Date(order.createdAt).getHours()}:
                        {new Date(order.createdAt).getMinutes()}
                      </td>
                    </tr>
                  </React.Fragment>
                ))}
              </table>
            </>
          ) : (
            <div className="rounded-xl bg-[#fff] w-64 h-12 flex justify-center items-center my-auto mx-auto text-[#000] text-center">
              <div>Aucune commande trouvée</div>
            </div>
          )}
        </div>
      )}
    </main>
  );
}
