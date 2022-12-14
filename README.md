# Food Fight 2022

This is a web application in which two foodstuffs duel each other :-)

Live demo @ [koodihaaste.matiasraisanen.com](https://koodihaaste.matiasraisanen.com/index.html)

```json
  "techKeywords": [
    "TypeScript",
    "React",
    "AWS CDK",
    "Serverless",
    "Github Actions",
    "Jest",
    "Fullstack",
    "Linux"
  ]
```

## Introduction

The objective of this project is to take part in Solidabis code challenge 2022 //
[Solidabis koodihaaste 2022](https://koodihaaste.solidabis.com/intro)

_Should the above URL be unavailable or updated, check [this snapshot](https://web.archive.org/web/20221011125550/https://koodihaaste.solidabis.com) on the Wayback Machine from 11-Oct-2022_

In the challenge the developer must create a fullstack application, in which a user can select two foodstuffs to "fight" each other.

The application must:

1. Retrieve nutritional contents of foodstuffs from a 3rd party source
2. Transform nutritional contents into character attributes
3. Have logic that allows two foodstuffs to duel each other
4. Present the duel results visually on the front end

I took the liberty of only using English in the project.  
Fighter names (food items) will be Finnish though.

Here's a little list of some fighters to try out.

| EN      | FI       |
| ------- | -------- |
| apple   | omena    |
| carrot  | porkkana |
| tomato  | tomaatti |
| potato  | peruna   |
| sausage | makkara  |

## Local development

You can run this application's frontend locally:  
`cd static && npm i && npm run start`

Local tests can be run like so:  
`npm run test`

The local version will still contact the actual production backend on AWS.

Backend can be deployed using CDK from under `infra` folder, but in order for it to work you need to configure your own AWS credentials, which I will not go into here.

---

## Infrastructure

The application as a whole is hosted on Amazon Web Services

![Koodihaaste infra](./architecture/architecture.drawio.svg)

## Back end

The back end is built and deployed using AWS Cloud Development Kit ([AWS CDK](https://aws.amazon.com/cdk/)), which lets the developer define the infrastructure as code.

The benefit here is that making changes to deployed infrastructure is easy, as it can be done through code and without the need to use any slow GUI.

CDK supports multiple programming languages, and I chose [TypeScript](https://www.typescriptlang.org/) as my language of choice. Its types bring some extra safety to writing complex web applications and lets me catch errors early.

## Front end

The front end is a simple react app, created from scratch using [create-react-app](https://reactjs.org/docs/create-a-new-react-app.html) and [React Bootstrap](https://react-bootstrap.github.io/) components.

It is hosted on AWS as a static website on an S3 Bucket.

## CI/CD

The application has an automated CI/CD-pipeline using [Github actions](https://github.com/features/actions).

Every tagged release on Github will launch a [deployment](./.github/workflows/deploy.yaml) to AWS.  
The pipeline can also be run manually, using a workflow dispatch.

The pipeline has also testing built in, so the application will not be deployed if a test fails.

## Deployment from local machine

Additionally to the automated CI/CD pipeline, the application can also be deployed from the local machine using the [deploy script](./deploy.sh)

`bash ./deploy.sh`

If you want to deploy the application, you have to change the deploy script to use your own AWS credentials, and also purchase a domain name to be used with the deployment.

---

## Food Fight - How it works?

- On the front end, the user will type a food into a search box and press "submit".

- The frontend will call API Gateway, which will forward the request to a lambda function
- The lambda function will call **Fineli foods API** with the requested food.
- Fineli responds with an array of all the items it found in its database.
- The lambda function will then try to find the food item in its most unprocessed and raw form.

```javascript
item.type.code = "FOOD" && item.preparationMethod[0].code = "RAW"
```

- If no unprocessed version can be found, we will just fall back to the first item in the list.

- The lambda function then converts the response into fighter stats.

  ```json
  {
    "statusCode": 200,
    "message": "success",
    "data": {
      "originalName": "Omena, ulkomainen, kuorineen",
      "hp": 38.852571462547175,
      "damage": 8.19540006637573,
      "defense": 0.165299997925758,
      "wait": 8.447700065597887,
      "aps": 0.1183754148744419,
      "dps": 0.9701338829192556
    }
  }
  ```

  **API response, fighter stats after conversion**

- Once the user has selected two fighters, they will press "FIGHT" to start the fight.

- The frontend will then use simple maths to calculate the winner of the food fight, and display the fight results as a scrolling log.

## Character stats

| Stat          | Formula                             | Notes                                                             |
| ------------- | ----------------------------------- | ----------------------------------------------------------------- |
| Original Name |                                     | Name of the food item in Fineli's database                        |
| HP            | energy (1kcal = 1hp)                | Total health points                                               |
| DAMAGE        | carbs (1g = 1pt)                    | Damage per strike                                                 |
| DEFENSE (%)   | protein (1g = 1%)                   | Mitigates damage from an incoming strike by a percentage. 1g = 1% |
| WAIT          | protein + carbs + fats = WAIT (sec) | Amount of seconds to wait after each strike.                      |
| APS           | 1 sec / WAIT                        | Number of attacks per second                                      |
| DPS           | DAMAGE / WAIT                       | Damage per second. Not used for logic, but a nice to know stat    |

## Fight logic

After the user presses "fight", the fighters will keep firing attacks against each other at intervals defined by their wait time.

Damage from a single attack will be mitigated by the target's defense, after which the remaining damage points will be deducted from the target's HP.

Whoever runs out of HP first loses.

To avoid the audience getting bored of slow fights, the fights will be carried out at 100x speed :-)
