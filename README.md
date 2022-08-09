<div id="top"></div>

<!-- PROJECT SHIELDS -->
![Status][status-shield]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![GNU GPLv3.0][license-shield]][license-url]
[![LinkedIn][linkedin-shield]][linkedin-url]

<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/Nelliosis/Henrietta-bot">
    <img src="assets/logo.png" alt="Logo" width="500" height="" />
  </a>

<h3 align="center">Henrietta</h3>

  <p align="center">
    My personal, multi-functional Discord companion bot.
    <br />
    <a href="https://github.com/Nelliosis/Henrietta-bot/wiki"><strong>Explore the Documentation »</strong></a>
    <br />
    <br />
    <a href="https://github.com/Nelliosis/Henrietta-bot/wiki/Music-Commands">Music</a>
    ·
    <a href="https://github.com/Nelliosis/Henrietta-bot/wiki/Poll-&-Schedule#poll">Polls</a>
    ·
    <a href="https://github.com/Nelliosis/Henrietta-bot/wiki/Poll-&-Schedule#schedule">Schedule</a>
  </p>
</div>

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#make-it-your-own">Make It Your Own</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
  </ol>
</details>

<!-- ABOUT THE PROJECT -->
## About The Project

Henrietta is my personal discord companion bot. I initially made her as a submission to [CS50](https://www.edx.org/course/introduction-computer-science-harvardx-cs50x), an online course by Harvard University. I wanted something that can simplify my day-to-day activities.

She features three main functions:

* Play, queue, shuffle and search music
* do simple polls
* make scheduled events

These are the three main functions I find useful. I will update the bot as I see fit.

Henrietta is not, and never will be mean't for deployment at scale. I fully intend to self-host and keep it in my personal servers.

If you wish to set up the bot for self-hosting as well, follow the [Getting Started Section](#getting-started).

If you want to add more functionality to the bot, fork the bot and [make it your own](#make-it-your-own).

My only request is *__do not use Henrietta's logo or name__*, brand it as you wish.

<p align="right">(<a href="#top">back to top</a>)</p>

### Built With

Core functionality:

* [Node.js v18.7.0](https://nodejs.org/en/)
* [Discord.js v14.1.2](https://discord.js.org/#/)

Music player:

* [Play-dl v1.9.5](https://github.com/play-dl/play-dl)

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- GETTING STARTED -->
## Getting Started

In order to deploy and use Henrietta on your local machine, follow this section.

### Prerequisites

* __Node.js__

For Windows and Mac, install node.js from their [website.](https://nodejs.org/en/)

For Linux, consult [this page](https://nodejs.org/en/download/package-manager/) for installing on your individual distro.

For Homebrew, input this command into your terminal:

```
brew install node
```

If you've successfully installed node, you can check by entering this into the terminal or command prompt:

```
node -v
```

To which the output should be

```
v17.9.0
```

or similar output.

It is recommended to install node v18 or higher as this is the base with which Henrietta was built.

### Installation

In order to use Henrietta, follow these steps:

#### 1. Clone the repository

If you have Git installed, use this command

```bash
git clone https://github.com/Nelliosis/Henrietta-bot.git
```

If you do not have Git installed, go to the top of this page, look for the green button named `code` and press `Download ZIP`.

#### 2. Create a `config.json` file

If you cloned Henrietta by Git, cd into the bot's main directory and create a file named `config.json`

If you have downloaded Henrietta by ZIP. Unzip the file and go into the folder. Inside the folder, create a file called `config.json`

config.json should have the following template:

```
{
  token: 
}
```

>*__Critical Note:__* what you are about to store in config.json is your Bot's Token. __DO NOT__ reveal, show nor give the token to anyone else.
>
>__IF your token leaks, a malicious element could take control of your Bot and mess up your account.__

Save the file and proceed to the next step.

#### 3. Create a Discord Application and insert the Token into `config.json`

Follow the Discord.js guide on [this link.](https://discordjs.guide/preparations/setting-up-a-bot-application.html#creating-your-bot) to create your bot's application.

After copying the token, paste it into the `config.json` file. It should now appear as follows:

```
{
  token: long-string-of-numbers-and-letters-here
}
```

Save the file.

Invite the bot to your server by following this [Discord js Guide.](https://discordjs.guide/preparations/adding-your-bot-to-servers.html#bot-invite-links)

After that, move onto the next.

#### 4. Create a Spotify Application

Open the [Spotify Developer Dashboard](https://developer.spotify.com/dashboard/login) and login using your account.

>If you don't want to use your personal account, you can create a new Spotify account under your Bot's name, and log into the Developer Dashboard using that name.

Next, select the `Create an App` button. Give it a name and short description of your liking.

After creating the app, look for your `Client ID`, copy it and paste it in NotePad or some note taking application. *DO NOT SAVE*.

We will only need it once. Label it properly as well.

After copying your `Client ID`, click on `SHOW CLIENT SECRET` and copy the string into NotePad or your preferred note taking app.

Your notes should look like the following:

```
Client ID: long-string-here
Client Secret: long-string-here
```

Next, open the `Edit Settings` button in the App. In the `Redirect URLS` insert the following:

```
http://127.0.0.1/index.html
```

The following link is a dummy link that points to nothing. But it is critical for later when we are going to run the authorization program.

Hit save and proceed to the next.

#### 5. Run the Authorization Program for Spotify

Open your terminal or command prompt and go into the main directory/Folder of the Bot.

Once in, enter the following command:

```
node authorization.js
```

You will then be asked the following questions:

> Do you want to save data in a file?

Reply `Yes`. Press enter.

> Choose your Service:

Reply `sp` Press enter.

> Start by entering your Client ID:

Reply by pasting `that-long-string` you copied into your notepad. Press enter.

> Now your Client Secret:

Reply by pasting the client secret `long-string-thing` you copied into your notepad. Press enter.

> Enter your Redirect URL now:

Reply by pasting the link we pasted into Spotify earlier: `http://127.0.0.1/index.html`. Press enter.

> Enter your region code:

Reply by following the wiki page and finding your country's 2-letter country code. Press enter.

> Paste the url which you just copied:

The program will then instruct you to follow a link it has provided. Copy and paste it in the browser and press enter.

Spotify will now ask you to authorize your Bot to view your Account. Press `Agree`.

You will be led to a broken page. This is normal. Copy the link in the browser's search bar and paste it back into the program.

#### 6. Run the Authorization Program for YouTube

Open your terminal or command prompt and go into the main directory/Folder of the Bot.

Once in, enter the following command:

```
node authorization.js
```

You will then be asked the following questions:

> Do you want to save data in a file?

Reply `Yes`. Press enter.

> Choose your Service:

Reply `yo` Press enter.

> Cookies:

To retrieve your cookie, first, open your browser's Developer Tools:

Mac: `Option + ⌘ + J`,
Everything else: `Shift + CTRL + J`,

Open the `Network` tab. Then go to any YouTube video link. If you can't be bothered, then open this: <https://www.youtube.com/watch?v=dQw4w9WgXcQ>

In your network tab, scroll to the very top and click the __First Request__. The first request is named `watch?=dQw4w9WgXcQ` or any ID if you used a different video.

After clicking the __First Request__, a new tab will appear. Scroll down until you reach `Request Headers`. Find the `Cookie` parameter and copy the entire string of text into the Authorization program.

#### 7. Install the node modules

open a terminal or command prompt window and enter the bot's base folder, then run the following:

```
npm install
```

The terminal will log everything that is happening. Wait for it to finish.

### Congratulations

You've successfully set up Henrietta.

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- USAGE EXAMPLES -->
## Usage

This section will discuss how to turn the bot on and off. As well as provide links to the various commands.

Make sure you went through the [prerequisites](#prerequisites) and [installation](#installation) sections first. Otherwise, the commands in this section will not work.

### Bringing the Bot Online

To bring the bot online, open a terminal/command prompt and navigate to the Bot's main directory. Then run this command:

```
node .
```

The bot will now appear online.

### Shutting down the Bot

Close the terminal/command prompt window that the process is running on or use the following shortcuts in the terminal window:

Mac: `OPTION + C`
Everything else: `CTRL + C`

### Commands

In order to learn how to use Henrietta's different music commands, visit [this wiki link](https://github.com/Nelliosis/Henrietta-bot/wiki/Music-Commands).

To learn how to use her poll and scheduling commands, visit [here](https://github.com/Nelliosis/Henrietta-bot/wiki/Poll-&-Schedule).

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- ROADMAP -->
## Roadmap

See my roadmap, as well as the commands implemented, further improvements and TODO in the [Roadmap](https://github.com/Nelliosis/Henrietta-bot/wiki/Roadmap) section of the [Wiki](https://github.com/Nelliosis/Henrietta-bot/wiki)

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- CONTRIBUTING -->
## Make It Your Own

If you want to:

1. add your own functionality
2. modify the code
3. tinker with the bot

then by all means *__fork__* the project. You need not to contribute back to this main project. You are free to make it your own.

Use the [Getting Started](#getting-started) section to get you up and running with the bot's development.

*__Though please do remember to credit my work.__*

### Note

The __artwork and logo are my personal property__, thus their images *cannot* be used in your forks.

I recommend branding the bot as something different altogether.

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- LICENSE -->
## License

Distributed under version 3.0 of the GNU General Public License. Visit the [license](https://github.com/Nelliosis/Henrietta-bot/blob/main/LICENSE) for more information.

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- CONTACT -->
## Contact

Reach me through my [LinkedIn](https://linkedin.com/in/jcapawing) or email me directlty at `under construction`

Project Link: [https://github.com/Nelliosis/Henrietta-bot](https://github.com/Nelliosis/Henrietta-bot)

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- ACKNOWLEDGMENTS -->
## Acknowledgments

I am incredibly thankful to the following resources and people for helping me throughout the development process:

* Art
  * My original character Henrietta, was designed and made by [Seruneechan](https://twitter.com/Seruneechan).

* Markdown Resources
  * [Othneildrew's Best Readme Template](https://github.com/othneildrew/Best-README-Template)
  * [ikatyang's Emoji Cheat Sheet for GitHub Markdown](https://github.com/ikatyang/emoji-cheat-sheet/blob/master/README.md)
  * [Markdown Guide](https://www.markdownguide.org/basic-syntax/#reference-style-links)
  * [GitHub Markdown Guide](https://enterprise.github.com/downloads/en/markdown-cheatsheet.pdf)

* Guides & Documentation
  * [niconiconii's / 3chospirits's Discord Bot YouTube Tutorial Series](https://www.youtube.com/playlist?list=PLOlSzPEdp-bRnCzZX6qnKehutm2nb_tN-)
  * [Discord.js Guide](https://discordjs.guide/#before-you-begin)
  * [Discord.js Documentation](https://discord.js.org/#/docs/discord.js/stable/general/welcome)
  * [Mozilla's JavaScript Documentation](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
  * [javascript.info: The Modern JavaScript Tutorial](https://javascript.info/)
  * [Play-dl Documentation](https://play-dl.github.io/index.html)
  * [Play-dl's examples for YT, SP and SO](https://github.com/play-dl/play-dl/tree/main/examples)
  * [Reqbin's 'How do I add a comments to JSON?'](https://reqbin.com/req/wtvjp1a3/json-comment-example#:~:text=No%2C%20JSON%20is%20a%20data,elements%20will%20still%20be%20data.)
  * [How to make Embeds with Discord.js on StackOverFlow](https://stackoverflow.com/questions/63502179/how-to-make-an-embed-with-discord-js)
  * [How to measure time performance in JS on StackOverFlow](https://stackoverflow.com/questions/313893/how-to-measure-time-taken-by-a-function-to-execute)
  * [How to trim performance.now() decimals on StackOverFlow](https://stackoverflow.com/questions/22550791/javascript-and-performance-now-and-trimming-after-the-decimal)
  * [Borislav Hadzhiev's Convert Seconds to Minutes and Seconds in JavaScript](https://bobbyhadz.com/blog/javascript-convert-seconds-to-minutes-and-seconds#:~:text=To%20convert%20seconds%20to%20minutes,as%20seconds%20as%20mm%3Ass%20.)
  * [Flavio Copes's How to shuffle elements in a JavaScript array](https://flaviocopes.com/how-to-shuffle-array-javascript/)
  * [Emojipedia](https://emojipedia.org/)
  
* Queue Resources & Guides
  * The Queue System I implemented was heavily inspired by [Cyntac's Switch Discord Music Bot](https://github.com/28Goo/Switch)
  * The Queue data structure I made was based from [JavaScript Tutorial's Queue implementation](https://www.javascripttutorial.net/javascript-queue/) with some new self-made methods.
  * The logic of how my Queue shows into the chat is an implementation from [niconiconii's / 3chospirits's How to Make Discord Music Bot YouTube video.](https://www.youtube.com/watch?v=fN29HIaoHLU)
  * [Ondrej Polesny's JavaScript Array of Objects Tutorial](https://www.freecodecamp.org/news/javascript-array-of-objects-tutorial-how-to-create-update-and-loop-through-objects-using-js-array-methods/)
  * [Amanda Fawcett's JavaScript Map and Set tutorial: How to use new built-in classes](https://www.educative.io/blog/javascript-map-set)
  * [Declaring Multiple module.exports Functions on StackOverFlow](https://stackoverflow.com/questions/16631064/declare-multiple-module-exports-in-node-js)
  * [Psionatix's Code Snippit for PlayerStates on Reddit](https://www.reddit.com/r/Discordjs/comments/srjzh0/how_to_loop_music_nonstop_discordjs/)
  * [Elson Correia's An Introduction to Queue Data Structure in Javascript](https://medium.com/before-semicolon/queue-data-structure-in-javascript-a8c7927daf06#:~:text=Queue%20Data%20Structure%20is%20a,also%20an%20abstract%20data%20type.)

* Miscellaneous
  * [Shields.io](https://shields.io/category/license)
  * [Visual Studio Code](https://code.visualstudio.com/)
  * [Toptal's Gitignore.io](https://www.toptal.com/developers/gitignore)

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[forks-shield]: https://img.shields.io/github/issues/Nelliosis/Henrietta-bot?style=for-the-badge
[forks-url]: https://github.com/Nelliosis/Henrietta-bot/network/members
[stars-shield]: https://img.shields.io/github/stars/Nelliosis/Henrietta-bot?style=for-the-badge
[stars-url]: https://github.com/Nelliosis/Henrietta-bot/stargazers
[license-shield]: https://img.shields.io/github/license/Nelliosis/Henrietta-bot?style=for-the-badge
[license-url]: https://github.com/Nelliosis/Henrietta-bot/blob/main/LICENSE
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://linkedin.com/in/jcapawing
[product-screenshot]: images/screenshot.png
[status-shield]: https://img.shields.io/badge/Status-In%20active%20development-green?style=for-the-badge
