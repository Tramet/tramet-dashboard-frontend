"use client";

import React, { useState, useCallback } from "react";
import { BsShieldLock } from "react-icons/bs";
import { ScrollArea } from "@trm/_components/ui/scroll-area";
import PermissionNodeComponent from "./PermissionNodeComponent";
import { PermissionNode, PermissionTreeProps, UserPermissions } from "./types";

const PermissionTree: React.FC<PermissionTreeProps> = ({ permissionTree, tempPermissions, onPermissionsChange }) => {
  // Estado para seguir los nodos expandidos
  const [expandedNodes, setExpandedNodes] = useState<string[]>([]);

  // Estado para rastrear selecciones actuales (para mostrar elementos filtrados)
  const [selectedSites, setSelectedSites] = useState<string[]>([]);
  const [selectedDepartments, setSelectedDepartments] = useState<string[]>([]);
  const [selectedAreas, setSelectedAreas] = useState<string[]>([]);
  const [selectedModules, setSelectedModules] = useState<string[]>([]);

  // Manejar la expansión/contracción de nodos
  const toggleNodeExpansion = useCallback(
    (nodeId: string, forceExpand: boolean = false, forceCollapse: boolean = false, nodesToCollapse: string[] = []) => {
      setExpandedNodes((prev) => {
        // Si tenemos una lista de nodos para contraer, los contraemos todos de una vez
        if (nodesToCollapse.length > 0) {
          return prev.filter((id) => !nodesToCollapse.includes(id));
        }

        if (forceCollapse) {
          // Si forzamos contraer, eliminamos el nodo de la lista de expandidos
          return prev.filter((id) => id !== nodeId);
        } else if (prev.includes(nodeId) && !forceExpand) {
          // Si el nodo ya está expandido y no estamos forzando la expansión, lo contraemos
          return prev.filter((id) => id !== nodeId);
        } else if (!prev.includes(nodeId)) {
          // Si el nodo no está expandido, lo expandimos
          return [...prev, nodeId];
        }
        return prev;
      });
    },
    []
  );

  // Función para manejar el cambio en un checkbox
  const handleCheckboxChange = useCallback(
    (node: PermissionNode, checked: boolean) => {
      // Actualizar el tipo adecuado de permiso según el tipo de nodo
      const permissionType = `${node.type}s` as keyof UserPermissions;

      const newPermissions = { ...tempPermissions };

      if (checked) {
        // Agregar el permiso si no existe
        if (!newPermissions[permissionType].includes(node.id)) {
          newPermissions[permissionType] = [...newPermissions[permissionType], node.id];
        }

        // Actualizar las listas de selección para filtrar los nodos hijos
        if (node.type === "site") {
          setSelectedSites((prevSites) => [...prevSites, node.id]);
        } else if (node.type === "department") {
          setSelectedDepartments((prevDepts) => [...prevDepts, node.id]);
        } else if (node.type === "area") {
          setSelectedAreas((prevAreas) => [...prevAreas, node.id]);
        } else if (node.type === "module") {
          setSelectedModules((prevModules) => [...prevModules, node.id]);
        }
      } else {
        // Remover el permiso
        newPermissions[permissionType] = newPermissions[permissionType].filter((id) => id !== node.id);

        // Actualizar las listas de selección
        if (node.type === "site") {
          setSelectedSites((prevSites) => prevSites.filter((id) => id !== node.id));

          // Si desmarcamos un sitio, debemos quitar también todos sus departamentos, áreas, etc.
          // Primero, identificar todos los departamentos de este sitio
          const deptsToRemove = node.children.map((dept) => dept.id);

          // Remover esos departamentos
          newPermissions.departments = newPermissions.departments.filter((id) => !deptsToRemove.includes(id));

          // Actualizar la lista de departamentos seleccionados
          setSelectedDepartments((prevDepts) => prevDepts.filter((id) => !deptsToRemove.includes(id)));

          // Para cada departamento, identificar y remover sus áreas
          let areasToRemove: string[] = [];
          node.children.forEach((dept) => {
            areasToRemove = [...areasToRemove, ...dept.children.map((area) => area.id)];
          });

          // Remover esas áreas
          newPermissions.areas = newPermissions.areas.filter((id) => !areasToRemove.includes(id));

          // Actualizar la lista de áreas seleccionadas
          setSelectedAreas((prevAreas) => prevAreas.filter((id) => !areasToRemove.includes(id)));

          // No podemos saber exactamente qué módulos y pantallas eliminar directamente,
          // ya que la relación no es clara en los datos actuales, pero en un sistema real
          // deberíamos remover también los módulos y pantallas asociados
        } else if (node.type === "department") {
          setSelectedDepartments((prevDepts) => prevDepts.filter((id) => id !== node.id));

          // Si desmarcamos un departamento, quitamos sus áreas
          const areasToRemove = node.children.map((area) => area.id);

          // Remover áreas
          newPermissions.areas = newPermissions.areas.filter((id) => !areasToRemove.includes(id));

          // Actualizar lista de áreas seleccionadas
          setSelectedAreas((prevAreas) => prevAreas.filter((id) => !areasToRemove.includes(id)));
        } else if (node.type === "area") {
          setSelectedAreas((prevAreas) => prevAreas.filter((id) => id !== node.id));

          // En un sistema real, aquí eliminaríamos los módulos y pantallas asociados a esta área
        } else if (node.type === "module") {
          setSelectedModules((prevModules) => prevModules.filter((id) => id !== node.id));

          // Si desmarcamos un módulo, quitamos sus pantallas
          const screensToRemove = node.children.map((screen) => screen.id);

          // Remover pantallas
          newPermissions.screens = newPermissions.screens.filter((id) => !screensToRemove.includes(id));
        }
      }

      // Notificar cambios en los permisos
      onPermissionsChange(newPermissions);
    },
    [tempPermissions, onPermissionsChange]
  );

  return (
    <ScrollArea className="h-[400px] rounded-md border border-border p-1">
      <div className="space-y-0.5 p-2">
        <div className="mb-3 flex items-center">
          <BsShieldLock className="mr-2 text-primary" />
          <h3 className="text-base font-medium">Estructura de Permisos</h3>
        </div>

        {permissionTree.length > 0 ? (
          permissionTree.map((node) => (
            <PermissionNodeComponent
              key={node.id}
              node={node}
              level={0}
              expandedNodes={expandedNodes}
              tempPermissions={tempPermissions}
              toggleNodeExpansion={toggleNodeExpansion}
              handleCheckboxChange={handleCheckboxChange}
              parentIsChecked={true}
            />
          ))
        ) : (
          <div className="text-center py-4 text-muted-foreground">
            <p>No hay datos de permisos disponibles.</p>
          </div>
        )}
      </div>
    </ScrollArea>
  );
};

export default PermissionTree;
