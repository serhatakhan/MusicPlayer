const prevButton = document.getElementById("prev");
const nextButton = document.getElementById("next");
const repeatButton = document.getElementById("repeat");
const shuffleButton = document.getElementById("shuffle");
const audio = document.getElementById("audio");
const songImage = document.getElementById("song-image");
const songName = document.getElementById("song-name");
const songArtist = document.getElementById("song-artist");
const pauseButton = document.getElementById("pause");
const playButton = document.getElementById("play");
const playListButton = document.getElementById("playlist");
const maxDuration = document.getElementById("max-duration");
const currentTimeRef = document.getElementById("current-time");
const progressBar = document.getElementById("progress-bar");
const playListContainer = document.getElementById("playlist-container");
const closeButton = document.getElementById("close-button");
const playListSongs = document.getElementById("playlist-songs");
const currentProgress = document.getElementById("current-progress");

// index - şarkı için
let index;

// döngü
let loop = true;

// karıştırcı açık mı
let isShuffleActive = false

// şarkı listesi
/* dizinin her birisinin içinde şarkıcıın sesi, adı, şarkı adı, resmi var. en az 4 özellik var */
/* bir elemana ait birden çok özelliği tutuyorsak bu obje oluyor */
/* o yüzden bir dizi oluşturduk */
const songsList = [
  {
    name: "Islak Islak",
    link: "assets/islak.mp3",
    artist: "Barış Akarsu",
    image: "assets/baris.jpg",
  },
  {
    name: "Bu Son Olsun",
    link: "assets/busonolsun.mp3",
    artist: "Cem Karaca",
    image: "assets/cem.jpg",
  },
  {
    name: "Çöpçüler",
    link: "assets/cöpcüler.mp3",
    artist: "Erkin Koray",
    image: "assets/erkin.jpg",
  },
  {
    name: "Bal Böceği",
    link: "assets/balböcegi.mp3",
    artist: "Barış Manço",
    image: "assets/manco.jpg",
  },
  {
    name: "Aşkın Mapushane",
    link: "assets/askinmapushane.mp3",
    artist: "Haluk Levent",
    image: "assets/haluk.jpg",
  },
];

// zaman formatı ayarlama
/* function zamanAyarla (gelenDeger){
}    aşağıda yazdığımız aslında bu demek.
*/
const timeFormatter = (timeInput) => {
  let minute = Math.floor(timeInput / 60);
  minute = minute < 10 ? "0" + minute : minute;
  /*
    if (minute < 10) {
    minute = "0" + minute;
    } else {
    minute = minute;
    } 
    69.satırdaki ifade aslında bu demek.*/
  let second = Math.floor(timeInput % 60);
  second = second < 10 ? "0" + second : second;
  return `${minute}:${second}`;
};
/*
***timeInput parametresi, dönüştürmek istediğimiz zamanı temsil eder.
***minute değişkeni, timeInput'ı 60'a böldüğümüzde elde edilen tam sayıdır. 
Yani, toplam dakikayı temsil eder. Math.floor kullanılarak bu sayı aşağıya yuvarlanır.
***minute değişkeni, 10'dan küçükse önüne "0" eklenir. Böylece, tek haneli 
dakika değerleri iki haneli bir formata getirilir.
***second değişkeni, timeInput'ın 60'a bölümünden kalanı temsil eder. 
Bu, kalan saniyeyi ifade eder.
***second değişkeni de aynı şekilde 10'dan küçükse önüne "0" eklenir.
*/

//şarkıyı çalma
const playAudio = () => {
  //birisi seni çağırdığında çalış
  audio.play();
  pauseButton.classList.remove("hide"); //çalma başladığında pause daki hide clasını kaldır.playe ekle
  playButton.classList.add("hide");
};

// şarkı atama - şarkı bilgilerini çağırma
const setSong = (arrayIndex) => {
    if (loop == true && isShuffleActive == true){
        arrayIndex = Math.floor(Math.random()*100)%5
    }    // karıştırıcı için bu kısım

  let { name, link, artist, image } = songsList[arrayIndex];
  audio.src = link; //yukarıdaki audio değişkenine .src ile gelen linki atıyoruz. çünkü link bizim şarkımıza denk geliyor
  songName.innerHTML = name;
  songArtist.innerHTML = artist;
  songImage.src = image; //genelde ses, video, resimin kaynak ataması .src ile olur. yazılarda da innerHTML veya innerText

  audio.onloadedmetadata = () => {
    maxDuration.innerText = timeFormatter(audio.duration);
  }; //ses yüklenildiğinde bunun zamanını hesapla dedik!

  playListContainer.classList.add("hide");
  playAudio();
};

/*
93.satırdaki JavaScript fonksiyonu, bir şarkı listesi olan songsList dizisinde belirli bir 
dizin numarasına karşılık gelen şarkının bilgilerini çıkarmak için kullanılıyor.
***arrayIndex parametresini alarak songsList dizisinden belirli bir şarkının bilgilerini çıkarır.
***songsList[arrayIndex] ifadesi, songsList dizisindeki arrayIndex indisine karşılık gelen şarkıyı temsil eden bir nesneyi döndürür.
***{name, link, artist, image} ifadesi, bu nesnenin özelliklerini ayrı değişkenlere çözerek, 
her bir özelliği ayrı değişkenlere atar. Bu, "destructuring assignment" 
(yapıyı parçalayarak atama) olarak adlandırılır.
***Bu işlemin sonucunda, setSong fonksiyonu name, link, artist, ve image 
değişkenlerini içeren bir nesne oluşturmuş oluyor 
*/

// sıradakini çal
const nextSong = () => {
  if (loop) {
    //loop true ise (zaten yukarıda true atamıştık)
    if (index == songsList.length - 1) {
      index = 0;
    } else {
      index += 1; //index = index+1 de olur. aynı anlama geliyor
    }
    setSong(index);
  } else {
    let randIndex = Math.floor(Math.random() * songsList.length);
    setSong(randIndex);
  }
};

// şarkı pnceresinin açılıp kapanması
playListButton.addEventListener("click", () => {
  playListContainer.classList.remove("hide");
});

closeButton.addEventListener("click", () => {
  playListContainer.classList.add("hide");
});

// şarkıyı durdurma
const pauseAudio = () => {
  audio.pause();
  pauseButton.classList.add("hide");
  playButton.classList.remove("hide");
};

// progress bar içini doldurma
setInterval(() => {
  currentTimeRef.innerHTML = timeFormatter(audio.currentTime);
  currentProgress.style.width =
    (audio.currentTime / audio.duration.toFixed(3)) * 100 + "%";
}, 1000);
/*
setInterval işlevi içinde, şu anki ses dosyasının oynatma konumunu toplam süresine 
(audio.duration) oranlayarak bir ilerleme yüzdesini hesaplar. Bu yüzdeyi, sayfadaki 
bir ilerleme çubuğu (bir div öğesi) üzerindeki width özelliğine atar. 
Bu sayede, ilerleme çubuğu ses dosyasının ilerleme durumunu gösterir.!!!
*/
/*
***audio.currentTime: Şu anki ses dosyasının oynatma konumunu saniye cinsinden verir.
***audio.duration.toFixed(3): Ses dosyasının toplam süresini saniye cinsinden verir, 
ancak toFixed(3) metodu ile bu değer üç ondalık basamağa yuvarlanır.
(***audio.currentTime / audio.duration.toFixed(3)): Bu, şu anki konumun toplam süreye 
oranını sağlar, yani şu anki konumun toplam süre içindeki yüzdesini.
*** * 100: Yüzdeyi 100 ile çarpar, böylece genişlik yüzde cinsinden olur.
*** + "%": Son olarak, yüzde değerini bir dize olarak birleştirerek CSS'in beklediği formatta bir genişlik değeri elde edilir.
*/

progressBar.addEventListener("click", (event) => {
  let coordStart = progressBar.getBoundingClientRect().left;
  let coordEnd = event.clientX;
  let progress = (coordEnd - coordStart) / progressBar.offsetWidth;

  currentProgress.style.width = progressBar * 100 + "%";

  audio.currentTime = progress * audio.duration;
  audio.play();
  pauseButton.classList.remove("hide");
  playButton.classList.add("hide");
});
/*
***Tıklama sırasında, ilerleme çubuğunun sol kenarından (getBoundingClientRect().left) 
başlayan bir koordinat ve tıklanan yerin x koordinatını (event.clientX) alır. 
Bu değerleri kullanarak, tıklanan konumu ilerleme çubuğunun genişliğine oranlayarak 
bir ilerleme yüzdesi (progress) elde eder.
***Elde edilen ilerleme yüzdesini kullanarak, currentProgress adlı bir HTML öğesinin 
genişliğini günceller. Bu, ilerleme çubuğu üzerindeki bir gösterge çizgisi gibi 
düşünülebilir.
***Hesaplanan ilerleme yüzdesini kullanarak, ses dosyasının oynatma konumunu günceller
(audio.currentTime) ve ardından ses dosyasını çalmaya başlar (audio.play()).
*/

// önceki şarkıya geçme
const previousSong = () => {
  if (index > 0) {
    index -= 1;
  } else {
    index = songsList.length - 1; //yani son şarkıyı kastediyoruz
  }
  setSong(index); //o an ki index değerine karşılık gelen şarkı bilgilerini ayarlar
};

// tıklama yakalamalar
nextButton.addEventListener(
  "click",
  nextSong
); /* next butona tıklanıldığında üstteki nextSong fonksiyonu çalışsın */
pauseButton.addEventListener("click", pauseAudio);
playButton.addEventListener("click", playAudio);
prevButton.addEventListener("click", previousSong);

// tıklama yakalam diğer yol-metodu içerde hallediyoruz
repeatButton.addEventListener("click", () => {
  if (repeatButton.classList.contains("active")) {
    repeatButton.classList.remove("active"); //yani eğer active sınıfı varsa (var style kısmında), onu kaldır ve loop özelliğini de kapat
    audio.loop = false;
    console.log("tekrar kapatildi");
  } else {
    repeatButton.classList.add("active");
    audio.loop = true; //eğer kapalıysa active ekle. döngüyü aktifleştir
    console.log("tekrar acildi");
  }
});

// hemen üsttekinin aynısı
shuffleButton.addEventListener("click", () => {
  if (shuffleButton.classList.contains("active")) {
    isShuffleActive = false  //karıştırıcı için
    shuffleButton.classList.remove("active");
    audio.loop = true;
    console.log("karistirici acildi");
  } else {
    isShuffleActive = true   //karıştırıcı için
    shuffleButton.classList.add("active");
    audio.loop = false;
    console.log("karistirici kapatildi");
  }
});

// şarkı penceresi
const initializePlaylist = () => {
  for (let i in songsList) {
    playListSongs.innerHTML += `<li class="playlistSongs" onclick="setSong(${i})">
        <div class="playlist-image-container">
            <img src="${songsList[i].image}" >
        </div>
        <div class="playlist-song-details">
            <span id="playlist-song-name">
                ${songsList[i].name}
            </span>
            <span id="playlist-song-artist-album">
                ${songsList[i].artist}
            </span>
        </div>
        </li>`;
  }
};

// şarkı bitişini yakala
audio.onended = () => {
  nextSong();
};

// seste durdurulma olursa, progress bar için,
audio.addEventListener("timeupdate", () => {
  //timeupdate ile ses dosyasının zamanı her güncellendiğinde tetiklenir.
  currentTimeRef.innerText = timeFormatter(audio.currentTime);
});
/* zaman güncellenirse, audio'nun şu anki zamanınını al */
/*
Bu olay dinleyicisi, her zaman güncellendiğinde ses dosyasının geçerli zamanını alır
ve belirli bir HTML öğesine (currentTimeRef) bu zamanı biçimlendirilmiş bir şekilde 
atar.
*/

// ekran ilk açıldığında - tarayıcı penceresi (window) tamamen yüklendiğinde belirli işlemleri gerçekleştirmek üzere kullanılır.
window.onload = () => {
  index = 0; /* ekran açıldığında index'in değeri 0 olsun. en başta değeri yoktu */
  setSong(index);

  //durdur ve sarşı listesini yükle

  pauseAudio(); //Sayfa yüklendiğinde, varsayılan olarak şarkının çalmamasını sağlamak için bu fonksiyonu çağırdık.
  initializePlaylist(); //şarkı penceresi
};



