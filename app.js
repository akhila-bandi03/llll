/* ==========================================================
   THE CRAZY BIRTHDAY CELEBRATION APP CONTROLLER
   State management, interactive widgets, scratch card, slot machine
   ========================================================== */

// Secret Surprise Reveal — global so onclick works
window.openSecretSurprise = function() {
  const giftBox = document.getElementById('secretGiftBox');
  const reveal  = document.getElementById('secretReveal');
  if (!giftBox || !reveal) return;
  if (reveal.classList.contains('revealed')) return; // already opened

  // Shake & pop the box before hiding it
  giftBox.style.animation = 'none';
  giftBox.style.transform = 'scale(1.3) rotate(5deg)';
  giftBox.style.transition = 'transform 0.2s ease';

  if (window.birthdayAudio) {
    window.birthdayAudio.playPop();
    setTimeout(() => window.birthdayAudio.playVictory(), 300);
  }
  if (window.partyCanvas) {
    const rect = giftBox.getBoundingClientRect();
    window.partyCanvas.partyNuke();
    window.partyCanvas.confettiCannon(rect.left + rect.width / 2, rect.top + rect.height / 2, 60);
  }

  setTimeout(() => {
    giftBox.classList.add('hidden');
    reveal.classList.remove('hidden');
    reveal.classList.add('revealed');
  }, 350);
};

// Define Global Curtain Opener immediately so it is ready on first frame
window.openTheaterCurtain = function() {
  const stageCurtain = document.getElementById('stageCurtain');
  if (!stageCurtain || stageCurtain.classList.contains('opened')) return;
  
  if (window.birthdayAudio) {
    window.birthdayAudio.init();
    window.birthdayAudio.playWhistle();
    window.birthdayAudio.playDrumroll();
  }
  
  if (window.partyCanvas) {
    window.partyCanvas.confettiCannon(window.innerWidth / 2, window.innerHeight * 0.3, 60);
  }

  stageCurtain.classList.add('opened');

  setTimeout(() => {
    stageCurtain.style.display = 'none';
  }, 1600);
};

document.addEventListener('DOMContentLoaded', () => {
  // 1. STATE & USER DATA
  const state = {
    friendName: 'LALLI',
    friendAge: 'Level Up!',
    senderName: 'Akki',
    tagline: 'May your life be filled with endless smiles, pure happiness, supreme joy, and unlimited love! 💖✨',
    customNote: `💌 Hey Lalli,

First of all… HAPPY BIRTHDAYYY, OYY! 🎂😭❤️

Nuvvu ee letter chadive mundu oka warning — over emotional avvakudadhu. Already nenu raayadaniki konchem over ayya. 😂

Actually cheppali ante, nuvvu naa life lo ela enter ayyavo exact ga teliyadu… kani ippudu nuvvu lekunda imagine cheyyadam konchem weird ga undi.

Mana friendship lo pedda pedda cinematic moments em levu maybe…

But—

random conversations, stupid jokes, unnecessary fights, “em chesthunav?” messages, reason lekunda navvadam, okariki okaram torture cheyyadam, and mana brain ki matrame artham ayye aa stupid jokes… 😂

Ivi anni kalisi chusthe… avi small moments kaavu. Avi mana memories. ❤️

Sometimes manam serious ga life gurinchi matladtham…
5 minutes later: “Rey, aa video chusava?” 😂
That's literally us. And honestly… I wouldn't change that.

Nuvvu perfect friend ani cheppanu.
Because obviously…
• Nee overthinking ki separate server kavali. 💀
• Nee drama ki Netflix subscription kavali.
• Nee replies ki 404 error vastundi.
• And nee craziness ki treatment inka kanipettaledu. 😂

But somehow… that's exactly why you're you.
And that's exactly why I like having you around. ❤️

Inka okati cheppali…
Nuvvu nannu chala care chesthav kada, adi naaku chala chala ishtam. ❤️ Kaani ade care nuvvu vere vallaki chesthe maatram naaku assalu nachadu. 😭😂 Enduko naake teliyadu… konchem possessive emo. Nenu kuda ninnu ala care cheyyakapothe, nuvvu nannu pattinchukovu emo ani konchem bayam anthe. 🥹❤️

And sorry. Na valla chala sarlu nuvvu hurt ayi untav. Telisi aina, teliyaka aina, na valla ninnu hurt chesina prathi sari genuinely sorry. ❤️ Ninnu hurt cheyyalani eppudu anukonu.

Life lo future lo em jaruguthundo manaki teliyadu.
Manam busy avvachu.
Different places ki vellachu.
Different people ni kalavachu.
Mana lives completely change avvachu.
But somewhere, someday… “Remember when we used to do that stupid thing?” ani okkasari cheppukunte chaalu.

I hope mana friendship lo aa “remember?” moments chaala untayi. ❤️
• More random plans.
• More stupid fights.
• More late conversations.
• More photos that should NEVER be shown to anyone. 😂
• More inside jokes.
• More memories.
• And obviously… more reasons to annoy each other. 😭❤️

And Lalli…
Nuvvu eppudaina life lo low feel ayina, confused ayina, everything is going wrong anipinchina… don't forget that someone is always going to be there to listen to your nonsense.
Yes. Unfortunately, that's me. 😂

So… Today is your birthday.
I don't just wish you “Happy Birthday.”
I wish you a year where you laugh more. Cry less. Overthink less. Achieve the things you're secretly wishing for.
And most importantly… never lose that crazy version of yourself.
Because that crazy version… is my favourite one. ❤️

So here's to you. To us. To all the memories we've already made. And to all the stupid memories we're still going to create.

Happy Birthday, Lalli. 🎂❤️
Stay crazy. Stay annoying. Stay happy.
And please don't become too mature… I still need my crazy best friend. 😂🫶

And one last thing…
Thanks for being one of those people who made ordinary days feel a little less ordinary. ❤️

12:00 ki ninnu surprise cheddam ani anukunna… kaani nuvvu photos pettale 😭😂 Ippudu nenu em cheyyali cheppu? Antha plan waste ayipoyindi 😂

Sare… inka baga over ayipothundi. Ega bye dear. 😤❤️

Love youuuuu ❤️😘
Umahhhhhh 😘💋`,
    candlesTotal: 5,
    candlesLit: 5,
    raveActive: false,
    scratchedPercent: 0
  };

  // 2. URL QUERY PARSER (Support shareable links)
  function loadUrlParams() {
    const params = new URLSearchParams(window.location.search);
    if (params.get('name')) state.friendName = params.get('name');
    if (params.get('age')) state.friendAge = params.get('age');
    if (params.get('from')) state.senderName = params.get('from');
    if (params.get('tagline')) state.tagline = params.get('tagline');
    if (params.get('msg')) state.customNote = params.get('msg');
  }

  function setElText(id, text) {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
  }

  function setElVal(id, val) {
    const el = document.getElementById(id);
    if (el) el.value = val;
  }

  function applyStateToUI() {
    setElText('displayFriendName', state.friendName);
    setElText('displayFriendAge', state.friendAge);
    setElText('displayTagline', state.tagline);
    setElText('cakeText', `HBD ${state.friendName.substring(0, 8)}!`);
    setElText('displayCustomNote', state.customNote);
    setElText('displaySenderName', `— ${state.senderName} ❤️`);
    setElText('certFriendName', state.friendName.toUpperCase());
    setElText('certSignature', `${state.senderName} (CEO of My Heart Co.)`);
    setElText('certDate', new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }));

    // Populate modal inputs safely
    setElVal('inputFriendName', state.friendName);
    setElVal('inputFriendAge', state.friendAge);
    setElVal('inputSenderName', state.senderName);
    setElVal('inputTagline', state.tagline);
    setElVal('inputLetter', state.customNote);
  }

  loadUrlParams();
  applyStateToUI();

  const openCurtainBtn = document.getElementById('openCurtainBtn');
  if (openCurtainBtn) {
    openCurtainBtn.addEventListener('click', window.openTheaterCurtain);
  }

  // 3. INTRO SCREEN: SECRET VAULT LOCKER PASSCODE KEYPAD
  const introScreen = document.getElementById('introScreen');
  const mainCelebration = document.getElementById('mainCelebration');
  const nukeBtn = document.getElementById('nukeBtn');
  const pinDots = document.querySelectorAll('.pin-dot');
  const pinStatusMsg = document.getElementById('pinStatusMsg');
  const keypadBtns = document.querySelectorAll('.keypad-btn[data-key]');
  const keyClear = document.getElementById('keyClear');
  const keyHint = document.getElementById('keyHint');
  const introBox = document.querySelector('.intro-box');

  let enteredPin = '';

  function updatePinDisplay() {
    pinDots.forEach((dot, index) => {
      if (index < enteredPin.length) {
        dot.classList.add('filled');
      } else {
        dot.classList.remove('filled', 'error', 'success');
      }
    });
  }

  function handleKeyInput(num) {
    if (enteredPin.length >= 4) return;
    
    enteredPin += num;
    if (window.birthdayAudio) window.birthdayAudio.playSlotTinkle();
    updatePinDisplay();

    if (enteredPin.length === 4) {
      validateLockerPin();
    }
  }

  function validateLockerPin() {
    pinStatusMsg.textContent = "VERIFYING PASSCODE...";
    
    setTimeout(() => {
      if (enteredPin === '2024') {
        pinDots.forEach(dot => dot.classList.add('success'));
        pinStatusMsg.textContent = "ACCESS GRANTED! WELCOME LEGEND 🎉";
        pinStatusMsg.style.color = "#00ff88";

        setTimeout(() => {
          triggerCelebrationAccess();
        }, 500);
      } else {
        pinDots.forEach(dot => dot.classList.add('error'));
        pinStatusMsg.textContent = "WRONG PIN! HINT: Manam kalisina year 😉";
        pinStatusMsg.style.color = "#ff0055";
        if (window.birthdayAudio) window.birthdayAudio.playWhistle();

        setTimeout(() => {
          enteredPin = '';
          updatePinDisplay();
          pinStatusMsg.textContent = "ENTER 4-DIGIT PIN";
          pinStatusMsg.style.color = "var(--secondary-glow)";
        }, 1300);
      }
    }, 300);
  }

  keypadBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const key = btn.getAttribute('data-key');
      btn.classList.add('pressed');
      setTimeout(() => btn.classList.remove('pressed'), 150);
      handleKeyInput(key);
    });
  });

  if (keyClear) {
    keyClear.addEventListener('click', () => {
      enteredPin = '';
      updatePinDisplay();
      pinStatusMsg.textContent = "ENTER 4-DIGIT PIN";
      pinStatusMsg.style.color = "var(--secondary-glow)";
      if (window.birthdayAudio) window.birthdayAudio.playPop();
    });
  }

  if (keyHint) {
    keyHint.addEventListener('click', () => {
      pinStatusMsg.textContent = "HINT: Manam kalisina year 💖";
      pinStatusMsg.style.color = "#ffe600";
      if (window.birthdayAudio) window.birthdayAudio.playWhistle();
    });
  }

  // Keyboard support (0-9, Backspace)
  window.addEventListener('keydown', (e) => {
    if (introScreen && !introScreen.classList.contains('hidden')) {
      if (e.key >= '0' && e.key <= '9') {
        handleKeyInput(e.key);
      } else if (e.key === 'Backspace') {
        enteredPin = enteredPin.slice(0, -1);
        updatePinDisplay();
      }
    }
  });

  if (nukeBtn) {
    nukeBtn.addEventListener('click', () => {
      triggerCelebrationAccess();
    });
  }

  function triggerCelebrationAccess() {
    if (window.birthdayAudio) {
      window.birthdayAudio.playApplause();
      window.birthdayAudio.playAirHorn();
    }
    if (window.partyCanvas) {
      window.partyCanvas.partyNuke();
    }

    introScreen.classList.add('hidden');
    mainCelebration.classList.remove('hidden');

    // Start song.mpeg & party celebration
    const bgSongAudio = document.getElementById('bgSongAudio');
    const musicState = document.getElementById('musicState');
    if (bgSongAudio) {
      bgSongAudio.play().then(() => {
        if (musicState) musicState.textContent = 'ON 🎵';
      }).catch(() => {
        const isPlaying = window.birthdayAudio.togglePartyMusic(true);
        if (musicState) musicState.textContent = isPlaying ? 'ON 🕺' : 'OFF';
      });
    } else {
      const isPlaying = window.birthdayAudio.togglePartyMusic(true);
      if (musicState) musicState.textContent = isPlaying ? 'ON 🕺' : 'OFF';
    }

    // Spawn floating heart balloons
    startFloatingHeartBalloons();

    // Auto-scroll to top smoothly
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // 3.5 FLOATING HEART BALLOONS ENGINE
  const heartBalloonsContainer = document.getElementById('heartBalloonsContainer');
  function startFloatingHeartBalloons() {
    if (!heartBalloonsContainer) return;
    const balloonEmojis = ['💖', '🎈', '💕', '❤️', '🧁', '✨', '🌸', '👑'];
    
    // Spawn initial wave
    for (let i = 0; i < 15; i++) {
      setTimeout(() => spawnSingleBalloon(balloonEmojis), i * 300);
    }
    
    // Continuous loop
    setInterval(() => {
      spawnSingleBalloon(balloonEmojis);
    }, 1200);
  }

  function spawnSingleBalloon(emojis) {
    if (!heartBalloonsContainer) return;
    const balloon = document.createElement('div');
    balloon.className = 'floating-balloon';
    balloon.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    balloon.style.left = `${Math.random() * 92}vw`;
    balloon.style.animationDuration = `${6 + Math.random() * 5}s`;
    balloon.style.fontSize = `${2 + Math.random() * 1.5}rem`;

    heartBalloonsContainer.appendChild(balloon);

    setTimeout(() => {
      balloon.remove();
    }, 12000);
  }

  // 4. FLOATING HUD CONTROLS
  const customizerToggleBtn = document.getElementById('customizerToggleBtn');
  const customizerModal = document.getElementById('customizerModal');
  const closeModalBtn = document.getElementById('closeModalBtn');
  const musicToggleBtn = document.getElementById('musicToggleBtn');
  const musicState = document.getElementById('musicState');
  const raveModeBtn = document.getElementById('raveModeBtn');
  const soundFxBtn = document.getElementById('soundFxBtn');
  const discoBallContainer = document.getElementById('discoBallContainer');

  customizerToggleBtn.addEventListener('click', () => {
    customizerModal.classList.remove('hidden');
  });
  closeModalBtn.addEventListener('click', () => {
    customizerModal.classList.add('hidden');
  });

  musicToggleBtn.addEventListener('click', () => {
    const bgSongAudio = document.getElementById('bgSongAudio');
    if (bgSongAudio) {
      if (bgSongAudio.paused) {
        bgSongAudio.play();
        musicState.textContent = 'ON 🎵';
      } else {
        bgSongAudio.pause();
        musicState.textContent = 'OFF';
      }
    } else {
      const isPlaying = window.birthdayAudio.togglePartyMusic();
      musicState.textContent = isPlaying ? 'ON 🕺' : 'OFF';
    }
  });

  soundFxBtn.addEventListener('click', () => {
    const enabled = window.birthdayAudio.toggleSFX();
    soundFxBtn.textContent = enabled ? '🔊 SFX: ON' : '🔇 SFX: OFF';
  });

  raveModeBtn.addEventListener('click', () => {
    state.raveActive = !state.raveActive;
    document.body.classList.toggle('rave-active', state.raveActive);
    document.body.classList.toggle('disco-active', state.raveActive);
    raveModeBtn.textContent = state.raveActive ? '🔥 RAVE ACTIVE!' : '⚡ RAVE MODE';
    
    if (state.raveActive) {
      window.birthdayAudio.playAirHorn();
      window.partyCanvas.partyNuke();
    }
  });

  // 5. HERO ACTIONS
  const heroConfettiBtn = document.getElementById('heroConfettiBtn');
  const airHornBtn = document.getElementById('airHornBtn');
  const relaunchNukeBtn = document.getElementById('relaunchNukeBtn');

  if (heroConfettiBtn) {
    heroConfettiBtn.addEventListener('click', (e) => {
      const rect = heroConfettiBtn.getBoundingClientRect();
      window.partyCanvas.confettiCannon(rect.left + rect.width / 2, rect.top);
      window.partyCanvas.launchRocket();
    });
  }

  if (airHornBtn) {
    airHornBtn.addEventListener('click', () => {
      window.birthdayAudio.playAirHorn();
    });
  }

  if (relaunchNukeBtn) {
    relaunchNukeBtn.addEventListener('click', () => {
      window.partyCanvas.partyNuke();
    });
  }

  // 5.5 TYPEWRITER LETTER CONTROLLER & 4 MYSTERY GIFTS
  const letterModal = document.getElementById('letterModal');
  const closeLetterBtn = document.getElementById('closeLetterBtn');
  const typewriterText = document.getElementById('typewriterText');
  const skipTypingBtn = document.getElementById('skipTypingBtn');
  const replayTypingBtn = document.getElementById('replayTypingBtn');
  const letterSignature = document.getElementById('letterSignature');

  let typeInterval = null;
  let typeIndex = 0;

  function startTypewriter(text) {
    if (typeInterval) clearInterval(typeInterval);
    typewriterText.textContent = '';
    typeIndex = 0;
    
    if (letterSignature) {
      letterSignature.textContent = `— ${state.senderName} ❤️`;
    }

    typeInterval = setInterval(() => {
      if (typeIndex < text.length) {
        typewriterText.textContent += text.charAt(typeIndex);
        const scrollBox = document.querySelector('.typewriter-body-scroll');
        if (scrollBox) {
          scrollBox.scrollTop = scrollBox.scrollHeight;
        }
        if (typeIndex % 3 === 0 && window.birthdayAudio) {
          window.birthdayAudio.playSlotTinkle();
        }
        typeIndex++;
      } else {
        clearInterval(typeInterval);
        typeInterval = null;
        if (window.birthdayAudio) window.birthdayAudio.playWhistle();
        if (window.partyCanvas) window.partyCanvas.confettiCannon();
      }
    }, 28);
  }

  function openTypingLetter() {
    letterModal.classList.remove('hidden');
    if (window.birthdayAudio) window.birthdayAudio.playVictory();
    if (window.partyCanvas) window.partyCanvas.confettiCannon();
    startTypewriter(state.customNote);
  }

  if (closeLetterBtn) {
    closeLetterBtn.addEventListener('click', () => {
      if (typeInterval) clearInterval(typeInterval);
      letterModal.classList.add('hidden');
    });
  }

  if (skipTypingBtn) {
    skipTypingBtn.addEventListener('click', () => {
      if (typeInterval) clearInterval(typeInterval);
      typewriterText.textContent = state.customNote;
    });
  }

  if (replayTypingBtn) {
    replayTypingBtn.addEventListener('click', () => {
      startTypewriter(state.customNote);
    });
  }

  // 5.6 VIDEO MEMORIES CONTROLLER
  const videoModal = document.getElementById('videoModal');
  const closeVideoBtn = document.getElementById('closeVideoBtn');
  const mainMemoryVideo = document.getElementById('mainMemoryVideo');
  const currentVideoTitle = document.getElementById('currentVideoTitle');
  const prevVideoBtn = document.getElementById('prevVideoBtn');
  const nextVideoBtn = document.getElementById('nextVideoBtn');
  const videoThumbBtns = document.querySelectorAll('.video-thumb-btn');

  let currentVideoIndex = 0;
  const videoList = Array.from(videoThumbBtns).map(btn => ({
    src: btn.getAttribute('data-src'),
    title: btn.getAttribute('data-title'),
    btn: btn
  }));

  function playVideoByIndex(index) {
    if (index < 0) index = videoList.length - 1;
    if (index >= videoList.length) index = 0;
    currentVideoIndex = index;

    videoThumbBtns.forEach(b => b.classList.remove('active'));
    const item = videoList[currentVideoIndex];
    if (item) {
      item.btn.classList.add('active');
      if (mainMemoryVideo) {
        mainMemoryVideo.src = item.src;
        mainMemoryVideo.play().catch(() => {});
      }
      if (currentVideoTitle) {
        currentVideoTitle.textContent = item.title;
      }
      if (window.birthdayAudio) window.birthdayAudio.playPop();
    }
  }

  function openVideoModal() {
    if (videoModal) {
      videoModal.classList.remove('hidden');
      playVideoByIndex(currentVideoIndex);
      if (window.birthdayAudio) window.birthdayAudio.playVictory();
      if (window.partyCanvas) window.partyCanvas.confettiCannon();
    }
  }

  if (closeVideoBtn) {
    closeVideoBtn.addEventListener('click', () => {
      videoModal.classList.add('hidden');
      if (mainMemoryVideo) mainMemoryVideo.pause();
    });
  }

  if (prevVideoBtn) {
    prevVideoBtn.addEventListener('click', () => {
      playVideoByIndex(currentVideoIndex - 1);
    });
  }

  if (nextVideoBtn) {
    nextVideoBtn.addEventListener('click', () => {
      playVideoByIndex(currentVideoIndex + 1);
    });
  }

  videoThumbBtns.forEach((btn, index) => {
    btn.addEventListener('click', () => {
      playVideoByIndex(index);
    });
  });

  // 5.7 4 MAGIC BALLOONS GAME CONTROLLER (YOU ARE SPECIAL TO ME)
  const balloonModal = document.getElementById('balloonModal');
  const closeBalloonBtn = document.getElementById('closeBalloonBtn');
  const popBalloonItems = document.querySelectorAll('.pop-balloon-item');
  const balloonVictoryBanner = document.getElementById('balloonVictoryBanner');
  const resetBalloonsBtn = document.getElementById('resetBalloonsBtn');

  let poppedBalloonsCount = 0;

  function openBalloonModal() {
    if (balloonModal) {
      resetBalloonGame();
      balloonModal.classList.remove('hidden');
      if (window.birthdayAudio) window.birthdayAudio.playVictory();
      if (window.partyCanvas) window.partyCanvas.confettiCannon();
    }
  }

  function resetBalloonGame() {
    poppedBalloonsCount = 0;
    popBalloonItems.forEach(item => {
      item.classList.remove('popped');
      item.style.pointerEvents = 'all';
      item.style.opacity = '1';
      item.style.transform = 'none';
    });

    for (let i = 1; i <= 4; i++) {
      const slot = document.getElementById(`wordSlot${i}`);
      if (slot) {
        slot.textContent = '?';
        slot.classList.remove('revealed');
      }
    }

    if (balloonVictoryBanner) {
      balloonVictoryBanner.classList.add('hidden');
    }
  }

  if (closeBalloonBtn) {
    closeBalloonBtn.addEventListener('click', () => {
      balloonModal.classList.add('hidden');
    });
  }

  if (resetBalloonsBtn) {
    resetBalloonsBtn.addEventListener('click', () => {
      resetBalloonGame();
      if (window.birthdayAudio) window.birthdayAudio.playLaser();
    });
  }

  popBalloonItems.forEach(item => {
    item.addEventListener('click', () => {
      if (item.classList.contains('popped')) return;

      const idx = item.getAttribute('data-index');
      const word = item.getAttribute('data-word');
      const targetSlot = document.getElementById(`wordSlot${idx}`);

      // Pop Animation & Sound
      item.classList.add('popped');
      if (window.birthdayAudio) {
        window.birthdayAudio.playPop();
      }

      const rect = item.getBoundingClientRect();
      if (window.partyCanvas) {
        window.partyCanvas.confettiCannon(rect.left + rect.width / 2, rect.top, 25);
      }

      // Reveal Word in Slot
      if (targetSlot) {
        targetSlot.textContent = word;
        targetSlot.classList.add('revealed');
      }

      poppedBalloonsCount++;

      // Check if all 4 are popped
      if (poppedBalloonsCount >= 4) {
        setTimeout(() => {
          if (balloonVictoryBanner) {
            balloonVictoryBanner.classList.remove('hidden');
          }
          if (window.birthdayAudio) {
            window.birthdayAudio.playVictory();
          }
          if (window.partyCanvas) {
            window.partyCanvas.partyNuke();
          }
        }, 400);
      }
    });
  });

  // Gift Boxes Handler
  const giftCards = document.querySelectorAll('.gift-card');
  giftCards.forEach(card => {
    card.addEventListener('click', () => {
      const giftType = card.getAttribute('data-gift');
      
      if (giftType === 'letter') {
        openTypingLetter();
      } else if (giftType === 'videos') {
        openVideoModal();
      } else if (giftType === 'balloons') {
        openBalloonModal();
      } else {
        if (!card.classList.contains('opened')) {
          card.classList.add('opened');
          const content = card.querySelector('.gift-content');
          if (content) content.classList.remove('hidden');
          
          if (giftType === 'nothing') {
            if (window.birthdayAudio) {
              window.birthdayAudio.playWhistle();
              window.birthdayAudio.playPop();
            }
          } else {
            if (window.birthdayAudio) {
              window.birthdayAudio.playPop();
              window.birthdayAudio.playVictory();
            }
          }

          const rect = card.getBoundingClientRect();
          window.partyCanvas.confettiCannon(rect.left + rect.width / 2, rect.top + rect.height / 2, 40);
        }
      }
    });
  });

  // 6. 3D INTERACTIVE CAKE & HAND GESTURE SWIPE CUTTING CEREMONY
  const cakeContainer = document.getElementById('cakeContainer');
  const candlesRack = document.getElementById('candlesRack');
  const blowAllCandlesBtn = document.getElementById('blowAllCandlesBtn');
  const cutCakeBtn = document.getElementById('cutCakeBtn');
  const relightCandlesBtn = document.getElementById('relightCandlesBtn');
  const cakeSwipeOverlay = document.getElementById('cakeSwipeOverlay');
  const cakeSliceTrailCanvas = document.getElementById('cakeSliceTrailCanvas');
  const servedSliceBox = document.getElementById('servedSliceBox');
  const wishRevealBox = document.getElementById('wishRevealBox');
  const randomWishMsg = document.getElementById('randomWishMsg');

  const fortuneWishes = [
    `"Your bank balance will soon look like a phone number, your skin will glow, and your wifi will never lag!"`,
    `"May all your wildest dreams come true, your enemies step on Legos, and every pizza you order arrive extra hot!"`,
    `"The universe has officially granted you +9999 Aura, supreme good fortune, and endless legendary adventures!"`,
    `"Warning: You are now too cool for this planet. Keep spreading awesome vibes!"`
  ];

  function renderCandles() {
    candlesRack.innerHTML = '';
    state.candlesLit = state.candlesTotal;

    // Clean up any right-half clones and cut-wrappers from previous cut
    if (cakeContainer) {
      cakeContainer.querySelectorAll('[data-right-half]').forEach(el => el.remove());
      cakeContainer.querySelectorAll('[data-cut-wrapper]').forEach(el => el.remove());
      cakeContainer.querySelectorAll('.cake-tier').forEach(tier => {
        tier.style.clipPath = '';
        tier.style.transform = '';
        tier.style.transition = '';
      });
      cakeContainer.classList.remove('is-cut');
    }

    if (wishRevealBox) wishRevealBox.classList.add('hidden');
    if (servedSliceBox) servedSliceBox.classList.add('hidden');
    if (cakeSwipeOverlay) cakeSwipeOverlay.classList.add('hidden');
    if (cutCakeBtn) cutCakeBtn.classList.add('hidden');
    if (blowAllCandlesBtn) blowAllCandlesBtn.classList.remove('hidden');

    for (let i = 0; i < state.candlesTotal; i++) {
      const candle = document.createElement('div');
      candle.className = 'candle';
      candle.innerHTML = `<div class="flame"></div>`;
      candle.addEventListener('click', () => extinguishCandle(candle));
      candlesRack.appendChild(candle);
    }
  }

  function extinguishCandle(candleEl) {
    if (!candleEl.classList.contains('blown')) {
      candleEl.classList.add('blown');
      if (window.birthdayAudio) window.birthdayAudio.playBlow();
      state.candlesLit--;
      checkAllCandlesBlown();
    }
  }

  function checkAllCandlesBlown() {
    if (state.candlesLit <= 0) {
      setTimeout(() => {
        if (window.birthdayAudio) {
          window.birthdayAudio.playApplause();
          window.birthdayAudio.playWhistle();
        }
        if (window.partyCanvas) {
          window.partyCanvas.confettiCannon(window.innerWidth / 2, window.innerHeight * 0.4, 40);
        }

        // Reveal the Hand Swipe to Cut Overlay!
        if (cakeSwipeOverlay) {
          cakeSwipeOverlay.classList.remove('hidden');
          initSliceCanvas();
        }
        if (cutCakeBtn) cutCakeBtn.classList.remove('hidden');
        if (blowAllCandlesBtn) blowAllCandlesBtn.classList.add('hidden');
      }, 400);
    }
  }

  function performCakeCut(cutXPercent) {
    if (cakeContainer.classList.contains('is-cut')) return;

    // Clamp cut position between 15% and 85% of cake width
    const cutPct = (cutXPercent !== undefined) ? Math.max(15, Math.min(85, cutXPercent)) : 50;

    // Flash a glowing cut line on the cake before splitting
    const flashLine = document.createElement('div');
    flashLine.style.cssText = `
      position:absolute; top:0; left:${cutPct}%; width:4px; height:100%;
      background: linear-gradient(to bottom, #fff 0%, #ffe600 50%, #fff 100%);
      box-shadow: 0 0 18px #fff, 0 0 35px #ffe600, 0 0 60px #ff00cc;
      z-index:50; pointer-events:none;
      animation: cutFlash 0.45s ease-out forwards;
    `;
    cakeContainer.appendChild(flashLine);
    setTimeout(() => flashLine.remove(), 500);

    setTimeout(() => {
      if (cakeSwipeOverlay) cakeSwipeOverlay.classList.add('hidden');
      if (cutCakeBtn) cutCakeBtn.classList.add('hidden');

      // For each tier: wrap it, then split into left/right halves via clip-path
      const tierWrapper = cakeContainer.querySelector('.cake-tier-wrapper');
      const tiers = Array.from(tierWrapper ? tierWrapper.querySelectorAll('.cake-tier') : cakeContainer.querySelectorAll('.cake-tier'));

      tiers.forEach(tier => {
        const w = tier.offsetWidth;
        const h = tier.offsetHeight;
        const mTop = parseInt(getComputedStyle(tier).marginTop) || 0;

        // Create a wrapper that preserves the tier's layout slot
        const wrapper = document.createElement('div');
        wrapper.setAttribute('data-cut-wrapper', '1');
        wrapper.style.cssText = `
          position: relative;
          width: ${w}px;
          height: ${h}px;
          overflow: visible;
          margin-top: ${mTop}px;
          flex-shrink: 0;
        `;

        // Left half — stays in place initially, then slides left
        const leftHalf = tier.cloneNode(true);
        leftHalf.style.cssText = `
          position: absolute; top: 0; left: 0;
          width: 100%; height: 100%; margin: 0;
          border-radius: inherit;
          clip-path: polygon(0 0, ${cutPct}% 0, ${cutPct}% 100%, 0 100%);
          transform: translateX(0) rotate(0deg);
          transition: transform 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        `;

        // Right half — stays in place initially, then slides right
        const rightHalf = tier.cloneNode(true);
        rightHalf.setAttribute('data-right-half', '1');
        rightHalf.style.cssText = `
          position: absolute; top: 0; left: 0;
          width: 100%; height: 100%; margin: 0;
          border-radius: inherit;
          clip-path: polygon(${cutPct}% 0, 100% 0, 100% 100%, ${cutPct}% 100%);
          transform: translateX(0) rotate(0deg);
          transition: transform 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        `;

        wrapper.appendChild(leftHalf);
        wrapper.appendChild(rightHalf);
        tier.parentNode.insertBefore(wrapper, tier);
        tier.remove();

        // Animate the split after paint
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            const leftShift = Math.round((cutPct / 100) * 40);
            const rightShift = Math.round(((100 - cutPct) / 100) * 40);
            leftHalf.style.transform = `translateX(-${leftShift}px) rotate(-3deg)`;
            rightHalf.style.transform = `translateX(${rightShift}px) rotate(3deg)`;
          });
        });
      });

      cakeContainer.classList.add('is-cut');

      if (window.birthdayAudio) {
        window.birthdayAudio.playLaser();
        setTimeout(() => {
          window.birthdayAudio.playHappyBirthdayTune();
          window.birthdayAudio.playVictory();
        }, 300);
      }

      if (servedSliceBox) servedSliceBox.classList.remove('hidden');
      if (wishRevealBox) {
        wishRevealBox.classList.remove('hidden');
        randomWishMsg.textContent = fortuneWishes[Math.floor(Math.random() * fortuneWishes.length)];
      }
      if (window.partyCanvas) {
        window.partyCanvas.partyNuke();
      }
    }, 220);
  }

  // Interactive Hand / Mouse Swipe to Cut Handler on Canvas
  let isSwipingCake = false;
  let swipePoints = 0;
  let lastX = null, lastY = null;
  let swipeXSum = 0; // accumulate X positions to find average cut point
  const userHandFollower = document.getElementById('userHandFollower');

  function initSliceCanvas() {
    if (!cakeSliceTrailCanvas) return;
    cakeSliceTrailCanvas.width = cakeSliceTrailCanvas.offsetWidth || 380;
    cakeSliceTrailCanvas.height = cakeSliceTrailCanvas.offsetHeight || 320;
  }

  // Move the hand emoji to follow cursor/touch position
  let handGuideDismissed = false;
  function moveHandFollower(clientX, clientY) {
    if (!userHandFollower || !cakeSwipeOverlay) return;
    const rect = cakeSwipeOverlay.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    userHandFollower.style.display = 'block';
    userHandFollower.style.left = x + 'px';
    userHandFollower.style.top = y + 'px';

    // Hide the demo guide hand once user interacts
    if (!handGuideDismissed) {
      handGuideDismissed = true;
      const guide = document.getElementById('handGestureGuide');
      if (guide) guide.style.opacity = '0';
    }
  }

  function handleSwipeMove(e) {
    e.preventDefault();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    // Move the hand emoji follower
    moveHandFollower(clientX, clientY);

    if (!isSwipingCake) return;
    swipePoints++;

    // Track X relative to the cake container to find where the cut lands
    const cakeRect = cakeContainer.getBoundingClientRect();
    const cakeRelX = clientX - cakeRect.left;
    const cakeXPct = (cakeRelX / cakeRect.width) * 100;
    swipeXSum += cakeXPct;

    // Draw glowing slash trail on canvas
    const rect = cakeSliceTrailCanvas.getBoundingClientRect();
    const ctx = cakeSliceTrailCanvas.getContext('2d');
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    if (lastX !== null && lastY !== null) {
      ctx.beginPath();
      ctx.moveTo(lastX, lastY);
      ctx.lineTo(x, y);
      ctx.strokeStyle = '#ffe600';
      ctx.shadowColor = '#ff00cc';
      ctx.shadowBlur = 22;
      ctx.lineWidth = 7;
      ctx.lineCap = 'round';
      ctx.stroke();
      // Inner bright line
      ctx.beginPath();
      ctx.moveTo(lastX, lastY);
      ctx.lineTo(x, y);
      ctx.strokeStyle = 'rgba(255,255,255,0.8)';
      ctx.shadowBlur = 5;
      ctx.lineWidth = 2;
      ctx.stroke();
    }

    // Glowing dot at current position
    ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
    ctx.shadowColor = '#ff007f';
    ctx.shadowBlur = 25;
    ctx.beginPath();
    ctx.arc(x, y, 7, 0, Math.PI * 2);
    ctx.fill();

    lastX = x;
    lastY = y;

    if (swipePoints > 10) {
      // Calculate average X% across the cake where the user swiped
      const avgCutXPct = swipeXSum / swipePoints;
      isSwipingCake = false;
      swipePoints = 0;
      swipeXSum = 0;
      lastX = null;
      lastY = null;
      if (userHandFollower) userHandFollower.style.display = 'none';
      performCakeCut(avgCutXPct);
    }
  }

  function handleSwipeStart(e) {
    isSwipingCake = true;
    swipePoints = 0;
    swipeXSum = 0;
    lastX = null;
    lastY = null;
    // Clear canvas for fresh slash
    if (cakeSliceTrailCanvas) {
      const ctx = cakeSliceTrailCanvas.getContext('2d');
      ctx.clearRect(0, 0, cakeSliceTrailCanvas.width, cakeSliceTrailCanvas.height);
    }
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    moveHandFollower(clientX, clientY);
  }

  function handleSwipeEnd() {
    isSwipingCake = false;
    lastX = null;
    lastY = null;
    swipeXSum = 0;
  }

  if (cakeSliceTrailCanvas) {
    cakeSliceTrailCanvas.addEventListener('mousedown', handleSwipeStart);
    window.addEventListener('mouseup', handleSwipeEnd);
    cakeSliceTrailCanvas.addEventListener('mousemove', handleSwipeMove);
    cakeSliceTrailCanvas.addEventListener('mouseleave', () => {
      if (userHandFollower) userHandFollower.style.display = 'none';
    });

    cakeSliceTrailCanvas.addEventListener('touchstart', (e) => { e.preventDefault(); handleSwipeStart(e); }, { passive: false });
    window.addEventListener('touchend', handleSwipeEnd);
    cakeSliceTrailCanvas.addEventListener('touchmove', handleSwipeMove, { passive: false });
  }

  if (blowAllCandlesBtn) {
    blowAllCandlesBtn.addEventListener('click', () => {
      const candles = document.querySelectorAll('.candle:not(.blown)');
      candles.forEach((c, idx) => {
        setTimeout(() => extinguishCandle(c), idx * 100);
      });
    });
  }

  if (cutCakeBtn) {
    cutCakeBtn.addEventListener('click', performCakeCut);
  }

  if (relightCandlesBtn) {
    relightCandlesBtn.addEventListener('click', () => {
      // renderCandles() handles all cleanup — just ensure extra state resets here
      renderCandles();
      if (userHandFollower) userHandFollower.style.display = 'none';
      handGuideDismissed = false;
      swipeXSum = 0;
      const guide = document.getElementById('handGestureGuide');
      if (guide) guide.style.opacity = '1';
      if (window.birthdayAudio) window.birthdayAudio.playLaser();
    });
  }

  renderCandles();

  // 7. SLOT MACHINE / ROAST-O-MATIC 3000
  const pullLeverBtn = document.getElementById('pullLeverBtn');
  const slot1 = document.getElementById('slot1');
  const slot2 = document.getElementById('slot2');
  const slot3 = document.getElementById('slot3');
  const slotResultText = document.getElementById('slotResultText');

  const slotItems = ['👑', '🍕', '🚀', '💎', '🦄', '🎉', '🔥', '⭐'];
  const slotPrizes = [
    `👑 TRIPLE ROYALS: Officially declared Supreme Royalty of the Universe!`,
    `🍕 PIZZA TIME: Free snacks guaranteed by whoever is nearby!`,
    `🚀 TO THE MOON: Your success & charisma will reach stratosphere levels this year!`,
    `💎 DIAMOND SWAG: Your presence is 100% certified priceless!`,
    `🦄 UNICORN ENERGY: 0% ordinary, 100% magical chaos!`,
    `🔥 MAXIMUM FLAME: Dangerously high coolness level detected!`,
    `⭐ LUCKY STAR: Extra luck on all choices made today!`
  ];

  let isSpinning = false;
  pullLeverBtn.addEventListener('click', () => {
    if (isSpinning) return;
    isSpinning = true;
    slotResultText.textContent = "SPINNING THE CHAOS REELS...";
    slot1.classList.add('spinning');
    slot2.classList.add('spinning');
    slot3.classList.add('spinning');

    // Play spinning sound
    let spinSoundInterval = setInterval(() => {
      window.birthdayAudio.playSlotTinkle();
    }, 120);

    setTimeout(() => {
      slot1.classList.remove('spinning');
      const res1 = slotItems[Math.floor(Math.random() * slotItems.length)];
      slot1.querySelector('.slot-reel').textContent = res1;
    }, 1000);

    setTimeout(() => {
      slot2.classList.remove('spinning');
      const res2 = slotItems[Math.floor(Math.random() * slotItems.length)];
      slot2.querySelector('.slot-reel').textContent = res2;
    }, 1400);

    setTimeout(() => {
      slot3.classList.remove('spinning');
      const res3 = slotItems[Math.floor(Math.random() * slotItems.length)];
      slot3.querySelector('.slot-reel').textContent = res3;

      clearInterval(spinSoundInterval);
      isSpinning = false;

      // Payout result
      const winMessage = slotPrizes[Math.floor(Math.random() * slotPrizes.length)];
      slotResultText.textContent = winMessage;
      window.birthdayAudio.playVictory();
      window.partyCanvas.confettiCannon(window.innerWidth / 2, window.innerHeight * 0.6, 60);
    }, 1800);
  });

  // 8. SOUNDBOARD PADS
  const sfxPads = document.querySelectorAll('.sfx-pad');
  sfxPads.forEach(pad => {
    pad.addEventListener('click', () => {
      pad.classList.add('pad-active');
      setTimeout(() => pad.classList.remove('pad-active'), 200);

      const type = pad.getAttribute('data-sound');
      switch (type) {
        case 'airhorn': window.birthdayAudio.playAirHorn(); break;
        case 'applause': window.birthdayAudio.playApplause(); break;
        case 'hbd8bit': window.birthdayAudio.playHappyBirthdayTune(); break;
        case 'disco': window.birthdayAudio.togglePartyMusic(); break;
        case 'whistle': window.birthdayAudio.playWhistle(); break;
        case 'victory': window.birthdayAudio.playVictory(); break;
        case 'laser': window.birthdayAudio.playLaser(); break;
        case 'drumroll': window.birthdayAudio.playDrumroll(); break;
      }
    });
  });

  // 10. POLAROID PHOTO UPLOADER
  const photoInput = document.getElementById('photoInput');
  const polaroidGallery = document.getElementById('polaroidGallery');

  photoInput.addEventListener('change', (e) => {
    const files = e.target.files;
    if (!files || !files.length) return;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const reader = new FileReader();
      reader.onload = (event) => {
        const tiltClass = i % 2 === 0 ? 'tilt-left' : 'tilt-right';
        const card = document.createElement('div');
        card.className = `polaroid-card ${tiltClass}`;
        card.innerHTML = `
          <div class="pin">✨</div>
          <div class="polaroid-img-box">
            <img src="${event.target.result}" alt="Friend Memory" />
          </div>
          <p class="caption">"Pure Legend Moments 💖"</p>
        `;
        polaroidGallery.prepend(card);
        window.partyCanvas.confettiCannon(window.innerWidth / 2, window.innerHeight * 0.7, 30);
      };
      reader.readAsDataURL(file);
    }
  });

  // 11. SCRATCH-OFF SECRET LETTER CANVAS
  const scratchCanvas = document.getElementById('scratchCanvas');
  const sCtx = scratchCanvas.getContext('2d');
  const quickRevealLetterBtn = document.getElementById('quickRevealLetterBtn');
  let isScratching = false;

  function initScratchCanvas() {
    scratchCanvas.width = scratchCanvas.offsetWidth || 450;
    scratchCanvas.height = scratchCanvas.offsetHeight || 280;

    // Gold Foil Gradient with sparkling texture
    const goldGrad = sCtx.createLinearGradient(0, 0, scratchCanvas.width, scratchCanvas.height);
    goldGrad.addColorStop(0, '#d4af37');
    goldGrad.addColorStop(0.3, '#f9e79f');
    goldGrad.addColorStop(0.6, '#aa7c11');
    goldGrad.addColorStop(1, '#f1c40f');

    sCtx.fillStyle = goldGrad;
    sCtx.fillRect(0, 0, scratchCanvas.width, scratchCanvas.height);

    // Text on top of gold foil
    sCtx.fillStyle = '#4a3300';
    sCtx.font = 'bold 18px "Space Grotesk", sans-serif';
    sCtx.textAlign = 'center';
    sCtx.fillText('✨ SCRATCH HERE TO UNLOCK SECRET ✨', scratchCanvas.width / 2, scratchCanvas.height / 2 - 10);
    sCtx.font = '14px "Outfit", sans-serif';
    sCtx.fillText('(Use finger or cursor)', scratchCanvas.width / 2, scratchCanvas.height / 2 + 18);
  }

  function scratch(x, y) {
    sCtx.globalCompositeOperation = 'destination-out';
    sCtx.beginPath();
    sCtx.arc(x, y, 24, 0, Math.PI * 2);
    sCtx.fill();

    if (Math.random() > 0.8) {
      window.birthdayAudio.playPop();
    }
  }

  function getScratchPos(e) {
    const rect = scratchCanvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return {
      x: (clientX - rect.left) * (scratchCanvas.width / rect.width),
      y: (clientY - rect.top) * (scratchCanvas.height / rect.height)
    };
  }

  scratchCanvas.addEventListener('mousedown', (e) => {
    isScratching = true;
    const pos = getScratchPos(e);
    scratch(pos.x, pos.y);
  });
  window.addEventListener('mouseup', () => { isScratching = false; });
  scratchCanvas.addEventListener('mousemove', (e) => {
    if (!isScratching) return;
    const pos = getScratchPos(e);
    scratch(pos.x, pos.y);
  });

  scratchCanvas.addEventListener('touchstart', (e) => {
    isScratching = true;
    const pos = getScratchPos(e);
    scratch(pos.x, pos.y);
  });
  scratchCanvas.addEventListener('touchmove', (e) => {
    if (!isScratching) return;
    const pos = getScratchPos(e);
    scratch(pos.x, pos.y);
  });
  scratchCanvas.addEventListener('touchend', () => { isScratching = false; });

  quickRevealLetterBtn.addEventListener('click', () => {
    sCtx.clearRect(0, 0, scratchCanvas.width, scratchCanvas.height);
    window.birthdayAudio.playWhistle();
    window.partyCanvas.confettiCannon();
  });

  // Delay init so elements layout properly
  setTimeout(initScratchCanvas, 300);
  window.addEventListener('resize', initScratchCanvas);

  // 12. CERTIFICATE PRINT & SHARE
  const printCertBtn = document.getElementById('printCertBtn');
  const shareUrlBtn = document.getElementById('shareUrlBtn');
  const copyShareableUrlBtn = document.getElementById('copyShareableUrlBtn');
  const customizerForm = document.getElementById('customizerForm');

  printCertBtn.addEventListener('click', () => {
    window.print();
  });

  function generateShareLink() {
    const url = new URL(window.location.origin + window.location.pathname);
    url.searchParams.set('name', state.friendName);
    url.searchParams.set('age', state.friendAge);
    url.searchParams.set('from', state.senderName);
    url.searchParams.set('tagline', state.tagline);
    url.searchParams.set('msg', state.customNote);
    return url.toString();
  }

  function copyLinkToClipboard() {
    const link = generateShareLink();
    navigator.clipboard.writeText(link).then(() => {
      alert('🎉 Personalized shareable link copied to clipboard!\nSend it to your friend!');
    }).catch(() => {
      prompt('Copy this URL to share with your friend:', link);
    });
  }

  shareUrlBtn.addEventListener('click', copyLinkToClipboard);
  copyShareableUrlBtn.addEventListener('click', copyLinkToClipboard);

  // 13. CUSTOMIZER FORM SUBMISSION
  customizerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    state.friendName = document.getElementById('inputFriendName').value.trim() || 'Legend';
    state.friendAge = document.getElementById('inputFriendAge').value.trim() || 'Level Up!';
    state.senderName = document.getElementById('inputSenderName').value.trim() || 'Your Bestie';
    state.tagline = document.getElementById('inputTagline').value.trim() || state.tagline;
    state.customNote = document.getElementById('inputLetter').value.trim() || state.customNote;

    applyStateToUI();
    customizerModal.classList.add('hidden');
    window.partyCanvas.partyNuke();
    window.birthdayAudio.playVictory();
  });
});
