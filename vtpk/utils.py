import fbconsole

from vtpk import app

def authenticate_fb():
  fbconsole.AUTH_SCOPE = app.config['FB_PERMISSIONS']
  fbconsole.APP_ID = app.config['FB_APP_ID']
  fbconsole.automatically_authenticate(
      app.config['FB_USERNAME'], app.config['FB_PASSWORD'],
      app.config['FB_APP_SECRET'], app.config['FB_REDIRECT_URI']) 