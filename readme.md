# AJAX Utility

## Overview
This module provides a utility function `ajax` to make HTTP requests using the Fetch API with additional features such as query parameter serialization, error handling, and structured request options.

## Features
- Supports different HTTP request methods (GET, POST, PUT, DELETE, etc.).
- Automatically serializes query parameters and request bodies.
- Provides default request options (mode, cache, credentials, etc.).
- Custom error handling for HTTP responses.

## Installation
To use this utility, import it into your project:
```javascript
import ajax from './ajax';
```

## Usage

### Basic GET Request
```javascript
ajax('https://api.example.com/data')
  .then(response => console.log(response))
  .catch(error => console.error(error));
```

### GET Request with Query Parameters
```javascript
ajax('https://api.example.com/data', {
  method: 'GET',
  query: { userId: 123, status: 'active' }
})
.then(response => console.log(response))
.catch(error => console.error(error));
```

### POST Request with JSON Body
```javascript
ajax('https://api.example.com/data', {
  method: 'POST',
  body: { name: 'John Doe', age: 30 }
})
.then(response => console.log(response))
.catch(error => console.error(error));
```

### Custom Headers
```javascript
ajax('https://api.example.com/data', {
  method: 'GET',
  headers: { Authorization: 'Bearer your_token' }
})
.then(response => console.log(response))
.catch(error => console.error(error));
```

## API Reference

### `ajax(url: string, props?: object): Promise<any>`
Performs an HTTP request.

#### Parameters:
- `url` *(string)*: The endpoint URL.
- `props` *(object, optional)*: Additional options for the request, including:
  - `method` *(string)*: HTTP method (default: `GET`).
  - `body` *(object)*: Request payload (for POST, PUT, DELETE, etc.).
  - `query` *(object)*: Query parameters.
  - `headers` *(object)*: Custom request headers.
  - `mode` *(string)*: Fetch mode (`cors`, `no-cors`, `same-origin`).
  - `cache` *(string)*: Cache control (`default`, `no-cache`, `reload`, etc.).
  - `credentials` *(string)*: Credentials policy (`same-origin`, `include`, `omit`).
  - `redirect` *(string)*: Redirect policy (`follow`, `manual`, `error`).

#### Returns:
A `Promise` resolving to the response data.

## Helper Functions
- `getUrlWithParams(url: string, params: object)`: Generates a URL with path parameters.
- `getUrl(url: string, props: object)`: Appends query parameters to a URL.
- `getHeaders(props: object)`: Generates request headers.
- `handleResponse(res: Response)`: Parses the response.
- `handleError(res: Response)`: Handles HTTP errors.

## License
This module is open-source and can be used freely in projects.

