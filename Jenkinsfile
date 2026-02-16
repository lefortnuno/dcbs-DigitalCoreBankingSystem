node {

    stage('Clone') {   
        checkout scm 
        bat 'dir'
    }

    stage('Test Frontend') {  
        dir('frontend') {
            bat 'npm install' 
            bat 'npm test'
        }
    }

    stage('Test Service') {  
        dir('user-service') {
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
    
    stage('Cleanup') {   
        bat 'docker rm -f kafka 2>nul || exit 0' 
        bat 'docker rm -f zookeeper 2>nul || exit 0' 
        bat 'docker rm -f discovery-doc 2>nul || exit 0' 
        bat 'docker rm -f config-doc 2>nul || exit 0' 
        bat 'docker rm -f user-doc 2>nul || exit 0' 
        bat 'docker rm -f account-doc 2>nul || exit 0' 
        bat 'docker rm -f transaction-doc 2>nul || exit 0' 
        bat 'docker rm -f gateway-doc 2>nul || exit 0' 
        bat 'docker rm -f react-doc 2>nul || exit 0' 
    }

    stage('Build Image') {  
        bat 'docker compose build --no-cache'
    }

    stage('Run Containers') {      
        bat 'docker compose up -d'
        sleep 10
    }

    stage('Post-Running') {   
        bat 'docker ps'  
        sleep 5

        bat 'curl http://localhost:7001/actuator/health'
        
        // Exécution du script PowerShell
        bat 'powershell -ExecutionPolicy Bypass -File ddos.ps1'
    }
 
}
