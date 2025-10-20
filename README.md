# Moisture Monitoring API Project

This is a simple API project built with Laravel to log and retrieve moisture level data.

## Technologies Used

- PHP 8.2+
- Laravel 12
- Composer

## Installation and Setup

1.  **Clone this repository:**
    ```bash
    git clone <your-repository-url>
    cd moisture
    ```

2.  **Navigate to the server directory:**
    ```bash
    cd server
    ```

3.  **Install Composer dependencies:**
    ```bash
    composer install
    ```

4.  **Copy the `.env.example` file to `.env`:**
    ```bash
    copy .env.example .env
    ```

5.  **Generate the application key:**
    ```bash
    php artisan key:generate
    ```

6.  **Configure your database in the `.env` file:**
    ```
    DB_CONNECTION=mysql
    DB_HOST=127.0.0.1
    DB_PORT=3306
    DB_DATABASE=laravel
    DB_USERNAME=root
    DB_PASSWORD=
    ```

7.  **Run the database migrations:**
    ```bash
    php artisan migrate
    ```

8.  **(Optional) Run the seeder to populate initial data:**
    ```bash
    php artisan db:seed --class=MoistureLogSeeder
    ```

9.  **Run the development server:**
    ```bash
    php artisan serve
    ```
    The application will be running at `http://127.0.0.1:8000`.

## API Endpoints

All endpoints are prefixed with `/api`.

### Log Moisture Data

-   **URL:** `/moisture/log`
-   **Method:** `POST`
-   **Request Body (JSON):**
    ```json
    {
        "moisture_level": 75.5
    }
    ```
-   **Success Response (201 Created):**
    ```json
    {
        "message": "Moisture log created successfully",
        "data": {
            "moisture_level": 75.5,
            "updated_at": "2025-10-20T12:00:00.000000Z",
            "created_at": "2025-10-20T12:00:00.000000Z",
            "id": 1
        }
    }
    ```

### Retrieve Moisture Data

-   **GET `/moisture/today`**: Retrieves moisture data for today.
-   **GET `/moisture/three-days`**: Retrieves moisture data for the last three days.
-   **GET `/moisture/seven-days`**: Retrieves moisture data for the last seven days.
-   **GET `/moisture/all-days`**: Retrieves all moisture data.

-   **Success Response (200 OK):**
    ```json
    {
        "message": "Data retrieved successfully",
        "data": [
            {
                "id": 1,
                "moisture_level": 75.5,
                "created_at": "2025-10-20T12:00:00.000000Z",
                "updated_at": "2025-10-20T12:00:00.000000Z"
            }
            // ... other data
        ]
    }
    ```
