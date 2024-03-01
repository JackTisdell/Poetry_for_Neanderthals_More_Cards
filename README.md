# Poetry_for_Neanderthals_More_Cards
More cards for the tabletop game Poetry for Neanderthals!

## Disclaimer
This project and the github pages site associated with it is not endorsed by Explodings Kittens. It is not meant to eclipse the base game Poetry for Neanderthals or the official expansion, please buy them. While there is some overlap in the cards, most of the official cards are not represented here (which cards are included are are discussed below). 

## Why?
I am a big fan of the tabletop game Poetry for Neanderthals produced by Exploding Kittens. However, the game's main flaw is that gameplay is crippled as soon as one becomes too familiar with the deck. Indeed, there is an official expansion pack with 500 additional double-sided cards, for total of 1000 extra unique word-phrase pairs. As a coding project, I thought it would be interesting to create a further expansion possibly incorporating features not easily implemented with physical cards (e.g., a difficult setting). 

## Implementation details
Recall the basic set-up of Poetry for Neanderthals: Players take turns, alternating between teams, as the Poet. Until the turn clock expires, they draw cards featuring a word (hereafter call the *constituent*) and common phrase or compound word containing the constituent (e.g., "cake" + "birthday cake"). They must get their teammates to guess either the constituent or the phrase using only monosyllabic words, placing the card in a 1 or 3 point pile accordingly, or else in a -1 point pile if they violate a rule or choose to forfeit the card. At the end of each turn, points are tallied add added to the team's total. 

Of course, the fun for the Poet comes from the challenge of communicating effectively in only monosyllabic words. The viability of the game depends on the *meaningfulness* and reasonably *common usage* of the words/phrases appearing on the cards. Obviously the common usage is necessary for the Guessers to possibly succeed but I think it's worth emphasizing that the phrases must also have a sufficiently clear meaning (perhaps several) on their only. As an severe example, "of the" is an extremely common two-word phrase, but it doesn't convey anything in isolation. "the" + "of the" would make a terrible card.

This example illustrates that what makes a good card is a much more subtle question of semantics than one might naively have thought. It does not suffice to simply take common two- or three-word phrases from a corpus of text and select a constituent from each. I suspect that the designers of Poetry for Neanderthals (and the expansion pack) have gone to the effort compiling the phrases "by hand", so to speak, maybe extracting them one-by-one from a much larger sample of mostly lousy phrases. 

For this reason, I gave up quickly on two-word phrases, opting exclusively for *compound words*. This posed a different challenge, namely, it is a non-trivial task to parse a compound word into its constituents. So I sought a database of english compounds together with their decompositions and found [LADEC: The Large Database of English Compounds](https://doi.org/10.3758/s13428-019-01282-6). I encourage anyone interested in psycholinguistics to read their paper. Allow me to discuss the features of 


