
import numpy as np

# From Virtual Machine Warmup Blows Hot and Cold

DELTA = 1  # Absolute time delta (in seconds) below which segments are
# considered equivalent.
STEADY_STATE_LEN = 500  # How many in-process iterations from the end of the time-series
# data will a non-equivalent segment trigger "no steady state"?


def percentage(percent, whole):
    return int((percent * whole) / 100.0)


def classify(segs, n_values):
    assert(len(segs) > 0)
    last_seg = segs[-1]
    STEADY_STATE_LEN = percentage(25, n_values)
    lower_bound = last_seg['mean'] - max(last_seg['variance'], DELTA)
    upper_bound = last_seg['mean'] + max(last_seg['variance'], DELTA)
    label = "flat"
    i = len(segs) - 2
    while i > - 1:
        seg = segs[i]
        i -= 1
        if seg['mean'] + seg['variance'] >= lower_bound and seg['mean'] - seg['variance'] <= upper_bound:
            continue
        elif seg['end'] > n_values - STEADY_STATE_LEN:
            label = "no steady state"
            break
        elif seg['mean'] < lower_bound:
            label = "slowdown"
            break
        assert(seg['mean'] > upper_bound)
        label = "warmup"
    return label