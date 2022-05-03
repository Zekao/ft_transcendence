# **************************************************************************** #
#                                                                              #
#                                                         :::      ::::::::    #
#    Makefile                                           :+:      :+:    :+:    #
#                                                     +:+ +:+         +:+      #
#    By: robriard <robriard@student.42.fr>          +#+  +:+       +#+         #
#                                                 +#+#+#+#+#+   +#+            #
#    Created: 2021/06/08 11:41:07 by robriard          #+#    #+#              #
#    Updated: 2022/04/29 10:07:18 by robriard         ###   ########.fr        #
#                                                                              #
# **************************************************************************** #

VOLUMES = /home/robriard/data

up:
	@docker-compose -f backend/docker-compose.yaml up -d

all: up

re: rm up
	#@docker-compose -f backend/docker-compose.yaml up --build -d

down:
	@docker-compose -f backend/docker-compose.yaml down

ps:
	@docker-compose -f backend/docker-compose.yaml ps

rm: down
	@docker system prune -a

.PHONY:	all up down re ps rm
