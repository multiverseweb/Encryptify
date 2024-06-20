def encrypt(pwd):
    n=len(pwd)
    e=""
    t=pwd[int(n/2):]
    t+=pwd[:int(n/2)]
    for _ in range(len(t)):
        e+=chr(ord(t[_])*2)
    return e

def decrypt(pwd):
    n=len(pwd)
    d=""
    if n%2==0:
        t=pwd[int(n/2):]
        t+=pwd[:int(n/2)]
    else:
        t=pwd[int(n/2)+1:]
        t+=pwd[:int(n/2)+1]
    for _ in range(len(t)):
        d+=chr(ord(t[_])//2)
    return d
while True:
    pwd=input("Enter Password: ")
    print("stored password: ",encrypt(pwd))
    print("decrypted password: ",decrypt(encrypt(pwd)))