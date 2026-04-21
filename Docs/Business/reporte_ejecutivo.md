# Tramet Dashboard - Reporte Ejecutivo del Sistema

Este documento constituye la memoria oficial de las capacidades empresariales y la arquitectura del sistema Tramet Dashboard Frontend. Está diseñado para el propietario del proyecto y ofrece una visión completa del estado tecnológico del activo.

---

## 🏛 Arquitectura y Características del Sistema

El software está construido sobre una base sólida y escalable, diseñada para operar en entornos empresariales. A continuación, se detallan las características principales que definen el nivel profesional de la aplicación:

### 1. Navegación Ágil y Contextual
El acceso a la información es inmediato. La selección del entorno de trabajo (Sitio, Departamento y Área) se realiza de forma fluida desde una barra de control superior, permitiendo que el usuario cambie su enfoque en segundos sin perder el hilo de su trabajo.

### 2. Memoria del Sistema (Estado Persistente)
El sistema cuenta con una arquitectura de "espejo" entre la memoria de la aplicación y el navegador.
- **Ventaja Empresarial**: La sesión del usuario sobrevive a recargas de página (F5) y cierres temporales. El sistema "recuerda" exactamente en qué área estaba trabajando el usuario, garantizando una experiencia ininterrumpida.

### 3. Centralización de Datos (Cerebro de Comunicaciones)
El núcleo de la aplicación utiliza un cliente de API altamente especializado ([`app/_lib/api/api-client.ts`](../../app/_lib/api/api-client.ts)).
- **Ventaja Empresarial**: Toda la comunicación con el servidor está unificada, lo que significa que el sistema puede reaccionar inteligentemente ante cualquier caída de red o error de datos, notificando al usuario de forma elegante sin que el sistema colapse.

### 4. Seguridad de Grado Administrativo
La protección de rutas está gestionada por un **Middleware** integrado de Next.js.
- **Ventaja Empresarial**: El sistema intercepta y verifica los niveles de acceso (Administrador de Sistema, Administrador de Cliente, Usuario) a nivel del servidor, antes de enviar información confidencial al navegador, blindando los datos sensibles de accesos no autorizados.

---

## 🌐 Control de Código y Organización (GitHub)

Para garantizar la propiedad total y la transparencia, el código está resguardado en la organización oficial de **GitHub** de Tramet, dividida en los siguientes pilares:

- **[tramet-dashboard-frontend](https://github.com/Tramet/tramet-dashboard-frontend)**: Es el repositorio oficial de la interfaz visual que el usuario utiliza y donde radica toda esta documentación.
- **[backendmain](https://github.com/Tramet/backendmain)**: Es el repositorio del servidor activo (Backend) desarrollado en Java. Es el motor principal de datos.
- **[Backend](https://github.com/Tramet/Backend)**: Es una versión antigua del servidor que ha sido **deprecada**. Se mantiene exclusivamente como repositorio de consulta o referencia histórica.

---

## 📦 Ecosistema Completo (Front + Back)

El ecosistema de Tramet funciona como una dupla sincronizada:

- **Frontend (Interfaz Visual)**: Este repositorio contiene el 100% de la arquitectura visual. Toda la documentación técnica detallada para esta parte se encuentra estructurada para desarrolladores en la carpeta `/Docs/Technical`.
- **Backend (Servidor Java)**: El código fuente del motor del sistema (Spring Boot) así como su documentación técnica específica conforman el segundo pilar, los cuales serán canalizados directamente por tu equipo de infraestructura (Jair) en formato de paquete fuente (.zip).

---

## 💎 Valor de la Inversión

La actual arquitectura del software asegura que Tramet posea un **activo tecnológico de alto valor**:
- **Alta Escalabilidad**: El sistema está diseñado modularmente para añadir cientos de nuevos sitios, departamentos o tipos de operaciones sin comprometer el rendimiento general.
- **Control y Propiedad**: La existencia de la nueva documentación profesional asegura que la empresa no dependa de un solo programador; cualquier equipo experto puede tomar el control y escalar la herramienta de inmediato.
- **Preparado para el Futuro**: Al estar construido con el estándar de la industria (Next.js 14), el ciclo de vida del software está garantizado para los próximos años sin necesidad de reescrituras profundas.

---

## 🔑 Acceso al Sistema (Credenciales de Prueba)
- **Admin Total**: `admin` / `admin123`
- **Admin Cliente**: `cliente1` / `cliente123`
- **Usuario Estándar**: `usuario1` / `usuario123`
