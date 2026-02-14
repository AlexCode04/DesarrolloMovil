# ConectaFácil - Administrador de Contactos PWA

App PWA para gestionar contactos. Los contactos se guardan automáticamente en el navegador.

##  Demo

**URL:** [[Contacto Facil](https://easycontacts-dev.netlify.app/)]

##  Instalar en Celular (Chrome)

1. Abre el link en Chrome de tu celular
2. Toca el menú (3 puntos) → **"Agregar a pantalla de inicio"** o **"Instalar app"**
3. Dale **"Instalar"**
4. Listo! Ya tienes la app en tu celular

##  Deploy en Netlify

1. Corre `npm run build`
2. Entra a [netlify.com](https://www.netlify.com/)
3. Arrastra la carpeta `dist` 
4. Copia el link que te da Netlify
5. Abre el link en tu celular e instala la app

##  Desarrollo Local

```bash
npm install
npm run dev
```

---

Desarrollado para el curso de Desarrollo Móvil

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
