# Apigee Snapshot

This script generates a snapshot of Apigee API proxies and shared flows across multiple environments in a specified organization. The script retrieves information about deployments, revisions, and other metadata for each API proxy and shared flow and creates a snapshot in JSON format.

## Prerequisites

Before running the script, make sure you have the following:

- Node.js (version 14 or later)
- An Apigee account with read and api permissoin
- A configuration file (`config.json`) that specifies the organization name, access token, and list of environments, API proxies, and shared flows to include in the snapshot

## Installation

1. Clone or download the script to your local machine.
2. Open a terminal window and navigate to the directory where the script is saved.
3. Run `npm install` to install the required dependencies.

## Usage

To generate a snapshot, run the following command:

```
npm start
```

The script will retrieve information about API proxy and shared flow-deployments, revisions, and other metadata and create a snapshot in JSON format. The snapshot will be saved in the `./snapshots` directory with a file name that includes the organization name.

## Configuration

The script requires a configuration file (`config.json`) that specifies the following:

- `organization`: The name of the Apigee organization to generate a snapshot for.
- `token`: An access token with the read and api privileges for the organization.
- `environments`: An array of environment to include in the snapshot.
- `apiProxies`: An array of objects that specify the names of API proxies to include in the snapshot.
- `sharedFlows`: An array of objects that specify the names of shared-flows to include in the snapshot.


## License

This script is licensed under the [MIT License](LICENSE).