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
      
      // Disparar evento para actualizar la tabla
      window.dispatchEvent(new Event("refreshUsersTable"));
      
      // Reiniciar el formulario y cerrar el diálogo
      setFormData({ user: "", password: "" });
      setIsOpen(false);
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
        <Button 
          variant="default" 
          size="sm"
          className="text-xs sm:text-sm"
          style={{ backgroundColor: 'hsl(23, 95%, 55%)' }} // Color naranja corporativo
        >
          <span className="sm:inline">Crear Usuario</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogTitle>Crear Nuevo Usuario</DialogTitle>
        <DialogDescription>
          Ingresa la información del nuevo usuario. La contraseña que asignes será la inicial y el usuario podrá cambiarla después.
        </DialogDescription>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="user" className="text-right">
              Usuario
            </Label>
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
            <Label htmlFor="password" className="text-right">
              Contraseña
            </Label>
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
          <DialogFooter className="sm:justify-end">
            <DialogClose asChild>
              <Button type="button" variant="secondary">
                Cancelar
              </Button>
            </DialogClose>
            <Button 
              type="submit"
              disabled={isLoading}
              style={{ backgroundColor: isLoading ? 'gray' : 'hsl(23, 95%, 55%)' }} // Color naranja corporativo
            >
              {isLoading ? "Creando..." : "Crear Usuario"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
