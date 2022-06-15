# **************************************************************************** #
#                                                                              #
#                                                         :::      ::::::::    #
#    Makefile                                           :+:      :+:    :+:    #
#                                                     +:+ +:+         +:+      #
#    By: unknow <unknow@student.42.fr>              +#+  +:+       +#+         #
#                                                 +#+#+#+#+#+   +#+            #
#    Created: 2021/06/08 11:41:07 by robriard          #+#    #+#              #
#    Updated: 2022/06/13 20:59:10 by unknow           ###   ########.fr        #
#                                                                              #
# **************************************************************************** #


# Define colors ################################################################
BOLD   = \e[01m
ITALIC = \e[03m
UNDER  = \e[04m
RED    = \e[31m
GREEN  = \e[32m
LGRAY  = \e[37m
GRAY   = \e[90m
RESET  = \e[0m
UP     = \e[A

# rules ################################################################

DIR=.

C=api

up:
	@docker-compose -f docker-compose.yaml up -d

show-logs:
	@docker-compose -f docker-compose.yaml up

re-show-logs: rm show-logs

all: up

re: rm up

devb:
	@docker-compose up -d database
	@npm i --prefix ./backend/api -f
	@npm run start:dev --prefix ./backend/api --legacy-peer-deps

devf:
	@npm i --prefix ./frontend
	@npm run dev --prefix ./frontend

down:
	@docker-compose -f docker-compose.yaml down

ps:
	@docker-compose -f docker-compose.yaml ps

rm: down
	@docker system prune -af
	@docker volume prune -f

logs:
	@docker logs ${C}

exec:
	@docker exec -it ${C} '/bin/sh'

.PHONY:	all up show-logs re-show-logs down re ps rm logs
