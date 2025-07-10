# Application de Suivi des Sommets des 26 Cantons

## Description
Cette application web permet de suivre en temps réel la position de votre frère durant son projet ambitieux de gravir tous les sommets des 26 cantons. Elle offre une visualisation claire et intuitive des trajets effectués sur plusieurs jours.

## Fonctionnalités
- **Suivi en temps réel** : Affichage des positions géographiques sur plusieurs jours.
- **Acquisition des données** : Intégration avec une montre connectée de sport (Garmin) et un téléphone pour collecter les données de localisation.

## Technologies utilisées
- **Frontend** : [à compléter]
- **Backend** : [à compléter]
- **Base de données** : [à compléter]
- **API Garmin** : Pour l'acquisition des données depuis la montre connectée.
## API
### Structure
gps_tracker_api/
├── app/
│   ├── main.py              # Point d'entrée FastAPI
│   ├── models.py            # Modèles SQLAlchemy (User, Position)
│   ├── schemas.py           # Schémas Pydantic (validation/DTO)
│   ├── crud.py              # Fonctions DB (insert, read...)
│   ├── garmin.py            # Intégration Garmin API
│   ├── database.py          # Connexion DB
│   ├── routes/
│   │   ├── positions.py     # Routes pour recevoir/envoyer des positions
│   │   └── users.py         # (Optionnel) routes pour gestion utilisateur
│   └── config.py            # Variables d'environnement
├── requirements.txt
└── README.md


## Installation
1. Clonez ce dépôt :  
    ```bash
    git clone <url-du-repo>
    ```
2. Installez les dépendances :  
    ```bash
    npm install
    ```
3. Configurez les paramètres d'intégration avec Garmin et le téléphone.
pip install --upgrade google-api-python-client google-auth-httplib2 google-auth-oauthlib

## Utilisation
1. Lancez le serveur :  
    ```bash
    npm start
    ```
2. Accédez à l'application via votre navigateur à l'adresse : `http://localhost:3000`.

 source venv/bin/activate  # ou . venv/bin/activate
 uvicorn app.main:app --host 192.168.1.13 --port 8000 --reload
## Contributions
Les contributions sont les bienvenues. Veuillez soumettre une pull request ou ouvrir une issue pour discuter des améliorations.

## Licence
[À compléter]
