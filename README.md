

# Summary

Welcome, this is the code I produced for the master's thesis. This project has 4 main parts The first part is the server, which is connected to a postresql database.
The second part is a notebook used at the beginning of the project to visualize the data and try some algorithms on a python notebook. The third part is an application of the warmup paper https://arxiv.org/pdf/1602.00602.pdf. This implementation takes the algorithm explained in the paper and bundles the R-impletation of the Changepoint project https://cran.r-project.org/web/packages/changepoint/changepoint.pdf. The last part is a scrit to test if there is a change in performance between 2 commits. I tested some curve comparison algorithms to see if they were similar or not. There is a script giving 2 commits as parameters that will do this comparison.

## Set up the database

To run this project and all the script i'm running on Linux Kernel: 5.7.12

Install Docker and Docker-compose for the database Postgresql
You can find the tutorial here:[https://docs.docker.com/compose/](https://docs.docker.com/compose/)

After that using the command bellow will build the docker image and you will have a Postgresql Database up and running
```
docker-compose up --build -d database
```

### Populating the database

After The database is up and running you can populate with  this backup from Stefan Marr [http://stefan-marr.de/tmp/rebenchdb-2020-05-05.sql.bz2](http://stefan-marr.de/tmp/rebenchdb-2020-05-05.sql.bz2)
After downloading this backup run this command to populate the db with the data of interest
```sh
pg_restore --exit-on-error --verbose -U postgres -h 0.0.0.0 -p 5432  -a --dbname=postgres rebenchdb-2020-05-05.sql
```

## Setup The API REST

Because the API is a standard node.js (Typescript) Project you only need to install the depencies

You will need node and npm on your computer [https://docs.npmjs.com/downloading-and-installing-node-js-and-npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)

At the root of the project
```sh
npm install && npm run dev
```
It normaly run all the SQL migration and the server is up and running for running the script that will fetch the data

## Setup the Python script

Each directory **compare** and **classify** need Python And R on your computer to run
For R you need this https://cran.r-project.org/web/packages/changepoint/changepoint.pdf package for the classify part of the project.
For the python side this project use Poetry as package manager [https://python-poetry.org/](https://python-poetry.org/)
Use this command when you want to use the script in each directory
```
poetry install
```
### Classify

Use this command to launch the script you will see the result in benchmarks directory with all the benchmarks classify in the name of the file **benchmarks/Bounce/Crystal/plot_4_flat.png** for example

```
poetry shell
python script.py
```

### Compare


Use this command to launch the script, you can also uncomment the code for each testing of algorithm and compare the result of each curve comparaison algorithm

```
poetry shell
python script.py
```

You can also compare two commit together and see if the results are worth looking

```
poetry shell
python compare.py c72cbd7d2dce09cb7e73e4c796109860be8f3951 1cb740046ed800e4de8bd6fc8a493cce7c5f154c
```
