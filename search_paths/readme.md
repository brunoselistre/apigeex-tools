# Apigee API Path Search

This Node.js script allows you to search for a specific basepath within the deployments of Apigee APIs. It prompts the user for a basepath input, queries the Apigee API to find matching paths, and displays the relevant information.

## Prerequisites

- Node.js (version 14 or later)
- An Apigee account with read and api permissoin

## Getting Started

1. Install the required dependencies by running the following command in the terminal:
   ```
   npm install
    ```

2. Create a .env file at `/apigeex-tools`. In this case, the script requires the following environment variables:
    ```
    TOKEN=your-google-access_token
    ORG=your-apigee-organization
    ENVS=["list","your","envs"]
    ```
3. Run the following command:
    ```
    npm run search
    ```
4. Done! The script will prompt you to enter a basepath. Provide the basepath you want to search for and press Enter.
