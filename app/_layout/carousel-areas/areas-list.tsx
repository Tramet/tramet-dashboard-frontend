import { AreaChart, Truck } from "lucide-react";

export const AREAS_LIST = [
  {
    id: 1,
    name: "Materia Prima",
    path: "raw-material",
    icon: AreaChart,
  },
  {
    id: 2,
    name: "Producción",
    path: "production",
    icon: AreaChart,
  },
  {
    id: 3,
    name: "Transporte Volumen",
    path: "volume-transport",
    icon: Truck,
  },
  {
    id: 4,
    name: "Centro de Distribución",
    path: "distribution-center",
    icon: AreaChart,
  },
  {
    id: 5,
    name: "Transporte fraccionado",
    path: "fractional-transport",
    icon: Truck,
  },
  {
    id: 6,
    name: "Punto de venta",
    path: "point-of-sale",
    icon: AreaChart,
  },
  {
    id: 7,
    name: "Delivery",
    path: "delivery",
    icon: AreaChart,
  },
  {
    id: 8,
    name: "Cliente Final",
    path: "final-client",
    icon: AreaChart,
  },
  {
    id: 9,
    name: "Quejas de Cliente",
    path: "client-complaints",
    icon: AreaChart,
  },
];
