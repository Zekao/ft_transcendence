# ft_transcendence
ft_transcendence is the last 42 comon core projet.

He have for objectif to learn web development on typescript language with different
framework like nestjs for backend or vuejs for frontend. This project has realize
in team of 3 to 5 people


## Installation

### With Homebrew 🍺:
```bash
brew install docker-compose
sudo docker–compose --version
```
### With Apt 📦:
```bash
sudo apt update
sudo apt upgrade
sudo apt install curl
sudo curl -L "https://github.com/docker/compose/releases/download/1.29.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
sudo docker–compose --version
```


## Usage

First start or don't rebuild containers images
```bash
make
```
Rebuild containers images
```bash
make re
```
Stop running containers
```bash
make down
```
Show currents containers's status
```bash
make ps
```
Show logs of a containers (api by default)
```bash
make logs C=<container name>
```
Remove containers's images
```
make rm
```

## License
[MIT](https://choosealicense.com/licenses/mit/)

## Project status

🚧 In progress
