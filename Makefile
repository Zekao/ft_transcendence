# **************************************************************************** #
#                                                                              #
#                                                         :::      ::::::::    #
#    Makefile                                           :+:      :+:    :+:    #
#                                                     +:+ +:+         +:+      #
#    By: robriard <robriard@student.42.fr>          +#+  +:+       +#+         #
#                                                 +#+#+#+#+#+   +#+            #
#    Created: 2021/06/08 11:41:07 by robriard          #+#    #+#              #
#    Updated: 2022/05/24 00:54:52 by robriard         ###   ########.fr        #
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

C=api

up:
	@mkdir -p ${PWD}/backend/database/data
	@docker-compose -f docker-compose.yaml up -d

all: up

re: rm up

down:
	@docker-compose -f docker-compose.yaml down

ps:
	@docker-compose -f docker-compose.yaml ps

rm: down
	@docker volume prune -f
	@docker system prune -af

logs:
	@docker logs ${C}

.PHONY:	all up down re ps rm logs
