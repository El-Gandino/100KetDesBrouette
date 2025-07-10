import os.path
import base64
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build
from email import message_from_bytes


class GmailClient:
    SCOPES = ['https://www.googleapis.com/auth/gmail.readonly']
    def __init__(self, credentials_file='app/crendentials.json', token_file='token.json'):
        self.creds = None
        self.service = None
        self.credentials_file = credentials_file
        self.token_file = token_file
        self.authenticate()

    def authenticate(self):
        if os.path.exists(self.token_file):
            self.creds = Credentials.from_authorized_user_file(self.token_file, self.SCOPES)
        if not self.creds or not self.creds.valid:
            if self.creds and self.creds.expired and self.creds.refresh_token:
                self.creds.refresh(Request())
            else:
                flow = InstalledAppFlow.from_client_secrets_file(self.credentials_file, self.SCOPES)

                # Auth manuelle
                auth_url, _ = flow.authorization_url(prompt='consent')
                print(f"👉 Va ici dans ton navigateur : {auth_url}")
                code = input("🔑 Colle le code d'autorisation ici : ")
                flow.fetch_token(code=code)

                self.creds = flow.credentials

            with open(self.token_file, 'w') as token:
                token.write(self.creds.to_json())

        self.service = build('gmail', 'v1', credentials=self.creds)

    def get_last_email(self):
        # Récupère le dernier message
        results = self.service.users().messages().list(userId='me', maxResults=1, labelIds=['INBOX'], q="").execute()
        messages = results.get('messages', [])
        if not messages:
            return None

        message = self.service.users().messages().get(userId='me', id=messages[0]['id'], format='raw').execute()
        msg_raw = base64.urlsafe_b64decode(message['raw'].encode('ASCII'))
        email_message = message_from_bytes(msg_raw)

        email_data = {
            'from': email_message['From'],
            'to': email_message['To'],
            'subject': email_message['Subject'],
            'date': email_message['Date'],
            'body': self._get_email_body(email_message)
        }
        return email_data

    def _get_email_body(self, msg):
        if msg.is_multipart():
            for part in msg.walk():
                content_type = part.get_content_type()
                if content_type == 'text/plain':
                    return part.get_payload(decode=True).decode(errors='ignore')
        else:
            return msg.get_payload(decode=True).decode(errors='ignore')
        return "(Pas de corps de message lisible)"

# Exemple d'utilisation
if __name__ == "__main__":
    client = GmailClient()
    last_email = client.get_last_email()
    if last_email:
        print("Dernier e-mail reçu :")
        for key, value in last_email.items():
            print(f"{key.capitalize()}: {value}")
    else:
        print("Aucun e-mail trouvé.")
