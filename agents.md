## Loba Counter

This app’s main purpose is to keep track of the scoreboard during friendly matches of the **Loba** card game.

## About the Loba Game

*La loba carioca*, or simply **Loba**, is a tabletop card game for two or more players, widely played in Argentina and Central America. It is usually played seated around a table, using two standard English decks (104 cards plus four jokers).

The game originates from Central America. Its rules—such as the number of cards dealt or their values—may vary depending on the region.

### Objective

The objective is to play (lay down) all the cards a player holds in their hand (for example, nine cards) by forming valid combinations.  
The player who achieves this wins the round, while the remaining players must add up the values of the cards still in their hands. These values are accumulated in a general scoreboard.

The game also ends if, at the end of a round, all players except one have a cumulative score greater than 100. In that case, the player with 100 points or fewer wins, and the other players cannot rejoin the game.

## Variants: Rejoining (Reenganche)

Some variants allow a player to **rejoin** (reengancharse) the game any number of times, with an increasing cost each time.

For example, if the initial stake is one unit per player:
- The first rejoin costs 1 unit.
- If a player is eliminated a second time and wants to rejoin, it costs 2 units.
- The third rejoin costs 3 units, and so on.

The rejoin count is tracked separately for each player. For instance, after one player has rejoined for the fourth time at a cost of 4 units, another player who is eliminated for the first time can still rejoin for just 1 unit.

When a player rejoins, they become an active participant again and assume the **highest score among the remaining active players**.

Example:  
If there are four players with the following scores:
- A: 50  
- B: 70  
- C: 103  
- D: 62  

If player C rejoins, they start the next round with player B’s score. The scores at the beginning of the next round would be:
- A: 50  
- B: 70  
- C: 70 (1 rejoin)  
- D: 62  

## Application Principles

Since Loba is a popular, family-oriented game often played outdoors—such as in parks, on the beach, or in the countryside—one of the core infrastructure principles of this application is to be **lightweight** and capable of working **offline**. Scores must be stored locally on the device.

The application should provide a **simple and friendly interface**, suitable for new users and older people. Starting a match, adding or removing players, and advancing rounds should be straightforward and never an obstacle. Advanced options should be available through a configuration or settings area.

For now, the relevant configurable options are:
- Allow rejoining (reenganche)
- Restart a match with the same players as the previous game

## Future Improvements

Looking ahead, the app should be able to generate and store meaningful analytical data over time, such as past match results, players, and scores per round. This would enable a rich historical record that could enhance user engagement and support promotion of the app on social media.
