import os.path
import base64
import imaplib
import email
from email import message_from_bytes
from email.header import decode_header


class mailClient:
        
    def authMailClient(self):
           # Remplacez ces valeurs par les informations de votre serveur de messagerie
            host = "mail.infomaniak.com" # ou l'adresse de votre serveur IMAP
            port = 993  # ou le port de votre serveur IMAP
            username = " webapp@sylylrdm.ch"
            password = "PVjaT$25p1B56g6" # ou un mot de passe d'application si vous avez l'authentification à deux facteurs activée

            try:
                # Utilisez le protocole SSL si votre serveur l'exige
                imap = imaplib.IMAP4_SSL(host, port) 
                # Ou sans SSL pour les ports non sécurisés
                # imap = imaplib.IMAP4(host, port)
                # Authentifiez-vous
                imap.login(username, password)
                return imap
            except imaplib.IMAP4.IMAP4Error as e:
                print(f"Erreur de connexion: {e}")
                exit() 


    #def getLastMailsFrom(emailSource, imap_serv
    # er, email_user, email_pass)
    def getLastMailsFrom(self,emailSource,mail):
        try:
            # Connexion au serveur IMAP
            mail.select("inbox")
            # Recherche des mails de l'expéditeur
            status, messages = mail.search(None, f'FROM "{emailSource}"')
            if status != "OK" or not messages[0]:
                print("Aucun mail trouvé.")
                return None  # Aucun mail trouvé
            # Récupération de l'ID du dernier mail
            mail_ids = messages[0].split()
            latest_email_id = mail_ids[-1]

            # Extraction du contenu du dernier mail
            status, msg_data = mail.fetch(latest_email_id, "(RFC822)")
            raw_email = msg_data[0][1]
            msg = email.message_from_bytes(raw_email)

            # Décodage du sujet
            subject, encoding = decode_header(msg["Subject"])[0]
            if isinstance(subject, bytes):
                subject = subject.decode(encoding or "utf-8")

            # Récupération du corps du message
            if msg.is_multipart():
                for part in msg.walk():
                    content_type = part.get_content_type()
                    content_disposition = str(part.get("Content-Disposition"))

                    if content_type == "text/plain" and "attachment" not in content_disposition:
                        body = part.get_payload(decode=True).decode()
                        break
            else:
                body = msg.get_payload(decode=True).decode()
            return {
                "from": msg["From"],
                "subject": subject,
                "body": body.strip()
            }
        except Exception as e:
            print("Erreur lors de la récupération du mail:", str(e))
            return None
        finally:
            try:
                mail.logout()
            except:
                pass
