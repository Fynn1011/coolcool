import math
import time
from datetime import timedelta
from functools import lru_cache
import multiprocessing as mp

# Optimierung 1: Cache für Teilerberechnungen
@lru_cache(maxsize=10000)
def get_divisors(n):
    """
    Berechnet alle echten Teiler einer Zahl und gibt sie als Liste zurück.
    Verwendet Caching für bessere Leistung.
    """
    divisors = [1]  # 1 ist immer ein Teiler
    
    # Wir prüfen nur bis zur Quadratwurzel, um effizient zu sein
    for i in range(2, int(math.sqrt(n)) + 1):
        if n % i == 0:
            divisors.append(i)
            if i != n // i:  # Vermeide Duplikate bei Quadratzahlen
                divisors.append(n // i)
    
    return sorted(divisors)

# Optimierung 2: Berechne nur die Summe, nicht die vollständige Liste außer wenn nötig
def get_divisors_sum(n):
    """
    Berechnet nur die Summe der Teiler, ohne die vollständige Liste zu erstellen.
    Viel schneller für große Zahlen.
    """
    # 1 ist immer ein Teiler
    divisor_sum = 1
    
    # Wir prüfen nur bis zur Quadratwurzel
    for i in range(2, int(math.sqrt(n)) + 1):
        if n % i == 0:
            divisor_sum += i
            if i != n // i:  # Vermeide Duplikate bei Quadratzahlen
                divisor_sum += n // i
    
    return divisor_sum

def is_perfect(n):
    """
    Überprüft, ob eine Zahl vollkommen ist.
    Eine vollkommene Zahl ist gleich der Summe ihrer echten Teiler.
    """
    return get_divisors_sum(n) == n

# Optimierung 3: Mathematische Filter für ungerade Zahlen
def could_be_odd_perfect(n):
    """
    Schneller Filter, der offensichtlich unmögliche Kandidaten ausschließt.
    """
    # Eine ungerade vollkommene Zahl muss ≡ 1 (mod 4) oder ≡ 9 (mod 36) sein
    if n % 4 != 1 and n % 36 != 9:
        return False
    
    # Muss durch 9 teilbar sein (bewiesener Satz)
    if n % 9 != 0:
        return False
    
    return True

# Optimierung 4: Parallele Verarbeitung
def check_range(start, end, output_queue, verbose=True):
    """
    Überprüft einen Zahlenbereich nach vollkommenen Zahlen.
    Designed für die Ausführung in einem separaten Prozess.
    """
    count = 0
    found = False
    
    for n in range(start, end, 2):  # Nur ungerade Zahlen
        count += 1
        
        # Schneller Filter
        if not could_be_odd_perfect(n):
            continue
        
        # Vollständige Prüfung
        divisor_sum = get_divisors_sum(n)
        
        # Ausgabe alle 1000 Zahlen, die durch den Filter gekommen sind
        if verbose and count % 1000 == 0:
            ratio = divisor_sum / n
            output_queue.put(f"Prozess {start}-{end}: Prüfe {n}, Verhältnis: {ratio:.6f}")
        
        # Wenn vollkommen
        if divisor_sum == n:
            output_queue.put(f"GEFUNDEN: {n} ist eine ungerade vollkommene Zahl!")
            # Vollständige Analyse
            divisors = get_divisors(n)
            output_queue.put(f"Teiler von {n}: {divisors}")
            output_queue.put(f"Summe der Teiler: {divisor_sum}")
            found = True
            break
    
    # Ergebnis zurückgeben
    output_queue.put(f"Prozess {start}-{end}: {count} Zahlen geprüft, Bereich abgeschlossen.")
    if found:
        output_queue.put(("FOUND", n))
    else:
        output_queue.put(("NOT_FOUND", None))

def search_odd_perfect_numbers(start=1, num_processes=None):
    """
    Sucht nach ungeraden vollkommenen Zahlen mit mehreren Prozessen.
    
    Args:
        start: Startwert für die Suche (wird auf ungerade aufgerundet)
        num_processes: Anzahl der zu verwendenden Prozesse (Standard: Anzahl der CPU-Kerne)
    """
    if start % 2 == 0:
        start += 1  # Stellt sicher, dass wir mit einer ungeraden Zahl beginnen
    
    # Optimierung 5: Multiprocessing für parallele Suche
    if num_processes is None:
        num_processes = mp.cpu_count()
    
    print(f"Starte optimierte Suche nach ungeraden vollkommenen Zahlen ab {start}...")
    print(f"Verwende {num_processes} Prozesse für parallele Berechnung.")
    print("Drücke Strg+C, um die Suche zu beenden.")
    print("-" * 70)
    
    start_time = time.time()
    
    # Erstelle eine Warteschlange für die Ausgabe
    output_queue = mp.Queue()
    
    # Wir verwenden den Bereichswert, um die Arbeit auf die Prozesse aufzuteilen
    range_size = 100000  # Jeder Prozess bearbeitet 100.000 Zahlen auf einmal
    
    try:
        found = False
        perfect_number = None
        
        while not found:
            processes = []
            end_ranges = []
            
            # Starte Prozesse für verschiedene Zahlenbereiche
            for i in range(num_processes):
                range_start = start + i * range_size * 2
                range_end = range_start + range_size * 2
                end_ranges.append(range_end)
                
                p = mp.Process(target=check_range, args=(range_start, range_end, output_queue))
                processes.append(p)
                p.start()
            
            # Sammle Ergebnisse
            results = []
            alive_count = len(processes)
            
            while alive_count > 0:
                try:
                    message = output_queue.get(timeout=0.1)
                    if isinstance(message, tuple) and message[0] == "FOUND":
                        found = True
                        perfect_number = message[1]
                    elif isinstance(message, tuple) and message[0] == "NOT_FOUND":
                        alive_count -= 1
                    else:
                        print(message)
                except:
                    # Timeout in der Queue, überprüfe ob alle Prozesse noch leben
                    alive_count = sum(1 for p in processes if p.is_alive())
                
                # Aktuelle Laufzeit anzeigen
                current_time = time.time()
                elapsed = current_time - start_time
                if int(elapsed) % 10 == 0:  # Alle 10 Sekunden
                    print(f"Laufzeit: {timedelta(seconds=int(elapsed))}")
            
            # Beende alle Prozesse
            for p in processes:
                p.join()
            
            # Wenn nichts gefunden wurde, setze den Startwert für die nächste Iteration
            if not found:
                start = max(end_ranges)
                print(f"Keine ungerade vollkommene Zahl im Bereich bis {start} gefunden.")
                print(f"Setze Suche bei {start} fort...")
            
            # Bei Fund
            if found:
                elapsed_time = time.time() - start_time
                print("\n" + "=" * 70)
                print(f"ERFOLG! {perfect_number} ist eine ungerade vollkommene Zahl!")
                print(f"Gesamtlaufzeit: {timedelta(seconds=int(elapsed_time))}")
                print("=" * 70)
                
                # Detaillierte Analyse der gefundenen Zahl
                divisors = get_divisors(perfect_number)
                print(f"\nMathematischer Beweis, dass {perfect_number} eine ungerade vollkommene Zahl ist:")
                print(f"1. Die Zahl {perfect_number} ist ungerade: {perfect_number} % 2 = {perfect_number % 2}")
                print(f"2. Die echten Teiler von {perfect_number} sind: {divisors}")
                print(f"3. Die Summe dieser Teiler beträgt: {sum(divisors)}")
                print(f"4. Da {perfect_number} = {sum(divisors)}, ist {perfect_number} per Definition eine vollkommene Zahl.")
                
                return perfect_number
    
    except KeyboardInterrupt:
        # Benutzer hat die Suche abgebrochen
        print("\nSuche wird abgebrochen...")
        
        # Beende alle laufenden Prozesse
        for p in processes:
            if p.is_alive():
                p.terminate()
                p.join()
        
        elapsed_time = time.time() - start_time
        print("-" * 70)
        print(f"Suche abgebrochen bei etwa {start + range_size * num_processes}")
        print(f"Gesamtlaufzeit: {timedelta(seconds=int(elapsed_time))}")
        return None

def verify_known_perfect_numbers():
    """
    Überprüft bekannte vollkommene Zahlen, um die Korrektheit des Algorithmus zu demonstrieren.
    """
    known_perfect = [6, 28, 496, 8128]
    
    print("Überprüfung bekannter vollkommener Zahlen:")
    print("-" * 70)
    
    for n in known_perfect:
        divisors = get_divisors(n)
        divisor_sum = sum(divisors)
        
        print(f"Zahl: {n}")
        print(f"Teiler: {divisors}")
        print(f"Summe der Teiler: {divisor_sum}")
        print(f"Ist vollkommen: {divisor_sum == n}")
        print("-" * 70)

# Hauptprogramm
if __name__ == "__main__":
    # Wegen Multiprocessing muss der Code in if __name__ == "__main__" sein
    print("Optimierte Suche nach ungeraden vollkommenen Zahlen")
    print("=" * 70)
    print("Erklärung: Eine vollkommene Zahl ist eine natürliche Zahl,")
    print("die gleich der Summe ihrer echten Teiler ist.")
    print("Beispiel: 6 ist vollkommen, weil 1 + 2 + 3 = 6.")
    print("Bisher wurden nur gerade vollkommene Zahlen gefunden.")
    print("Dieses Programm sucht nach ungeraden vollkommenen Zahlen.")
    print("=" * 70)
    
    # Überprüfe, ob das Multiprocessing-Modul funktioniert
    print(f"System hat {mp.cpu_count()} CPU-Kerne verfügbar.")
    
    # Zuerst bekannte vollkommene Zahlen überprüfen
    print("\nVerifikation des Algorithmus mit bekannten vollkommenen Zahlen:")
    verify_known_perfect_numbers()
    
    # Benutzer nach Startwert und Prozessanzahl fragen
    try:
        start_value = int(input("\nStartwert für die Suche (ungerade, Standard: 1): ") or "1")
        if start_value % 2 == 0:
            start_value += 1
            print(f"Startwert auf {start_value} angepasst, da der Wert ungerade sein muss.")
        
        num_cores = mp.cpu_count()
        num_processes = int(input(f"Anzahl der zu verwendenden Prozesse (1-{num_cores}, Standard: {num_cores}): ") or str(num_cores))
        num_processes = max(1, min(num_processes, num_cores))  # Begrenze auf verfügbare Kerne
        
        # Starte die Suche
        search_odd_perfect_numbers(start_value, num_processes)
        
    except ValueError:
        print("Ungültige Eingabe. Bitte gib eine Zahl ein.")
        start_value = 1
        print(f"Verwende Standardwert {start_value} und alle verfügbaren CPU-Kerne.")
        search_odd_perfect_numbers(start_value)