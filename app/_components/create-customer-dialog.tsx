"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@trm/_components/ui/button";
import { Input } from "@trm/_components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@trm/_components/ui/dialog";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@trm/_components/ui/form";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@trm/_components/ui/select";
import { useEffect } from "react";
import { getCustomers } from "@trm/_api/customers";
import { useGetCustomers } from "@trm/_hooks/use-get-customers";

// Define el esquema de validación para el formulario
const formSchema = z.object({
  name: z.string().min(2, {
    message: "El nombre de la empresa debe ser de al menos 2 caracteres.",
  }),
  details: z.object({
    mission: z.string().min(10, {
      message: "La misión debe ser de al menos 10 caracteres.",
    }),
    vision: z.string().min(10, {
      message: "La visión debe ser de al menos 10 caracteres.",
    }),
    companyValues: z.string(),
    history: z.string(),
    goals: z.string(),
    fiscalData: z.string(),
    digitalContract: z.string(),
  }),
  info: z.object({
    logo: z.string(),
    direction: z.string(),
    coordinates: z.string(),
    finalCost: z.string(),
    paymentPeriod: z.string(),
    contractPlan: z.string(),
    status: z.string(),
  }),
});

export function CreateCustomerDialog() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      details: {
        mission: "",
        vision: "",
        companyValues: "",
        history: "",
        goals: "",
        fiscalData: "",
        digitalContract: "",
      },
      info: {
        logo: "",
        direction: "",
        coordinates: "",
        finalCost: "",
        paymentPeriod: "",
        contractPlan: "",
        status: "",
      },
    },
  });

  const { customers, setCustomers } = useGetCustomers();

  // Maneja la presentación de errores del formulario
  const { errors } = form.formState;

  // Función para manejar la presentación de errores
  function getErrorMessage(fieldName: string) {
    return errors[fieldName as keyof typeof errors]?.message;
  }

  // Función para manejar el envío del formulario
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    // Convierte el costo final a un número
    values.info.finalCost = Number(values.info.finalCost);
    // Convierte el estado a un booleano
    values.info.status = values.info.status === "active";

    // Envía los datos del formulario al endpoint con un try catch
    try {
      const response = await fetch("http://localhost:8080/customers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        // La respuesta es un error HTTP, intenta leer el cuerpo de la respuesta
        const errorText = await response.text();
        // Lanza un error con el cuerpo de la respuesta
        throw new Error(errorText);
      }

      // Cierra el diálogo al enviar el formulario
      console.log("Cliente creado con éxito", values);
      form.reset();
      // Actualizar la lista de clientes después de crear uno nuevo con la API
      const newCustomers = await getCustomers();
      setCustomers(newCustomers);
    } catch (error) {
      console.error((error as Error).message);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Crear Cliente</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>Crear Cliente</DialogTitle>
          <DialogDescription>Agrega un nuevo cliente</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Primera columna */}
            <div className="grid grid-cols-1 gap-y-4 sm:grid-cols-2 md:grid-cols-3 sm:gap-x-4 pl-5 pr-5 h-[500px] overflow-y-auto">
              {/* Campo de formulario para el logo */}
              <FormField
                control={form.control}
                name="info.logo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Logo</FormLabel>
                    <FormControl>
                      <Input
                        className="text-sidebar-foreground placeholder:text-sidebar-foreground"
                        placeholder="Ingrese la URL del logo"
                        {...field}
                      />
                    </FormControl>
                    {/* Muestra el mensaje de error si existe */}
                    <FormMessage>{getErrorMessage("info.logo")}</FormMessage>
                  </FormItem>
                )}
              />
              {/* Campo de formulario para el nombre */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cliente</FormLabel>
                    <FormControl>
                      <Input
                        className="text-sidebar-foreground placeholder:text-sidebar-foreground"
                        placeholder="Ingrese el nombre del cliente"
                        {...field}
                      />
                    </FormControl>
                    {/* Muestra el mensaje de error si existe */}
                    <FormMessage>{getErrorMessage("name")}</FormMessage>
                  </FormItem>
                )}
              />
              {/* Campo de formulario para la misión */}
              <FormField
                control={form.control}
                name="details.mission"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Misión</FormLabel>
                    <FormControl>
                      <Input
                        className="text-sidebar-foreground placeholder:text-sidebar-foreground"
                        placeholder="Ingrese la misión del cliente"
                        {...field}
                      />
                    </FormControl>
                    {/* Muestra el mensaje de error si existe */}
                    <FormMessage>
                      {getErrorMessage("details.mission")}
                    </FormMessage>
                  </FormItem>
                )}
              />
              {/* Campo de formulario para la visión */}
              <FormField
                control={form.control}
                name="details.vision"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Visión</FormLabel>
                    <FormControl>
                      <Input
                        className="text-sidebar-foreground placeholder:text-sidebar-foreground"
                        placeholder="Ingrese la visión del cliente"
                        {...field}
                      />
                    </FormControl>
                    {/* Muestra el mensaje de error si existe */}
                    <FormMessage>
                      {getErrorMessage("details.vision")}
                    </FormMessage>
                  </FormItem>
                )}
              />
              {/* Campo de formulario para los valores de la empresa */}
              <FormField
                control={form.control}
                name="details.companyValues"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Valores de la Empresa</FormLabel>
                    <FormControl>
                      <Input
                        className="text-sidebar-foreground placeholder:text-sidebar-foreground"
                        placeholder="Ingrese los valores de la empresa"
                        {...field}
                      />
                    </FormControl>
                    {/* Muestra el mensaje de error si existe */}
                    <FormMessage>
                      {getErrorMessage("details.companyValues")}
                    </FormMessage>
                  </FormItem>
                )}
              />
              {/* Campo de formulario para la historia */}
              <FormField
                control={form.control}
                name="details.history"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Historia</FormLabel>
                    <FormControl>
                      <Input
                        className="text-sidebar-foreground placeholder:text-sidebar-foreground"
                        placeholder="Ingrese la historia del cliente"
                        {...field}
                      />
                    </FormControl>
                    {/* Muestra el mensaje de error si existe */}
                    <FormMessage>
                      {getErrorMessage("details.history")}
                    </FormMessage>
                  </FormItem>
                )}
              />
              {/* Campo de formulario para las metas */}
              <FormField
                control={form.control}
                name="details.goals"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Metas</FormLabel>
                    <FormControl>
                      <Input
                        className="text-sidebar-foreground placeholder:text-sidebar-foreground"
                        placeholder="Ingrese las metas del cliente"
                        {...field}
                      />
                    </FormControl>
                    {/* Muestra el mensaje de error si existe */}
                    <FormMessage>
                      {getErrorMessage("details.goals")}
                    </FormMessage>
                  </FormItem>
                )}
              />
              {/* Campo de formulario para los datos fiscales */}
              <FormField
                control={form.control}
                name="details.fiscalData"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Datos Fiscales</FormLabel>
                    <FormControl>
                      <Input
                        className="text-sidebar-foreground placeholder:text-sidebar-foreground"
                        placeholder="Ingrese los datos fiscales del cliente"
                        {...field}
                      />
                    </FormControl>
                    {/* Muestra el mensaje de error si existe */}
                    <FormMessage>
                      {getErrorMessage("details.fiscalData")}
                    </FormMessage>
                  </FormItem>
                )}
              />
              {/* Campo de formulario para el contrato digital */}
              <FormField
                control={form.control}
                name="details.digitalContract"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contrato Digital</FormLabel>
                    <FormControl>
                      <Input
                        className="text-sidebar-foreground placeholder:text-sidebar-foreground"
                        placeholder="Ingrese el contrato digital del cliente"
                        {...field}
                      />
                    </FormControl>
                    {/* Muestra el mensaje de error si existe */}
                    <FormMessage>
                      {getErrorMessage("details.digitalContract")}
                    </FormMessage>
                  </FormItem>
                )}
              />
              {/* Campo de formulario para la dirección */}
              <FormField
                control={form.control}
                name="info.direction"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Dirección</FormLabel>
                    <FormControl>
                      <Input
                        className="text-sidebar-foreground placeholder:text-sidebar-foreground"
                        placeholder="Ingrese la dirección del cliente"
                        {...field}
                      />
                    </FormControl>
                    {/* Muestra el mensaje de error si existe */}
                    <FormMessage>
                      {getErrorMessage("info.direction")}
                    </FormMessage>
                  </FormItem>
                )}
              />
              {/* Campo de formulario para las coordenadas */}
              <FormField
                control={form.control}
                name="info.coordinates"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Coordenadas</FormLabel>
                    <FormControl>
                      <Input
                        className="text-sidebar-foreground placeholder:text-sidebar-foreground"
                        placeholder="Ingrese las coordenadas del cliente"
                        {...field}
                      />
                    </FormControl>
                    {/* Muestra el mensaje de error si existe */}
                    <FormMessage>
                      {getErrorMessage("info.coordinates")}
                    </FormMessage>
                  </FormItem>
                )}
              />
              {/* Campo de formulario para el costo final */}
              <FormField
                control={form.control}
                name="info.finalCost"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Costo Final</FormLabel>
                    <FormControl>
                      <Input
                        className="text-sidebar-foreground placeholder:text-sidebar-foreground"
                        type="number"
                        placeholder="Ingrese el costo final"
                        {...field}
                      />
                    </FormControl>
                    {/* Muestra el mensaje de error si existe */}
                    <FormMessage>
                      {getErrorMessage("info.finalCost")}
                    </FormMessage>
                  </FormItem>
                )}
              />
              {/* Campo de formulario para el período de pago */}
              <FormField
                control={form.control}
                name="info.paymentPeriod"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Período de Pago</FormLabel>
                    <FormControl>
                      <Input
                        className="text-sidebar-foreground placeholder:text-sidebar-foreground"
                        type="datetime-local"
                        placeholder="Ingrese el período de pago"
                        {...field}
                      />
                    </FormControl>
                    {/* Muestra el mensaje de error si existe */}
                    <FormMessage>
                      {getErrorMessage("info.paymentPeriod")}
                    </FormMessage>
                  </FormItem>
                )}
              />
              {/* Campo de formulario para el plan de contrato */}
              <FormField
                control={form.control}
                name="info.contractPlan"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Plan de Contrato</FormLabel>
                    <FormControl>
                      <Input
                        className="text-sidebar-foreground placeholder:text-sidebar-foreground"
                        placeholder="Ingrese el plan de contrato"
                        {...field}
                      />
                    </FormControl>
                    {/* Muestra el mensaje de error si existe */}
                    <FormMessage>
                      {getErrorMessage("info.contractPlan")}
                    </FormMessage>
                  </FormItem>
                )}
              />
              {/* Campo de formulario para el estado */}
              <FormField
                control={form.control}
                name="info.status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Estado</FormLabel>
                    <FormControl>
                      <Select onValueChange={field.onChange}>
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Estado" />
                        </SelectTrigger>
                        <SelectContent {...field}>
                          <SelectGroup>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="inactive">Inactive</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    {/* Muestra el mensaje de error si existe */}
                    <FormMessage>{getErrorMessage("info.status")}</FormMessage>
                  </FormItem>
                )}
              />
            </div>
            {/* Botón de submit */}
            <div className="text-center">
              <Button type="submit">Crear</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
