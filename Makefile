SERVER:="docker"

.PHONY: deploy e2e dev

deploy:
	docker-compose build
	docker push docker.lan.cgt.name:5000/osiris:latest
	scp docker-compose.yml $(SERVER):osiris-stack.yml
	ssh $(SERVER) 'docker pull docker.lan.cgt.name:5000/osiris:latest && docker stack deploy --compose-file osiris-stack.yml --with-registry-auth osiris'

e2e:
	docker-compose -f docker-compose.e2e.yml up --build --abort-on-container-exit --exit-code-from cypress

dev:
	CYPRESS_baseUrl="http://localhost:3000" npm run cypress:open