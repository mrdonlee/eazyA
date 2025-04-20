from typing import Dict, Any
import json


def read_abi(filepath: str) -> Dict[str, Any]:
  """
  Read a JSON file and return its contents as a Python dictionary.
  
  :param filepath: Path to the JSON file
  :return: Dictionary containing the JSON data
  :raises FileNotFoundError: If the file does not exist
  :raises json.JSONDecodeError: If the file is not valid JSON
  """
  try:
      with open(filepath, 'r') as file:
        data = json.load(file)
      return data
  except FileNotFoundError:
      print(f"Error: File '{filepath}' not found.")
      raise
  except json.JSONDecodeError:
      print(f"Error: File '{filepath}' contains invalid JSON.")
      raise