# solidabis-koodihaaste-2022

Coding challenge for Solidabis //
[Solidabis koodihaaste 2022](https://koodihaaste.solidabis.com/intro)

## Infrastructure

![Koodihaaste infra](./architecture.drawio.svg)

## Back end

The backend is hosted on Amazon Web Services.
The infra is built and deployed using AWS Cloud Development Kit ([AWS CDK](https://aws.amazon.com/cdk/)), which lets the user define the infrastructure in code.

API Gateway will forward the request to a lambda function, which will then in turn call **Fineli foods API** with the requested food. The lambda will then parse the "fighter" stats from the answer, and return them to the frontend.

## Front end

Front end is a simple react app, which implements [Material UI](https://mui.com/) components.
It is also hosted on AWS.

## Final notes

I would like to take part in the koodihaaste-competition. I am also open for interesting job offers **:-)**

You can contact me at [matias@matiasraisanen.com](mailto:matias@matiasraisanen.com)
