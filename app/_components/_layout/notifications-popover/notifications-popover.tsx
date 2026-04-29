"use client";

import { Button } from "@trm/_components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@trm/_components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@trm/_components/ui/tabs";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@trm/_components/ui/popover";
import { Bell, Inbox } from "lucide-react";
import { useState } from "react";
import { ScrollArea, ScrollBar } from "@trm/_components/ui/scroll-area";

function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
      <Inbox className="h-10 w-10 mb-2 opacity-40" />
      <p className="text-sm">{message}</p>
    </div>
  );
}

export function NotificationsPopover() {
  const [tab, setTab] = useState("alerts");

  const onTabChange = (value: string): void => {
    setTab(value);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="rounded-full p-0 bg-accent hover:bg-muted text-accent-foreground hover:text-muted-foreground border-0 outline-none">
          <Bell className="w-6 h-6" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto">
        <Tabs
          defaultValue="account"
          className="max-w-[300px] 2xl:max-w-[400px] text-wrap overflow-x-auto"
          value={tab}
          onValueChange={onTabChange}>
          <ScrollArea className="w-full py-4">
            <TabsList className="flex gap-0">
              <TabsTrigger value="alerts">Alertas</TabsTrigger>
              <TabsTrigger value="authorizations">Autorizaciones</TabsTrigger>
              <TabsTrigger value="announcements">Avisos</TabsTrigger>
              <TabsTrigger value="calendar">Calendario</TabsTrigger>
              <TabsTrigger value="personalMonitoring">
                Seguimiento personal
              </TabsTrigger>
              <ScrollBar orientation="horizontal" />
            </TabsList>
          </ScrollArea>

          <TabsContent value="alerts">
            <Card>
              <CardHeader>
                <CardTitle>Alertas</CardTitle>
                <CardDescription>
                  Notificaciones importantes que requieren tu atención.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <EmptyState message="No hay alertas pendientes" />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="authorizations">
            <Card>
              <CardHeader>
                <CardTitle>Autorizaciones</CardTitle>
                <CardDescription>
                  Solicitudes pendientes de aprobación o revisión.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <EmptyState message="No hay autorizaciones pendientes" />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="announcements">
            <Card>
              <CardHeader>
                <CardTitle>Avisos</CardTitle>
                <CardDescription>
                  Comunicados y avisos generales del sistema.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <EmptyState message="No hay avisos nuevos" />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="calendar">
            <Card>
              <CardHeader>
                <CardTitle>Calendario</CardTitle>
                <CardDescription>
                  Eventos y fechas importantes próximas.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <EmptyState message="No hay eventos programados" />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="personalMonitoring">
            <Card>
              <CardHeader>
                <CardTitle>Seguimiento personal</CardTitle>
                <CardDescription>
                  Tareas y actividades asignadas a tu perfil.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <EmptyState message="No hay actividades de seguimiento" />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </PopoverContent>
    </Popover>
  );
}
