# pokemon_final

# Backend

# Endpoints

Endpoints are grouped in ???? categories:

- **registration** - relating to the user's registration, sign-in process and password reset
- **addPokemonToParty** - relating to creating a Pokemon's build and saving it to the user's profile

## Registration Endpoints

### POST /createUser

Allows the user to register to the website

A JSON body is expected in the following format:

```json
{
  "user": "John",
  "password": "ExamplePW1",
  "email": "johnsmith@email.com"
}
```

The password must be 8 characters long and include at least 1 number. If the user and email are accepted as well, then the following response will be returned:

```json
{
	"status": 201,
	"data": "John",
  "message" : "User successfully created."
},
```

### POST "/signinUser"

Allows a pre-registered user to log into the website.

A JSON body is expected in the following format:

```json
{
  "user": "John",
  "email": "johnsmith@email.com",
  "password": "ExamplePW1"
}
```

If the user enters the valid username, email and password, the following response will be returned:

```json
{
	"status": 200,
	"data": "John",
  "message" : "Log in successful."
},
```

### PATCH "/resetPassword"

Allows a pre-registered user to reset their password.

A JSON body is expected in the following format:

```json
{
  "user": "John",
  "email": "johnsmith@email.com",
  "password": "NewExamplePW1",
  "passwordRepeat": "NewExamplePW1"
}
```

If the password respects the previous criteria, the following response will be returned:

```json
{
	"status": 201,
  "message" : "Password successfully changed."
},
```

## AddPokemonToParty Endpoints

### POST "/pokemonPartyAddition"

Allows a logged-in user to create a Pokemon build and save it to their profile.

A JSON body is expected in the following format:

```json
{
  "trainer": "John",
  "name": "charizard",
  "id": "6",
  "generation": "red-blue",
  "ability": "blaze",
  "nature": "modest",
  "level": "100",
  "item": "life-orb",
  "iv": {
    "hp": "31",
    "atk": "31",
    "def": "31",
    "spAtk": "31",
    "spDef": "31",
    "spd": "31"
  },
  "ev": {
    "hp": "0",
    "atk": "0",
    "def": "0",
    "spAtk": "252",
    "spDef": "4",
    "spd": "252"
  },
  "stats": ["200", "175", "150", "391", "193", "301"],
  "attacks": {
    "atk1": "flamethrower",
    "atk2": "air-slash",
    "atk3": "solar-beam",
    "atk4": "hyper-beam"
  }
}
```

Certain fields must respect specific criteria:

1. An ability and a nature must be defined.
2. Any individual iv value cannot exceed 31.
3. Any individual ev value cannot exceed 252 and the total of all 6 cannot exceed 510.
4. The attacks must all be unique.

If the aforementioned criteria is satisfied, then the following response will be returned with a randomnly generated id value.

```json
{
  "status": 201,
	"data": {
    "id" : "1234_4224_4241_4124",
  "trainer": "John",
  "party" : [
  {
    "name": "charizard",
    "id": "6",
    "generation": "red-blue",
    "ability": "blaze",
    "nature": "modest",
    "level": "100",
    "item": "life-orb",
    "iv": {
      "hp": "31",
      "atk": "31",
      "def": "31",
      "spAtk": "31",
      "spDef": "31",
      "spd": "31"
    },
    "ev": {
      "hp": "0",
      "atk": "0",
      "def": "0",
      "spAtk": "252",
      "spDef": "4",
      "spd": "252"
    },
    "stats": ["200", "175", "150", "391", "193", "301"],
    "attacks": {
      "atk1": "flamethrower",
      "atk2": "air-slash",
      "atk3": "solar-beam",
      "atk4": "hyper-beam"
      }
    }
  ]},
  "message" : "Pokemon successfully added to party."
},
```
