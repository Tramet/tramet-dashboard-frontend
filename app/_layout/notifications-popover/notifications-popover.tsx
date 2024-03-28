"use client";

import { Button } from "@trm/_components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
import { Bell } from "lucide-react";
import { useState } from "react";
import { ScrollArea, ScrollBar } from "@trm/_components/ui/scroll-area";
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
          className="rounded-full p-0 bg-foreground hover:bg-muted text-background hover:text-muted-foreground border-0 outline-none">
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
                  Make changes to your account here. Click save when you're
                  done.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2"></CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="authorizations">
            <Card>
              <CardHeader>
                <CardTitle>Autorizaciones</CardTitle>
                <CardDescription>
                  Change your password here. After saving, you'll be logged out.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2"></CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="announcements">
            <Card>
              <CardHeader>
                <CardTitle>Avisos</CardTitle>
                <CardDescription>
                  Change your password here. After saving, you'll be logged out.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2"></CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="calendar">
            <Card>
              <CardHeader>
                <CardTitle>Calendario</CardTitle>
                <CardDescription>
                  Change your password here. After saving, you'll be logged out.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2"></CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="personalMonitoring">
            <Card>
              <CardHeader>
                <CardTitle>Seguimiento personal</CardTitle>
                <CardDescription>
                  Change your password here. After saving, you'll be logged out.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2"></CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </PopoverContent>
    </Popover>
  );
}
