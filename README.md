# Mostro Relay Tester

This project is a testing suite for [Mostro's relay](wss://relay.mostro.network). It validates the functionality of creating, retrieving, updating, and deleting orders through the WebSocket API provided by the relay.

## Features

- **Order Creation**: Tests the ability to create and send an order to the relay.
- **Order Validation**: Ensures invalid data is properly rejected.
- **Order Retrieval**: Verifies that orders can be retrieved by their ID.
- **Order Updates**: Confirms that existing orders can be updated.
- **Order Deletion**: Tests the ability to delete an order.

## Prerequisites

Before running the tests, ensure you have the following installed:

- **Node.js**: Version 18 or higher is recommended.
- **npm**: Comes with Node.js.

## Installation

1. Clone this repository:
   ```bash
   git clone https://github.com/fabohax/mostro-tester.git
   cd mostro-tester
   ```

2. Install the project dependencies:

    ``npm i``
   
## Running the Tests

To run the tests, execute the following command:

``npx mocha``