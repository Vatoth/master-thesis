import argparse
from pathlib import Path
from urllib.parse import urljoin

import requests
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from scipy.spatial.distance import directed_hausdorff


class RelativeSession(requests.Session):
    def __init__(self, base_url):
        super(RelativeSession, self).__init__()
        self.__base_url = base_url

    def request(self, method, url, **kwargs):
        url = urljoin(self.__base_url, url)
        return super(RelativeSession, self).request(method, url, **kwargs)


def get_measurements_from_source(commitid):

    source = session.get(
        "/sources?commitid={0}".format(commitid)).json()[0]

    trials = session.get(
        "/sources/{0}/trials".format(source['id'])).json()

    measurements_data = []

    for trial in trials:
        measurements = session.get(
            "/trials/{0}/measurements".format(trial['id'])).json()

        run = session.get("/runs/{0}".format(measurements[0]['runid'])).json()
        executor = session.get("/executors/{0}".format(run['execid'])).json()
        benchmark = session.get(
            "/benchmarks/{0}".format(run['benchmarkid'])).json()

        measurements_data.append(
            {'name': benchmark['name'],
             'executor': executor['name'],
             'measurements': measurements})
    return measurements_data


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


def clean_ouliers(measurements_data):
    for measurements in measurements_data:
        values = np.array(
            list(map(lambda x: x['value'], measurements['measurements'])))
        values = pd.Series(values)
        outliers = get_outliers(values, 200)
        values = values.drop(index=outliers)
        measurements['measurements'] = values.to_numpy()


def compare(
        first_measurements_data,
        last_measurements_data,
        benchmark_name="Unknow"):
    if len(first_measurements_data) < len(last_measurements_data):
        last_measurements_data = last_measurements_data[:len(
            first_measurements_data)]

    if len(last_measurements_data) < len(first_measurements_data):
        first_measurements_data = first_measurements_data[:len(
            last_measurements_data)]

    first_measurements_data = first_measurements_data.reshape(-1, 1)
    last_measurements_data = last_measurements_data.reshape(-1, 1)
    value_directed = min(
        directed_hausdorff(
            first_measurements_data,
            last_measurements_data)[0],
        directed_hausdorff(
            last_measurements_data,
            first_measurements_data)[0])

    path = Path('plot_from_compare/')
    path.mkdir(parents=True, exist_ok=True)
    ax = fig.add_subplot()
    ax.plot(first_measurements_data, label='1st measurements')
    ax.plot(last_measurements_data, label='2nd measurements')
    ax.set_title('Comparaison between two commit of {} algorithm'.format(benchmark_name))
    ax.set_xlabel('Iterations')
    ax.set_ylabel('Time (ms)')
    ax.legend()
    filename = "plot_from_compare/plot_{0}_{1}.png".format(
        benchmark_name, value_directed)

    fig.savefig(filename, dpi=300)
    plt.clf()
    return value_directed


session = RelativeSession("http://localhost:3000")

parser = argparse.ArgumentParser()
parser.add_argument(
    "first_commit",
    help="First commit to compare with the last",
    type=str)
parser.add_argument(
    "last_commit",
    help="Last commit to compare with the first",
    type=str)
args = parser.parse_args()

first_measurements_data = get_measurements_from_source(args.first_commit)
last_measurements_data = get_measurements_from_source(args.last_commit)

clean_ouliers(first_measurements_data)
clean_ouliers(last_measurements_data)


fig = plt.figure(figsize=(10, 6))

for i, first_data in enumerate(first_measurements_data):
    if i > len(last_measurements_data):
        break
    last_data = last_measurements_data[i]
    value = compare(
        first_data['measurements'],
        last_data['measurements'],
        last_data['name'])

    if value < 30:
        print("Benchmark {0} between the two commit are the same do not need further analysis", first_data['name'])
    else:
        print("Benchmark {0} between the two commit are different need further analysis", first_data['name'])
