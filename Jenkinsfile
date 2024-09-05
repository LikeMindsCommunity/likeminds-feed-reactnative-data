pipeline {
    agent {label 'localMachine'}
    tools {nodejs "nodejs"}

    options {
        buildDiscarder logRotator(daysToKeepStr: '3', numToKeepStr: '1')
    }
    parameters {
        stashedFile 'FILE'
    }
    stages {

        stage('file upload'){
            steps{
                unstash 'FILE'
                sh 'mv FILE $FILE_FILENAME'
                sh 'ls'
            }
        }
        
        
        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }

        stage('Build') {
            steps {
                sh 'npm run build'
            }
        }

        stage('Package') {
            steps {
                sh 'npm pack'
            }
        }

        stage('Archive Package') {
            steps {
                archiveArtifacts artifacts: '*.tgz', fingerprint: true
            }
        }
    }

}