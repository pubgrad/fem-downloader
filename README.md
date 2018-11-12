# Frontend Masters video downloader

Based on Nodejs and Puppeteer, you can launch it from the command line providing your credentials and it will download the course of your choice.

## Installation

From the project root type:

```
yarn install
```

Note that Puppeteer installation will download a version of Chromium compatible with your os.

## Usage

From the command line type:

```
node fem-downloader.js --username <your-username> --password <your-password> --course <course1-slug> [course2-slug] [course3-slug]
```

1.  Puppeteer will open a browser window and will log in to Frontend Masters using the provided credentials.
1.  After logging in, it will go to the main page of the course you selected and begin downloading its lessons one by one.
1.  The course will be downloaded into the project root, in its own folder, and each lesson will have its slug name.
1.  Each lesson group will have its separate folder and each lesson will be prepended with a number reflecting its order.
1.  You can download more than one course by appending their slug after the first one you provide

## Notes

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

MIT
