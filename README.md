# E-commerce Frontend (Vue 3 + TypeScript)

Aplicación SPA para administrar productos, inventario, órdenes y usuarios, consumir reportes y ejecutar búsquedas avanzadas. Integra autenticación JWT contra el backend Spring Boot.

## Stack
- **Vue 3** + **TypeScript**
- **Vue Router**, **Pinia** (store)
- **PrimeVue** + **PrimeIcons** (UI)
- **Axios** (HTTP)

## Requisitos
- **Node.js 18 LTS o 20 LTS**
- **npm** (o pnpm/yarn si prefieres)

## Configuración de API
Actualmente la base de la API está fija en `http://localhost:9091/api`:
- `src/services/AuthService.ts` usa `http://localhost:9091/api/auth/`
- `src/services/ProductService.ts` crea `apiClient` con `baseURL: 'http://localhost:9091/api'`

> Si tu backend corre en otra URL/puerto, **ajusta esas rutas** o crea un proxy en `vue.config.js`.

## Instalación y ejecución
```bash
# 1) Instalar dependencias
npm install

# 2) Desarrollo con HMR
npm run serve

# 3) Build producción
npm run build

# 4) Linter
npm run lint

