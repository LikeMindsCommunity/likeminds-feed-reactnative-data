pipeline {
    agent {label 'localMachine'}
    tools {nodejs "nodejs"}

    options {
        buildDiscarder logRotator(daysToKeepStr: '3', numToKeepStr: '10')
    }
    parameters {
    base64File name 'fileupload.tgz'
    }
    stages {

        stage('file upload'){
            steps{
                // echo "${fileupload.tgz}"
                echo "${fileupload.tgz}"
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