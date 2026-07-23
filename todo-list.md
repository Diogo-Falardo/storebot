-> Create App Lobby []
App lobby is the initial route user access after entering on the bot

  route_specs: {
    route: "/",
    name: "lobby"
  }

App-Lobby-Todo-List:
  - Authentication []
    -> Authentication is now set to level 1 (development mode) [X]
    (production mode means that bot token has been validated)
    -> Authentication level 2 (production mode) []
-- auth:
Verify if its a current user of the bot or if its the first time the user is accessing the bot.
If its the first time generate a user and create user shop
--- after: (validated init data)
store the userId into an jwt cookie
--
  - Access "Shop Center" []
  - Visualize Favourit shops []
