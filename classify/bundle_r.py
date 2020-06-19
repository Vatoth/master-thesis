
from rpy2.robjects.packages import importr, data
from rpy2 import robjects
import numpy as np
from pprint import pprint
changepoint = importr('changepoint')
stats = importr('stats')


def get_changepoints(values):
    rvalues = robjects.FloatVector(values)
    rpen_value = float(15.0 * np.log(len(values)))
    r = changepoint.cpt_meanvar(
        rvalues,
        method='PELT',
        penalty='Manual',
        pen_value=float(15.0 * np.log(values.shape[0])))
    return np.asarray(r.slots['cpts'])
