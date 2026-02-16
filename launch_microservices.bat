@echo off
chcp 65001 > nul

echo ========================================
echo  Lancement de l'Application D.C.B.S
echo ========================================


echo.
echo ========================================
echo  Lancement de Docker (Kafka, Zookeeper...)
echo ========================================

@REM docker compose down -v
@REM docker compose build --no-cache
@REM docker compose up -d

@REM echo Attente du démarrage de Kafka...
@REM timeout /t 15 /nobreak > nul

@REM echo Création des topics Kafka...

@REM docker exec kafka kafka-topics --create --if-not-exists --topic user.created --bootstrap-server localhost:9092 --partitions 1 --replication-factor 1
@REM timeout /t 5 /nobreak > nul

@REM docker exec kafka kafka-topics --create --if-not-exists --topic transaction.event --bootstrap-server localhost:9092 --partitions 1 --replication-factor 1
@REM timeout /t 5 /nobreak > nul

@REM docker exec kafka kafka-topics --create --if-not-exists --topic transaction.acc.response --bootstrap-server localhost:9092 --partitions 1 --replication-factor 1

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


@REM echo ========================================
@REM echo  Lancement du frontend React
@REM echo ========================================
@REM if exist "frontend\package.json" (
@REM     start "frontend" cmd /c "cd /d frontend && npm run dev"
@REM     echo ✓ Frontend en cours d'exécution (Fenêtre séparée)
@REM ) else (
@REM     echo ✗ Aucun frontend trouvé dans /frontend
@REM )

@REM echo.
@REM echo Logs frontend :
@REM if exist "..\frontend.log" (
@REM     echo frontend.log
@REM ) else (
@REM     echo Aucun fichier frontend.log trouvé
@REM )
@REM echo.


echo ========================================
echo Tous les services sont en cours d'exécution
echo Fermez les fenêtres pour arrêter.
echo ========================================
echo.
pause >nul

echo Arrêt de tous les micro-services...
taskkill /F /T /IM mvn.cmd >nul 2>&1
taskkill /F /T /IM java.exe >nul 2>&1
@REM taskkill /F /T /IM node.exe >nul 2>&1

echo Tous les services sont arrêtés.
timeout /t 2 >nul
  
