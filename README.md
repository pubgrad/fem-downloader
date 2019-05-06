# Frontend Masters video downloader

[![License][licence-badge]](#license)
[![Min NodeJs][node-badge]][node]
[![Dependencies][dependencies-badge]][dependencies-badge]

Based on Nodejs and Puppeteer, you can launch it from the command line providing your credentials and it will download the course of your choice.

## Installation

From the project root type:

```
yarn install
```

Note that Puppeteer installation will download a version of Chromium compatible with your os.

## Usage

Just run the following command:

```
node fem-downloader.js

? Please insert your username: ....
? Please insert your password: ....
? Please insert course slug: ....
? Launch Puppeteer in headless mode? (Y/n):
? Are the information correct? (Y/n):
```

Once the download starts you'll be shown a progress bar for the current lesson:

```
11:23:53: Downloading video: 8-removing-bad-links
 █████████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 21% | ETA: 56s | 876370/4080650
```

1.  If not in headless mode, Puppeteer will open a browser window and will log in to Frontend Masters using the provided credentials.
1.  After logging in, it will go to the main page of the course you selected and begin downloading its lessons one by one.
1.  The course will be downloaded into the project root, in its own folder, and each lesson will have its slug name.
1.  Each lesson group will have its separate folder and each lesson will be prepended with a number reflecting its order.

## Notes

06/05/2019 - Google ReCaptcha is not complaining anymore.
11/12/2018 - Google ReCaptcha is now preventing the login. Fair enough, it is their right to check user identity. Anyway, to bypass it with a quick and dirty solution I just disabled a timeout which crashed the whole app before you could even log in. So, long story short: the first time you log in you should manually complete the ReCaptcha procedure and the you are good to go. I suggest you to schedule more than 1 course for each download session so to avoid to be presented every time with the ReCaptcha.
As of today, 07/25/2018, I have been using it to download a few short and long courses and it has been working smoothly.
Nevertheless, if you find any bugs or if you'd like to ask for new functionalities, feel free to open an issue and I will do my best to give you my support.
Lessons are downloaded serially so the speed of the whole process will heavily depend on your internet connection.

## Disclaimer

This is not intended as a means of software piracy.

You are not allowed to redistribute or publish any course you will download with this tool and therefore I **strongly discourage**
this kind of usage.

The sole purpose of this piece of software is to provide a way to Frontend Masters subscribers to download the courses they like more for **exclusive personal use**.

## License

```
Copyright (c) Cristian Gabbanini - https://github.com/cristian-gabbanini

MIT License

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
```

[licence-badge]: https://img.shields.io/badge/licence-MIT-yellowgreen.svg
[node-badge]: https://img.shields.io/badge/node-%3E%3D%208.0.0-brightgreen.svg
[node]: https://nodejs.org/en/
[dependencies-badge]: https://david-dm.org/cristian-gabbanini/fem-downloader.svg
