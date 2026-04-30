# Configuración Técnica de Kerygma

Este documento contiene las instrucciones para desplegar y configurar los servicios externos.

## 1. Despliegue en GitHub Pages
He configurado un **GitHub Action** en `.github/workflows/deploy.yml` para automatizar el proceso.

**Pasos en GitHub:**
1. Ve a **Settings** > **Pages**.
2. En **Build and deployment** > **Source**, selecciona **GitHub Actions**.
3. Haz un `push` a `main` y GitHub construirá y publicará la web automáticamente.

## 2. Configuración de OAuth (Login con GitHub)
Para que el login funcione:
1. Crea una **OAuth App** en GitHub (Settings > Developer settings).
2. **Homepage URL**: URL de tu app en Firebase/GitHub.
3. **Authorization callback URL**: `https://<TU-PROYECTO>.firebaseapp.com/__/auth/handler`
4. Copia el **Client ID** y **Secret** a tu consola de Firebase (Authentication > Sign-in method > GitHub).

## 3. Variables de Entorno
Asegúrate de configurar las variables de `.env.example` en tu entorno de despliegue si usas funciones del lado del servidor (como las de Gemini si no son directas).
