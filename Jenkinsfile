node('swarm'){
	stage 'Build & Create new image'
	checkout scm
	sh 'npm install'
	sh 'bower install'
	sh 'grunt build'
	sh 'docker build -t datagraft/grafterizer:latest .'

	stage 'Start containers & Test'
	//Download docker-compose and start containers
	sh 'curl -sSL https://raw.githubusercontent.com/datagraft/datagraft-platform/master/docker-compose.yml > docker-compose.yml'

	try {
		sh 'docker-compose pull'		
		sh 'docker-compose -p datagraft up -d --force-recreate'
		//Download and run startup script
		sh 'curl -sSL https://raw.githubusercontent.com/datagraft/datagraft-platform/master/startup.sh > startup.sh'
		sh 'bash startup.sh oauth2clientid oauth2clientsecret http://localhost:55557/oauth/callback'
		//Here is where tests are run, for now errors for static code analysis are swallowed
		sh 'grunt check || exit 0'
		sh 'DATAGRAFT_HOST=127.0.0.1 grunt selenium'
	} finally {
		// Tear down docker containers and remove volumes-- errors in this case will be swallowed
		sh 'docker-compose -p datagraft down -v || exit 0'
		sh 'rm -f docker-compose.yml'
		sh 'rm -f startup.sh'
	}

	stage 'Publish'
	prompt 'Do you want to publish image on hub?'
	//Temporary tag to deploy to non production dockerhub
	sh 'docker tag datagraft/grafterizer:latest anavalery/grafterizer'
	sh 'docker push anavalery/grafterizer'
	//Remove created image
	sh 'docker rmi datagraft/grafterizer:latest'
}
