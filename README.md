#Social Spark
# Langflow Integration with AstraDB

## Project Overview

This project integrates Langflow with AstraDB to facilitate easy data interaction for social media posts. Users can submit different types of social media posts (Static, Carousel, Reels) via the frontend, which are then processed using Langflow's API. Additionally, the data is stored and queried from AstraDB to calculate and analyze posts
and their performance and gives suggestion for future posts and which post type will work the best.

### Features:
- Langflow API integration for submitting and retrieving data.
- AstraDB integration for querying social media post data and calculating averages.
- Dynamic post type selection (Static, Carousel, Reels) and data retrieval based on user input.

## File Structure

```
/web-app
  ├── /src
      ├── /app
          ├── /api
              ├── /astra-db
                  ├── get-data
                  └── insert-data
      ├── /components
          └── DB_connect.js
      └── /pages
          └── LangflowPage.js
```

## Getting Started

### 1. Install Dependencies

To set up the project, follow these steps:

1. Clone this repository to your local machine.
2. Navigate to the project directory.
3. Run the following command to install dependencies:

```bash
npm install
```

### 2. Set Up Environment Variables

The project requires several environment variables to function properly. Create a `.env` file in the root directory of the project and add the following variables:

```
ASTRA_TOKEN=<your_astra_db_token>
FLOW_ID=<your_flow_id>
LANGFLOW_ID=<your_langflow_id>
ASTRA_TB=<your_astra_tb_token>
```

### 3. Running the Project Locally

Once the environment variables are configured, you can start the development server with:

```bash
npm run dev
```

This will start the Next.js server locally. You can view the application at `http://localhost:3000`.

### 4. API Endpoints

- **/api/astra-db/get-data/route.js**: Fetches the average comments, shares, and likes for each post type from AstraDB.
- **/api/astra-db/insert-data/route.js**: Inserts the data from a local JSON file into AstraDB.
- **/pages/LangflowPage.js**: Handles user input, submits data to Langflow API, and displays the results.

### 5. Frontend

- The frontend allows users to choose between different post types: "Static", "Carousel", and "Reels".
- Once a post type is selected, the data is fetched from AstraDB, and the results are displayed.

## Deployment

To deploy the project to a production environment, follow these steps:

1. Choose a platform like Vercel, Netlify, or Heroku.
2. Deploy the project and ensure that the environment variables are configured properly.

## Contributing

If you would like to contribute to this project, feel free to open issues or submit pull requests. Contributions are welcome!

## License

This project is licensed under the MIT License.

## Acknowledgements

- Langflow API
- AstraDB
