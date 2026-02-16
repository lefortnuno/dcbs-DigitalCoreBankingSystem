# dcbs-DigitalCoreBankingSystem

# sm-lefort

Digital CoreBanking System - Light version by Trofel (Lefort)

“Le projet intègre une approche DevOps avec Jenkins pour la CI/CD, des tests unitaires automatisés, des services conteneurisés avec Docker et un déploiement orchestré via Kubernetes.”

# kafka

docker compose down -v
docker compose build --no-cache
docker compose up -d

## creation topic

docker exec -it kafka kafka-topics --create --topic user.created --bootstrap-server localhost:9092 --partitions 1 --replication-factor 1

docker exec -it kafka kafka-topics --create --topic transaction.event --bootstrap-server localhost:9092 --partitions 1 --replication-factor 1

### creation auto des topic

spring.kafka.admin.auto-create=true

### liste des topics

docker exec -it kafka /bin/bash

kafka-topics --bootstrap-server localhost:9092 --list

kafka-topics --delete --topic user.created --bootstrap-server localhost:9092

#### histo des user creer

kafka-console-consumer --bootstrap-server localhost:9092 --topic user.created --from-beginning

kafka-console-consumer --bootstrap-server localhost:9092 --topic chat.created --from-beginning

# KEYCLOCK

docker run -d --name keycloak -p 192.168.1.72:8080:8080 -e KEYCLOAK_ADMIN=admin -e KEYCLOAK_ADMIN_PASSWORD=admin quay.io/keycloak/keycloak:24.0 start-dev

docker rm -f keycloak

docker run -d --name keycloak -p 8080:8080 -e KEYCLOAK_ADMIN=admin -e KEYCLOAK_ADMIN_PASSWORD=admin quay.io/keycloak/keycloak:24.0 start-dev

# Conteneurisation frontend

docker build -t frontend-app .

## lancement frontend dans le conteneur

docker run --name frontend -p 5173:5173 frontend-app

# Test AUto dans FORNT

npm install -D vitest @testing-library/react @testing-library/jest-dom jsdom

voir vite.config.ts; tsconfig.json; package.json; setup.ts; et App.test.tsx

npm test
ou
npx vitest

# Test Auto du Back

## User-service

creer des testes dans test/Test.java puis

mvn clean test

# Pre-build les jar

cd ms-discovery
mvn clean install -DskipTests

cd ../config-service
mvn clean install -DskipTests

cd ../ms-gateway
mvn clean install -DskipTests

cd ../user-service
mvn clean install -DskipTests

cd ../account-service
mvn clean install -DskipTests

cd ../transaction-service
mvn clean install -DskipTests

cd ..

docker compose down -v
docker compose build --no-cache
docker compose up -d

## commande 1️⃣ Supprimer le conteneur existant

docker rm -f discovery-doc
docker rm -f config-doc
docker rm -f user-doc
docker rm -f chat-doc
docker rm -f ai-doc
docker rm -f gateway-doc
docker rm -f jenkins-doc

## 2️⃣ Supprimer tous les conteneurs inutilisés

docker ps -a # liste tous les conteneurs
docker rm -f $(docker ps -aq) # supprime tous les conteneurs

## logs

docker logs user-doc

# teste ddos
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
