
# Zing <img src='./favicon.png' style='display:inline-block;margin-left: 10px;width:40px;'>

An open-source teleprompter for all the speeches

## Why does this exist?

Because apparently nobody understands how to use them (:rofl:):

- <https://youtu.be/toMcQVfLCyQ?t=15>
- <https://youtu.be/UE9BXkQ-SRc>
- <https://youtu.be/F2iQSGHZFQc>

## So, how do you use it?

The quickest way to set everything up is to simply run the shell script [`build.sh`](./build.sh) located at the root of this repository.
Just run the following from a Bash terminal (see Git Bash for Windows):

```bash
curl -sL https://raw.githubusercontent.com/quantum9Innovation/zing/main/build.sh | bash
```

This will clone the repository, create a config template, and open the application in your browser using `live-server`.
To create the server the application needs to run, use `npx live-server`, which creates a local web server using this [npm package](https://www.npmjs.com/package/live-server).
Otherwise, find some other way to serve the root directory so that `file://` requests are not blocked.

## Where's the speech?

Glad you asked! The `config/` directory will hold all your materials.
When you open the directory, you should see a `speech.txt` and `styling.css` file.
The `styling.css` file can be used to override the default styling at `index.css` without creating changes to the repository.
Paste your speech into `speech.txt` and Zing will automatically tokenize it and create the transcript.
As you edit the speech file, `live-server` will enable hot-reloading so you can see your changes in real time.

## An example?

You'll find various examples in the [`examples/`](./examples/) directory.
Just copy and paste the text from any file into the `speech.txt` file in `config/`.
Zing automatically splits the speech into lines using common punctuation though it ignores single newlines.
Double newlines are interpreted as paragraph breaks and understood by Zing.
To create an artificial break, simply use the `<br>` token.
Using [Barack Obama's 2004 speech](./examples/obama-2004.txt) to the Democratic National Convention as an example, you should see various text boxes appear below the controls.

## Wait, controls?

All the controls you need are at the top of the screen.
There's also a timer fixed in place at the bottom right.
To start the teleprompter, press the play button (or use <kbd>space</kbd>).
You can also move up and down the transcript by using the up and down arrows on your keyboard.
Lastly, you can change the automatic speed of the teleprompter by using the left and right arrows or the range slider in the controls.

## Non-English language support

Zing relies on certain punctuation tokens to detect when to split lines.
Unfortunately, many of these tokens do not accurately represent the way that other non-English languages should be split.
If you speak another language and would be interested in creating a tokenizer, you can add your own to the parsers in [`index.js`](./index.js).

## That's all?

Yes! It's really that simple.
If you have any problems, please report them to this repository as everything is still very much in the alpha stage of development.
Now get back to speech writing and let Zing take care of the rest.
