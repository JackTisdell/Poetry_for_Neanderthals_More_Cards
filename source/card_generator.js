const compounds = [];
const turnDuration = 7;//90;
const primingTime = 2000;   // time (in ms) after turn before next turn is 'primed', misclicks in this window will not start the next turn
const graceWindow = 500;    // grace period (in ms) after turn clock where play is still active
const options = {
    difficulty: 1,  // set by user, 0 excludes rare compounds, 1 uses full deck, 2 uses only rare compounds
};
let i = 0;
let currentCard = undefined;
let currentTeam = -1;
let primed = true;
const turnScore = {flops: [], ones: [], threes: []};
const madScore = {flops: 0, ones: 0, threes: 0, adjustments: 0};
const gladScore = {flops: 0, ones: 0, threes: 0, adjustments: 0};

$(document).ready(function() {

    parseCSV(LADEC, compounds);

    shuffle(compounds);

    const numCmpds = compounds.length;


    $('.start-turn').on('click', () => {
        if (primed) {startTurn();}
    });

    $('#draw-button').on('click', () => advance(-1));
    $('.card-top').on('click', () => advance(1));
    $('.card-bottom').on('click', () => advance(3));

    $('.mad .down').on('click', () => {--madScore.adjustments; updateScores();});
    $('.mad .up').on('click', () => {++madScore.adjustments; updateScores();});
    $('.glad .down').on('click', () => {--gladScore.adjustments; updateScores();});
    $('.glad .up').on('click', () => {++gladScore.adjustments; updateScores();});

    // set options from user input
    changeDifficulty();
    changeBgColor();

});


function parseCSV(csv, outputArray) {
    const rows = csv.split('\n');
    const headers = rows[0].split(',');
    rows.slice(1).map(row => {
        const values = row.split(',');
        const rowObj = {};
        headers.forEach( (header, index) => {
            rowObj[header] = values[index];
        });
        outputArray.push(rowObj);
    });
}


function shuffle(array) {
    let n = array.length;
    let i, temp;
    while (n > 0) {
        i = Math.floor(Math.random() * n--);
        temp = array[n];
        array[n] = array[i];
        array[i] = temp;
    }
}

function advance(points) {
    if (!currentCard) {return;}
    tally(currentCard, points);
    currentCard = drawCard();
    displayCard(currentCard);
}

function startTurn() {
    $('.start-turn').css('display', 'none');
    primed = false;

    turnScore.flops = [];
    turnScore.ones = [];
    turnScore.threes = [];
    $('.turn-tally .bucket div').remove();

    $('.inner-bar').css('animation', `timer ${turnDuration}s linear 0s none`);
    $('#draw-button').html('SKIP');
    currentCard = drawCard();
    displayCard(currentCard);
    setTimeout( () => {
        currentTeam = -currentTeam;
        if (currentTeam < 0) {
            $('.mad').addClass('current');
            $('.glad').removeClass('current');
            gladScore.flops += turnScore.flops.length;
            gladScore.ones += turnScore.ones.length;
            gladScore.threes += turnScore.threes.length;
        } else {
            $('.glad').addClass('current');
            $('.mad').removeClass('current');
            madScore.flops += turnScore.flops.length;
            madScore.ones += turnScore.ones.length;
            madScore.threes += turnScore.threes.length;
        }
        updateScores();

        setTimeout( () => {
            currentCard = undefined;
            displayCard(currentCard);
            $('.inner-bar').css('animation', 'none');
            $('#draw-button').html('GO');
            $('.start-turn').css('display', 'block');
            setTimeout( () => {primed = true;}, primingTime);
        }, graceWindow );
    }, turnDuration * 1000);
}

function updateScores() {
    let madTotal = 3*madScore.threes + madScore.ones - madScore.flops + madScore.adjustments;
    let gladTotal = 3*gladScore.threes + gladScore.ones - gladScore.flops + gladScore.adjustments;
    $('.mad .value').html(madTotal);
    $('.glad .value').html(gladTotal);
}

function drawCard() {
    let cmpd, c;
    while (true) {
        cmpd = compounds[i++];
        // skips card if incorrectly parsed, plural, or profane
        if (cmpd.correctParse === 'no' || cmpd.isPlural === '1' || cmpd.profanity_stim === 'TRUE') {
            continue;
        }
        if (options.difficulty === 0 && cmpd.isCommonstim === '0') {
            continue;
        }
        if (options.difficulty === 2 && cmpd.isCommonstim === '1') {
            continue;
        }

        c = chooseConsituent(cmpd);
        break;
    }
    return [cmpd, c];
}

function tally(card, points) {
    let cmpd = card[0];
    let str = card[1] === 1 ? `<div><span>${cmpd.c1}</span>${cmpd.c2}</div>` : `<div>${cmpd.c1}<span>${cmpd.c2}</span></div>`;
    switch (points) {
        case -1:
            turnScore.flops.push(card);
            $('.turn-tally .flops').append(str);
            break;
        case 1:
            turnScore.ones.push(card);
            $('.turn-tally .ones').append(str);
            break;
        case 3:
            turnScore.threes.push(card);
            $('.turn-tally .threes').append(str);
            break;
    }
}
    

function displayCard(card) {
    // cmpd : object corresponding to a row of LADEC data
    // c    : 1 or 2 specifying a constituent
    if (!card) {
        $('#constituent').html('');
        $('#compound').html('');
        return;
    }
    let cmpd = card[0];
    let c = card[1];
    let cons = c === 1 ? cmpd.c1 : cmpd.c2;
    $('#constituent').html(cons);
    $('#compound').html(cmpd.stim);
    isCommonC = c === 1 ? cmpd.isCommonC1 : cmpd.isCommonC2;
    style1 = isCommonC === '1' ? 'none' : 'underline';
    style2 = cmpd.isCommonstim === '1' ? 'none' : 'underline';
    $('#constituent').css('text-decoration', style1);
    $('#compound').css('text-decoration', style2);
}



function chooseConsituent(cmpd) {
    // if either constituent is profane, return the other.
    // note: we have already ensured the compound is not profane and there are no cases
    // in the LADEC database of compounds where both constituents are considered profane
    if (cmpd.profanity_c1 === 'TRUE') { return 2; }
    if (cmpd.profanity_c2 === 'TRUE') { return 1; }

    // if exactly one consituent is common, return the common one
    if (cmpd.isCommonC1 !== cmpd.isCommonC2) {
        if (cmpd.isCommonC1 === '1') {return 1;}
        return 2;
    }

    // if both (un)common, return the one in the smaller family
    let fam1 = parseInt(cmpd.nc1_cmpnoplural);
    let fam2 = parseInt(cmpd.nc2_cmpnoplural);
    if (fam1 < fam2) {return 1;}
    if (fam2 < fam1) {return 2;};

    // if all else equal, flip a coin
    return Math.random() < 0.5 ? 1 : 2;
}

function changeDifficulty() {
    $('.menu-difficulty input[type="radio"]').change(function() {
        let color;
        switch (this.value) {
            case 'easy':
                options.difficulty = 0;
                break;
            case 'medium':
                options.difficulty = 1;
                break;
            case 'hard':
                options.difficulty = 2;
                break;
        }
        $('body').css('background', color);
    });
}

function changeBgColor() {
    $('.menu-bg-color input[type="radio"]').change(function() {
        let color;
        switch (this.value) {
            case 'yellow':
                color = 'rgb(254, 207, 83)';
                break;
            case 'green':
                color = '#87A96B';
                break;
            case 'gray':
                color = '#CACACA';
                break;
        }
        $('body').css('background', color);
    });
}

/*
window.addEventListener('beforeunload', function (e) {
     // Cancel the event
     e.preventDefault(); // If you prevent default behavior in Mozilla Firefox prompt will always be shown
     // Chrome requires returnValue to be set
     e.returnValue = '';
});
*/
