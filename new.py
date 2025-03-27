start = int(input("Bitte Startwert eingeben"))
end = int(input("Bitte Endwert eingeben"))

for x in range(start, end):
    if x > 1:
        if x != 2 and x % 2 == 0:
            print(str(x) + " ist keine Primzahl")
        else: 
            