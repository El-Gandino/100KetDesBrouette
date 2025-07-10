<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>40k et des brouette</title>
    <meta name="description" content="Projet sportif et humain : gravir les 26 sommets cantonaux suisses en un mois à la force humaine. Suivez Loïc & Loïc dans leur périple entre vélo, alpinisme et trail.">
    <!-- Référencement par les moteurs de recherche -->
  <meta name="robots" content="index, follow">
  <link rel="canonical" href="https://www.sylylrdm.ch/">

  <!-- Open Graph (réseaux sociaux comme Facebook, LinkedIn) -->
  <meta property="og:title" content="40k et des brouettes – Aventure humaine en Suisse">
  <meta property="og:description" content="Suivez Loïc & Loïc dans leur défi unique : relier les 26 sommets des cantons suisses sans moteur, entre vélo, alpinisme et trail.">
  <meta property="og:type" content="website">
  <meta property="og:url" content="https://www.sylylrdm.ch/">
  <meta property="og:image" content="https://www.sylylrdm.ch/images/Personnes/project.jpg">

  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="40k et des brouettes – Défi suisse 100% humain">
  <meta name="twitter:description" content="Découvrez le projet fou de Loïc & Loïc : 26 sommets cantonaux, 1700 km, 51000 m D+, en un mois.">
  <meta name="twitter:image" content="https://www.sylylrdm.ch/images/Personnes/project.jpg">

  <!-- Favicon -->
  <link rel="icon" href="/favicon.ico" type="image/x-icon">


    <link rel="stylesheet" href="styles/main.css">
    <script src="scripts/structurRender.js"></script>
</head>
<?php

    // Chargement des variables d'environnement depuis .env
    if (file_exists('.env')) {
        foreach (file('.env', FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES) as $line) {
            if (strpos($line, '=') !== false) {
                [$key, $value] = explode('=', $line, 2);
                putenv(trim($key) . '=' . trim($value, "\"'"));
            }
        }
    }

    // Paramètres IMAP
    $host = 'mail.infomaniak.com';
    $port = 993;
    $mailbox = "{{$host}:{$port}/imap/ssl}INBOX";
    $username = getenv('mailsUser');
    $password = getenv('mailsPasswd');
    $emailSource = 'noreply@garmin.com';

    $return = ['livetrack' => null];

    // Connexion IMAP
    $imap = @imap_open($mailbox, $username, $password);
    if (!$imap) {
        exit("Erreur IMAP : " . imap_last_error());
    }

    // Recherche des derniers mails de l'expéditeur
    $uids = imap_search($imap, 'FROM "' . $emailSource . '"', SE_UID);
    if (!$uids) {
        imap_close($imap);
        exit("Aucun email de $emailSource trouvé.");
    }
    rsort($uids); // Dernier en premier
    $latestUid = $uids[0];

    // Fonction récursive d'extraction du corps du message
    function extractBody($imap, $uid, $structure = null, $partNum = ''): string {
        if (!$structure) {
            $structure = imap_fetchstructure($imap, $uid, FT_UID);
        }

        $body = '';

        if (isset($structure->parts)) {
            foreach ($structure->parts as $i => $part) {
                $newPartNum = $partNum === '' ? ($i + 1) : "$partNum." . ($i + 1);
                $body .= extractBody($imap, $uid, $part, $newPartNum);
            }
        } elseif (in_array(strtolower($structure->subtype ?? ''), ['plain', 'html'])) {
            $rawBody = imap_fetchbody($imap, $uid, $partNum ?: 1, FT_UID);
            switch ($structure->encoding) {
                case 3: $body = base64_decode($rawBody); break;
                case 4: $body = quoted_printable_decode($rawBody); break;
                default: $body = $rawBody;
            }
        }

        return $body;
    }

    // Corps complet du mail
    $body = extractBody($imap, $latestUid);

    // Extraction du lien LiveTrack
    if (preg_match_all('/https?:\/\/[^\s<>"\'()]+/', $body, $matches)) {
        foreach ($matches[0] as $url) {
            if (stripos($url, 'livetrack.garmin.com/session') !== false) {
                $return['livetrack'] = $url;
                break;
            }
        }
    }

    // Utilisation du résultat
    if ($return['livetrack']) {
        //créer une variable js
        echo "<script>var liveTrackUrl = '" . htmlspecialchars($return['livetrack'], ENT_QUOTES) . "';</script>";
        // echo "Lien LiveTrack : " . $return['livetrack'];
    }

    // Fermeture propre
    imap_close($imap);
?>

<body class="dark-mode">
    <script>
        fetch('data.json?t=' + new Date().getTime(), { cache: "no-cache" })
            .then(response => response.json())
            .then(json => new PageConstructor(json));
    </script>
</body>


</html>