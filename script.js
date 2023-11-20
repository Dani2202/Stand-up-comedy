const button = document.getElementById('button')
const audioElement = document.getElementById('audio');
const subtitlesElement = document.getElementById('subtitles');

function tellMe(joke) {
  const words = joke.split(' ');
  const wordsPerInterval = 2;

  let currentIndex = 0;
  let interval;
  let delay = 3000; // Delay in milliseconds before starting the speech

  setTimeout(function () {
    VoiceRSS.speech({
      key: '09bb45eae2b148ac9b7499bb82c6c9dc',
      src: joke,
      hl: 'en-us',
      v: 'Linda',
      r: 0,
      c: 'mp3',
      f: '44khz_16bit_stereo',
      ssml: false,
      onEndCallback: function () {
        toggleButton();
        subtitlesElement.innerHTML = ''; // Clear subtitles when audio ends
      },
      onSpeechCallback: function (text) {
        updateSubtitles(text);
      },
    });

    interval = setInterval(function () {
      if (currentIndex < words.length) {
        let currentWords = words.slice(
          currentIndex,
          currentIndex + wordsPerInterval
        );
        currentIndex += wordsPerInterval;
        updateSubtitles(currentWords.join(' '));
      } else {
        clearInterval(interval);
        subtitlesElement.innerHTML = '';  
      }
    }, 700); 
  }, delay);
}

function updateSubtitles(text) {
  subtitlesElement.innerHTML = text;
}

//Toggle Button

function toggleButton(){
  button.disabled = !button.disabled;
}

// Get Jokes from Joke API

async function getJokes(){
  let joke = ''
  const apiUrl = 'https://v2.jokeapi.dev/joke/Programming?blacklistFlags=nsfw,religious,racist,sexist,explicit';
  try{
    const response = await fetch(apiUrl);
    const data = await response.json();
    if (data.setup){
      joke += `${data.setup} ... ${data.delivery}`;
    }
    else{
      joke = data.joke;
    }
    tellMe(joke)
    toggleButton()
  } catch(error){
    console.log('whoops',error)
  }
}

button.addEventListener('click',getJokes);
audioElement.addEventListener('ended',toggleButton);
