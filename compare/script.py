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

first_source = sources[1]
second_source = sources[4]
sources = [first_source, second_source]

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
for i, source in enumerate(sources):
    trials = session.get("/sources/{0}/trials".format(source['id'])).json()
    trial = trials[0]
    for trial in trials:
        measurements = session.get(
            "/trials/{0}/measurements".format(trial['id'])).json()
        run = session.get("/runs/{0}".format(measurements[0]['runid'])).json()
        executor = session.get("/executors/{0}".format(run['execid'])).json()
        benchmark = session.get(
            "/benchmarks/{0}".format(run['benchmarkid'])).json()
        values = np.array(
            list(map(lambda x: x['value'], measurements)))
        values = pd.Series(values)
        outliers = get_outliers(values, 200)
        values = values.drop(index=outliers)
        values = values.to_numpy()
        path = Path(
            'benchmarks/')
        path.mkdir(parents=True, exist_ok=True)
        filename = "benchmarks/plot_{0}_{1}_{2}.png".format(benchmark['name'], executor['name'], i)
        ax = fig.add_subplot()
        ax.plot(values, 'b-', label='measurements')
        print(filename)
        fig.savefig(filename, dpi=300)
        values_list.append(values)
        plt.clf()
        break

exp_data = values_list[0]
num_data = values_list[1]

if len(exp_data) < len(num_data):
    num_data = num_data[:len(exp_data)]


if len(num_data) < len(exp_data):
    exp_data = exp_data[:len(num_data)]

print(len(exp_data), len(num_data))
dtw, d = similaritymeasures.dtw(exp_data, num_data)

print(dtw)