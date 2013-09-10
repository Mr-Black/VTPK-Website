#!C:\Python27/python.exe
from vtpk import app
from vtpk.utils import authenticate_fb

if __name__ == "__main__":
  authenticate_fb()
  app.run()