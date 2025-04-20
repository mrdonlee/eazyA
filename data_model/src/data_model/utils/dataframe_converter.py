import pandas as pd


def convert_to_dataframe(api_data):
    """
    Convert raw API data into a pandas DataFrame.

    Parameters:
    api_data (list): A list of dictionaries representing the API data.

    Returns:
    pd.DataFrame: A DataFrame containing the API data.
    """
    return pd.DataFrame(api_data)
