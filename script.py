from urllib.parse import urljoin
import ruptures as rpt
import requests
import matplotlib
import matplotlib.pyplot as plt
import numpy as np
import os


class RelativeSession(requests.Session):
    def __init__(self, base_url):
        super(RelativeSession, self).__init__()
        self.__base_url = base_url

    def request(self, method, url, **kwargs):
        url = urljoin(self.__base_url, url)
        return super(RelativeSession, self).request(method, url, **kwargs)


session = RelativeSession("http://localhost:3000")


def percentage(percent, whole):
    return (percent * whole) / 100.0


# https://www.gakhov.com/articles/find-outliers-in-an-array.html

def is_outlier(value, p25, p75):
    """Check if value is an outlier
    """
    lower = p25 - 1.5 * (p75 - p25)
    upper = p75 + 1.5 * (p75 - p25)
    return value <= lower or value >= upper


def get_indices_of_outliers(values):
    """Get outlier indices (if any)
    """
    p25 = np.percentile(values, 25)
    p75 = np.percentile(values, 75)

    indices_of_outliers = []
    for ind, value in enumerate(values):
        if is_outlier(value, p25, p75):
            indices_of_outliers.append(ind)
    return indices_of_outliers


benchmarks = session.get("/benchmarks").json()

fig = plt.figure(figsize=(10, 6))
for benchmark in benchmarks:

    runs = session.get("/benchmarks/{0}/runs".format(benchmark['id'])).json()
    for run in runs:
        executor = session.get("/executors/{0}".format(run['execid'])).json()
        measurements = session.get(
            "/runs/{0}/measurements".format(run['id'])).json()
        measurements_values = np.array(
            list(map(lambda x: x['value'], measurements)))
        measurements_values = np.asarray(measurements_values, dtype=np.float32)
        if len(measurements_values) == 0:
            continue
        criterion = session.get(    
            "/criterions/{0}".format(measurements[0]['criterion'])).json()

        if not os.path.exists('benchmarks/' + benchmark['name'] + '/changepoint'):
            os.makedirs('benchmarks/' + benchmark['name'] + '/changepoint')
        if not os.path.exists('benchmarks/' + benchmark['name'] + '/simple'):
            os.makedirs('benchmarks/' + benchmark['name'] + '/simple')
        if not os.path.exists('benchmarks/' + benchmark['name'] + '/means_diff'):
            os.makedirs('benchmarks/' + benchmark['name'] + '/means_diff')
        if not os.path.exists('benchmarks/' + benchmark['name'] + '/outliers'):
            os.makedirs('benchmarks/' + benchmark['name'] + '/outliers')
        if not os.path.exists('benchmarks/' + benchmark['name'] + '/banpei'):
            os.makedirs('benchmarks/' + benchmark['name'] + '/banpei')
        if not os.path.exists(
                'benchmarks/' +
                benchmark['name'] +
                '/banpei/' +
                executor['name'] +
                '.png'):
            ax = plt.gca()
            ax.plot(measurements_values)
            ax.set(
                xlabel='iterations',
                ylabel='{0} ({1})'.format(
                    criterion['name'],
                    criterion['unit']),
                title='Benchmark: {0}'.format(
                    benchmark['name']))
            ax.grid()
            plt.savefig(
                'benchmarks/' +
                benchmark['name'] +
                '/simple/' +
                executor['name'] +
                '.png')
            plt.cla()

            min_size = int(percentage(1, len(measurements_values)))
            if min_size == 1:
                min_size += 1
            print("min_size={0}".format(min_size))
            print(len(measurements_values))
            breakpoints = rpt.Pelt(
                model="l2").fit_predict(
                measurements_values,
                1)
            _, (ax,) = rpt.display(
                measurements_values, breakpoints, figsize=(10, 6))
            ax.set(
                xlabel='iterations',
                ylabel='{0}.{1}'.format(
                    criterion['name'],
                    criterion['unit']),
                title='Changepoints of Benchmark: {0} Executor {1}'.format(
                    benchmark['name'],
                    executor['name']))

            plt.savefig(
                'benchmarks/' +
                benchmark['name'] +
                '/changepoint/' +
                executor['name'] +
                '.png')
            plt.cla()
            means = []
            measurements_values_matrix = np.split(
                measurements_values, breakpoints)
            print(len(measurements_values_matrix))
            for measurements_values_split in measurements_values_matrix:
                if measurements_values_split.size > 0:
                    mean = np.mean(measurements_values_split)
                    means.append(mean)
            means = np.array(means)
            threshold = np.mean(means)
            min_threshold = threshold - percentage(10, threshold)
            max_threshold = threshold + percentage(10, threshold)

            x = range(len(means))

            clrs = [
                'green'
                if(x < max_threshold) and (x > min_threshold) else 'red'
                for x in means]

            ax.bar(x, means, color=clrs)

            ax.set(
                xlabel='Chunks',
                ylabel='{0} ({1})'.format(
                    criterion['name'],
                    criterion['unit']),
                title='Means between each breakpoints \nBenchmark: {0} Executor {1}'.format(
                    benchmark['name'],
                    executor['name']))

            ax.plot([0., len(means)], [max_threshold, max_threshold], "k--")
            ax.plot([0., len(means)], [min_threshold, min_threshold], "k--")
            plt.savefig(
                'benchmarks/' +
                benchmark['name'] +
                '/means_diff/' +
                executor['name'] +
                '.png')
            plt.cla()

            indices_of_outliers = get_indices_of_outliers(measurements_values)

            fig = plt.figure()
            ax = fig.add_subplot(111)
            ax.plot(measurements_values, 'b-', label='distances')
            ax.plot(
                indices_of_outliers,
                measurements_values[indices_of_outliers],
                'ro',
                markersize=7,
                label='outliers')
            ax.legend(loc='best')

            plt.savefig(
                'benchmarks/' +
                benchmark['name'] +
                '/outliers/' +
                executor['name'] +
                '.png')
            plt.cla()

            from fastsst import SingularSpectrumTransformation
            print(measurements_values, min_size)
            if min_size == 0:
                min_size = 1
            score = SingularSpectrumTransformation(
                win_length=min_size, n_components=1, use_lanczos=False).score_offline(measurements_values)
            f, ax = plt.subplots(2, 1, figsize=(20, 10))
            ax[0].plot(measurements_values)
            ax[0].set_title("raw data")
            ax[1].plot(score, "r")
            ax[1].set_title("score")
            plt.savefig(
                'benchmarks/' +
                benchmark['name'] +
                '/banpei/' +
                executor['name'] +
                '.png')
            plt.cla()
            #exit()
