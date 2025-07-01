# Étape 1 : Build de l'application Angular dans le dossier /front
FROM node:20 AS build

# Définir le répertoire de travail dans /app/front
WORKDIR /app

# Copier uniquement le dossier front
COPY front/ ./front/

# Aller dans le répertoire front pour installer les dépendances
WORKDIR /app/front

# Installer Angular CLI et les dépendances
RUN npm install -g @angular/cli && npm install

# Build de l'application
RUN ng build --configuration=production


# Étape 2 : Servir avec NGINX
FROM nginx:alpine


# Copier le build Angular depuis /app/front/dist vers NGINX
COPY --from=build /app/front/dist/front/browser /usr/share/nginx/html

# Si vous avez une conf NGINX pour gérer le routing Angular :
# COPY nginx.conf /etc/nginx/nginx.conf


RUN ls -al /usr/share/nginx/html



# Exposer le port
EXPOSE 80

# Commande de démarrage
CMD ["nginx", "-g", "daemon off;"]
