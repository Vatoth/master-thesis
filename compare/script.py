from dtw import accelerated_dtw
from scipy.signal import savgol_filter
from math import log
import math
import json
from urllib.parse import urljoin
from pathlib import Path

import requests
import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
import similaritymeasures


class RelativeSession(requests.Session):
    def __init__(self, base_url):
        super(RelativeSession, self).__init__()
        self.__base_url = base_url

    def request(self, method, url, **kwargs):
        url = urljoin(self.__base_url, url)
        return super(RelativeSession, self).request(method, url, **kwargs)


session = RelativeSession("http://localhost:3000")


sources = session.get(
    "/sources/?repourl=https://github.com/smarr/SOMns").json()


fig = plt.figure(figsize=(10, 6))


def is_outlier(value, p25, p75):
    """Check if value is an outlier
    """
    lower = p25 - 1.5 * (p75 - p25)
    upper = p75 + 1.5 * (p75 - p25)
    return value <= lower or value >= upper


def get_indices_of_outliers(values):
    """Get outlier indices (if any)
    """
    p25 = np.percentile(values, 10)
    p75 = np.percentile(values, 90)

    indices_of_outliers = []
    for ind, value in enumerate(values):
        if is_outlier(value, p25, p75):
            indices_of_outliers.append(ind)
    return indices_of_outliers


def get_outliers(values, warmup_index):
    windows = []
    values.rolling(warmup_index).apply(
        lambda x: windows.append(
            x.values) or 0, raw=False)
    windows = windows[warmup_index:]
    outliers = np.array([])
    for i, window in enumerate(windows):
        indices_of_outliers = np.array(get_indices_of_outliers(window))
        indices_of_outliers = indices_of_outliers + (warmup_index + (i))
        outliers = np.unique(
            np.concatenate(
                (outliers, indices_of_outliers), 0))
    return outliers


values_list = []

#sources = [sources[29], sources[34]]
#sources = [sources[42], sources[43]]
for i, source in enumerate(sources):
    trials = session.get("/sources/{0}/trials".format(source['id'])).json()
    for trial in trials:
        measurements = session.get(
            "/trials/{0}/measurements".format(trial['id'])).json()
        run = session.get("/runs/{0}".format(measurements[0]['runid'])).json()
        executor = session.get("/executors/{0}".format(run['execid'])).json()
        benchmark = session.get(
            "/benchmarks/{0}".format(run['benchmarkid'])).json()
        if benchmark['name'] != "SleepingBarber":
            break
        values = np.array(
            list(map(lambda x: x['value'], measurements)))
        values = pd.Series(values)
        outliers = get_outliers(values, 200)
        values = values.drop(index=outliers)
        values = values.to_numpy()
        #path = Path(
        #    'benchmarks/')
        #filename = "benchmarks/plot_{0}_{1}_{2}.png".format(
        #    benchmark['name'], executor['name'], i)
        #ax = fig.add_subplot()
        #ax.plot(values, 'b-', label='measurements')
        #fig.savefig(filename, dpi=300)
        values_list.append(values)
        #plt.clf()
        break


def smooth(y, box_pts):
    box = np.ones(box_pts) / box_pts
    y_smooth = np.convolve(y, box, mode='same')
    return y_smooth


def manhattan_distance(x, y):
    return np.abs(x - y)

def prepare_data(exp_data, num_data):
    x = np.arange(len(exp_data))
    y = exp_data
    exp_data = np.zeros((len(x), 2))
    exp_data[:, 0] = x
    exp_data[:, 1] = y

    x = np.arange(len(num_data))
    y = num_data
    num_data = np.zeros((len(x), 2))
    num_data[:, 0] = x
    num_data[:, 1] = y


    # quantify the difference between the two curves using PCM
    pcm = similaritymeasures.pcm(exp_data, num_data)

    # quantify the difference between the two curves using
    # Discrete Frechet distance
    df = similaritymeasures.frechet_dist(exp_data, num_data)

    # quantify the difference between the two curves using
    # area between two curves
    area = similaritymeasures.area_between_two_curves(exp_data, num_data)

    # quantify the difference between the two curves using
    # Curve Length based similarity measure
    cl = similaritymeasures.curve_length_measure(exp_data, num_data)

    # quantify the difference between the two curves using
    # Dynamic Time Warping distance
    dtw, d = similaritymeasures.dtw(exp_data, num_data)

    return pcm, df, area, cl, dtw, d

for i, values in enumerate(values_list):
    x = values
    if i + 1 < len(values_list):
        y = values_list[i + 1]
    else:
        break
    #print(len(values_list))
    #print(len(x), len(y))
    exp_data = x
    num_data = y
    #exp_data = savgol_filter(x, 51, 3)
    #num_data = savgol_filter(y, 51, 3)

    if len(exp_data) < len(num_data):
        num_data = num_data[:len(exp_data)]

    if len(num_data) < len(exp_data):
        exp_data = exp_data[:len(num_data)]

    #pcm, df, area, cl, dtw, d = prepare_data(exp_data, num_data)

    exp_data = exp_data.reshape(-1, 1)
    num_data = num_data.reshape(-1, 1)

    path = Path(
            'compare_plot/')
    path.mkdir(parents=True, exist_ok=True)
    ax = fig.add_subplot()
    ax.plot(exp_data, label='1st measurements')
    ax.plot(num_data, label='2nd measurements')



    # print the results

    #print(pcm, df, area, cl, dtw)

    from scipy.spatial.distance import directed_hausdorff

    value_directed = directed_hausdorff(exp_data, num_data)[0]

    print(value_directed)

    fig.savefig(filename, dpi=300)
    filename = "compare_plot/plot_{0}_{1}.png".format(i, value_directed)
    plt.clf()

    #d, cost_matrix, acc_cost_matrix, path = accelerated_dtw(
    #    exp_data, num_data, dist=manhattan_distance)
    #print(d / len(exp_data))

