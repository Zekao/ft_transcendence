# ft_transcendence
ft_transcendence is the last 42 common core projet.


With this project, we will learn web developement in typescript with different frameworks
such as nestjs for the backend and vuejs for the frontend.
This project has to be made in team between 3 and 5 students.

# Table of contents
1. [Installation](#installation)
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

⚠️ Please change CLIENT_ID and CLIENT_SECRET with your own credentials in the .env file ⚠️
```env
CLIENT_ID= YOUR UID
CLIENT_SECRET= YOUR TOKEN
CALLBACK_URL= WEBSITE WHERE YOU WANT TO HOST
```

Start containers with --build flag
```bash
make
```
Start containers without --build flag
```bash
make up
```
Show logs of containers (you can choose one in particular)
```bash
docker-compose logs <container name>
```
Stop running containers
```bash
make down
```
Stop running containers and delete volume
```bash
make delete
```
Remove containers's images
```
make clean
```

## Authors

#### Gaëtan Marchal
42 login: [gamarcha](https://profile.intra.42.fr/users/gamarcha)
contact: gamarcha@student.42.fr

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

Done ✅

[![emaugale's 42 ft_transcendence Score](https://badge42.vercel.app/api/v2/cl180j5x4000609mclltm1fox/project/2621106)](https://github.com/Zekao)
