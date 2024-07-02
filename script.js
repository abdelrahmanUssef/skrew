
let numPlayers = 0;
let players = [];
let isArabic = false;

const textContent = {
    en: {
        title: "Player Score Tracker",
        howToPlayTitle: "How To Play",
        howToPlayContent: `Overview of the game: The game is simple but requires concentration. Each player starts with four cards and aims to get the lowest number of points to win.
            How to play: Players can see two cards and choose to draw a new card, swap it, or see other players' cards.
            Card values and effects: Some cards have special effects, such as seeing additional cards or randomly swapping cards.
            Winning and losing: The round ends when one player is satisfied with their cards and declares "screw", and the player with the fewest points wins.
            Special cards: Some cards have special values or effects, such as reducing points or forcing others to swap cards.`,
        numPlayersTitle: "Enter Number of Players",
        numPlayersLabel: "Number of Players (max 10):",
        numPlayersNextBtn: "Next",
        playerNamesTitle: "Enter Player Names",
        playerNamesNextBtn: "Next",
        enterScoresTitle: "Enter Scores",
        languageToggleBtn: "Switch to Arabic"
    },
    ar: {
        title: "متعقب درجات اللاعبين",
        howToPlayTitle: "كيفية اللعب",
        howToPlayContent: `نظرة عامة على اللعبة: اللعبة سهلة لكنها تتطلب تركيز. يبدأ كل لاعب بأربع كروت ويهدف للحصول على أقل عدد من النقاط للفوز.
            كيفية اللعب: يمكن للاعبين رؤية كرتين واختيار سحب كرت جديد أو تبديله أو رؤية كروت اللاعبين الآخرين.
            قيم الكروت وتأثيراتها: بعض الكروت لها تأثيرات خاصة، مثل رؤية كروت إضافية أو تبديل الكروت عشوائياً.
            الفوز والخسارة: تنتهي الجولة عندما يكون أحد اللاعبين راضياً عن كروته ويعلن "سكرو"، واللاعب ذو أقل النقاط يفوز.
            الكروت الخاصة: بعض الكروت لها قيم أو تأثيرات خاصة، مثل تقليل النقاط أو إجبار الآخرين على تبديل الكروت.`,
        numPlayersTitle: "أدخل عدد اللاعبين",
        numPlayersLabel: "عدد اللاعبين (حد أقصى 10):",
        numPlayersNextBtn: "التالي",
        playerNamesTitle: "أدخل أسماء اللاعبين",
        playerNamesNextBtn: "التالي",
        enterScoresTitle: "أدخل الدرجات",
        languageToggleBtn: "تبديل إلى الإنجليزية"
    }
};

function toggleLanguage() {
    isArabic = !isArabic;
    const lang = isArabic ? 'ar' : 'en';
    document.getElementById('title').innerText = textContent[lang].title;
    document.getElementById('howToPlayTitle').innerText = textContent[lang].howToPlayTitle;
    document.getElementById('howToPlayContent').innerText = textContent[lang].howToPlayContent;
    document.getElementById('numPlayersTitle').innerText = textContent[lang].numPlayersTitle;
    document.getElementById('numPlayersLabel').innerText = textContent[lang].numPlayersLabel;
    document.getElementById('numPlayersNextBtn').innerText = textContent[lang].numPlayersNextBtn;
    document.getElementById('playerNamesTitle').innerText = textContent[lang].playerNamesTitle;
    document.getElementById('playerNamesNextBtn').innerText = textContent[lang].playerNamesNextBtn;
    document.getElementById('enterScoresTitle').innerText = textContent[lang].enterScoresTitle;
    document.getElementById('languageToggleBtn').innerText = textContent[lang].languageToggleBtn;
}

function showPlayerNames() {
    const numPlayersInput = document.getElementById('numPlayers').value;
    if (numPlayersInput > 10 || numPlayersInput < 1) {
        alert('Please enter a number between 1 and 10.');
        return;
    }
        numPlayers = parseInt(numPlayersInput);
        document.getElementById('numPlayers').disabled = true;
        document.getElementById('numPlayersNextBtn').style.display = 'none';
        document.getElementById('square2').classList.add('visible');
        const playerNamesDiv = document.getElementById('playerNames');
        playerNamesDiv.innerHTML = '';
        for (let i = 0; i < numPlayers; i++) {
            playerNamesDiv.innerHTML += `
                <div class="form-group col-lg-4">
                    <label for="playerName${i}">Player ${i + 1} Name:</label>
                    <input type="text" class="form-control" id="playerName${i}" required>
                </div>
            `;
        }
    }

    function finalizePlayerNames() {
        players = [];
        for (let i = 0; i < numPlayers; i++) {
            const playerName = document.getElementById(`playerName${i}`).value;
            players.push({ id: i, name: playerName, totalScore: 0 });
            document.getElementById(`playerName${i}`).disabled = true;
        }
        document.getElementById('playerNamesNextBtn').style.display = 'none';
        document.getElementById('square3').classList.add('visible');
        renderScoreTable();
    }

    function renderScoreTable() {
        const scoreTableHeader = document.getElementById('scoreTableHeader');
        const scoreTableBody = document.getElementById('scoreTableBody');
        const scoreTableFooter = document.getElementById('scoreTableFooter');

        scoreTableHeader.innerHTML = '<th>Round</th>';
        scoreTableFooter.innerHTML = '<th>Total</th>';
        for (let player of players) {
            scoreTableHeader.innerHTML += `<th>${player.name}</th>`;
            scoreTableFooter.innerHTML += `<td id="total_${player.id}">0 (Rank: 1)</td>`;
        }

        scoreTableBody.innerHTML = '';
        for (let round = 1; round <= 5; round++) {
            let row = `<tr><td>Round ${round}</td>`;
            for (let player of players) {
                row += `<td><input type="number" class="form-control score-input" data-player-id="${player.id}" data-round="${round}" onchange="updateTotal(${player.id})"></td>`;
            }
            row += '</tr>';
            scoreTableBody.innerHTML += row;
        }
    }

    function updateTotal(playerId) {
        let total = 0;
        const inputs = document.querySelectorAll(`.score-input[data-player-id="${playerId}"]`);
        inputs.forEach(input => {
            total += parseInt(input.value) || 0;
        });

        players = players.map(player => {
            if (player.id === playerId) {
                player.totalScore = total;
            }
            return player;
        });

        players.sort((a, b) => a.totalScore - b.totalScore);

        players.forEach((player, index) => {
            document.getElementById(`total_${player.id}`).innerText = `${player.totalScore} (Rank: ${index + 1})`;
        });
    }

    function clearScores() {
        const inputs = document.querySelectorAll('.score-input');
        inputs.forEach(input => {
            input.value = '';
        });
        players.forEach(player => {
            player.totalScore = 0;
            document.getElementById(`total_${player.id}`).innerText = '0 (Rank: 1)';
        });
    }