# My Hyperlocal Social Network

## Überblick
Eine mobile-first Netzwerk-Dashboard-App für iOS und Android, die nur für eingeladene Netzwerkmitglieder zugänglich ist. Die App ermöglicht es Netzwerken, gemeinsam zu kommunizieren, Termine zu planen und Inhalte zu teilen. Der Standard-App-Titel ist "My Hyperlocal Social Network" und wird prominent angezeigt.

## Startseite (vor Login)
- Die Startseite vor dem Login zeigt eine moderne und ansprechende Benutzeroberfläche mit erfrischtem Design, das sich am Look & Feel von internetcomputer.org orientiert
- Ein Hero-Bereich mit einladendem Titel und kurzer Beschreibung des "hyperlocal social network" Konzepts, gestaltet mit modernen 3D-Grafiken und auffälligen Farbverläufen
- Attraktive Visuals oder Icons, die das Thema der lokalen sozialen Vernetzung widerspiegeln, mit animierten Icons und interaktiven Elementen
- Ein Karussell oder Feature-Highlights, die die Hauptfunktionen der App vorstellen, mit dynamischen Übergängen und modernen visuellen Effekten
- Das Karussell stellt prominent die neuesten Funktionen vor: Umfragen & Abstimmungen, Erinnerungen & Benachrichtigungen, sowie Abzeichen & Rangliste
- Die Hintergrundfarbe der Karussell-Komponente ist optisch an das restliche App-Design angepasst und hebt die Inhalte ansprechend hervor
- Das Design ist mobile-first optimiert und unterstützt alle verfügbaren App-Sprachen
- Die Startseite zeigt die Login- und Registrierungsoptionen ("Ich habe eine Einladung") prominent an
- Alle Texte, Labels, Beschreibungen und Oberflächenelemente werden vollständig mehrsprachig in der gewählten Sprache angezeigt
- Die Startseite ist vollständig mehrsprachig und unterstützt alle verfügbaren App-Sprachen mit dynamischer Sprachumschaltung
- Alle Interface-Elemente, Schaltflächen-Beschriftungen und Navigationselemente der Startseite werden in der ausgewählten Sprache dargestellt
- UI/UX im Stil von internetcomputer.org mit modernen 3D-Grafiken, auffälligen Farbverläufen, animierten Icons, interaktiven Kacheln, moderner Typografie, großzügigen Weißräumen und dynamischen Übergängen
- Visuell beeindruckende und interaktive Elemente mit Animationen und visuellen Effekten, die an die Startseite von internetcomputer.org erinnern

## Authentifizierung und Zugang
- Registrierung nur per Einladung möglich
- Netzwerkmitglieder können Einladungsanfragen an neue Personen senden
- Neue Benutzer registrieren sich über "Ich habe eine Einladung" und werden automatisch als Beitrittsanfrage im Admin-Bereich angezeigt
- Wenn sich ein neuer, noch nicht registrierter Benutzer anmeldet, wird automatisch eine Beitrittsanfrage an den Administrator zur Genehmigung gesendet
- Nach der Registrierung erhalten neue Benutzer keinen direkten Zugriff auf die App, sondern sehen eine Informationsseite, die erklärt, dass ihre Anfrage geprüft wird und der Zugang erst nach Admin-Freigabe möglich ist
- Der Registrierungsprozess für Mitglieder mit Einladungscode ist optimiert für eine reibungslose und intuitive Benutzererfahrung
- Der automatische Beitrittsanfrage-Prozess funktioniert nahtlos in allen unterstützten Sprachen und Benutzerflows
- Administratoren müssen Beitrittsanfragen bestätigen oder ablehnen, bevor neue Mitglieder vollständigen Zugang erhalten
- Wenn ein Administrator eine Beitrittsanfrage ablehnt, wird der wartende Benutzer automatisch benachrichtigt und alle seine Daten, ID und Zugriffe werden vollständig aus dem System gelöscht
- Nach einer Ablehnung muss derselbe Benutzer bei einem erneuten Registrierungsversuch den vollständigen Registrierungs- und Genehmigungsprozess durchlaufen, ohne dass Restdaten oder Zugriffe vorhanden sind
- Der Status der Einladung wird nach der Registrierung korrekt aktualisiert und im Admin-Bereich angezeigt
- Benutzer müssen sich authentifizieren, um auf die App zuzugreifen
- Nach dem Login gelangen bestätigte Benutzer zur Dashboard-Übersichtsseite
- Nicht bestätigte Benutzer sehen nach dem Login weiterhin die Warteseite mit der Information über den ausstehenden Genehmigungsprozess
- Die App-Sprache wird automatisch auf die im Benutzerprofil gespeicherte Sprache eingestellt
- Zuvor entfernte Benutzer können sich nicht ohne neue Admin-Genehmigung wieder registrieren oder auf das Netzwerk zugreifen
- Jeder Registrierungsversuch eines zuvor entfernten Benutzers löst automatisch eine neue Beitrittsanfrage aus, die explizit vom Administrator genehmigt werden muss

## Benutzerrollen
- **Normale Netzwerkmitglieder**: Können alle Hauptfunktionen nutzen und Einladungsanfragen senden
- **Administratoren**: Haben zusätzlich Zugriff auf die Admin-Funktionen zur Verwaltung von Einladungsanfragen, Dashboard-Einstellungen, Benutzerverwaltung und Abzeichen-Kriterien
- **Automatische Admin-Zuweisung**: Der allererste registrierte Benutzer im Netzwerk erhält automatisch die Administrator-Rolle
- Die Benutzerrolle wird in der Benutzerverwaltung und Netzwerkmitglieder-Übersicht deutlich angezeigt

## Benutzerprofile
- Jeder Benutzer kann ein Profilbild hochladen, ändern und anzeigen lassen
- Jeder Benutzer kann seine bevorzugte Sprache für die App-Oberfläche auswählen
- In der Sprachauswahl wird links neben dem Namen jeder Sprache das entsprechende Länderflaggen-Emoji angezeigt, das das Land der jeweiligen Sprache repräsentiert
- Die Flaggen-Emojis werden als visuell klare, barrierefreie und konsistente Symbole dargestellt, sowohl mobil als auch am Desktop
- Die Flaggen-Emojis sind für alle unterstützten Sprachen in der App verfügbar und werden einheitlich gestaltet
- Die Flaggen-Emojis sind klar sichtbar und konsistent gestylt über alle unterstützten Geräte und Themes hinweg
- Es werden keine Sprachkürzel (wie "DE", "EN", etc.) in der Sprachauswahl angezeigt, sondern nur die Flaggen-Emojis und die Sprachnamen
- Jeder Benutzer kann ein Theme für die App-Oberfläche auswählen aus drei verfügbaren Optionen: "Tokyo", "Royal Blue" und "Cyber Bunker" (ähnlich wie caffeine.ai)
- Das "Tokyo" Theme hat einen erhöhten Kontrast durch angepasste Hintergrundfarben, während der Gesamtstil beibehalten wird
- Das "Royal Blue" Theme ist so gestaltet, dass alle Texte in der App klar lesbar sind, während der charakteristische Stil des Themes beibehalten wird
- Das "Cyber Bunker" Theme ist so gestaltet, dass alle Texte in der App klar lesbar sind, während der charakteristische Stil des Themes beibehalten wird
- Die App-Oberfläche wird in der vom Benutzer gewählten Sprache angezeigt
- Die App-Oberfläche wird mit dem vom Benutzer gewählten Theme angezeigt
- Das gewählte Theme wird über alle Sitzungen hinweg gespeichert und beibehalten

## Gamification-System
- Benutzer können Abzeichen (Badges) für verschiedene Aktivitäten verdienen:
  - Häufige Chat-Beiträge (z.B. "Kommunikator" für 50 Nachrichten)
  - Medien-Uploads (z.B. "Medien-Sammler" für 20 hochgeladene Medien)
  - Video-Uploads (z.B. "Videofilmer" für 10 hochgeladene Videos)
  - Kalender-Aktivität (z.B. "Planer" für 10 erstellte Termine)
  - Link-Sammlung (z.B. "Sammler" für 15 geteilte Links)
  - Event-Teilnahme (z.B. "Teilnehmer" für Anwesenheit bei Terminen)
- Administratoren können neue Abzeichen-Kriterien erstellen mit vollständiger Eingabemaske für Name, Beschreibung, Symbol/Icon, erforderliche Anzahl von Aktivitäten und Aktivitätstyp
- Die Abzeichen-Erstellung bietet eine benutzerfreundliche Oberfläche zur Definition neuer Abzeichen-Kriterien
- Administratoren können bestehende Abzeichen-Kriterien vollständig bearbeiten (Name, Beschreibung, Symbol, Aktivitätszahl und Aktivitätstyp ändern)
- Administratoren können Abzeichen-Kriterien dauerhaft aus dem System löschen
- Die Abzeichen-Verwaltung bietet vollständige CRUD-Funktionalität (Create, Read, Update, Delete) für alle Abzeichen-Kriterien
- Eine Rangliste zeigt nur aktive Benutzer basierend auf ihren Aktivitäten und verdienten Abzeichen
- Nur bestätigte und aktive Netzwerkmitglieder werden in der Rangliste angezeigt
- Abzeichen werden im Benutzerprofil, in der Rangliste und in der Netzwerkmitglieder-Übersicht mit passenden Symbolen angezeigt
- Die Rangliste ist für alle Netzwerkmitglieder einsehbar und zeigt Punkte oder Aktivitätslevel an
- Gamification-Elemente sind vollständig mehrsprachig und passen sich an die Benutzersprache an
- Jeder Benutzer kann seine erhaltenen Abzeichen und aktuelle Ranglistenposition einsehen

## Erinnerungen und Benachrichtigungen
- Das System erstellt automatische Erinnerungen für anstehende Kalendertermine
- Benutzer können eigene Erinnerungen für Termine, Geburtstage oder andere Ereignisse erstellen
- Erinnerungen enthalten Titel, Datum, Uhrzeit und optional eine Beschreibung
- Erinnerungen werden im Dashboard angezeigt und als interne Benachrichtigungen präsentiert
- Benutzer können Geburtstage in ihrem Profil hinterlegen
- Das System zeigt automatische Geburtstags-Erinnerungen für alle Netzwerkmitglieder im Dashboard an
- Erinnerungen sind konfigurierbar (z.B. 1 Tag vorher, am Tag selbst)
- Benutzer können ihre eigenen Erinnerungen bearbeiten und löschen
- Benutzer können ihre selbst erstellten Erinnerungen jederzeit löschen
- Alle Erinnerungen und Benachrichtigungen werden in der Benutzersprache angezeigt

## Umfragen und Abstimmungen
- Netzwerkmitglieder können Umfragen erstellen, anzeigen und daran teilnehmen
- Umfragen können über eine dedizierte "Umfrage erstellen" Funktion oder direkt im Chat-Bereich erstellt werden
- Alle Netzwerkmitglieder können an Umfragen teilnehmen und ihre Stimme abgeben
- Jeder Benutzer kann nur einmal pro Umfrage abstimmen - Mehrfachabstimmungen sind nicht erlaubt
- Bei der Erstellung einer Umfrage kann die Umfragedauer gewählt werden: 1 Stunde, 12 Stunden oder 24 Stunden
- Umfragen werden nach Ablauf der gewählten Dauer automatisch für weitere Abstimmungen gesperrt, bleiben aber weiterhin sichtbar
- Umfragen enthalten eine Frage und mehrere Antwortoptionen
- Ergebnisse werden in Echtzeit angezeigt mit Anzahl der Stimmen pro Option
- Umfrage-Ersteller können ihre eigenen Umfragen bearbeiten oder schließen
- Umfrage-Ersteller können die vollständige Statistik ihrer Umfrage einsehen, einschließlich detaillierter Abstimmungsdaten
- Geschlossene Umfragen zeigen nur noch die Endergebnisse an
- Das Umfrage-System ist vollständig mehrsprachig
- Umfragen werden im Dashboard und in der Umfragen-Übersicht angezeigt
- Im Chat erstellte Umfragen werden sowohl im Chat als auch in der Umfragen-Übersicht angezeigt
- Umfragen können direkt im Chat beantwortet werden
- Eine vollständige Umfrage-Funktion ermöglicht es Nutzern, Umfragen zu erstellen, anzuzeigen und daran teilzunehmen

## Admin-Funktionen
- Administratoren können alle offenen Beitrittsanfragen ("möchte beitreten") einsehen
- Beitrittsanfragen enthalten Informationen über den Einladenden und die eingeladene Person
- Beitrittsanfragen von Benutzern, die sich über "Ich habe eine Einladung" registriert haben, werden korrekt angezeigt
- Automatisch generierte Beitrittsanfragen von neuen, nicht registrierten Benutzern werden korrekt im Admin-Bereich angezeigt
- Administratoren können Beitrittsanfragen direkt in der App bestätigen oder ablehnen
- Administratoren können Beitrittsanfragen direkt in der Benutzerverwaltung bestätigen oder ablehnen
- In der Benutzerverwaltung werden bei jeder ausstehenden Beitrittsanfrage die Schaltflächen "Bestätigen" und "Ablehnen" angezeigt
- Bei der Ablehnung einer Beitrittsanfrage wird der wartende Benutzer automatisch benachrichtigt und alle seine Daten werden vollständig gelöscht
- Der Status der Einladung wird nach Admin-Entscheidung zuverlässig aktualisiert
- Jede Bestätigung einer Beitrittsanfrage wird im Einladungsverlauf protokolliert
- Nur bestätigte Einladungen ermöglichen neuen Personen den vollständigen Zugang zum Netzwerk
- Nur Benutzer mit Admin-Rechten können auf die Verwaltung der Beitrittsanfragen zugreifen
- Administratoren können den Namen des Netzwerk-Dashboards jederzeit ändern
- Eine Benutzeroberfläche ermöglicht es Administratoren, einen neuen Dashboard-Namen einzugeben und zu speichern
- Der aktualisierte Dashboard-Name wird in der gesamten App angezeigt
- Das Dashboard-Namen-Änderungsdialog ist vollständig mehrsprachig und alle Labels und Anweisungen passen sich an die Profilsprache des Benutzers an
- Administratoren können ein Logo-Bild für das Netzwerk hochladen
- Das Netzwerk-Logo wird im App-Titel-Bereich angezeigt, entweder oberhalb oder links vom Netzwerk-Namen, in der gesamten App
- Das Netzwerk-Logo wird flächenfüllend und proportional dargestellt, sodass es die gesamte vorgesehene Fläche ausfüllt und dabei die ursprünglichen Proportionen beibehält
- Das Netzwerk-Logo wird in den Dashboard-Kacheln als flächenfüllender, proportional skalierter Hintergrund angezeigt
- Administratoren können ein benutzerdefiniertes Standard-Vorschaubild für fehlerhafte Link-Vorschauen hochladen
- Das benutzerdefinierte Standard-Vorschaubild wird in den Dashboard-Einstellungen unterhalb des Netzwerk-Logos platziert
- Dieses benutzerdefinierte Bild wird als Standard-Vorschaubild für alle fehlerhaften oder nicht ladbaren Link-Vorschauen verwendet, anstelle des internetcomputer.org Logos
- Die 'Admin'-Schaltfläche ist oben rechts neben dem 'Abmelden'-Symbol platziert
- Bei allen Einträgen werden lesbare Benutzernamen statt kryptischer IDs angezeigt
- Administratoren können alle Benutzerprofile verwalten und Benutzer aus dem Netzwerk entfernen
- Administratoren können Benutzer durch Klicken auf die "Entfernen"-Schaltfläche in der Benutzerverwaltung vollständig aus dem Netzwerk entfernen
- Beim Entfernen eines Benutzers werden alle seine Daten (Nachrichten, Medien, Videos, Links, Kalendereinträge) aus dem System gelöscht
- Der Dialog zum Entfernen eines Benutzers ist vollständig mehrsprachig und alle Texte passen sich an die Profilsprache des Benutzers an
- Administratoren können direkte Chat-Nachrichten an einzelne Netzwerkmitglieder senden
- Administratoren können Abzeichen-Kriterien erstellen, bearbeiten, löschen und verwalten mit vollständiger CRUD-Funktionalität
- Die Abzeichen-Kriterien-Erstellung umfasst Eingabefelder für Name, Beschreibung, Symbol/Icon, erforderliche Anzahl und Aktivitätstyp
- Die Admin-Seite zeigt alle Labels und Beschreibungen in der vom Benutzer gewählten Profilsprache an
- In der Benutzerverwaltungs-Kachel der Admin-Seite wird das Wort "Familie" in allen unterstützten Sprachen entfernt
- In der Benutzerverwaltungs-Kachel werden die Schaltflächen "Nachricht" und "Entfernen" untereinander angeordnet für eine übersichtliche und benutzerfreundliche Darstellung
- Das Admin-Dashboard zeigt korrekte Zahlen für "Einladungen", "Bestätigt" und "Wartende Anfragen" an, basierend auf den tatsächlichen Daten im System
- Der Bereich "Beitrittsanfragen verwalten" listet alle Beitrittsanfragen mit Datum, Uhrzeit und aktuellem Status für jede Anfrage auf
- UI/UX im Stil von internetcomputer.org mit modernen 3D-Grafiken, auffälligen Farbverläufen, animierten Icons, interaktiven Kacheln, moderner Typografie, großzügigen Weißräumen und dynamischen Übergängen
- Visuell beeindruckende und interaktive Kacheln mit Animationen und visuellen Effekten, die an die wichtigsten UI-Elemente von internetcomputer.org erinnern

## Dashboard-Übersichtsseite
- Die Übersichtsseite ist die Startseite nach dem Login für bestätigte Benutzer
- Zeigt eine Zusammenfassung der wichtigsten Netzwerkaktivitäten:
  - Anstehende Kalendertermine mit Anzeige des Erstellers, Erstellungsdatum und -zeit für jeden Eintrag
  - Automatische Erinnerungen für wichtige Termine und Geburtstage werden prominent angezeigt
  - Kalendereinträge sind anklickbar und führen zur entsprechenden Kalender-Detailseite mit allen relevanten Informationen zu diesem Termin
  - Ungelesene Nachrichten-Indikator mit Anzahl der ungelesenen Nachrichten (klickbar, führt zur Chat-Seite) - das Label wird vollständig mehrsprachig in der Profilsprache des Benutzers angezeigt
  - Der zuletzt hinzugefügte Link
  - Falls Platz vorhanden ist, die zuletzt hochgeladenen Medien in einem kompakteren Format zur Platzersparnis
  - Aktuelle Umfragen und Abstimmungen werden angezeigt mit der Möglichkeit zur direkten Teilnahme
  - Gamification-Bereich mit aktuellen Abzeichen und Ranglistenposition des Benutzers
- Zeigt alle Netzwerkmitglieder mit Profilbild, Namen, ihrer jeweiligen Rolle (Admin, Benutzer, etc.) und optimierter Darstellung der erhaltenen Abzeichen und aktueller Ranglistenposition an
- Die Netzwerkmitglieder-Anzeige ist speziell für mobile Geräte und Desktop optimiert mit responsivem Design
- Jedes Mitglied wird mit seinem Profilbild, Namen, Rolle und einer ansprechenden Darstellung seiner Abzeichen und Ranglistenplatzierung angezeigt
- Die Abzeichen werden mit passenden Symbolen und einer modernen UI im Stil der App dargestellt
- Die Ranglistenplatzierung wird prominent und klar erkennbar angezeigt mit visuellen Elementen, die den Rang hervorheben
- Die Darstellung der Netzwerkmitglieder ist übersichtlich und kompakt gestaltet, sodass alle relevanten Informationen auf einen Blick erfasst werden können
- Auf mobilen Geräten werden die Mitglieder-Informationen platzsparend aber vollständig lesbar angezeigt
- Die Kacheln sind optimiert für bessere Übersichtlichkeit und passen sich inhaltlich an die jeweiligen Einträge an
- Das Kachel-Layout ist speziell für die Smartphone-Nutzung optimiert mit verbesserter Lesbarkeit und kompakterer Darstellung
- Jede Kachel zeigt nur die relevantesten Informationen an und vermeidet Überfüllung
- Die Kachel-Größen passen sich dynamisch an den Inhalt an für eine ausgewogene und übersichtliche Darstellung
- UI/UX im Stil von internetcomputer.org mit modernen 3D-Grafiken, auffälligen Farbverläufen, animierten Icons, interaktiven Kacheln, moderner Typografie, großzügigen Weißräumen und dynamischen Übergängen
- Visuell beeindruckende und interaktive Kacheln mit Animationen und visuellen Effekten, die an die wichtigsten UI-Elemente von internetcomputer.org erinnern
- Dashboard-Bereich mit besonders ausgeprägten 3D-Elementen und interaktiven Kacheln im internetcomputer.org-Stil

## Hauptfunktionen

### Gemeinsamer Kalender
- Netzwerkmitglieder können Termine erstellen, bearbeiten und löschen
- Alle Termine sind für alle Netzwerkmitglieder sichtbar
- Termine enthalten Titel, Datum, Uhrzeit und optional eine Beschreibung
- In der Kalenderübersicht wird für jeden Eintrag der Ersteller, das Erstellungsdatum und die Erstellungszeit angezeigt
- Benutzer können ihre eigenen Kalendereinträge bearbeiten und löschen
- Das Termin-Erstellungsformular zeigt alle Labels und Beschreibungen in der vom Benutzer gewählten Profilsprache an
- Nach dem Speichern eines Kalendereintrags wird die Kalenderübersicht automatisch aktualisiert, sodass die neuesten Änderungen sofort sichtbar sind
- Kalendereinträge haben eine Detailseite, die alle relevanten Informationen zu einem Termin anzeigt
- UI/UX im Stil von internetcomputer.org mit modernen 3D-Grafiken, auffälligen Farbverläufen, animierten Icons, interaktiven Kacheln, moderner Typografie, großzügigen Weißräumen und dynamischen Übergängen
- Visuell beeindruckende und interaktive Kacheln mit Animationen und visuellen Effekten, die an die wichtigsten UI-Elemente von internetcomputer.org erinnern

### Chat-Bereich
- Gruppenchat-Funktionalität ähnlich WhatsApp-Gruppen
- Netzwerkmitglieder können Nachrichten senden und empfangen
- Nachrichten werden chronologisch angezeigt
- Der Benutzername wird bei jeder Chat-Nachricht angezeigt
- Benutzer können ihre eigenen Chat-Nachrichten jederzeit bearbeiten und löschen
- Das Menü für "Bearbeiten" und "Löschen" wird direkt beim Antippen oder Klicken auf die eigene Nachricht eingeblendet, ohne drei Punkte anzuzeigen
- Die Menü-Auswahl für eigene Nachrichten ist kompakt gestaltet
- Das Eingabefeld für die Bearbeitung von Chat-Nachrichten ist optimiert für bessere Lesbarkeit mit angepassten Hintergrund- und Textfarben für optimalen Kontrast
- Diese Kontrast-Optimierung funktioniert in allen verfügbaren Themes (Tokyo, Royal Blue, Cyber Bunker) und sowohl in hellen als auch dunklen Modi
- Benutzer können Bilder/Anhänge in den Chat hochladen
- Benutzer können Videos in den Chat hochladen und abspielen
- Videos im Chat werden oberhalb des Chat-Textes angezeigt mit integrierten Wiedergabesteuerungen
- Videos nehmen 80% der verfügbaren Bildschirmbreite ein, wobei die Proportionen beibehalten werden
- Wenn ein Video im Chat erkannt wird, wird es im Chat angezeigt und automatisch zur Medien-Galerie hinzugefügt
- Videos aus dem Chat erhalten in der Galerie den Titel "aus Chat vom *Datum, Zeit*" und als Beschreibung den Chat-Nachrichtentext
- Bilder im Chat werden oberhalb des Chat-Textes angezeigt und nehmen 80% der verfügbaren Bildschirmbreite ein, wobei die Proportionen beibehalten werden
- Wenn ein Bild im Chat erkannt wird, wird es im Chat angezeigt und automatisch zur Medien-Galerie hinzugefügt
- Bilder aus dem Chat erhalten in der Galerie den Titel "aus Chat vom *Datum, Zeit*" und als Beschreibung den Chat-Nachrichtentext
- Im Chat geteilte Bilder und Videos können beim Antippen in einer bildschirmfüllenden Ansicht angezeigt werden
- Videos können in der bildschirmfüllenden Ansicht abgespielt werden
- Die bildschirmfüllende Ansicht hat eine gut sichtbare 'Schließen' (X) Schaltfläche
- Beim Anklicken von Medien im Chat wird nur ein einziger Satz von Steuerelementen (Wiedergabe, Schließen, Navigation) angezeigt, ohne doppelte Overlays oder mehrfache Steuerungen
- Benutzer können Emojis direkt in ihre Chat-Nachrichten einfügen, bevor sie diese senden
- Ein Emoji-Picker ist im Chat-Eingabebereich leicht zugänglich und funktioniert nahtlos auf mobilen Geräten
- Emojis erscheinen inline mit dem Text in den Chat-Nachrichten
- Ein Trennbalken mit der Beschriftung "ungelesene Nachrichten" wird oberhalb der ersten ungelesenen Nachricht angezeigt
- Der Trennbalken verschwindet, wenn der Benutzer scrollt
- Web-Links in Chat-Nachrichten werden automatisch erkannt und als anklickbare Hyperlinks gespeichert und angezeigt
- URLs in Nachrichten werden beim Senden automatisch erkannt und in klickbare Links umgewandelt
- Umfragen können direkt im Chat erstellt und beantwortet werden
- Die Upload-Schaltfläche im Chat wird durch eine Büroklammer-Schaltfläche ersetzt, über die Medien und andere Dateien hochgeladen werden können
- UI/UX im Stil von internetcomputer.org mit modernen 3D-Grafiken, auffälligen Farbverläufen, animierten Icons, interaktiven Kacheln, moderner Typografie, großzügigen Weißräumen und dynamischen Übergängen
- Visuell beeindruckende und interaktive Kacheln mit Animationen und visuellen Effekten, die an die wichtigsten UI-Elemente von internetcomputer.org erinnern

### Medien-Bereich
- Netzwerkmitglieder können Medien (Fotos und Videos) hochladen
- Alle hochgeladenen Medien sind für alle Netzwerkmitglieder sichtbar
- Medien können mit einem Titel oder einer Beschreibung versehen werden
- Beim Anklicken öffnen sich Fotos bildschirmfüllend
- Videos können direkt in der Galerie mit integrierten Wiedergabesteuerungen abgespielt werden
- Bildschirmfüllende Fotos haben eine gut sichtbare 'Schließen' (X) Schaltfläche
- Im bildschirmfüllenden Modus können Benutzer zwischen mehreren Fotos navigieren, wenn mehr als ein Foto verfügbar ist
- Links und rechts vom angezeigten Foto befinden sich Pfeil-Schaltflächen zum Wechseln zwischen den Bildern
- Im Medien-Upload-Bereich werden die Anforderungen für Uploads klar angezeigt (maximale Dateigröße und unterstützte Formate)
- Benutzer können ihre eigenen hochgeladenen Medien löschen
- Alle Benutzer können Emoji-Reaktionen zu Medien hinzufügen oder entfernen, um ihre Reaktion zu zeigen
- Die Anzahl der Reaktionen pro Emoji wird bei jedem Medium angezeigt
- Jeder Benutzer kann pro Medium pro Emoji nur einmal reagieren und seine Reaktion wieder entfernen
- Bilder und Videos aus dem Chat werden automatisch zur Medien-Galerie hinzugefügt
- Netzwerkmitglieder können Alben erstellen und Medien diesen Alben zuordnen
- Medien, die in einem Album sind, erscheinen nicht mehr als einzelne Medien in der allgemeinen Übersicht, sondern nur im jeweiligen Album
- In Alben können Medien aus dem Album entfernt und zurück in die allgemeine Übersicht verschoben werden
- Die Medienübersicht zeigt je nach Bildschirmgröße bis zu 6 Medien pro sichtbarer Seite in einem responsiven Grid an
- Der "Medien" Seitentitel wird in der vom Benutzer gewählten Profilsprache angezeigt
- Das Medien-Upload-Formular zeigt alle Labels und Beschreibungen in der vom Benutzer gewählten Profilsprache an
- Bei Video-Uploads wird die Dateigröße vor dem Upload überprüft: Wenn ein Video größer als 50 MB ist, wird der Benutzer gefragt, ob er eine komprimierte Version hochladen möchte
- Wenn der Benutzer der Komprimierung zustimmt, wird das Video clientseitig komprimiert, um unter 50 MB zu bleiben
- Die Video-Komprimierung erfolgt ohne Audioausgabe und ohne Wiedergabe des Videos während der Verarbeitung
- Die Video-Komprimierung behält die ursprüngliche Videolänge und die Audiospur vollständig bei
- Komprimierte Videos behalten sowohl ihre vollständige Dauer als auch den Ton nach der Komprimierung
- Die Audiospur wird während der Komprimierung vollständig erhalten und ist nach dem Upload hörbar
- Die Lautstärkeregelung im Video-Player funktioniert korrekt und ermöglicht die Steuerung der Audiolautstärke
- Die Komprimierungsgeschwindigkeit ist optimiert, sodass die Verarbeitung möglichst schnell abgeschlossen wird
- Nach erfolgreicher Komprimierung wird der Benutzer sofort zur Eingabe von Titel und Beschreibung weitergeleitet, ohne blockierende Dialoge
- Das "Video hinzufügen"-Formular bleibt während des gesamten Prozesses (Größenprüfung, Komprimierung, Titel-Eingabe) zugänglich und bedienbar
- Nach der Titel-Eingabe wird das komprimierte Video automatisch hochgeladen und im Backend gespeichert
- Das komprimierte Video erscheint sofort nach erfolgreichem Upload in der Video-Übersicht/Galerie ohne Seitenaktualisierung
- Eine klare Bestätigungsmeldung wird angezeigt, nachdem das komprimierte Video erfolgreich hochgeladen und im Backend gespeichert wurde
- Die Video-Galerie wird automatisch aktualisiert, um das neu hochgeladene komprimierte Video anzuzeigen
- Der Upload-Prozess wird vollständig abgeschlossen und das komprimierte Video ist sofort verfügbar
- Wenn der Benutzer die Komprimierung ablehnt, wird der Upload abgebrochen und der Benutzer über die Größenbeschränkung informiert
- Der gesamte Video-Upload-Workflow ist nahtlos und ohne blockierende Dialoge gestaltet
- Die "Video hinzufügen"-Schaltfläche bleibt jederzeit funktionsfähig und anklickbar
- Der Benutzer kann den Prozess jederzeit abbrechen oder ein anderes Video auswählen, ohne dass die Benutzeroberfläche blockiert wird
- UI/UX im Stil von internetcomputer.org mit modernen 3D-Grafiken, auffälligen Farbverläufen, animierten Icons, interaktiven Kacheln, moderner Typografie, großzügigen Weißräumen und dynamischen Übergängen
- Visuell beeindruckende und interaktive Kacheln mit Animationen und visuellen Effekten, die an die wichtigsten UI-Elemente von internetcomputer.org erinnern

### Link-Sammlung
- Netzwerkmitglieder können Links zu interessanten Apps und Webseiten hinzufügen
- Links enthalten URL, Titel, optional eine Beschreibung und Tags
- Alle Links sind für alle Netzwerkmitglieder sichtbar
- Benutzer können ihre eigenen Links bearbeiten und löschen
- In der Änderungsmaske für Links werden vorhandene Tags angezeigt und können bearbeitet werden
- Benutzer können neue Tags zu bestehenden Links hinzufügen
- Die Links-Seite zeigt alle Link-Einträge an, sowohl solche mit Tags als auch solche ohne Tags
- Die Darstellung ist konsistent für alle Link-Einträge, unabhängig davon, ob sie Tags haben oder nicht
- Die Links-Seite verfügt über eine Filterfunktion, mit der Links nach Tags gefiltert werden können
- Die Tag-Filterfunktion ermöglicht es, Links mit bestimmten Tags anzuzeigen oder auszublenden
- Für jeden gespeicherten Link wird ein Vorschaubild (Thumbnail) angezeigt
- Das Backend ruft automatisch Open Graph oder ähnliche Metadaten von der URL ab, um ein Vorschaubild zu extrahieren
- Falls kein Vorschaubild verfügbar ist oder das Vorschaubild beschädigt ist oder nicht geladen werden kann, wird das vom Administrator hochgeladene benutzerdefinierte Standard-Vorschaubild angezeigt
- Das Standard-Vorschaubild für fehlerhafte Links wird immer vollständig sichtbar innerhalb seines Rahmens angezeigt, wobei die ursprünglichen Proportionen beibehalten werden, indem das Bild an den verfügbaren Platz angepasst wird, sodass das gesamte Bild ohne Beschneidung oder Verzerrung dargestellt wird
- Falls kein benutzerdefiniertes Standard-Vorschaubild hochgeladen wurde, wird das Logo von internetcomputer.org als Standard-Platzhalter-Bild angezeigt
- Der "Link-Sammlung" Seitentitel wird in der vom Benutzer gewählten Profilsprache angezeigt
- Das Link-Erstellungsformular zeigt alle Labels und Beschreibungen in der vom Benutzer gewählten Profilsprache an
- UI/UX im Stil von internetcomputer.org mit modernen 3D-Grafiken, auffälligen Farbverläufen, animierten Icons, interaktiven Kacheln, moderner Typografie, großzügigen Weißräumen und dynamischen Übergängen
- Visuell beeindruckende und interaktive Kacheln mit Animationen und visuellen Effekten, die an die wichtigsten UI-Elemente von internetcomputer.org erinnern

## Navigation
- Die Navigationsschaltflächen (Netzwerk-Übersicht, Kalender, Chat, Medien, Links) sind am unteren Rand der App fixiert
- Diese Schaltflächen bleiben immer sichtbar, unabhängig vom Scrollen in den verschiedenen Bereichen
- Navigation ist nur für bestätigte Benutzer verfügbar
- Die Navigationsschaltflächen sind speziell für Smartphones optimiert mit deutlich kompakterer Größe und verbesserter Touch-Bedienung
- Die Schaltflächen im unteren Navigationsbereich sind gezielt verkleinert und platzsparender gestaltet für optimale Smartphone-Nutzung
- Auf Smartphones werden die Navigationsschaltflächen in ihrer Größe, Abstände und Textgröße speziell angepasst für bessere Bedienbarkeit mit dem Daumen
- Die Navigation behält ihre Lesbarkeit und Benutzerfreundlichkeit auf allen mobilen Geräten bei, mit besonderem Fokus auf Smartphone-Optimierung
- Die kompakteren Navigationsschaltflächen bieten mehr Platz für den Hauptinhalt der App
- UI/UX im Stil von internetcomputer.org mit modernen 3D-Grafiken, auffälligen Farbverläufen, animierten Icons, interaktiven Kacheln, moderner Typografie, großzügigen Weißräumen und dynamischen Übergängen
- Visuell beeindruckende und interaktive Kacheln mit Animationen und visuellen Effekten, die an die wichtigsten UI-Elemente von internetcomputer.org erinnern
- Navigationsbereich mit besonders ausgeprägten 3D-Elementen und interaktiven Elementen im internetcomputer.org-Stil

## Oberer Bereich nach Anmeldung
- Die Schaltflächen im oberen Bereich (Admin, Abmelden, etc.) sind für Smartphones vollständig funktionsfähig und optimiert
- Das obere rechte Menü enthält keine Navigationsoptionen für Übersicht, Kalender, Chat, Medien und Links, da diese bereits in der unteren Navigation verfügbar sind
- Alle Auswahloptionen (Auswahlen) im oberen Bereich sind auf Smartphones vollständig interaktiv und nutzbar
- Das Layout der oberen Schaltflächen ist responsiv und passt sich automatisch an die Bildschirmgröße an
- Bei Platzmangel auf kleineren Bildschirmen werden die Schaltflächen kompakter dargestellt oder durch horizontales Scrollen zugänglich gemacht
- Die Schaltflächen sind touch-optimiert mit ausreichender Größe für eine gute Bedienbarkeit auf Smartphones
- Die Anordnung der oberen Schaltflächen ist so gestaltet, dass alle wichtigen Funktionen auch auf kleinen Bildschirmen gut erreichbar sind
- Die Schaltflächen-Beschriftungen bleiben auch bei kompakter Darstellung lesbar und verständlich
- Alle Dropdown-Menüs, Auswahlfelder und interaktiven Elemente im oberen Bereich funktionieren einwandfrei auf Touchscreen-Geräten
- Die Touch-Bereiche für alle Auswahloptionen sind ausreichend groß für eine präzise Bedienung mit dem Finger
- Alle Hover-Effekte sind durch entsprechende Touch-Interaktionen ersetzt oder ergänzt

## Benutzeroberfläche und Barrierefreiheit
- Alle Schaltflächen-Texte in der gesamten App haben ausreichenden Kontrast zwischen Text- und Hintergrundfarben
- Schaltflächen-Beschriftungen sind in jedem Theme (Tokyo, Royal Blue, Cyber Bunker) und in jeder Sprache immer klar sichtbar und zugänglich
- Die Lesbarkeit aller Schaltflächen-Texte ist optimiert für bessere Barrierefreiheit und Benutzererfahrung
- Alle Themes (Tokyo, Royal Blue, Cyber Bunker) sind so gestaltet, dass alle Texte in der App klar lesbar sind, während der charakteristische Stil jedes Themes beibehalten wird
- UI/UX orientiert sich deutlich am Design von internetcomputer.org mit modernen 3D-Grafiken, auffälligen Farbverläufen, animierten Icons und interaktiven Kacheln im Dashboard und auf allen Hauptseiten
- Animationen und visuelle Effekte, die an die Startseite und die wichtigsten UI-Elemente von internetcomputer.org erinnern, inklusive moderner Typografie, großzügiger Weißräume und dynamischer Übergänge
- 3D-Grafiken werden mit React Three Fiber implementiert für optimale Performance
- Animationen sind mobile-optimiert und performant auf allen Geräten
- 3D-Effekte und Animationen sind konsistent mit den bestehenden Themes (Tokyo, Royal Blue, Cyber Bunker) und dem internetcomputer.org-Design
- Visuell beeindruckende und interaktive Kachel-Layouts mit animierten Icons für eine zeitgemäße und fesselnde Optik im Stil von internetcomputer.org
- 3D-Effekte sind deutlich sichtbar und ansprechend, besonders im Dashboard und in den Hauptnavigationsbereichen
- Verwendung von auffälligen Farbverläufen, glatten Übergängen und modernen visuellen Effekten zur Schaffung eines Look & Feel, das sich am Design von internetcomputer.org orientiert
- Die Auf- und Ab-Animationen der Symbole innerhalb der Schaltflächen sind dezent gestaltet mit reduzierter Sprunghöhe für eine harmonischere Wirkung
- Die Neigung der Kacheln bei Mouseover ist verringert, sodass die Animationen weniger extrem und harmonischer erscheinen

## Datenbereinigung
- Das System entfernt automatisch alle von Caffeine.ai hinzugefügten Testdaten beim Start der App
- Alle Demo-Benutzer, Test-Umfragen und andere automatisch generierte Inhalte werden vollständig aus dem System gelöscht
- Nur echte, von realen Benutzern erstellte Daten bleiben in der App erhalten
- Die Datenbereinigung erfolgt einmalig beim ersten Start nach der Implementierung dieser Funktion

## Vollständige Mehrsprachigkeit
- Alle UI-Texte, Beschriftungen, Schaltflächen, Dialoge und Masken in der gesamten App werden sprachabhängig übersetzt und entsprechend der im Benutzerprofil gewählten Sprache angezeigt
- Dies umfasst alle Bereiche: Navigation, Übersichten, Formulare, Admin-Seiten, Medien, Kalender, Chat, Links, Erinnerungen, Abzeichen, Umfragen und alle Systemmeldungen
- Alle noch nicht übersetzten oder fest codierten Texte werden korrigiert, sodass sie konsequent das Übersetzungssystem nutzen und in allen unterstützten Sprachen korrekt erscheinen
- Fehlermeldungen, Bestätigungsdialoge, Tooltips, Platzhaltertexte und alle anderen UI-Elemente sind vollständig mehrsprachig
- Alle Schaltflächen-Beschriftungen, Menü-Einträge, Dropdown-Optionen und interaktive Elemente werden in der Benutzersprache angezeigt
- Datum- und Zeitformate passen sich an die gewählte Sprache an
- Alle Validierungsmeldungen und Eingabeaufforderungen sind mehrsprachig
- Die Spracheinstellung wird konsistent über alle App-Bereiche hinweg angewendet

## Backend-Datenspeicherung
Das Backend speichert folgende Daten persistent:
- Benutzerprofile und Authentifizierungsdaten
- Benutzerrollen (normale Mitglieder vs. Administratoren) mit detaillierten Rollendaten für die Anzeige in der Netzwerkmitglieder-Übersicht
- Automatische Administrator-Zuweisung für den ersten registrierten Benutzer
- Benutzerstatus (registriert aber nicht bestätigt, bestätigt und aktiv)
- Profilbilder der Benutzer
- Spracheinstellungen pro Benutzer
- Theme-Einstellungen pro Benutzer (Tokyo, Royal Blue, Cyber Bunker)
- Geburtstage der Benutzer für automatische Erinnerungen
- Netzwerkgruppen und Mitgliedschaften
- Dashboard-Namen für jedes Netzwerk (standardmäßig "My Hyperlocal Social Network")
- Netzwerk-Logo-Bilder für jedes Netzwerk
- Benutzerdefinierte Standard-Vorschaubilder für fehlerhafte Link-Vorschauen pro Netzwerk
- Einladungsanfragen mit korrektem Status-Tracking (offen, bestätigt, abgelehnt) und Zeitstempel für Datum und Uhrzeit
- Automatisch generierte Beitrittsanfragen von neuen, nicht registrierten Benutzern mit vollständigen Metadaten
- Einladungsverlauf mit Protokollierung aller Admin-Bestätigungen
- Registrierungsdaten von Benutzern mit "Ich habe eine Einladung" Status
- Liste der zuvor entfernten Benutzer zur Verhinderung unbefugter Wiederzugriffe
- Funktionalität zur vollständigen Löschung aller Benutzerdaten, ID und Zugriffe bei Ablehnung einer Beitrittsanfrage
- Benachrichtigungssystem für abgelehnte Registrierungsanfragen
- Kalendertermine mit Bearbeitungs- und Löschberechtigungen sowie Ersteller-Informationen, Erstellungsdatum und -zeit
- Chat-Nachrichten mit Bild- und Video-Anhängen, Gelesen-Status pro Benutzer, erkannten Web-Links und Bearbeitungs-/Löschberechtigungen für Nachrichtenverfasser
- Hochgeladene Medien mit Löschberechtigungen für Uploader
- Komprimierte Videos werden zuverlässig im Backend gespeichert und sofort in der Video-Galerie angezeigt nach erfolgreichem Upload
- Medien-Alben mit Zuordnung von Medien zu Alben
- Emoji-Reaktionen zu Medien mit Benutzer-Zuordnung und Reaktionszählung pro Emoji
- Link-Sammlung mit Bearbeitungs- und Löschberechtigungen für Ersteller sowie Tags für jeden Link
- Tags für Links mit Funktionalität zum Hinzufügen, Bearbeiten und Filtern
- Vorschaubilder für Links, die aus Open Graph oder ähnlichen Metadaten extrahiert wurden, mit benutzerdefinierten Standard-Vorschaubildern oder internetcomputer.org Logo als Fallback
- Übersichtsdaten für die Dashboard-Startseite
- Direkte Chat-Nachrichten zwischen Administratoren und Netzwerkmitgliedern
- Verknüpfung zwischen Chat-Bildern/Videos und Medien-Galerie-Einträgen
- Funktionalität zum vollständigen Entfernen von Benutzern und deren Daten durch Administratoren
- Funktionalität zur Bestätigung und Ablehnung von Beitrittsanfragen direkt in der Benutzerverwaltung
- Gamification-Daten: Benutzeraktivitäten, verdiente Abzeichen, Punkte und Ranglistenpositionen nur für aktive Benutzer
- Abzeichen-Kriterien mit Namen, Beschreibungen, Symbolen, erforderlichen Aktivitätszahlen und Aktivitätstypen sowie vollständiger CRUD-Funktionalität (Create, Read, Update, Delete) für Administratoren
- Umfragen und Abstimmungen mit Fragen, Antwortoptionen, Stimmen, Ablaufdaten und gewählter Umfragedauer
- Abstimmungsdaten pro Benutzer und Umfrage zur Verhinderung von Mehrfachabstimmungen
- Detaillierte Abstimmungsstatistiken für Umfrage-Ersteller mit Informationen über Teilnehmer und deren Abstimmungen
- Automatische Sperrung von Umfragen nach Ablauf der gewählten Dauer
- Umfragen, die im Chat erstellt wurden, werden sowohl im Chat als auch in der Umfragen-Übersicht gespeichert
- Benutzererstellte Erinnerungen mit Titel, Datum, Uhrzeit und Beschreibung sowie Löschberechtigungen für Ersteller
- Erinnerungseinstellungen und automatische Benachrichtigungen für Termine und Geburtstage
- Funktionalität zur automatischen Entfernung von Caffeine.ai Testdaten
- Korrekte Zählung und Anzeige der Statistiken für Einladungen, bestätigte Benutzer und wartende Anfragen im Admin-Dashboard

## Sprache
- App-Inhalte werden auf Deutsch angezeigt
- Die App-Oberfläche ist in mehreren Sprachen verfügbar und jeder Benutzer kann seine bevorzugte Sprache auswählen
- Die App-Oberfläche wird immer in der vom Benutzer gewählten Profilsprache angezeigt
- Beim App-Start wird die Sprache automatisch auf die im Benutzerprofil gespeicherte Sprache eingestellt
- Alle Labels und Beschreibungen der App-Oberfläche werden dynamisch in der gewählten Sprache angezeigt
- Benutzergenerierte Inhalte bleiben in ihrer ursprünglichen Sprache unverändert
- Spezifische mehrsprachige Unterstützung für: Dashboard-Kachel "Ungelesene Nachrichten", Termin-Erstellungsformular, "Medien" Seitentitel, Medien-Upload-Formular, "Link-Sammlung" Seitentitel, Link-Erstellungsformular, Admin-Seite, Dashboard-Namen-Änderungsdialog, Dialog zum Entfernen eines Benutzers, die Warteseite für nicht bestätigte Benutzer, die Startseite vor dem Login, Gamification-Elemente, Umfrage-System, Erinnerungen-Erstellungsformular und Abzeichen-Kriterien-Verwaltung
- In der gesamten App wird die Beschriftung "Medien" konsistent verwendet, um zu verdeutlichen, dass sowohl Fotos als auch Videos unterstützt werden - dies betrifft Navigation, Überschriften, Buttons, Masken, Tabs, Labels und Platzhaltertexte
- Die Verwendung von "Medien" wird mehrsprachig umgesetzt und erscheint korrekt in allen unterstützten Sprachen
