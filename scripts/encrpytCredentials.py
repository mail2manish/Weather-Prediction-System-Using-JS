from cryptography.fernet import Fernet

# Generate a secret key for encryption (keep this key secret)
secret_key = Fernet.generate_key()

# Initialize the Fernet cipher with the secret key
cipher_suite = Fernet(secret_key)

# Read the plaintext configuration file
with open('Credentails.ini', 'rb') as config_file:
    plaintext_config = config_file.read()

# Encrypt the configuration file
encrypted_config = cipher_suite.encrypt(plaintext_config)

# Save the encrypted configuration to a new file
with open('encryptedDatabaseCredentails.enc', 'wb') as encrypted_file:
    encrypted_file.write(encrypted_config)

print("Configuration file encrypted and saved as 'config.enc'")

with open('secret_key.txt', 'wb') as key_file:
    key_file.write(secret_key)
