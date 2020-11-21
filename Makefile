SERVER:="docker"

.PHONY: deploy

deploy:
	docker-compose build
	docker push docker.lan.cgt.name:5000/osiris:latest
	scp docker-compose.yml $(SERVER):osiris-stack.yml
	ssh $(SERVER) 'docker pull docker.lan.cgt.name:5000/osiris:latest && docker stack deploy --compose-file osiris-stack.yml osiris'
