all: build

build:
	@docker-compose up -d --build --remove-orphans

up:
	@docker-compose up -d --remove-orphans

down:
	@docker-compose down


delete:
	@docker-compose down --volumes

clean:
	@docker system prune -a


.PHONY:	all up down delete clean
