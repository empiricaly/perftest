This repository contains a load performance test for Empirica v1.

It is composed of:

- server: an minimal Empirica app streamlined for easier automation
- client: a [puppeteer](https://github.com/GoogleChrome/puppeteer) script to
  automate X player bots running through the experiment concurrently.

The client is quite basic, and just opens X headless Chrome windows in
puppeteer, and sequencialy goes between the windows to move the player bot
forward in the game steps. It cannot handle complex situations, but can
currently move onto the next game once their current game ends or is cancelled.

To run the server, install Docker and Docker Compose on the machine you wish to
test. Then copy the `docker-compose.yml` file at the root of this repo to that
server and run `docker-compose up`.

To run the client, use the following command where you replace the IP
(`123.123.123.123` in this example) with your server's IP or domain name, and
the number of player bots (`12` in this example) you wish to test with.

```sh
sudo docker run --rm empiricaly/perftest-client 123.123.123.123 12
```

The client has not been tested with more than 100 player botss. Since the
automation is ran sequencially (player by player), running with many more player
bots might become unsustainable, and you might wish to run multiple instances of
this command (on the same or different server, depending on load).

Also, each player costs between 50 and 150MB of RAM (Chrome...), so you'll need
up to 16GB of RAM to run 100 players for example.

Finally, there is 1 extra optional arg you can pass to the command: the time to
wait in seconds between player bots playing, devided by all player. By default
this value is of 20s, which means if we have 10 players, we will wait 2s between
each player bot submnitting their round. This delay allows for the game to not
go too fast. Each round should last more or less 20s. But this is only if the
players are sequencially playing the same game, which might not be the case, if
for example you have 100 players playing 10 games concurrently. Although, if you
have 100 player bots, each player bot should play within 200ms (more or less,
there's definitely latency), so the 10 games should be more or less in sync.

UPDATE: to run in parralel, you can run the docker-conpose.yml file in the
/client dir. For example:

```sh
export SERVER_ADDR=123.123.123.123
sudo -E docker-compose up --scale app=9
```

Will run 9 times the client script, each script is configured (by default) to
have 11 players (99 total, usually nice to be one manual player testing it at
the same time). This does alleviate some of the latency.

### Experiment notes

Server: z1d.large 2 cores 16GB Client: t3a.xlarge 4 cores 16GB

#### Setup machine:

AMI: Ubuntu 18
https://www.digitalocean.com/community/tutorials/how-to-install-and-use-docker-on-ubuntu-18-04
sudo apt update sudo apt install apt-transport-https ca-certificates curl
software-properties-common curl -fsSL
https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add - sudo
add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu
bionic stable" sudo apt update sudo apt install docker-ce sudo systemctl status
docker

https://www.digitalocean.com/community/tutorials/how-to-install-docker-compose-on-ubuntu-18-04
sudo curl -L
https://github.com/docker/compose/releases/download/1.21.2/docker-compose-`uname
-s`-`uname -m` -o /usr/local/bin/docker-compose sudo chmod +x
/usr/local/bin/docker-compose docker-compose --version
