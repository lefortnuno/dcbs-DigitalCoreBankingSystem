node {

    stage('Clone') {   
        checkout scm 
        bat 'dir'
    }

    stage('Test Service') {  
        dir('user-service') {
            bat 'mvn clean test'
        } 
        dir('account-service') {
            bat 'mvn clean test'
        } 
        dir('transaction-service') {
            bat 'mvn clean test'
        }
    }

    stage('Build Service') {  
        dir('config-service') {
            bat 'mvn clean install -DskipTests'
        }
        dir('ms-discovery') {
            bat 'mvn clean install -DskipTests'
        }
        dir('user-service') {
            bat 'mvn clean install -DskipTests'
        }
        dir('account-service') {
            bat 'mvn clean install -DskipTests'
        }
        dir('transaction-service') {
            bat 'mvn clean install -DskipTests'
        }
        dir('ms-gateway') {
            bat 'mvn clean install -DskipTests'
        }
    }
    
    stage('Test Frontend') {  
        dir('frontend') {
            bat 'npm install'  
            bat 'npx vitest run'
        }
    }

    stage('Rebuild & Deploy Containers') {   
        bat 'docker compose down -v'
        bat 'docker compose up -d --build'
        sleep 40
    }
    
    stage('Post Running') {   
        bat 'docker ps'  
        
        bat 'curl http://localhost:8761/actuator/health'
        bat 'curl http://localhost:9999/actuator/health'
        bat 'curl http://localhost:8085/actuator/health'
    }
    
    stage('Check User') { 
        bat 'curl http://localhost:7001/actuator/health'
        bat 'powershell -ExecutionPolicy Bypass -File user.ps1'
        bat 'curl http://localhost:7001/users'
    }
    
    stage('Check Account') { 
        bat 'curl http://localhost:7002/actuator/health'
        bat 'curl http://localhost:7002/accounts'
    }

    stage('Check Frontend') {
        bat 'docker inspect -f "{{.State.Running}}" react-doc'
        retry(3) {
            sleep 5
            bat 'curl -f http://localhost:5173 || exit /b 1' 
        }
    }

    stage('DDOS Attack') {    
        sleep 5
        // Exécution du script PowerShell
        bat 'powershell -ExecutionPolicy Bypass -File ddos.ps1'
    }

    stage('Check Transaction') { 
        bat 'curl http://localhost:7003/actuator/health'
        bat 'curl http://localhost:7003/transactions'
    }

    stage('Owarii') {
            echo """
        ===================[ DCBS - DÉPLOIEMENT RÉUSSI ]===================  

            >>> PREREQUIS :
                - Démarrer le conteneur Keycloak pour activer l'authentification 

            >>> ACCÈS :
                - Frontend : http://localhost:5173
                - Service Discovery (Eureka) : http://localhost:8761
                - API Gateway : http://localhost:8085
 
        ================================================================="""
    }
    
}
