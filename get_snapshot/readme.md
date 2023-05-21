# Apigee Snapshot

This script generates a snapshot of Apigee API proxies and shared flows across multiple environments in a specified organization. The script retrieves information about deployments, revisions, and other metadata for each API proxy and shared flow and creates a snapshot in JSON format.

## Prerequisites

Before running the script, make sure you have the following:

- Node.js (version 14 or later)
- An Apigee account with read and api permissoin
- A configuration file (`settings.json`) that specifies the list of environments, API proxies, and shared flows to include in the snapshot

## Installation

1. Clone or download the script to your local machine.
2. Run `npm install` to install the required dependencies.

## Configuration
The script requires a configuration file (`.env`) that specifies the following:

    TOKEN=your-google-access_token
    ORG=your-apigee-organization
    ENVS=["list","your","envs"]


## Usage

1. Navigate to the directory `/get_snapshot` and add the snapshot information at `seetings.json`

2. Run the following command:

    ```
    npm run snapshot
    ```

The script will retrieve information about API proxy and shared flow-deployments, revisions, and other metadata and create a snapshot in JSON format. The snapshot will be saved in the `./snapshots` directory with a file name that includes the organization name.




## License

This script is licensed under the [MIT License](LICENSE).