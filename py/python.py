
import requests
import serial


ser = serial.Serial('/dev/ttyACM0', 9600)
url = 'http://jsonplaceholder.typicode.com/posts/1'

while 1:
    test = ser.readline()
    if test == 'Hello world\r\n' :
        response = requests.get(url)
        print response.text
    
