@echo off
chcp 65001 > nul

echo ========================================
echo  Lancement de l'Application D.C.B.S
echo ========================================


echo.
echo ========================================
echo  Lancement de Docker (Kafka, Zookeeper...)
echo ========================================

docker compose down -v
docker compose build --no-cache
docker compose up -d

echo Attente du démarrage de Kafka...
timeout /t 15 /nobreak > nul

echo Création des topics Kafka...

docker exec kafka kafka-topics --create --if-not-exists --topic user.created --bootstrap-server localhost:9092 --partitions 1 --replication-factor 1
timeout /t 5 /nobreak > nul

docker exec kafka kafka-topics --create --if-not-exists --topic transaction.event --bootstrap-server localhost:9092 --partitions 1 --replication-factor 1
timeout /t 5 /nobreak > nul

docker exec kafka kafka-topics --create --if-not-exists --topic transaction.acc.response --bootstrap-server localhost:9092 --partitions 1 --replication-factor 1

echo Kafka prêt.
echo.


echo ========================================
echo  Lancement des micro-services Spring Boot
echo ========================================  

set SERVICES=config-service ms-discovery user-service account-service transaction-service ms-gateway  
 
for %%s in (%SERVICES%) do (
    echo.
    echo Démarrage de %%s...
    
    if exist "%%s\pom.xml" (
        start "%%s" cmd /c "cd /d "%%s" && mvn spring-boot:run > "..\%%s.log" 2>&1"
        timeout /t 8 /nobreak > nul
        echo ✓ %%s démarré
    ) else (
        echo ✗ %%s : pom.xml introuvable
    )
)

echo.
echo ========================================
echo  Tous les services sont en cours de démarrage
echo ========================================
echo.
echo Fichiers de logs créés :
dir *.log /b
echo.


echo ========================================
echo  Lancement du frontend React
echo ========================================
if exist "frontend\package.json" (
    start "frontend" cmd /c "cd /d frontend && npm run dev"
    echo ✓ Frontend en cours d'exécution (Fenêtre séparée)
) else (
    echo ✗ Aucun frontend trouvé dans /frontend
)

echo.
echo Logs frontend :
if exist "..\frontend.log" (
    echo frontend.log
) else (
    echo Aucun fichier frontend.log trouvé
)
echo.


echo ========================================
echo Tous les services sont en cours d'exécution
echo Fermez les fenêtres pour arrêter.
echo ========================================
echo.
pause >nul

echo Arrêt de tous les micro-services...
taskkill /F /T /IM mvn.cmd >nul 2>&1
taskkill /F /T /IM java.exe >nul 2>&1
taskkill /F /T /IM node.exe >nul 2>&1

echo Tous les services sont arrêtés.
timeout /t 2 >nul
  
