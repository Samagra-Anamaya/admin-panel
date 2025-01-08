# STRIDE Admin

This is a **react-admin** based admin panel with two login options for **MJJY** and **STE** admins.

The view for **MJJY** admin shows them list of GP's and villages under them as well as the list of submissions. 

They can:
- view a submission
- give feedback on each submission
- view their given feedback
- approve or flag a submission.

The view for **STE** admin shows them a list of users and departments. The admin can create a department or a user.

To **create a department**, admin types a department name and assigns a schema in JSON format to be enter by users of that department.

To **create a user**, admin types a username and password along with a department to assign the user.

These users then use APIs to submit department data of citizens in specified schemas.

## Installation

Install the application dependencies by running:

```sh
npm install
# or
yarn install
```

## Development

Start the application in development mode by running:

```sh
npm run dev
# or
yarn dev
```

## Production

Build the application in production mode by running:

```sh
npm run build
# or
yarn build
```

## DataProvider

The included data provider use [ra-data-simple-rest](https://github.com/marmelab/react-admin/tree/master/packages/ra-data-simple-rest). It fits REST APIs using simple GET parameters for filters and sorting. This is the dialect used for instance in [FakeRest](https://github.com/marmelab/FakeRest).

You'll find an `.env` file at the project root that includes a `VITE_JSON_SERVER_URL` variable. Set it to the URL of your backend.

## Authentication

The included auth provider should only be used for development and test purposes.
You'll find a `users.json` file in the `src` directory that includes the users you can use.

You can sign in to the application with the following usernames and password:
- janedoe / password
- johndoe / password

