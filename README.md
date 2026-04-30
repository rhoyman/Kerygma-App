# Kerygma App - Configuración de GitHub y Firebase

## 1. Despliegue en GitHub Pages
He configurado un **GitHub Action** para que tu aplicación se despliegue automáticamente cada vez que hagas un push a la rama principal (`main` o `master`).

Para que funcione:
1. Ve a tu repositorio en GitHub.
2. Ve a **Settings** > **Pages**.
3. En **Build and deployment** > **Source**, selecciona **GitHub Actions**.
4. La próxima vez que subas cambios, se desplegará solo.

## 2. Configuración de OAuth (GitHub Login)
Para que el botón de "Acceder con GitHub" funcione, debes configurar una aplicación OAuth en GitHub:

1. Ve a **GitHub Settings** > **Developer settings** > **OAuth Apps**.
2. Haz clic en **New OAuth App**.
3. **Application Name**: Kerygma (o el que quieras).
4. **Homepage URL**: Pon la URL de tu proyecto en Firebase o la de GitHub Pages.
   - Ejemplo: `https://kerygmaapp-c2bee.firebaseapp.com`
5. **Authorization callback URL**: DEBES poner la URL de Firebase Auth.
   - URL: `https://kerygmaapp-c2bee.firebaseapp.com/__/auth/handler`
6. Copia el **Client ID** y el **Client Secret**.
7. Ve a tu **Firebase Console** > **Authentication** > **Sign-in method**.
8. Añade **GitHub** y pega allí el Client ID y Client Secret que copiaste de GitHub.

## 3. Error 404 en GitHub Pages
El error 404 suele ocurrir porque los navegadores buscan los archivos en la raíz en lugar de en la subcarpeta del repositorio.
- He actualizado `vite.config.ts` con `base: './'` para que use rutas relativas.
- He actualizado `index.html` para que apunte correctamente a los scripts.

Si sigues viendo el error, asegúrate de que el despliegue mediante GitHub Actions (punto 1) ha terminado correctamente.
