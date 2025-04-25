<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {

    // Haal de formuliergegevens op en beveilig ze
    $naam = htmlspecialchars($_POST['name']);
    $email = htmlspecialchars($_POST['email']);
    $telefoon = htmlspecialchars($_POST['phone']);
    $kamer = htmlspecialchars($_POST['room-type']);
    $aankomst = htmlspecialchars($_POST['checkin']);
    $vertrek = htmlspecialchars($_POST['checkout']);
    $personen = htmlspecialchars($_POST['guests']);
    $opmerkingen = htmlspecialchars($_POST['remarks']);

    // Ontvanger
    $to = "hotelclaridge@msn.com"; // <-- Pas hier jouw hotel e-mailadres aan

    // Onderwerp van de e-mail
    $subject = "Nieuwe verblijf aanvraag via de website";

    // Bouw het e-mailbericht op in HTML
    $message = "
    <html>
    <head>
      <title>Nieuwe Verblijf Aanvraag</title>
    </head>
    <body style='font-family: Georgia, serif;'>
      <h2>Nieuwe Aanvraag</h2>
      <table cellpadding='8' cellspacing='0' border='0'>
        <tr><td><strong>Naam:</strong></td><td>{$naam}</td></tr>
        <tr><td><strong>E-mail:</strong></td><td>{$email}</td></tr>
        <tr><td><strong>GSM-nummer:</strong></td><td>{$telefoon}</td></tr>
      </table>
      <hr style='margin:20px 0;'>
      <h3>Aanvraaggegevens</h3>
      <table cellpadding='8' cellspacing='0' border='0'>
        <tr><td><strong>Kamer Type:</strong></td><td>{$kamer}</td></tr>
        <tr><td><strong>Aankomst:</strong></td><td>{$aankomst}</td></tr>
        <tr><td><strong>Vertrek:</strong></td><td>{$vertrek}</td></tr>
        <tr><td><strong>Aantal Personen:</strong></td><td>{$personen}</td></tr>
        <tr><td><strong>Opmerkingen:</strong></td><td>" . nl2br($opmerkingen) . "</td></tr>
      </table>
    </body>
    </html>
    ";

    // Stel de e-mail headers in
    $headers  = "MIME-Version: 1.0" . "\r\n";
    $headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";
    $headers .= "From: Website Hotel Claridge <noreply@hotel-claridge.be>" . "\r\n";

    // Verstuur de e-mail
    if (mail($to, $subject, $message, $headers)) {
        echo "<script>alert('Bedankt! Uw aanvraag is succesvol verstuurd.'); window.location.href='index.html';</script>";
    } else {
        echo "<script>alert('Er is iets misgegaan tijdens het versturen. Probeer opnieuw.'); window.location.href='html/boeking.html';</script>";
    }
}
?>
