from math import log
from ruptures.base import BaseCost
import json
from pathlib import Path
import math
import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
import ruptures as rpt

from classify import classify
from bundle_r import get_changepoints

with open('./data_wallclock_times.json') as f:
    data = json.load(f)


def rolling_window(a, window):
    shape = a.shape[:-1] + (a.shape[-1] - window + 1, window)
    strides = a.strides + (a.strides[-1],)
    return np.lib.stride_tricks.as_strided(a, shape=shape, strides=strides)


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


def test(values):
    windows = []
    values.rolling(200).apply(
        lambda x: windows.append(
            x.values) or 0, raw=False)
    windows = windows[200:]
    outliers = np.array([])
    for i, window in enumerate(windows):
        indices_of_outliers = np.array(get_indices_of_outliers(window))
        indices_of_outliers = indices_of_outliers + (200 + (i))
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


fig = plt.figure(figsize=(40,10))


def analysis(filename, values):
    values = pd.Series(values)
    outliers = test(values)
    ax = fig.add_subplot()
    values = values.drop(index=outliers)
    values = values.to_numpy()
    ax.plot(values, 'b-', label='measurements')
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


for key in data.keys():
    #key = "binarytrees:HHVM:default-php"
    path = Path('/'.join(key.split(':')))
    path.mkdir(parents=True, exist_ok=True)
    for i, benchmarks_values in enumerate(data[key]):
        filename = '{0}/plot_{1}'.format('/'.join(key.split(':')), i + 1)
        analysis(filename, benchmarks_values)
    #exit(0)
