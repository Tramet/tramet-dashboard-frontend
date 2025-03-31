"use client";

import React, { useState } from "react";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle, DialogTrigger, DialogFooter } from "@trm/_components/ui/dialog";
import { Button } from "@trm/_components/ui/button";
import { Label } from "@trm/_components/ui/label";
import { Input } from "@trm/_components/ui/input";
import { toast } from "sonner";
import { useAuth } from "@trm/_lib/auth/auth-context";
import { createUser } from "@trm/_api/admin/users";

export const CreateUserDialog = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    user: "",
    password: ""
  });
  // Obtener el token de autenticación
  const { token, isAuthenticated } = useAuth();

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

    try {
      // Validar que los campos no estén vacíos
      if (!formData.user || !formData.password) {
        toast.error("Por favor, completa todos los campos");
        setIsLoading(false);
        return;
      }

      // Verificar que hay un token válido
      if (!token || !isAuthenticated) {
        throw new Error("No hay un token de autenticación válido");
      }

      // Utilizar la función de API para crear el usuario
      await createUser(token, formData);

      // Éxito
      toast.success("Usuario creado con éxito");
      setFormData({ user: "", password: "" });
      setIsOpen(false); // Cerrar el diálogo
      
      // Disparar evento para refrescar la tabla
      window.dispatchEvent(new CustomEvent("refreshUsersTable"));
    } catch (error) {
      console.error("Error al crear usuario:", error);
      toast.error(error instanceof Error ? error.message : "Error al crear el usuario");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="btn-primary-gradient">+ Agregar Usuario</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Agregar Usuario</DialogTitle>
        <DialogDescription>Ingresa la información para crear un nuevo usuario.</DialogDescription>
        
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="user">Nombre de Usuario</Label>
            <Input 
              id="user" 
              name="user"
              value={formData.user}
              onChange={handleChange}
              placeholder="usuario123" 
              className="text-sidebar-foreground" 
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">Contraseña</Label>
            <Input 
              id="password" 
              name="password"
              type="password" 
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••" 
              className="text-sidebar-foreground" 
              required
            />
          </div>
          
          <DialogFooter className="mt-6">
            <DialogClose asChild>
              <Button type="button" variant="outline">Cancelar</Button>
            </DialogClose>
            <Button 
              type="submit" 
              disabled={isLoading}
              className={isLoading ? "" : "btn-primary-gradient"}
            >
              {isLoading ? "Creando..." : "Crear Usuario"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
