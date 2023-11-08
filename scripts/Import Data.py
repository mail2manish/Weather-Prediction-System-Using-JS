import pandas as pd
import configparser
import pyodbc
from sqlalchemy import create_engine
from sqlalchemy import Integer, String, Numeric, VARCHAR, DECIMAL
from cryptography.fernet import Fernet
import numpy as np
import re
import requests
from bs4 import BeautifulSoup

url = "https://weather.com/en-AU/weather/today/l/ASXX0023:1:AS?Goto=Redirected"

# ---------------- Terminal text formatting ----------------
def redText(Text): return(f"\033[91m{Text}\033[0m")
def greenBackground(Text): return "\x1b[6;30;42m" + Text + "\x1b[0m"

def greenText(Text): return(f"\033[92m{str(Text)}\033[0m")
def headerText(Text): return(f"\033[95m{Text}\033[0m")
def blueText(Text): return(f"\033[94m{Text}\033[0m")
def cyanText(Text): return(f"\033[96m{Text}\033[0m")
def yellowText(Text): return(f"\033[93m{Text}\033[0m")
def redText(Text): return(f"\033[91m{Text}\033[0m")
def boldText(Text): return(f"\033[1m{Text}\033[0m")
def underlineText(Text): return(f"\033[4m{Text}\033[0m")
# ----------------------------------------------------------

with open('secret_key.txt', 'rb') as key_file:
    secret_key = key_file.read()

# Reading encrypted config file
cipher_suite = Fernet(secret_key)
with open('databaseCredentials.enc', 'rb') as encrypted_file:
    encrypted_config = encrypted_file.read()

# Decrypting the config file
plaintext_config = cipher_suite.decrypt(encrypted_config)
config = configparser.ConfigParser()
config.read_string(plaintext_config.decode('utf-8'))

# Allocating decrypted credentials to variables
server = config['database']['server']
database = config['database']['database']
username = config['database']['username']
password = config['database']['password']

# Connecting to the SQL server
conn = pyodbc.connect(
    'DRIVER={SQL Server};'
    f'SERVER={server};'
    'Trusted_Connection=yes;'  # Uses Windows Authentication over login credentials 
    f'DATABASE={database};'
)

# ---------------------------------------------------------------------------------------
# ----- Use the segment below to connect to the database using credentials instead ------
# conn = pyodbc.connect(
#     'DRIVER={SQL Server};'
#     f'SERVER={server};'
#     f'DATABASE={database};'
#     f'UID={username};'
#     f'PWD={password};'
# )
# ---------------------------------------------------------------------------------------


# The following is for the AirTable .csv file in the root directory.

# Specifying data source (as .csv file)
csv_file = 'Imported table-Grid view.csv' # REPLACE AS NECESSARY

engine = create_engine(f'mssql+pyodbc://{server}/{database}?driver=SQL+Server')

# List all column names for selected source
target_columns = {
    'id': Integer,
}

# Selecting columns based on the schema 
selected_columns = {
    'id': Integer,
}

# If neceesary, use datatype mapping below
data_type_mapping = {
    Integer: int,
}

# Mapping column names, if names are not identical between the .csv table and database table attributes
# column naming inconsistancies
column_mapping = {
    'id': 'exmaple_id',
}

df = pd.read_csv(csv_file)
table_name = 'Imported table-Grid view' # located in root, replace name as necessary

# Renaming dataframe columns to the same naming structure as that of the SQL server database food table
df.rename(columns=column_mapping, inplace=True)

# Function to extract numeric values from strings (to address values such as 6g, 250mg etc... in the AirTable)
def extract_numeric(string):
    match = re.search(r'[\d.]+', str(string))
    if match:
        return float(match.group())
    else:
        return None 
    
# Extracting numeric values from strings (replacing values in dataframe - example set up)
df['table_name_1'] = df['table_name_1'].apply(extract_numeric)

print(df)

# Handling NA and INF values by replacing them with 0
columns_with_nonfinite = df.columns[df.isna().any() | df.isin([np.inf, -np.inf]).any()]
# print(columns_with_nonfinite)
for column in columns_with_nonfinite:
    df[column].fillna(0, inplace=True)
    df[column] = df[column].replace([np.inf, -np.inf], 0)

# Datatype Conversion
integer_columns = []
for column, data_type in selected_columns.items():
    if data_type is Integer:
        integer_columns.append(column)

df[integer_columns] = df[integer_columns].astype(int)

# Convert DataFrame columns to their corresponding SQL data types
for column, data_type in selected_columns.items():
    dtype = data_type
    
    if column in df.columns:
        sql_data_type = data_type_mapping.get(dtype, str)  # Default to String if not found
        if sql_data_type is float:
            df[column] = df[column].astype(float)  # Explicitly cast to float

        df[column] = df[column].astype(sql_data_type)
        print(f"{cyanText(column)} | Database Column Datatype: {redText(dtype.__name__)} | Dataframe (AirTable) Column Datatype: {greenText(sql_data_type.__name__)} - {yellowText('Datatype Mapping Complete')}")


table_name = 'food'
df.to_sql(table_name, engine, if_exists='replace', index=False)

conn.close()

print(f"\n{greenBackground('Successful importation of AirTable data into the Database')}\n")
