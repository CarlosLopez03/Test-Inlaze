# My Awesome Nest.js Application

Welcome to my awesome Nest.js application! This application is built using Nest.js, a progressive Node.js framework for building efficient, reliable, and scalable server-side applications.

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [Tests](#tests)
- [Contributing](#contributing)
- [License](#license)

## Introduction

This application serves as a backend for managing publications and likes. It provides endpoints to create, read, update, and delete publications, as well as to like publications. Additionally, it includes authentication and authorization features for securing access to the endpoints.

## Features

- CRUD operations for managing publications
- Like functionality for publications
- Authentication and authorization using JWT tokens
- Swagger documentation for API endpoints
- Docker support for containerization
- Pagination and filtering for listing publications

## Prerequisites

Before running this application, ensure you have the following prerequisites installed:

- Node.js and npm
- MongoDB
- Redis (for caching or session management)
- Docker (optional, for containerization)

## Installation

1. Clone this repository to your local machine:

```bash
$ git clone https://github.com/CarlosLopez03/Test-Inlaze
```

2. Navigate to the project directory:

```bash
$ cd prueba-inlaze
```

3. Install dependencies:

```bash
$ npm install
```

## Configuration

Before running the application, you need to configure some environment variables. Copy the `.env.example` file to `.env` and update the variables with your values.

```bash
$ cp .env.example .env
```

## Usage

To start the application, run the following command:

```bash
$ npm run start
```

The application will start listening on the specified port (default is 3000). You can then access the API endpoints using a tool like Postman or curl.

## API Documentation

The API documentation is generated using Swagger. Once the application is running, you can access the Swagger UI at /api endpoint. This page provides detailed documentation for all available endpoints along with request and response examples.