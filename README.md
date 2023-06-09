# pokemon_final

# Backend

# Link to Video

To see a video explaining the functionality of the site, please click on the following link: https://youtu.be/WSpBoasav2U

# Endpoints

Endpoints are grouped in 4 categories:

- **registration** - relating to the user's registration, sign-in process and password reset
- **addPokemonToParty** - relating to creating a Pokemon's build and saving it to the user's profile
- **profile** - relating to the functionality of the user's profile which includes getting the user's information, updating a specific builds, deleting a specific build and posting the build to the website.
- **builds** - relating to the functionality accessible to a signed-in user if the Pokemon has an active build. Includes getting the build, leaving a comment, deleting a comment and, depending on the user, deleting the build if they are the author or saving the build to their own profile if they aren't the author.

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

If the aforementioned criteria is satisfied, then the following response will be returned with a randomnly generated id value for both the trainer and the pokemon.

```json
{
  "status": 201,
	"data": {
    "id" : "3121090f-1f20-4224-9101-b6b37ac0fb97",
  "trainer": "John",
  "party" : [
  {
    "pokemon": "charizard",
    "entryId" : "fef39a1a-c0d9-46f0-bc76-93bf9885533e",
    "index": "6",
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

## Profile Endpoints

### GET "/profile/:user"

Allows a user to see their profile page.

The expected param is the signed-in user's username.

On success, the following response will be sent:

```json
{
  "status": 200,
  "success" : "true",
	"data": {
    "id" : "3121090f-1f20-4224-9101-b6b37ac0fb97",
  "trainer": "John",
  "party" : [
  {
    "pokemon": "charizard",
    "entryId" : "fef39a1a-c0d9-46f0-bc76-93bf9885533e",
    "index": "6",
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
  ]}
},
```

### PATCH "/pokemon/update/"

Allows a user to update their build from the profile page.

A JSON body is expected in the following format:

```json
{
  "trainer": "John",
  "ability": "blaze",
  "nature": "modest",
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
  },
  "pokemonId": "fef39a1a-c0d9-46f0-bc76-93bf9885533e"
}
```

The same checks will be performed as they were in the "/pokemonPartyAddition" endpoint. If all of the checks are satisfied, the following response will be returned:

```json
{
	"status": 201,
  "message" : "Pokemon successfully updated."
},
```

### DELETE "/pokemon/delete/"

Allows the user to delete a pokemon from their party and remove it from their profile.

A JSON body is expected in the following format:

```json
{
	"trainer": "John",
  "pokemonId" : "fef39a1a-c0d9-46f0-bc76-93bf9885533e"
},
```

On success, the following response will be returned:

```json
{
	"status": 201,
  "message" : "Pokemon was released successfully."
},
```

### POST "/pokemon/postBuild/"

Allows the user to post their own creative build to the main page of the selected Pokemon for other users of the site to see and comment upon.

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
  },
  "description": "This is a dummy description"
}
```

The same checks will be performed as they were in the "/pokemonPartyAddition" endpoint. Furthermore, the description must container at least 100 characters to be accepted as a properly described build. If all of the checks are satisfied, the following response will be returned:

```json
{
	"status": 201,
  "message" : "Build successfully submitted."
},
```

## Builds Endpoints

### GET "/pokemon/getBuilds/:pokemon"

Allows everyone to see a Pokemon's build if it was posted to the site by a signed-in user.

The expected param is the pokemon species currently being viewed by the user.

On success, the following response will be sent:

```json
{
  "status": 200,
  "data": {
    "id": "3121090f-1f20-4224-9101-b6b37ac0fb97",
    "trainer": "John",
    "pokemon": "charizard",
    "index": "6",
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
    },
    "description": "This is a dummy description",
    "comments": ["comment1", "comment2"]
  }
}
```

### PATCH "/pokemon/leaveComment"

Allows a signed-in user to leave a comment about the Pokemon's build.

A JSON body is expected in the following format:

```json
{
	"postId": "3121090f-1f20-4224-9101-b6b37ac0fb97",
  "trainer" : "John",
  "comment" : "This is a dummy comment."
},
```

The comment is expected to be at least 10 characters in length.

On success, the following response will be sent:

```json
{
	"status": 201,
  "message" : "Comment added!"
},
```

### PATCH "/deleteComment/:comment""

Allows the author of the comment to delete their posted comment if they so choose.

A param containing the comments's id is expected.

On success, the following response is returned:

```json
{
	"status": 200,
  "message" : "Comment successfully deleted."
},
```

### DELETE "/pokemon/delete/:build"

Allows the author of the post to delete their posted build if they so choose.

A param containing the Pokemon's entryId is expected.

On success, the following response is returned:

```json
{
	"status": 200,
  "message" : "Build successfully deleted."
},
```

### POST "/pokemonPartyAddition"

Allows a user to save a build they like to their own profile page. This endpoint is the same as the one used previously in the - ## AddPokemonToParty Endpoints - section
