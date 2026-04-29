"use client";

import React, { useEffect, useState } from "react";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle, DialogTrigger, DialogFooter } from "@trm/_components/ui/dialog";
import { Button } from "@trm/_components/ui/button";
import { Label } from "@trm/_components/ui/label";
import { Input } from "@trm/_components/ui/input";
import toast from "react-hot-toast";
import { useAuth } from "@trm/_lib/auth/auth-context";
import { createUser, getAllUsers, linkUserToCustomer } from "@trm/_api/admin/users";
import { getCustomers } from "@trm/_api/customers";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@trm/_components/ui/select";

export const CreateUserDialog = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [customers, setCustomers] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    user: "",
    password: "",
    role: "USER",
    customerId: ""
  });
  
  const { isAuthenticated, userData } = useAuth();
  const isTrametAdmin = userData?.role === "TRAMET_ADMIN";

  useEffect(() => {
    if (isOpen) {
      if (isTrametAdmin) {
        getCustomers().then(data => {
          if (Array.isArray(data)) setCustomers(data);
        }).catch(console.error);
      } else if (userData?.customerId) {
        // Si no es admin de Tramet, pero tiene un customerId, lo asignamos automáticamente
        setFormData(prev => ({ ...prev, customerId: userData.customerId!.toString() }));
      }
    }
  }, [isOpen, isTrametAdmin, userData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);

    if (!formData.user || !formData.password) {
      toast.error("Por favor, completa todos los campos");
      setIsLoading(false);
      return;
    }

    if (isTrametAdmin && !formData.customerId) {
      toast.error("Por favor, selecciona una empresa para este usuario");
      setIsLoading(false);
      return;
    }

    if (!isAuthenticated) {
      toast.error("No estás autenticado");
      setIsLoading(false);
      return;
    }

    const processCreation = async () => {
      // Paso 1: Crear el usuario
      await createUser(formData);
      
      // Paso 2: Obtener el ID del nuevo usuario si tenemos que vincularlo a una empresa
      if (formData.customerId) {
        const users = await getAllUsers();
        // Buscar el usuario recién creado (asumiendo que el username es único)
        const newUser = users.find(u => u.username === formData.user);
        
        if (newUser && newUser.id) {
          // Paso 3: Vincular el usuario a la empresa
          await linkUserToCustomer(newUser.id, Number(formData.customerId));
        } else {
          throw new Error("Usuario creado pero no se pudo vincular a la empresa (No se encontró el ID).");
        }
      }
    };

    await toast.promise(
      processCreation(),
      {
        loading: 'Creando usuario y vinculando empresa...',
        success: 'Usuario creado y configurado con éxito',
        error: (err) => `Error: ${err instanceof Error ? err.message : 'Error al crear usuario'}`
      },
      {
        style: { minWidth: '250px' },
        success: {
          duration: 5000,
          iconTheme: { primary: 'hsl(23, 95%, 55%)', secondary: 'white' },
        },
      }
    )
    .then(() => {
      window.dispatchEvent(new Event("refreshUsersTable"));
      setFormData({ user: "", password: "", role: "USER", customerId: "" });
      setIsOpen(false);
    })
    .catch(console.error)
    .finally(() => {
      setIsLoading(false);
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="default" 
          size="sm"
          className="text-xs sm:text-sm"
          style={{ backgroundColor: 'hsl(23, 95%, 55%)' }}
        >
          <span className="sm:inline">Crear Usuario</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogTitle>Crear Nuevo Usuario</DialogTitle>
        <DialogDescription>
          Ingresa la información del nuevo usuario y asígnalo a una empresa específica.
        </DialogDescription>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="user" className="text-right">Usuario</Label>
            <Input
              id="user"
              name="user"
              value={formData.user}
              onChange={handleChange}
              className="col-span-3"
              autoComplete="off"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="password" className="text-right">Contraseña</Label>
            <Input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              className="col-span-3"
              autoComplete="off"
            />
          </div>

          {isTrametAdmin && (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="customerId" className="text-right">Empresa</Label>
              <Select
                value={formData.customerId}
                onValueChange={(value) => setFormData(prev => ({ ...prev, customerId: value }))}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Seleccionar empresa" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Tramet (Interno)</SelectItem>
                  {customers.map(c => (
                    <SelectItem key={c.id} value={c.id.toString()}>{c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="role" className="text-right">Rol</Label>
            <Select
              value={formData.role}
              onValueChange={(value) => setFormData(prev => ({ ...prev, role: value }))}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Seleccionar rol" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="USER">Usuario Operativo</SelectItem>
                <SelectItem value="CUSTOMER_ADMIN">Administrador de Cliente</SelectItem>
                {isTrametAdmin && (
                  <SelectItem value="TRAMET_ADMIN">Administrador Tramet</SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>

          <DialogFooter className="sm:justify-end">
            <DialogClose asChild>
              <Button type="button" variant="secondary">Cancelar</Button>
            </DialogClose>
            <Button 
              type="submit"
              disabled={isLoading}
              style={{ backgroundColor: isLoading ? 'gray' : 'hsl(23, 95%, 55%)' }}
            >
              {isLoading ? "Creando..." : "Crear Usuario"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
