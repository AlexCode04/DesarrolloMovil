# MissionQuest

Aplicacion movil/web hecha con Ionic + React + Capacitor.

## Que se hizo

- Sistema de autenticacion con Firebase (registro, login y logout).
- Misiones con puntaje y progreso:
- Mision 1: tomar captura/foto.
- Mision 2: recorrer distancia con GPS.
- Mision 3: modo zen con temporizador y vibracion.
- Ranking basico de usuarios por puntos.
- Soporte de scroll en pantallas principales (Home y Results).
- Configuracion de Firebase usando variables de entorno con `import.meta.env`.
- Permisos Android para camara y ubicacion.

## Variables de entorno

Crear archivo `.env` en la raiz usando como base `.env.example`.

## Como correr el proyecto

### 1. Instalar dependencias

```bash
npm install
```

### 2. Ejecutar en web (desarrollo)

```bash
npm run dev
```

### 3. Build de produccion

```bash
npm run build
```

### 4. Ejecutar en Android (dispositivo o emulador)

```bash
npm run build
npx cap copy android
npx cap run android
```

## Notas

- Si cambias variables de entorno, vuelve a correr `npm run build` antes de `npx cap run android`.
- Si no aparecen permisos (camara/GPS), revisa permisos de la app en Ajustes del telefono.

DRIVE CON LAS FOTO DE PRUEBAS: https://drive.google.com/drive/folders/1-hlWXrc5g8Mh5SA9fIMkmi_VzNlJ-Ftq?usp=sharing
