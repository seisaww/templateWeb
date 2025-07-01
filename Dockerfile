# Étape 1 : Servir avec NGINX
FROM nginx:alpine

COPY /web/index.html /usr/share/nginx/html

# Exposer le port
EXPOSE 80

# Commande de démarrage
CMD ["nginx", "-g", "daemon off;"]
