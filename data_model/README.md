# Data API Client

This project is a Python package designed to retrieve data from an API and import it as a pandas DataFrame. It provides a simple interface for making API requests and handling the data efficiently.

## Features

- Fetch data from a specified API endpoint.
- Convert the retrieved data into a pandas DataFrame for easy manipulation and analysis.
- Modular design with clear separation of concerns.

## Installation

To install the package, you can use pip:

```bash
pip install data-api-client
```

## Usage

Here is a basic example of how to use the `data_api_client` package:

```python
from data_api_client.client import ApiClient
from data_api_client.utils.dataframe_converter import convert_to_dataframe

# Initialize the API client
client = ApiClient(base_url='https://api.example.com')

# Fetch data from the API
data = client.fetch_data(endpoint='/data')

# Convert the raw data to a DataFrame
df = convert_to_dataframe(data)

# Display the DataFrame
print(df)
```

## Contributing

Contributions are welcome! Please feel free to submit a pull request or open an issue for any suggestions or improvements.

## License

This project is licensed under the MIT License. See the LICENSE file for more details.