from google.cloud import storage
import pandas as pd
import io


def download_blob(source_blob_name, bucket_name="polkadot-dataset-bucket"):
    """
    Download a blob from the bucket and return its content as bytes.

    Parameters:
    bucket_name (str): The name of the bucket.
    source_blob_name (str): The name of the blob to download.

    Returns:
    bytes: The content of the blob.
    """
    storage_client = storage.Client()

    bucket = storage_client.bucket(bucket_name)
    blob = bucket.blob(source_blob_name)

    # Download the blob's content as bytes
    return blob.download_as_bytes()


def convert_to_dataframe(blob_uri):
    """
    Convert raw API data into a pandas DataFrame.

    Parameters:
    api_data (list): A list of dictionaries representing the API data.

    Returns:
    pd.DataFrame: A DataFrame containing the API data.
    """
    api_data = download_blob(source_blob_name=blob_uri)
    api_data = pd.read_json(io.BytesIO(api_data), lines=True)

    return pd.DataFrame(api_data)
