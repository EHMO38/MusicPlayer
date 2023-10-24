// Aqui modificamos a pagina quando o menu for aberto
const menuBtn = document.querySelector('.menu-btn'),
    container = document.querySelector('.container');

const ProgressBar = document.querySelector('.bar')
    ProgressDot = document.querySelector('.dot');
    currentTimeEl = document.querySelector('.current-time');
    DurationEl = document.querySelector('.duration')



menuBtn.addEventListener('click', () => {
    container.classList.toggle('active');
});

// Aqui estamos configurando as variáveis do player de musica
let playing = false,
    currentSong = 0,
    shuffle = false,
    repeat = false,
    favoritas = [],
    audio = new Audio();

    const songs = [
        {
            title: 'falcão',
            artist: 'djonga',
            img_src: "falcaoImage.jpg",
            src: 'falcao.mp3',
        },

        {
            title: 'Nasci para ser grande',
            artist: 'djonga, Froid e BK',
            img_src: "nasciImage.png",
            src: 'nasci_para_ser_grande.mp3',
        },
    ];

const playlistContainer = document.querySelector('#playlist'),
    infoWrapper = document.querySelector('.info'),
    coverImage = document.querySelector('.cover-image'),
    currentSongTitle = document.querySelector('.current-song-title'),
    currentFavorite = document.querySelector('#current-favorite')

function init() {
        updatePlaylist(songs);
        loadSong(currentSong);
}

init();



function updatePlaylist(songs) {

    //remover qualquer elemento existente

    playlistContainer.innerHTML = '';

    //Usando forEach no array de sons

    songs.forEach((song , index) => {
        
        //extrair dados do som

        const { title, src } = song;
        
        //checa se está incluido nos favoritos
        const isFavourite = favoritas.includes(index);

        //criar uma tr para som wrappe
        const tr = document.createElement('tr');
        tr.classList.add('song');
        tr.innerHTML = `<td class="no">
                            <h6>${index + 1}</h6>
                        </td>
                        <td class="title">
                            <h6>${title}</h6>
                        </td>
                        <td class="length">
                            <h6>2:03</h6>
                        </td>
                        <td>
                            <i class="fas fa-heart" ${isFavourite ? 'active' : ''}>&#10084;</i>
                        </td>`;


        playlistContainer.appendChild(tr)

        

        
        
        //tocar a musica com o click
        tr.addEventListener('click', (e) => {

            //adiciona aos favoritos
            if(e.target.classList.contains('favoritar')){
                addToFavourits(index);
                e.target.classList.toggle('active');

                return
            }

            currentSong = index;
            loadSong(currentSong);
            audio.play();
            container.classList.remove('active');
            playPauseBtn.classList.replace('fa-play', 'fa-pause');
            playing = true;
        });

        //Modifica o tempo de acordo com a duração da música e onde ela está
        const audioForDuration = new Audio(`dados/${src}`); //aqui tem o caminho para o arquivo
        audioForDuration.addEventListener('loadedmetadata', () => {
            const duration = audioForDuration.duration;

            let songDuration = formatTime(duration);
            tr.querySelector('.length h6').innerText = songDuration;

        });
    });
}

function formatTime(time) {
    //formatando o tempo
    let minutes = Math.floor(time / 60);
    let seconds = Math.floor(time % 60);

    //adicionando zero a esquerda(por exemplo, de "5" para "05") se segundos for inferiores a 10
    seconds = seconds < 10 ? `0${seconds}` : seconds;

    return `${minutes}:${seconds}`;
}

//vamos adicionar um tocador de audio funcional

function loadSong(num) {
    //modifica todo o titulo, artista e tempo para o som atual
    infoWrapper.innerHTML = `
        <h2>${songs[num].title}</h2>
        <h3>${songs[num].artist}</h3>
    `;

    //mudando o titulo que aparece no canto inferior, conforme a musica
    currentSongTitle.innerHTML = songs[num].title;

    //mudando a imagem de fundo
    coverImage.style.backgroundImage = `url(dados/${songs[num].img_src})`;

    //adicionando src a variavel audio
    audio.src = `dados/${songs[num].src}` //dados/${} faz o caminho da variavel

    //se a música estiver favoritada
    if(favoritas.includes(num)) {
        currentFavorite.classList.add('active');
    }
    else {
        currentFavorite.classList.remove('active');
    }
}

//adicionando funcionalidade ao play, proximo e anterior

const playPauseBtn = document.querySelector('#playPause'),
    nextBtn = document.querySelector('#next'),
    prevBtn = document.querySelector('#prev');

playPauseBtn.addEventListener('click', () => {
    if(playing) {
        //pausar se estiver tocando
        playPauseBtn.classList.replace('fa-pause', 'fa-play');
        playing = false;
        audio.pause();
        playPauseBtn.innerHTML = '<p class="fas fa-play" id="playPause">&#9654;</p>'
    } else {
        playPauseBtn.classList.replace('fa-play', 'fa-pause');
        playing = true;
        audio.play();
        playPauseBtn.innerHTML = '<p class="fas fa-play" id="playPause">||</p>'
    }
});

function nextSong() {

    //shufle tocara no proximo som
    if(shuffle){
        shuffleFunc();
        loadSong(currentSong);
        
    }

    //Se a musica atual não for a ultima
    else if(currentSong < songs.length - 1) {
        currentSong++
        loadSong(currentSong);
    } else { //se for a ultima musica
        currentSong = 0;
    }
    loadSong(currentSong);

    //depois de carregar se a musica estiver tocando toque tambem a proxima
    if(playing){
        audio.play();
    }
}

//adiciona a função ao evento de click
nextBtn.addEventListener('click', nextSong);

function prevSong() {

    //shufle tocara no proximo som
    if(shuffle){
        shuffleFunc();
        loadSong(currentSong);
    
    }
    //se a musica for a primeira ir para ultima

    else if(currentSong > 0) {
        currentSong--;
    } else {
        currentSong = songs.length - 1;
    }
    loadSong(currentSong);

    //se a musica estiver tocando
    if(playing){
        audio.play();
    }
}

prevBtn.addEventListener('click', prevSong);

function addToFavourits(index) {
    //checa se já está nos favoritos
    if(favoritas.includes(index)){
        favoritas = favoritas.filter((item) => item !== index)
        //PARA IGUALAR A MUSICA ATUAL COM A DA PLAYLIST
        if(index === currentSong){
            currentFavorite.classList.remove('active');
        }
    } else {
        //se não estiver nas favoritas, adiciona
        favoritas.push(index);
        //serve para deixar o coração marcado tanto na playlist quanto na musica atual
        if(index === currentSong){
            currentFavorite.classList.add('active');
        }
    }

    updatePlaylist(songs);

}

currentFavorite.addEventListener('click', () => {
    currentFavorite.classList.toggle('active');
    addToFavourits(currentSong);
    
});

//adicionando a funcionalidade random

const shuffleBtn = document.querySelector('#shuffle');

function shuffleSongs(){
    //se o shuffle for falso vira verdadeiro ou vice versa
    shuffle = !shuffle;
    shuffleBtn.classList.toggle('active');
}

shuffleBtn.addEventListener('click', shuffleSongs);

//se shuffle for verdadeiro deixar random as proximas musicas ou anteirores

function sjuffleFunc() {
    if(shuffle) {
        currentSong = Math.floor(Math.random() * songs.length)
    } 
}

//funcionalidade de repetir
const repeatBtn = document.querySelector('#repeat');

function repeatSong() {
    if(repeat === 0){
        //se o repetidor estiver desativado, vai ativa-lo
        repeat = 1;
        repeatBtn.classList.add('active');
    } else if(repeat === 1) {
        //se repetidor for 1 e estiver repetindo o som atual isso faz repetir a playlist
        repeat = 2;
        repeatBtn.classList.add('active');
    } else {
        //se o repetidor for desligado
        repeat = 0;
        repeatBtn.classList.remove('active');
    }
}
//se clicar uma vez repete uma, duas repete a playlist e se clicar 3 desabilita
repeatBtn.addEventListener('click', repeatSong);

// se o repetidor estiver ativado no final da musica

audio.addEventListener('ended', () => {
    if(repeat === 1) {
        //se a musica acabar com o repetidor ativado, ela carrega novamente
        loadSong(currentSong);
        audio.play();
    } else if(repeat === 2) {
        nextSong();
        audio.play();
    } else {
        if(currentSong === songs.length - 1){
            //se for a ultima musica, pare de tocar a playlist
            audio.pause();
            playPauseBtn.classList.replace('fa-pause', 'fa-play');
            playing = false;
        } else {
            //se não for a ultima continue para a proxima
            nextSong();
            audio.play();
        }
    }
});

//vamos adicionar a barra de progresso

function progress() {
    //pegar duração e tempo atual do audio
    let {duration, currentTime} = audio;

    //se nenhum for um numero transforme em 0

    isNaN(duration) ? (duration = 0) : duration;
        isNaN(currentTime) ? (currentTime = 0) : currentTime;

    //atualizando o elemento tempo
    currentTimeEl.innerHTML = formatTime(currentTime);
        DurationEl.innerHTML = formatTime(duration);

        //agora vamos mover a bolinha de progresso
    let progressPercentage = (currentTime / duration) * 100;
    ProgressDot.style.left = `${progressPercentage}%`


};

//atualizando progresso no audio timeupdate event

audio.addEventListener('timeupdate', progress);


//mudar o progresso quando clicado na barra

function setProgress(e) {
    let width = this.clientWidth;
    let clickX = e.offsetX;
    let duration = audio.duration;
    audio.currentTime = (clickX / width) * duration;

}

ProgressBar.addEventListener('click', setProgress);