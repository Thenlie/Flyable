# Flyable

A NodeJS application intended to be run on a Raspberry Pi. This will query a flight park weather station and return a boolean based on if the current weather conditions are conducive to paragliding. The parameters for what is considered conducive are still a work in progress, so this should by no means be considered a source of truth. Rather, it will give a pilot a rough idea of the conditions, so they can continue with deeper research.

## Usage

Once you have your raspberry pi set up and connected to WiFi, you will need to install NodeJS. This can be done via `apt-get`. 

Next, you will want to clone this repository to the directory you would like the program to live in.
```
git clone git@github.com:Thenlie/Flyable.git
```
Now that the repository lives on the Raspberry Pi, you can run the program!
```
cd Flyable && node index.js
```

> **Note** The program was designed for and tested on a Raspberry Pi Zero W. While it may work with other devices as well, that is not gauranteed. 

## Questions?

If you have any questions about the project you can reach out to me via email or GitHub with the information below. 

>Email: leithen113@gmail.com 

>GitHub: [Thenlie](https://github.com/Thenlie)
