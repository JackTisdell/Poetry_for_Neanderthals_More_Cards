# Poetry_for_Neanderthals_More_Cards
More cards for the tabletop game Poetry for Neanderthals!

## Disclaimer
This project and the github pages site associated with it is not endorsed by Explodings Kittens. It is not meant to eclipse the base game Poetry for Neanderthals or the official expansion, please buy them. While there is some overlap in the cards, most of the official cards are not represented here (which cards are included are are discussed below). Moreover, there will always be gameplay value in the tactility of physical cards. Lastly, while there are over 10,000 possible unique cards here, they are in some sense less varied than the official cards, as explained below.

## Why?
I am a big fan of the tabletop game Poetry for Neanderthals produced by Exploding Kittens. However, the game's main flaw is that gameplay is crippled as soon as one becomes too familiar with the deck. Indeed, there is an official expansion pack with 500 additional double-sided cards, for total of 1000 extra unique word-phrase pairs. As a coding project, I thought it would be interesting to create a further expansion possibly incorporating features not easily implemented with physical cards (e.g., a difficult setting). 

## Details
Recall the basic set-up of Poetry for Neanderthals: Players take turns, alternating between teams, as the Poet. Until the turn clock expires, they draw cards featuring a word (hereafter call the *constituent*) and common phrase or compound word containing the constituent (e.g., "cake" + "birthday cake"). They must get their teammates to guess either the constituent or the phrase using only monosyllabic words, placing the card in a 1 or 3 point pile accordingly, or else in a -1 point pile if they violate a rule or choose to forfeit the card. At the end of each turn, points are tallied add added to the team's total. 

Of course, the fun for the Poet comes from the challenge of communicating effectively in only monosyllabic words. The viability of the game depends on the *meaningfulness* and reasonably *common usage* of the words/phrases appearing on the cards. Obviously the common usage is necessary for the Guessers to possibly succeed but I think it's worth emphasizing that the phrases must also have a sufficiently clear meaning (perhaps several) on their only. As an severe example, "of the" is an extremely common two-word phrase, but it doesn't convey anything in isolation. "the" + "of the" would make a terrible card.

This example illustrates that what makes a good card is a much more subtle question of semantics than one might naively have thought. It does not suffice to simply take common two- or three-word phrases from a corpus of text and select a constituent from each. I suspect that the designers of Poetry for Neanderthals (and the expansion pack) have gone to the effort compiling the phrases "by hand", so to speak, maybe extracting them one-by-one from a much larger sample of mostly lousy phrases. 

For this reason, I gave up quickly on two-word phrases, opting exclusively for *compound words*. This posed a different challenge, namely, it is a non-trivial task to parse a compound word into its constituents. So I sought a database of english compounds together with their decompositions and found [LADEC: The Large Database of English Compounds](https://doi.org/10.3758/s13428-019-01282-6). I encourage anyone interested in psycholinguistics to read their paper. Allow me to now discuss the particulars of the implementation.

In the interest of homogeneity and managability, LADEC consists only of compound nouns. This is a shortcoming for our purposes but it is nonetheless, the largest adequate database of compound words I could find and the auxilliary data it contained proved to be most useful for the gameplay. The full database consists of about 9,000 items. However, since they are all nouns, about half of these are plurals of the other half. Since I wanted the compound words appearing in any one play of the game to be unique, I restricted the database to the singular entries. LADEC also includes entires whihc are valid compound words but incorrectly parsed (e.g., there are two entries for "overexertion", one correctly parsed as "over"+"exertion" and one incorrectly parsed as "overexert"+"ion"). I chose to restrict gameplay to the correctly parsed entries. Although this is not necessary for the gameplay, I still wanted the compound words to be unique. Restricting to the correctly parsed, singular entries resulted in a list of 5,625 unique compound nouns. Of these, 3,355 are indicated as common words in LADEC (meaning that they appear on Mathematica's WordData package's list of common English words). 

When the page loads, all LADEC entries are shuffled and the compounds are drawn in this shuffled order. A compound is skipped automatically wheneven it is plural, incorrectly parsed, or profane. Otherwise, one of the constituents is selected by applying the following rules in order:
    1. If one of the constituents alone is considered profane, the other is selected (it never happens that both are profane is the compound itself isn't).
    2. If exactly one of the constituents is an uncommon word, the other is chosen.
    3. If neither constituent is both and both are common or both are uncommon, the one in the smaller family not counting plurals (e.g., the family having "over" as the first constituent has 87 singular compounds).
    4. If both families have the same size (probably both 1), a constituent is selected uniformly at random.






