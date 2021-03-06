from math import log
import json
from pathlib import Path
import requests
from ruptures.base import BaseCost
from urllib.parse import urljoin
import math
import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
import ruptures as rpt

from classify import classify
from bundle_r import get_changepoints


class RelativeSession(requests.Session):
    def __init__(self, base_url):
        super(RelativeSession, self).__init__()
        self.__base_url = base_url

    def request(self, method, url, **kwargs):
        url = urljoin(self.__base_url, url)
        return super(RelativeSession, self).request(method, url, **kwargs)


session = RelativeSession("http://localhost:3000")


def percentage(percent, whole):
    return int((percent * whole) / 100.0)


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

def outliers(tmp):
    """tmp is a list of numbers"""
    outs = []
    mean = sum(tmp)/(1.0*len(tmp))
    var = sum((tmp[i] - mean)**2 for i in range(0, len(tmp)))/(1.0*len(tmp))
    std = var**0.5
    outs = [tmp[i] for i in range(0, len(tmp)) if abs(tmp[i]-mean) > 1.96*std]
    return outs





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


def grouped(iterable, n=2):
    return zip(*[iter(iterable)] * n)


def get_breakpoints_value(values, changepoints):
    x_list = []
    y_list = []
    segments = []
    for i, changepoint in enumerate(changepoints):
        x = changepoint
        if i + 1 < len(changepoints):
            y = changepoints[i + 1]
        else:
            break
        chunck = values[x:y]
        x_list.append(x)
        x_list.append(y)
        value = chunck.mean()
        y_list.append(value)
        y_list.append(value)
        segment = {}
        segment['mean'] = chunck.mean()
        segment['variance'] = chunck.var()
        segment['start'] = x
        segment['end'] = y
        segments.append(segment)
    return x_list, y_list, segments


fig = plt.figure(figsize=(40, 10))


def analysis(filename, values):
    values = pd.Series(values)
    outliers = outliers(values, 200)
    ax = fig.add_subplot()

    ax.plot(
        outliers,
        values[outliers],
        'ro',
        markersize=7,
        label='outliers')
    ax.plot(values, 'b-', label='measurements')
    values = values.drop(index=outliers)
    values = values.to_numpy()
    breakpoints = get_changepoints(values)
    breakpoints = np.insert(breakpoints, 0, 0)
    x, y, segments = get_breakpoints_value(values, breakpoints)
    ax.plot(
        x,
        y,
        'r-',
        label='changepoint')
    ax.legend(loc='best')
    label = ""
    label = classify(segments, len(values))

    fig.savefig(
        '{0}_{1}.png'.format(filename, label), dpi=300)

    plt.clf()


benchmarks = session.get("/benchmarks").json()

fig = plt.figure(figsize=(10, 6))
for benchmark in benchmarks:
    runs = session.get("/benchmarks/{0}/runs".format(benchmark['id'])).json()
    for i, run in enumerate(runs):
        executor = session.get("/executors/{0}".format(run['execid'])).json()
        path = Path(
            'benchmarks/{0}/{1}'.format(benchmark['name'],
                                        executor['name']))
        path.mkdir(parents=True, exist_ok=True)
        measurements = session.get(
            "/runs/{0}/measurements".format(run['id'])).json()
        measurements_values = np.array(
            list(map(lambda x: x['value'], measurements)))
        if len(measurements_values) > 200:
            filename = 'benchmarks/{0}/{1}/plot_{2}'.format(
                benchmark['name'], executor['name'], i)
            try:
                analysis(filename, measurements_values)
            except Exception as E:
                pass
