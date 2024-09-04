pipeline {
    agent {label 'localMachine'}
    tools {nodejs "nodejs"}

    options {
        buildDiscarder logRotator(daysToKeepStr: '3', numToKeepStr: '10')
    }

    parameters {
        base64File description: 'node package', name: 'pkg'
    }

    stages {

        stage('file upload'){

            withFileParameter('pkg') { filePath ->
                        // Print the path to the uploaded file
                        echo "Uploaded file is available at: ${filePath}"

                        // List the file to verify it's there
                        sh "ls -l ${filePath}"

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