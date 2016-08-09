node('swarm'){
	stage 'Build & Create new image'
	checkout scm
	sh 'npm install'
	sh 'bower install'
	sh 'grunt build'
	sh 'docker build -t datagraft/grafterizer:latest .'

	stage 'Start containers & Test'
	//Download docker-compose and start containers
	sh 'curl https://raw.githubusercontent.com/datagraft/datagraft-platform/master/docker-compose.yml > docker-compose.yml'
	sh 'docker-compose -p datagraft up -d --force-recreate'

	try {
		//Download and run startup script
		sh 'curl -s https://raw.githubusercontent.com/datagraft/datagraft-platform/master/startup.sh |bash -s oauth2clientid oauth2clientsecret http://localhost:8082/oauth/callback'
		//Here is where tests are run, for now errors for static code analysis are swallowed
		sh 'grunt check || exit 0'
		sh 'grunt selenium'
	} finally {
		// Tear down docker containers and remove volumes-- errors in this case will be swallowed
		sh 'docker-compose -p datagraft down -v || exit 0'
	}

	stage 'Deploy'
	//Temporary tag to deploy to non production dockerhub
	sh 'docker tag datagraft/grafterizer:latest anavalery/grafterizer'
	sh 'docker push anavalery/grafterizer'
}
