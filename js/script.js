const form = document.getElementById('form');
const result = document.getElementById('result');
const inp = document.getElementById('inp');
const more = document.getElementById('pagination');
const loader = document.querySelector('#loading');
let first = (localStorage.getItem("first") === null) ? true : localStorage.getItem("first");
if (first == true) {
    setTimeout(() => {
        if (first) {
            window.onload = whenOnload();
            localStorage.setItem('first', 'false');
        }
    }, 5300);
}
else {
    whenOnload();
}
function whenOnload() {
    console.log("Loaded");
    document.querySelector(".preload-cont").style.display = "none";
    document.querySelector("body").style.overflow = "visible";
}
const apiURL = 'https://api.lyrics.ovh';
async function getMoreSongs(url) {
    loader.classList = '';
    result.innerHTML = '';
    more.innerHTML = "";
    const res = await fetch(`https://cors-anywhere.herokuapp.com/${url}`);
    const data = await res.json();
    loader.classList = 'hide';
    console.log('Loader Visible');
    organizeData(data);
}
async function getLyrics(a, b) {
    loader.classList = '';
    result.innerHTML = '';
    more.innerHTML = "";
    const res = await fetch(`${apiURL}/v1/${a}/${b}`);
    const data = await res.json();
    console.log(data.lyrics);
    if (!data.hasOwnProperty('lyrics')) {
        loader.classList = 'hide';
        result.innerHTML = `<p>Sorry, the lyric has been removed or modified from server</p>
        <p>It's not Algo's mistake</p>
        <p>Take another stab</p>`;
        more.innerHTML = "";
    }
    else {
        const lyrics = data.lyrics.replace(/(\r\n|\r|\n)/g, '<br>');
        loader.classList = 'hide';
        console.log('Loader Hidden');
        result.innerHTML = `<h2><strong>${a}</strong>  -  ${b}</h2>
    <span>${lyrics}</span>`;
        more.innerHTML = "";
    }

}
async function organizeData(song) {
    loader.classList = 'hide';
    result.innerHTML = '';
    more.innerHTML = "";
    console.log('Loader Hidden');
    let output = "";
    song.data.forEach(e => {
        output += `<li><p>${e.artist.name} - <strong>${e.title}</strong></p>
         <button class='getLyrics' data-artist='${e.artist.name}'
          data-songTitle='${e.title}'>View</button></li>`;
    });
    result.innerHTML = `<i>${song.total} results have been found</i><ul>${output}</ul>`;
    if (song.prev && song.next) {
        more.innerHTML = `<button class='page' onclick='getMoreSongs("${song.prev}")'>Prev</button><button class='page'
      onclick='getMoreSongs("${song.next}")'>Next</button>`;
    }
    else if (song.prev) {
        more.innerHTML = `<button class='page' onclick='getMoreSongs("${song.prev}")'>Prev</button>`;
    }
    else if (song.next) {
        more.innerHTML = `<button class='page' onclick='getMoreSongs("${song.next}")'>Next</button>`;
    }
    else {
        more.innerHTML = "";
    }
}
async function findSong(inf) {
    loader.classList = '';
    result.innerHTML = '';
    more.innerHTML = "";
    console.log('Loader Visible');
    const res = await fetch(`${apiURL}/suggest/${inf}`)
    const data = await res.json();
    organizeData(data);
}
form.addEventListener('submit', e => {
    e.preventDefault();
    const inpValue = inp.value.trim();
    if (!inpValue) {
        alert('Please enter artist or song name!');
    }
    else {
        findSong(inpValue);
    }
});
result.addEventListener('click', e => {
    const btn = e.target;
    if (btn.tagName == 'button'); {
        const artist = btn.getAttribute('data-artist');
        const songName = btn.getAttribute('data-songTitle');
        getLyrics(artist, songName);
    }

});