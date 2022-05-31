# ft_transcendence
ft_transcendence is the last 42 comon core projet.

He have for objectif to learn web development on typescript language with different
framework like nestjs for backend or vuejs for frontend. This project has realize
in team of 3 to 5 people

# Table of contents
1. [Installation](#installation)
    1 [Homebrew🍺](#homebrew)
    2 [Apt📦](#apt)
2. [Usage](#usage)
3. [Authors](#authors)
4. [License](#license)
5. [Project Status](#project-status)

## Installation

### With Homebrew 🍺: <a name='homebrew'></a>
```bash
brew install docker-compose
sudo docker–compose --version
```
### With Apt 📦: <a name='apt'></a>
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
Execute in front a container
```bash
make exec C=<container name>
```
Remove containers's images
```
make rm
```

## Authors

#### Lucas Sehairi
42 login: [lusehair](https://profile.intra.42.fr/users/lusehair)
contact: lusehair@student.42.fr

####  Elidjah Maugalem
42 login: [emaugale](https://profile.intra.42.fr/users/emaugale)
contact: emaugale@student.42.fr

#### Naofel Bentayeb
42 login: [nabentay](https://profile.intra.42.fr/users/nabentay)
contact: nabentay@student.42.fr

#### Romain Briard
42 login: [robriard](https://profile.intra.42.fr/users/robriard)
contact: robriard@student.42.fr


## License
[MIT](https://choosealicense.com/licenses/mit/)

## Project status

🚧 In progress
