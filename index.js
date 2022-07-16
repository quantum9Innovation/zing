// index.js
// Build transcript and start the teleprompter

// Globals
let lines = []
let line = 1
let dark = false
let speed = 5
let play = false
let startTime = Date.now()
let lastPaused = Date.now()
let pauseDuration = 0


// Resource getters
const getTranscript = URL => {

    // Get the transcript from the speech.txt file
    return fetch(URL)
           .then(response => response.text())
           .catch(error => console.log(error))

}


// Parsers
const splitParagraphs = transcript => {

    // Detect double newlines and split into paragraphs
    return transcript.split(/(?:\n\n|\r\n\r\n)/g)
    
}
const splitPunctuation = paragraph => {

    // Split paragraphs into phrases when any punctuation is detected,
    // but keep the original punctuation at the end of the previous phrase
    
    let tokenized = []
    let startToken = 0

    let breaks = paragraph.split('\n')
    let words = []

    for (let i = 0; i < breaks.length; i++) {
        words.push(...breaks[i].split(' '))
    }

    let punctuation = [
        '.', '!', '?', 
        ';', ':', ',', 
        '"', '\'', '`',
        '“', '”', '‘', 
        '’', 
    ]
    let splitPunc = ['--', '---', '—', '...']

    for (let i = 0; i < words.length; i++) {

        // If the current word starts in or ends with a punctuation mark,
        // add the current phrase to the tokenized array and reset the start 
        // token

        let word = words[i].trim()

        if (word == '<br>') {

            tokenized.push(words.slice(startToken, i).join(' '))
            startToken = i + 1
            continue

        }

        for (let j = 0; j < punctuation.length; j++) {

            let mark = punctuation[j]

            if (
                word.startsWith(mark) 
                && word.endsWith(mark)
            ) {
                continue
            }
            if (i == words.length - 1) {

                tokenized.push(words.slice(startToken, i + 1).join(' '))
                break

            }

            if (word.startsWith(mark)) {

                tokenized.push(words.slice(startToken, i).join(' '))
                startToken = i

            } else if (word.endsWith(mark)) {

                tokenized.push(words.slice(startToken, i + 1).join(' '))
                startToken = i + 1

            }

        }
        for (let j = 0; j < splitPunc.length; j++) {

            if (word.includes(splitPunc[j])) {

                tokenized.push(words.slice(startToken, i + 1).join(' '))
                startToken = i + 1

            }
            
        }
        
    }

    return tokenized

}
const getLines = transcript => {

    // Generate lines from transcript
    let nested = splitParagraphs(transcript).map(splitPunctuation)
    
    let flattened = []
    for (let i = 0; i < nested.length; i++) {

        for (let j = 0; j < nested[i].length; j++) {
            if (nested[i][j].length > 0) {
                flattened.push(nested[i][j].trim())
            }
        }

        flattened.push('¶')

    }

    return flattened

}


// Build the teleprompter
const inputLine = (line, k) => {

    // Add a line to the teleprompter
    let lineElement = document.createElement('p')
    lineElement.className = 'line'
    lineElement.id = k
    lineElement.innerText = line
    document.getElementById('speech').appendChild(lineElement)

}
const build = async () => {

    // Get the transcript and build the teleprompter
    let transcript = await getTranscript('/config/speech.txt')
    lines = getLines(transcript)

    for (let i = 0; i < lines.length; i++) {
        inputLine(lines[i], i + 1)
    }

    activate(1)
    
}


// Control the teleprompter
const activate = k => {

    // Activate a line
    let line = document.getElementById(k)
    line.className = 'line active'

}
const deactivate = k => {

    // Deactivate a line
    let line = document.getElementById(k)
    line.className = 'line'

}
const prev = () => {

    if (line == 1) return
    deactivate(line)
    line--
    activate(line)
    let el = document.getElementById(line)
    el.scrollIntoView({ behavior: 'smooth', block: 'center' })

}
const next = () => {

    if (line == lines.length) return
    deactivate(line)
    line++
    activate(line)
    let el = document.getElementById(line)
    el.scrollIntoView({ behavior: 'smooth', block: 'center' })

}


// Helper functions
const calcTime = k => {

    // Calculate the time (in ms) required to read the `k`th line
    // at a rate of `speed` characters per second
    
    let text = lines[k - 1]
    if (text == '¶') return 1500
    
    let words = text.split(' ').length
    let chars = Math.max(text.length - words - 1, 1)
    return (chars / speed) * 1000

}


// Start the teleprompter
const teleprompt = () => {
    
    // Logic for starting the teleprompter goes here
    if (!play) {
        setTimeout(teleprompt, 500)
        return
    }
    if (line == lines.length) {
        setTimeout(teleprompt, 500)
        return
    }

    // Get the time required to read the current line
    let reqTime = calcTime(line)

    // Move to next line after time has elapsed
    setTimeout(() => {
        
        if (!play) {
            setTimeout(teleprompt, 500)
            return
        }
        next()
        teleprompt()

    }, reqTime)

}
const setTimer = () => {

    if (!play) {
        setTimeout(setTimer, 1000)
        return
    }

    let time = Date.now() - startTime - pauseDuration
    let minutes = Math.floor(time / 60000)
    let seconds = Math.floor((time % 60000) / 1000)

    let secondsString = seconds < 10 ? '0' + seconds : seconds
    let timeString = minutes + ':' + secondsString

    document.getElementById('timer').innerText = timeString
    setTimeout(setTimer, 1000)

}
build().then(() => {

    teleprompt()
    setTimer()

})


// Inputs
const togglePlay = () => {

    // Do time calculations
    if (play) lastPaused = Date.now()
    else pauseDuration += Date.now() - lastPaused

    // Toggle play/pause
    play = !play
    let button = document.getElementById('play')
    button.innerHTML = 
        play ? 'Pause (<kbd>space</kbd>)' 
        : 'Play (<kbd>space</kbd>)'

}
const toggleFullscreen = () => {

    // Toggle fullscreen
    let isFullscreen = 
        (document.fullscreenElement && document.fullscreenElement !== null) 
        || (
            document.webkitFullscreenElement 
            && document.webkitFullscreenElement !== null
        )
        || (
            document.mozFullScreenElement 
            && document.mozFullScreenElement !== null
        )
        || (
            document.msFullscreenElement 
            && document.msFullscreenElement !== null
        )

	let docElm = document.documentElement

	if (!isFullscreen) {

		if (docElm.requestFullscreen) {
			docElm.requestFullscreen()
		} else if (docElm.mozRequestFullScreen) {
			docElm.mozRequestFullScreen()
		} else if (docElm.webkitRequestFullScreen) {
			docElm.webkitRequestFullScreen()
		} else if (docElm.msRequestFullscreen) {
			docElm.msRequestFullscreen()
		}

	} else {

		if (document.exitFullscreen) {
			document.exitFullscreen()
		} else if (document.webkitExitFullscreen) {
			document.webkitExitFullscreen()
		} else if (document.mozCancelFullScreen) {
			document.mozCancelFullScreen()
		} else if (document.msExitFullscreen) {
			document.msExitFullscreen()
		} else {
            alert(
                'Attempting to exit fullscreen; '
                + 'if this doesn\'t work try ESC or F11'
            )
        }

	}

    // Change button name
    let button = document.getElementById('fullscreen')
    button.innerHTML = 
        !isFullscreen ? 'Exit fullscreen (<kbd>f</kbd>)' 
        : 'Fullscreen (<kbd>f</kbd>)'

}
const toggleDark = () => {

    // Toggle dark mode
    dark = !dark
    document.body.className = dark ? 'dark' : ''

    // Change button name
    let button = document.getElementById('dark')
    button.innerHTML = dark ? 'Light (<kbd>d</kbd>)' : 'Dark (<kbd>d</kbd>)'

}
const setSpeed = val => { 

    speed = parseFloat(val)
    let range = document.getElementById('speed')
    range.value = speed

}


// Pre-set inputs
const darkModeEnabled = window.matchMedia('(prefers-color-scheme: dark)')
if (darkModeEnabled.matches) toggleDark()
setSpeed(document.getElementById('speed').value)


// Key inputs
document.addEventListener('keydown', e => {

    switch (e.key) {

        case ' ': togglePlay(); e.preventDefault(); break
        case 'f': toggleFullscreen(); e.preventDefault(); break
        case 'd': toggleDark(); e.preventDefault(); break
        case 'ArrowUp': prev(); e.preventDefault(); break
        case 'ArrowDown': next(); e.preventDefault(); break
        case 'ArrowLeft': setSpeed(speed - 0.1); e.preventDefault(); break
        case 'ArrowRight': setSpeed(speed + 0.1); e.preventDefault(); break

    }

})
