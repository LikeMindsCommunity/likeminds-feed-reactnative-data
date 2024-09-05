pipeline {
    agent {label 'localMachine'}
    tools {nodejs "nodejs"}

    options {
        buildDiscarder logRotator(daysToKeepStr: '3', numToKeepStr: '10')
    }
    parameters {
        base64File 'file'
    }
    stages {

        stage('file upload'){
            steps{
                sh 'echo $file | base64 -d > config.txt'
                sh "ls"
            }
        }
        
        
        // stage('Install Dependencies') {
        //     steps {
        //         sh 'npm install'
        //     }
        // }

        // stage('Build') {
        //     steps {
        //         sh 'npm run build'
        //     }
        // }

        // stage('Package') {
        //     steps {
        //         sh 'npm pack'
        //     }
        // }

        // stage('Archive Package') {
        //     steps {
        //         archiveArtifacts artifacts: '*.tgz', fingerprint: true
        //     }
        // }
    }

}