import time
import string
import itertools
import multiprocessing
from multiprocessing import Process, Queue, Value, Manager, cpu_count
import ctypes
import sys
import os

def worker_process(process_id, target_password, charset, start_length, end_length, 
                  chunk_index, num_chunks, found_flag, found_result, attempts_counter, 
                  progress_queue):
    """
    Worker-Prozess für den Bruteforce-Angriff - realistische Version
    """
    attempts = 0
    last_progress_report = 0
    
    try:
        # Durchlaufe alle Passwortlängen systematisch von kurz nach lang
        for length in range(start_length, end_length + 1):
            # Überprüfe, ob das Passwort bereits gefunden wurde
            if found_flag.value:
                break
            
            # Schätze die Anzahl der möglichen Kombinationen für diese Länge
            total_combinations = len(charset) ** length
            estimated_per_worker = total_combinations // num_chunks
            
            # Gib Informationen über den aktuellen Arbeitsbereich aus
            if process_id == 0:  # Nur der erste Prozess gibt diese Informationen aus
                progress_queue.put((process_id, 0, f"Länge {length}: ~{estimated_per_worker} Kombinationen pro Worker"))
            
            # Lokaler Cache für schnelleren Zugriff
            local_found_flag = found_flag.value
                
            # Generiere alle möglichen Kombinationen für die aktuelle Länge
            for attempt in get_password_combinations(charset, length, chunk_index, num_chunks):
                attempts += 1
                
                # Reduziere die Häufigkeit der Fortschrittsberichte für höhere Performance
                if attempts - last_progress_report >= 25000:
                    # Aktualisiere den gemeinsamen Zähler für Versuche
                    with attempts_counter.get_lock():
                        attempts_counter.value += (attempts - last_progress_report)
                    
                    # Aktualisiere den lokalen Cache von found_flag
                    local_found_flag = found_flag.value
                    
                    # Sende Update an den Fortschrittsmonitor
                    try:
                        progress_queue.put_nowait((process_id, attempts - last_progress_report, attempt))
                    except:
                        pass  # Queue voll - ignorieren für maximale Geschwindigkeit
                    
                    last_progress_report = attempts
                
                # Prüfe, ob wir das Passwort gefunden haben
                if attempt == target_password:
                    # Aktualisiere den Zähler ein letztes Mal
                    with attempts_counter.get_lock():
                        attempts_counter.value += (attempts - last_progress_report)
                        
                    # Setze das gemeinsame Flag
                    found_flag.value = 1
                    found_result.put((attempt, attempts))
                    return
                    
                # Überprüfe den lokalen Cache für bessere Performance
                if local_found_flag:
                    break
        
        # Aktualisiere den letzten Fortschritt, falls nötig
        remaining_attempts = attempts - last_progress_report
        if remaining_attempts > 0:
            with attempts_counter.get_lock():
                attempts_counter.value += remaining_attempts
            
            try:
                progress_queue.put_nowait((process_id, remaining_attempts, ""))
            except:
                pass  # Queue voll - ignorieren
    
    except Exception as e:
        # Bei einem Fehler, melde ihn zurück über die Queue
        try:
            progress_queue.put_nowait((process_id, 0, f"ERROR: {str(e)}"))
        except:
            pass  # Queue voll - ignorieren

def get_password_combinations(charset, length, chunk_index, num_chunks):
    """
    Generiert Passwort-Kombinationen für einen bestimmten Chunk.
    Optimierte Version für maximale Geschwindigkeit.
    """
    # Für sehr kurze Passwörter (1-3 Zeichen) sind vorgenerierte Listen schneller
    if length <= 2:
        all_combinations = [''.join(combo) for combo in itertools.product(charset, repeat=length)]
        for i, combo in enumerate(all_combinations):
            if i % num_chunks == chunk_index:
                yield combo
    else:
        # Für längere Passwörter: On-the-fly-Generierung mit minimaler Python-Overhead
        # Um die Geschwindigkeit zu erhöhen, generieren wir die Passwörter direkt
        counter = 0
        for combination in itertools.product(charset, repeat=length):
            if counter % num_chunks == chunk_index:
                # Direkte String-Konstruktion ist schneller als ''.join() für große Mengen
                password = ''.join(combination)
                yield password
            counter += 1

def progress_monitor(progress_queue, attempts_counter, found_flag, verbose=True):
    """
    Prozess, der den Fortschritt überwacht und ausgibt - mit informativer Anzeige
    """
    start_time = time.time()
    last_report_time = start_time
    last_attempts = 0
    current_samples = {}
    current_info = ""
    
    try:
        while not found_flag.value:
            try:
                # Hole alle verfügbaren Updates aus der Queue
                updates = []
                try:
                    for _ in range(100):  # Begrenze die Anzahl der zu verarbeitenden Updates
                        try:
                            updates.append(progress_queue.get(block=False))
                        except:
                            break  # Queue leer
                except Exception:
                    pass
                
                for process_id, attempts, current_attempt in updates:
                    if current_attempt:
                        # Wenn die Nachricht mit "Länge" beginnt, handelt es sich um eine Informationsmeldung
                        if isinstance(current_attempt, str) and current_attempt.startswith("Länge"):
                            current_info = current_attempt
                        else:
                            current_samples[process_id] = current_attempt
                
                current_time = time.time()
                elapsed_time = current_time - start_time
                
                # Aktualisiere die Ausgabe, aber nicht zu häufig
                if current_time - last_report_time >= 0.5:
                    last_report_time = current_time
                    
                    # Hole den aktuellen Zählerstand atomisch
                    current_attempts = attempts_counter.value
                    recent_attempts = current_attempts - last_attempts
                    last_attempts = current_attempts
                    
                    # Berechne Versuche pro Sekunde und ETA
                    attempts_per_second = recent_attempts * 2  # Für 0.5 Sekunden
                    
                    # Formatiere die Zahlen - Tausendertrennung mit Punkten
                    formatted_attempts = f"{current_attempts:,}".replace(",", ".")
                    formatted_speed = f"{attempts_per_second:,.0f}".replace(",", ".")
                    
                    # Formatiere die Zeit
                    minutes, seconds = divmod(elapsed_time, 60)
                    hours, minutes = divmod(minutes, 60)
                    time_str = f"{int(hours):02}:{int(minutes):02}:{int(seconds):02}"
                    
                    # Aktualisiere die Statuszeile
                    if verbose:
                        status_line = f"\rVersuche: {formatted_attempts} | {formatted_speed} Versuche/s | Zeit: {time_str}"
                        
                        # Zeige Infos über den aktuellen Arbeitsbereich
                        if current_info:
                            status_line += f" | {current_info}"
                        
                        # Zeige ein Beispiel für ein aktuelles Passwort
                        if current_samples:
                            sample = list(current_samples.values())[0]
                            status_line += f" | Probe: {sample}"
                        
                        sys.stdout.write(status_line)
                        sys.stdout.flush()
            
            except Exception as e:
                sys.stderr.write(f"\rFehler im Progress Monitor: {str(e)}\n")
            
            # Kurze Pause
            time.sleep(0.05)
    
    except KeyboardInterrupt:
        pass

def brute_force_crack_mp(password, chars_to_try=None, max_length=None, verbose=True, 
                        num_processes=None):
    """
    Implementiert einen Bruteforce-Passwort-Cracker unter Verwendung von Multiprocessing
    für maximale CPU-Auslastung.
    """
    if chars_to_try is None:
        chars_to_try = string.ascii_lowercase + string.digits
    
    if max_length is None:
        max_length = len(password) + 1
    
    # Verwende alle verfügbaren CPU-Kerne wenn nicht anders angegeben
    if num_processes is None:
        # Für maximale CPU-Auslastung: Verwende deutlich mehr Prozesse als Kerne
        # 3x mehr Prozesse als Kerne sorgt für eine nahezu vollständige Auslastung 
        # auf den meisten Systemen
        num_processes = cpu_count() * 3
    
    # Überprüfe, ob Großbuchstaben im Passwort vorhanden sind und füge sie ggf. hinzu
    if any(c.isupper() for c in password) and not any(c.isupper() for c in chars_to_try):
        print("\nWARNUNG: Das Zielpasswort enthält Großbuchstaben, aber der gewählte Zeichensatz nicht!")
        print("Füge Großbuchstaben zum Zeichensatz hinzu...")
        chars_to_try += string.ascii_uppercase
    
    print(f"Starte {num_processes} Prozesse für maximale CPU-Auslastung...")
    
    # Gemeinsame Variablen zwischen Prozessen
    manager = Manager()
    found_flag = Value(ctypes.c_bool, False)
    found_result = Queue()
    attempts_counter = Value(ctypes.c_ulonglong, 0)
    progress_queue = Queue()
    
    # Starte den Fortschrittsmonitor
    monitor = Process(target=progress_monitor, 
                     args=(progress_queue, attempts_counter, found_flag, verbose))
    monitor.daemon = True
    monitor.start()
    
    # Erstelle und starte die Worker-Prozesse
    processes = []
    start_time = time.time()
    
    try:
        # Starte die Worker-Prozesse
        for i in range(num_processes):
            # Jeder Worker bekommt ein Segment des Passwortbereichs
            p = Process(target=worker_process, 
                      args=(i, password, chars_to_try, 1, max_length - 1, 
                           i, num_processes, found_flag, found_result, 
                           attempts_counter, progress_queue))
            p.daemon = True
            p.start()
            processes.append(p)
        
        # Warte auf Ergebnisse
        while not found_flag.value:
            if not found_result.empty():
                found_password, proc_attempts = found_result.get()
                found_flag.value = True
                break
            
            # Prüfe, ob alle Prozesse fertig sind
            if all(not p.is_alive() for p in processes):
                break
            
            time.sleep(0.1)
    
    except KeyboardInterrupt:
        print("\nBruteforce-Angriff wurde abgebrochen.")
    
    finally:
        # Markiere als gefunden, damit alle Prozesse aufhören
        found_flag.value = True
        
        # Warte kurz, damit die Prozesse aufhören können
        time.sleep(0.5)
        
        # Beende die Prozesse, falls sie noch laufen
        for p in processes:
            if p.is_alive():
                p.terminate()
        
        if monitor.is_alive():
            monitor.terminate()
    
    # Berechne die Ergebnisse
    end_time = time.time()
    time_taken = end_time - start_time
    total_attempts = attempts_counter.value
    
    # Hole das gefundene Passwort, falls vorhanden
    found_password = None
    if not found_result.empty():
        found_password, _ = found_result.get()
    
    return found_password, total_attempts, time_taken

def detect_charset(password):
    """Erkennt automatisch den benötigten Zeichensatz für ein Passwort"""
    charset = ""
    
    if any(c.islower() for c in password):
        charset += string.ascii_lowercase
        print("Erkannt: Kleinbuchstaben")
    
    if any(c.isupper() for c in password):
        charset += string.ascii_uppercase
        print("Erkannt: Großbuchstaben")
    
    if any(c.isdigit() for c in password):
        charset += string.digits
        print("Erkannt: Zahlen")
    
    if any(c in string.punctuation for c in password):
        charset += string.punctuation
        print("Erkannt: Sonderzeichen")
    
    if not charset:  # Falls nichts erkannt wurde
        charset = string.ascii_lowercase + string.ascii_uppercase + string.digits
        print("Keine speziellen Zeichen erkannt. Verwende Standard-Zeichensatz.")
    
    return charset

def get_charset_choice():
    """Benutzer nach Zeichensatz fragen"""
    print("\nWelchen Zeichensatz möchten Sie verwenden?")
    print("1: Nur Kleinbuchstaben (a-z)")
    print("2: Klein- und Großbuchstaben (a-z, A-Z)")
    print("3: Buchstaben und Zahlen (a-z, A-Z, 0-9)")
    print("4: Buchstaben, Zahlen und Sonderzeichen (vollständiger Zeichensatz)")
    print("5: Benutzerdefinierter Zeichensatz")
    
    choice = input("Wählen Sie (1-5): ")
    
    if choice == '1':
        return string.ascii_lowercase
    elif choice == '2':
        return string.ascii_lowercase + string.ascii_uppercase
    elif choice == '3':
        return string.ascii_lowercase + string.ascii_uppercase + string.digits
    elif choice == '4':
        return string.ascii_lowercase + string.ascii_uppercase + string.digits + string.punctuation
    elif choice == '5':
        custom_charset = input("Geben Sie den benutzerdefinierten Zeichensatz ein: ")
        if not custom_charset:
            print("Leerer Zeichensatz. Verwende Standardeinstellung (a-z, A-Z, 0-9).")
            return string.ascii_lowercase + string.ascii_uppercase + string.digits
        return custom_charset
    else:
        print("Ungültige Eingabe. Verwende vollständigen Zeichensatz.")
        return string.ascii_lowercase + string.ascii_uppercase + string.digits + string.punctuation

def main():
    # Umleiten der Ausgabe auf stdout für bessere Performance
    if sys.platform == 'win32':
        import msvcrt
        msvcrt.setmode(sys.stdout.fileno(), os.O_BINARY)
    
    print("=" * 70)
    print("PASSWORT BRUTEFORCE DEMONSTRATION (REALISTISCH)")
    print("=" * 70)
    print(f"\nSysteminformationen:")
    print(f"- CPU-Kerne: {cpu_count()}")
    print(f"- Optimierte Prozessanzahl: {cpu_count() * 2}")
    print("\nDieses Programm ist nur zu Demonstrationszwecken gedacht.")
    print("WARNUNG: Bei längeren Passwörtern und/oder großen Zeichensätzen kann")
    print("der Vorgang EXTREM lange dauern. Ein Passwort mit 8 Zeichen aus einem")
    print("Zeichensatz mit 94 Zeichen hat 6,1 Billiarden mögliche Kombinationen!")
    print("Drücken Sie Ctrl+C, um das Programm jederzeit abzubrechen.\n")
    
    try:
        # Benutzer nach dem zu knackenden Passwort fragen
        password = input("Geben Sie ein Passwort ein, das geknackt werden soll: ")
        
        if not password:
            print("Kein Passwort eingegeben. Verwende 'test123' als Beispiel.")
            password = "test123"
        
        # Benutzer nach dem Zeichensatz fragen
        charset = get_charset_choice()
        
        # Maximale Länge abfragen
        try:
            max_length = int(input(f"\nMaximale zu überprüfende Passwortlänge (Standard: 12): ") or "12")
            if max_length <= 0:
                raise ValueError
        except ValueError:
            max_length = 12
            print(f"Verwende Standardwert: {max_length}")
            
        # Anzahl der Prozesse (Optional)
        try:
            num_processes = int(input(f"\nAnzahl der zu verwendenden Prozesse (Standard: Auto): ") or "0")
            if num_processes <= 0:
                num_processes = None
        except ValueError:
            num_processes = None
        
        print("\nStarte Bruteforce-Angriff mit maximaler CPU-Auslastung...")
        print(f"Zeichensatz ({len(charset)} Zeichen): {charset[:20]}..." if len(charset) > 20 else f"Zeichensatz: {charset}")
        print(f"Mögliche Kombinationen pro Länge: {len(charset)}^n")
        
        try:
            found_password, attempts, time_taken = brute_force_crack_mp(
                password, 
                chars_to_try=charset, 
                max_length=max_length,
                num_processes=num_processes
            )
            
            if found_password:
                print("\n" + "=" * 70)
                print(f"Passwort gefunden: {found_password}")
                # Formatiere die Anzahl der Versuche für bessere Lesbarkeit mit Punkten als Tausendertrennzeichen
                formatted_attempts = f"{attempts:,}".replace(",", ".")
                print(f"Benötigte Versuche: {formatted_attempts}")
                print(f"Benötigte Zeit: {time_taken:.2f} Sekunden")
                
                # Berechne theoretische Versuche pro Sekunde
                if time_taken > 0:
                    attempts_per_second = attempts / time_taken
                    print(f"Versuche pro Sekunde: {attempts_per_second:,.0f}")
                    print(f"CPU-Auslastung für diesen Test: ~{min(100, attempts_per_second / 50000 * 100):.1f}%")
                
                # Berechne theoretische Zeit für komplexere Passwörter
                if len(password) < 10:
                    complex_chars = len(string.ascii_lowercase + string.ascii_uppercase + string.digits + string.punctuation)
                    for complex_len in [8, 10, 12]:
                        if complex_len > len(password):
                            combinations = complex_chars ** complex_len
                            est_time = combinations / attempts_per_second if attempts_per_second > 0 else float('inf')
                            
                            if est_time < 60:
                                time_str = f"{est_time:.2f} Sekunden"
                            elif est_time < 3600:
                                time_str = f"{est_time/60:.2f} Minuten"
                            elif est_time < 86400:
                                time_str = f"{est_time/3600:.2f} Stunden"
                            elif est_time < 31536000:
                                time_str = f"{est_time/86400:.2f} Tage"
                            else:
                                time_str = f"{est_time/31536000:.2f} Jahre"
                            
                            print(f"Geschätzte Zeit für {complex_len}-stelliges komplexes Passwort: {time_str}")
                
                # Ausgabe einer Warnung für schwache Passwörter
                if len(password) < 8:
                    print("\nWARNUNG: Das Passwort ist sehr kurz und unsicher!")
                    print("Empfehlung: Verwenden Sie Passwörter mit mindestens 12 Zeichen,")
                    print("die Groß- und Kleinbuchstaben, Zahlen und Sonderzeichen enthalten.")
            else:
                print("\nPasswort konnte nicht gefunden werden.")
                # Formatiere die Anzahl der Versuche für bessere Lesbarkeit mit Punkten als Tausendertrennzeichen
                formatted_attempts = f"{attempts:,}".replace(",", ".")
                print(f"Durchgeführte Versuche: {formatted_attempts}")
                print(f"Benötigte Zeit: {time_taken:.2f} Sekunden")
        
        except KeyboardInterrupt:
            print("\n\nBruteforce-Angriff wurde vom Benutzer abgebrochen.")
            
    except KeyboardInterrupt:
        print("\nProgramm wurde vom Benutzer beendet.")

if __name__ == "__main__":
    # Versuche, die Prozesspriorität zu erhöhen, wenn möglich
    try:
        if sys.platform == 'win32':
            # Windows-spezifischer Code ohne externe Bibliotheken
            import ctypes
            process_handle = ctypes.windll.kernel32.GetCurrentProcess()
            ctypes.windll.kernel32.SetPriorityClass(process_handle, 0x00008000)  # HIGH_PRIORITY_CLASS
        elif sys.platform == 'linux' or sys.platform == 'darwin':
            os.nice(-10)  # Niedrigerer Wert = höhere Priorität (Unix/Linux/macOS)
    except:
        # Fehler ignorieren, wenn die Prioritätsänderung nicht funktioniert
        pass
    
    multiprocessing.freeze_support()  # Für Windows-Kompatibilität
    main()