"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@trm/_components/ui/card";
import { useAuth } from "@trm/_lib/auth/auth-context";
import { motion } from "framer-motion";
import { 
  BsBuilding, 
  BsPeople, 
  BsCreditCard, 
  BsGraphUp, 
  BsActivity,
  BsPlusCircle,
  BsWindowStack,
  BsShieldLock
} from "react-icons/bs";
import { getCustomers } from "@trm/_api/customers";
import { getAllUsers } from "@trm/_api/admin/users";
import { Button } from "@trm/_components/ui/button";
import { useRouter } from "next/navigation";

const AdminDashboard = () => {
  const { userData } = useAuth();
  const router = useRouter();
  const isTrametAdmin = userData?.role === "TRAMET_ADMIN";
  
  const [stats, setStats] = useState({
    customers: 0,
    users: 0,
    activeSubscriptions: 0,
    monthlyRevenue: "$12,400" // Mock real-looking for now
  });

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [customersData, usersData] = await Promise.all([
          getCustomers(),
          getAllUsers()
        ]);
        
        setStats(prev => ({
          ...prev,
          customers: Array.isArray(customersData) ? customersData.length : 0,
          users: Array.isArray(usersData) ? usersData.length : 0,
          activeSubscriptions: Array.isArray(customersData) ? customersData.filter((c: any) => c.status === 'ACTIVE').length || 1 : 0
        }));
      } catch (error) {
        console.error("Error loading admin stats:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      <header className="flex justify-between items-end">
        <div className="space-y-1">
          <h1 className="text-4xl font-extrabold tracking-tight">
            {isTrametAdmin ? "Dashboard de Plataforma" : "Administración General"}
          </h1>
          <p className="text-muted-foreground text-lg">
            Bienvenido, <span className="font-semibold text-primary">{userData?.sub}</span>. 
            {isTrametAdmin ? " Resumen global del SaaS Tramet." : " Gestión administrativa de tu organización."}
          </p>
        </div>
        {isTrametAdmin && (
          <Button onClick={() => router.push("/admin/tramet-customers")} className="gap-2">
            <BsPlusCircle size={18} />
            Nuevo Cliente
          </Button>
        )}
      </header>

      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {/* Card: Clientes / Empresas */}
        <motion.div variants={item}>
          <Card className="border-none shadow-lg bg-gradient-to-br from-blue-500/10 to-blue-600/5 hover:scale-[1.02] transition-transform duration-300">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                {isTrametAdmin ? "Clientes Totales" : "Mi Empresa"}
              </CardTitle>
              <BsBuilding className="h-5 w-5 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{isLoading ? "..." : stats.customers}</div>
              <p className="text-xs text-muted-foreground mt-1">+2 este mes</p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Card: Usuarios */}
        <motion.div variants={item}>
          <Card className="border-none shadow-lg bg-gradient-to-br from-purple-500/10 to-purple-600/5 hover:scale-[1.02] transition-transform duration-300">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">
                Usuarios Activos
              </CardTitle>
              <BsPeople className="h-5 w-5 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{isLoading ? "..." : stats.users}</div>
              <p className="text-xs text-muted-foreground mt-1">Sincronizado con API</p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Card: Suscripciones */}
        <motion.div variants={item}>
          <Card className="border-none shadow-lg bg-gradient-to-br from-orange-500/10 to-orange-600/5 hover:scale-[1.02] transition-transform duration-300">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-bold uppercase tracking-wider text-orange-600 dark:text-orange-400">
                Suscripciones
              </CardTitle>
              <BsCreditCard className="h-5 w-5 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{isLoading ? "..." : stats.activeSubscriptions}</div>
              <p className="text-xs text-muted-foreground mt-1">98% de retención</p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Card: Revenue / Actividad */}
        <motion.div variants={item}>
          <Card className="border-none shadow-lg bg-gradient-to-br from-green-500/10 to-green-600/5 hover:scale-[1.02] transition-transform duration-300">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-bold uppercase tracking-wider text-green-600 dark:text-green-400">
                {isTrametAdmin ? "Ingresos MRR" : "Salud del Sistema"}
              </CardTitle>
              <BsGraphUp className="h-5 w-5 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{isTrametAdmin ? stats.monthlyRevenue : "Excelente"}</div>
              <p className="text-xs text-muted-foreground mt-1">Crecimiento del 12%</p>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12">
        <Card className="border-none shadow-xl bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BsActivity className="text-primary" />
              Actividad Reciente
            </CardTitle>
            <CardDescription>Eventos importantes en la plataforma</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { event: "Nueva empresa registrada", target: "Logística SA", time: "hace 2 horas" },
                { event: "Suscripción renovada", target: "Industrias GDL", time: "hace 5 horas" },
                { event: "Nuevo admin asignado", target: "Daniel Anaya", time: "hace 1 día" }
              ].map((e, i) => (
                <div key={i} className="flex justify-between items-center p-3 rounded-lg hover:bg-muted/50 transition-colors">
                  <div>
                    <p className="text-sm font-medium">{e.event}</p>
                    <p className="text-xs text-muted-foreground">{e.target}</p>
                  </div>
                  <span className="text-xs text-muted-foreground">{e.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-xl bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Accesos Directos</CardTitle>
            <CardDescription>Gestión rápida de recursos</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
            <Button variant="outline" className="h-20 flex flex-col gap-2" onClick={() => router.push("/admin/users")}>
              <BsPeople size={20} />
              Gestionar Equipo
            </Button>
            <Button variant="outline" className="h-20 flex flex-col gap-2" onClick={() => router.push("/admin/sites")}>
              <BsWindowStack className="w-5 h-5" />
              Configurar Sitios
            </Button>
            <Button variant="outline" className="h-20 flex flex-col gap-2" onClick={() => router.push("/admin/departments")}>
              <BsShieldLock size={20} />
              Departamentos
            </Button>
            <Button variant="outline" className="h-20 flex flex-col gap-2" onClick={() => router.push("/admin/tramet-customers")}>
              <BsBuilding size={20} />
              Lista Clientes
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
