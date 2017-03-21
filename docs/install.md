# SPD server install

## Install all dependencies and tools

### Git

https://git-scm.com/downloads

Linux:

    sudo apt install git

### Node.js

https://nodejs.org/en/

Recommended install script:
https://github.com/mklement0/n-install

Linux:

    curl -L https://git.io/n-install | bash
    n stable

### Oracle client

Download the basic client, and the SDK.
http://www.oracle.com/technetwork/topics/linuxx86-64soft-092277.html

Install the libaio package

    sudo apt-get install libaio1



Addtional install instructions.
https://github.com/oracle/node-oracledb/blob/master/INSTALL.md

On Linux you may need to set some environment variables:

    export LD_LIBRARY_PATH="~/bin/instantclient_12_1:$LD_LIBRARY_PAT"
    export OCI_LIB_DIR="~/bin/instantclient_12_1"
    export OCI_INC_DIR="~/bin/instantclient_12_1/sdk/include"

...adjusting the path as needed.

### Phantom JS

http://phantomjs.org/download.html

### Install pdftk

    sudo apt install pdftk

## Install the SPD server

Use your Git GUI of your choice to download the repository.

https://github.com/kshowalter/SPD_server

or

    git clone https://github.com/kshowalter/SPD_server.git

In the SPD server directory run:

    sudo npm install


## Run SPD server

In the SPD server directory run:

    sudo npm run serve_production

Note: This runs a command stored in package.json. This command runs a script to setup some environment variables for the oracle module, then starts the [PM2](https://github.com/Unitech/pm2) process manager. PM2 runs a daemon to manage the nodejs server, and can be accessed with the pm2 command. Example commands below.

List active processes (should only be one: 0 )

    sudo pm2 list

Show parameters for process 0

    sudo pm2 show 0

Show log for system 0 (normal command-line output)

    sudo pm2 logs 0
