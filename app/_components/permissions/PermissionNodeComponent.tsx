"use client";

import React from "react";
import { Checkbox } from "@trm/_components/ui/checkbox";
import {
  BsChevronDown,
  BsChevronRight,
  BsBuilding,
  BsWindowStack,
  BsCardList,
  BsGrid1X2,
  BsDisplay,
} from "react-icons/bs";
import { PermissionNode, PermissionNodeComponentProps, UserPermissions } from "./types";

// Componente para renderizar un nodo de permisos
const PermissionNodeComponent: React.FC<PermissionNodeComponentProps> = React.memo(
  ({
    node,
    level,
    expandedNodes,
    tempPermissions,
    toggleNodeExpansion,
    handleCheckboxChange,
    parentIsChecked = true,
  }) => {
    const hasChildren = node.children && node.children.length > 0;
    const isExpanded = expandedNodes.includes(node.id);
    const isChecked = node.selectable && tempPermissions[`${node.type}s` as keyof UserPermissions]?.includes(node.id);

    // Determinar si este nodo está habilitado basándose en si su padre está seleccionado
    const isEnabled = parentIsChecked;

    // Determinar el icono para cada tipo de nodo
    const getNodeIcon = () => {
      switch (node.type) {
        case "site":
          return <BsWindowStack className={`mr-2 ${isEnabled ? "text-blue-500" : "text-blue-300"}`} />;
        case "department":
          return <BsBuilding className={`mr-2 ${isEnabled ? "text-green-500" : "text-green-300"}`} />;
        case "area":
          return <BsCardList className={`mr-2 ${isEnabled ? "text-amber-500" : "text-amber-300"}`} />;
        case "module":
          // Si no es seleccionable, es un nodo agrupador
          if (!node.selectable)
            return <BsGrid1X2 className={`mr-2 ${isEnabled ? "text-purple-500" : "text-purple-300"}`} />;
          return <BsGrid1X2 className={`mr-2 ${isEnabled ? "text-purple-500" : "text-purple-300"}`} />;
        case "screen":
          return <BsDisplay className={`mr-2 ${isEnabled ? "text-red-500" : "text-red-300"}`} />;
        default:
          return null;
      }
    };

    // Color de fondo para nodos seleccionados o deshabilitados
    const getBgColor = () => {
      if (!isEnabled) {
        return "bg-muted/20 cursor-not-allowed";
      }
      if (isChecked) {
        return "bg-primary/10 dark:bg-primary/20";
      }
      return "hover:bg-accent/50";
    };

    // Memoizar la función collectNodesToCollapse para evitar recreaciones innecesarias
    const collectNodesToCollapse = React.useCallback((nodeToCollapse: PermissionNode, nodesToRemove: string[] = []) => {
      // Añadir el nodo actual a la lista para contraer
      nodesToRemove.push(nodeToCollapse.id);

      // Si tiene hijos, procesarlos también
      if (nodeToCollapse.children && nodeToCollapse.children.length > 0) {
        nodeToCollapse.children.forEach((child) => collectNodesToCollapse(child, nodesToRemove));
      }

      return nodesToRemove;
    }, []);

    // Memoizar el handleCheckboxChange para este nodo específico
    const handleCheck = React.useCallback(
      (checked: boolean) => {
        // No permitir cambios si el nodo no está habilitado
        if (!isEnabled) {
          return;
        }

        // Si desmarcamos un checkbox, primero nos aseguramos de contraer todos sus hijos
        if (!checked && hasChildren) {
          const nodesToRemove = collectNodesToCollapse(node);
          toggleNodeExpansion(node.id, false, true, nodesToRemove);
        } else if (checked && hasChildren) {
          // Si marcamos el checkbox, expandimos el nodo
          toggleNodeExpansion(node.id, true);
        }

        // Luego manejamos el cambio en los permisos
        handleCheckboxChange(node, !!checked);
      },
      [node, hasChildren, collectNodesToCollapse, toggleNodeExpansion, handleCheckboxChange, isEnabled]
    );

    // Memoizar el handleRowClick
    const handleRowClick = React.useCallback(
      (e: React.MouseEvent) => {
        // No permitir expansión si el nodo no está habilitado
        if (!isEnabled) {
          return;
        }

        // Si hacemos clic en la fila (pero no en el checkbox directamente),
        // expandimos/contraemos si hay hijos, pero solo si el elemento no tiene checkbox o
        // si estamos haciendo clic en una parte diferente al checkbox
        if (hasChildren && !(e.target as HTMLElement).closest(".checkbox-container")) {
          toggleNodeExpansion(node.id);
        }
      },
      [hasChildren, node.id, toggleNodeExpansion, isEnabled]
    );

    return (
      <div className="mb-0.5">
        <div
          onClick={handleRowClick}
          className={`flex items-center p-1.5 rounded-sm ${getBgColor()} transition-colors select-none ${
            isEnabled ? "cursor-pointer" : "cursor-not-allowed"
          }`}
          style={{ paddingLeft: `${level * 16 + 8}px` }}>
          <div className="flex items-center mr-2">
            {hasChildren ? (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  // Solo permitir la expansión si el nodo está habilitado
                  if (isEnabled) {
                    toggleNodeExpansion(node.id);
                  }
                }}
                disabled={!isEnabled}
                className={`mr-1 ${
                  isEnabled ? "text-muted-foreground hover:text-foreground" : "text-muted-foreground/40"
                } transition-colors`}>
                {isExpanded ? <BsChevronDown size={14} /> : <BsChevronRight size={14} />}
              </button>
            ) : (
              <div className="w-[14px] mr-1" />
            )}
          </div>

          {node.selectable && (
            <div className="checkbox-container">
              <Checkbox
                id={`checkbox-${node.id}`}
                checked={isChecked}
                onCheckedChange={handleCheck}
                disabled={!isEnabled}
                className={`mr-2 ${!isEnabled ? "opacity-50" : ""}`}
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          )}

          <label
            htmlFor={node.selectable && isEnabled ? `checkbox-${node.id}` : undefined}
            className={`flex items-center text-sm font-medium flex-grow truncate ${
              isEnabled ? "cursor-pointer" : "cursor-not-allowed text-muted-foreground"
            }`}
            onClick={(e) => e.stopPropagation()}>
            {getNodeIcon()}
            <span className="truncate">{node.name}</span>
          </label>
        </div>

        {hasChildren && isExpanded && (
          <div className="ml-2 border-l-2 border-border dark:border-muted pl-2 mt-0.5 mb-0.5">
            {node.children.map((childNode) => (
              <PermissionNodeComponent
                key={childNode.id}
                node={childNode}
                level={level + 1}
                expandedNodes={expandedNodes}
                tempPermissions={tempPermissions}
                toggleNodeExpansion={toggleNodeExpansion}
                handleCheckboxChange={handleCheckboxChange}
                parentIsChecked={isChecked} // Pasar el estado de este nodo como el estado del padre para el hijo
              />
            ))}
          </div>
        )}
      </div>
    );
  }
);

// Asignar displayName para facilitar la depuración
PermissionNodeComponent.displayName = "PermissionNodeComponent";

export default PermissionNodeComponent;
