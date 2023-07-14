# IntegritasAPITesting
Prototype project for testing purpose

# Car Rental Service API Testing

This repository contains automated tests for the Car Rental Service API. The tests are implemented using Cypress and TypeScript.

## Test Scenarios Covered

1. Positive test cases for successful creation, retrieval, and cancellation of reservations.
2. Test cases to handle error conditions, such as providing invalid inputs or requesting a non-existent reservation.
3. Boundary test cases to ensure the API handles edge cases, such as reservations with minimum and maximum date ranges and maximum character limits for customer names.
4. Test cases to validate the behavior of the API when creating multiple overlapping reservations for the same car.

## Project Structure

- `cypress/e2e`: This directory contains the test scripts.
- `cypress/fixtures`: This directory contains the JSON fixtures used in the tests.

## Setup and Execution

1. Clone the repository:

git clone https://github.com/lucasvacis11/IntegritasAPITesting.git

2. Install dependencies:

npm install

3. Update the `cypress/fixtures/reservation.json` file with the required test data.
