from flask import Flask, request
from flask_restful import Resource, Api
from flask_cors import CORS
from load_tables import table_loader
import json
from flask import json

app = Flask(__name__)
api = Api(app)
CORS(app)

loader = table_loader()


@app.route('/getColumnSize', methods = ['POST'])
def api_message2():

    if request.headers['Content-Type'] == 'application/json':
        req = request.json
        return loader.return_revenue_chart(req['num_columns'],req['Mean'])
    else:
        return "415 Unsupported Media Type ;)"


@app.route('/getBubbleSizePosition', methods = ['POST'])

def api_message():

    if request.headers['Content-Type'] == 'application/json':
        req = request.json
        return loader.return_filtered(req['start_t'],req['end_t'],req['max_num'],req['genres'])
    else:
        return "415 Unsupported Media Type ;)"

@app.route('/getActorNetwork', methods = ['POST'])
def api_message3():

    if request.headers['Content-Type'] == 'application/json':
        req = request.json
        return loader.return_actor_network(req['actor_id'])
    else:
        return "415 Unsupported Media Type ;)"
    
@app.route('/getCloudPoints', methods = ['POST'])
def api_message4():

    if request.headers['Content-Type'] == 'application/json':
        req = request.json
        return loader.return_cloud_points(req['actor_id'])
    else:
        return "415 Unsupported Media Type ;)"


if __name__ == '__main__':
    app.run(debug=True, threaded = True)
