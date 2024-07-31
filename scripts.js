function openTab(evt, tabName) {
    let i, tabcontent, tablinks;

    tabcontent = document.getElementsByClassName("tab-content");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
        tabcontent[i].classList.remove("active");
    }

    tablinks = document.getElementsByClassName("tab-button");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }

    document.getElementById(tabName).style.display = "block";
    document.getElementById(tabName).classList.add("active");
    evt.currentTarget.className += " active";
}

function transcribe(type) {
    let resultDiv;
    if (type === 'microphone') {
        resultDiv = document.getElementById('microphone-result');
    } else if (type === 'audiofile') {
        resultDiv = document.getElementById('audiofile-result');
    } else if (type === 'youtube') {
        resultDiv = document.getElementById('youtube-result');
    }

    // Simulate transcribing process
    resultDiv.innerHTML = '<p>Transcribing...</p>';
    setTimeout(() => {
        resultDiv.innerHTML = '<p>Transcription complete!</p>';
    }, 2000);
}

document.addEventListener('DOMContentLoaded', (event) => {
    document.querySelector('.tab-button').click();
});
