import time
from fastapi import FastAPI
from .getMail import mailClient 
import re

app = FastAPI()  # Création de l'application FastAPI

@app.get("/")
def read_root():
    return {"message": "Bienvenue sur l'API"}

@app.get("/mails")
def get_position():
    # Créer une instance
    # Récupérer le dernier email
    mail_client = mailClient()
    imap = mail_client.authMailClient()
    content_mail  = mail_client.getLastMailsFrom("syly.gandini@gmail.com",imap)
    link_livetrack = get_livetrack_links_from_email(content_mail)
    response = make_success_response(
        data= link_livetrack,
        message="LiveTrack link success retrieved",
    )
    return response


def get_livetrack_links_from_email(email_data):
    body = email_data.get("body", "")
    urls = re.findall(r'https?://[^\s<>"]+', body)
    for url in urls:
        if 'livetrack' in url.lower():
            return {"livetrack": url}
    return {"livetrack": None}


    # Fonction pour extraire les liens du mail
# Fonction principale pour exécuter le suivi en boucle
def make_success_response(data, message="OK", code=200):
    return {
        "status": "success",
        "code": code,
        "data": data,
        "message": message,
        "timestamp": int(time.time()),
        "version": "0.0.1"      
    }

if __name__ == "__main__":
    main()