import fbconsole
import tweepy

from flask import jsonify, render_template
from vtpk import app
from vtpk.utils import authenticate_fb

class RawJsonParser(tweepy.parsers.Parser):
  def parse(self, method, payload):
    return payload

@app.route('/')
def home():
  return render_template('index.html')

@app.route('/videos')
def videos():
  return render_template('videos.html')

@app.route('/fb/group/wall')
def get_fb_group_wall():
  try:
    fb_group_wall = fbconsole.get(
        app.config['FB_GRAPH_QUERY'], app.config['FB_GRAPH_QUERY_PARAMS'])
  except:
    authenticate_fb()
    fb_group_wall = fbconsole.get(
    app.config['FB_GRAPH_QUERY'], app.config['FB_GRAPH_QUERY_PARAMS'])
  return jsonify(fb_group_wall)

@app.route('/tw/feed')
def get_tw_feed():
  """Gets the VTPK twitter feed."""
  auth = tweepy.OAuthHandler(
      app.config['TW_CONSUMER_TOKEN'], app.config['TW_CONSUMER_SECRET'])
  auth.set_access_token(
      app.config['TW_ACCESS_TOKEN'], app.config['TW_ACCESS_SECRET'])
  api = tweepy.API(auth, parser=RawJsonParser())
  feed = api.user_timeline(app.config['TW_USER_NAME'])
  return feed