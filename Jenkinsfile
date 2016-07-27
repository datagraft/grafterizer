node('linux'){
	stage 'Build & Create new image'
	git url: 'https://github.com/datagraft/grafterizer.git'
	sh 'npm install'
	sh 'bower install'
	sh 'grunt build'
	sh 'docker build -t datagraft/grafterizer:latest .'

	stage 'Start containers & Test'
	sh 'docker-compose up -d --force-recreate'

	try {
		sh 'bash startup.sh'
		//Here is where tests are run, for now errors for static code analysis are swallowed
		sh 'grunt check || exit 0'
		sh 'grunt selenium'
	} finally {
		// Tear down docker containers -- errors in this case will be swallowed
		sh 'docker-compose down -v || exit 0'
	}

	stage 'Deploy'
	//Temporary tag to deploy to non production dockerhub
	sh 'docker tag datagraft/grafterizer:latest anavalery/grafterizer'
	sh 'docker push anavalery/grafterizer'
}
