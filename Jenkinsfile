pipeline {
    agent any
    tools {nodejs "nodejs"}

    options {
        buildDiscarder logRotator(daysToKeepStr: '7', numToKeepStr: '1')
    }

    parameters {
        stashedFile 'feed_js_data_pacakge'
    }

    stages {

        stage('file upload'){
            steps{
                unstash 'feed_js_data_pacakge'
                sh 'mv feed_js_data_pacakge $feed_js_data_pacakge_FILENAME'
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

    post {
        always {
            cleanWs()
        }
    }

}