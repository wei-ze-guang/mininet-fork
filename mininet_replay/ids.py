"""Stable ID helpers for replay collector objects."""

from datetime import datetime
from itertools import count


_run_counter = count(1)


def new_run_id(now=None):
    """Return a stable run identifier for one collector execution."""
    now = now or datetime.utcnow()
    return f"run_{now:%Y%m%d_%H%M%S}_{next(_run_counter):03d}"


def node_id(run_id, mn_name):
    """Return a stable node identifier scoped to one run."""
    return f"{run_id}:{mn_name}"


def intf_id(run_id, node_name, intf_name):
    """Return a stable interface identifier scoped to one run."""
    return f"{run_id}:{node_name}:{intf_name}"


def link_id(run_id, intf_a, intf_b):
    """Return a stable link identifier scoped to one run."""
    return f"{run_id}:link:{intf_a}__{intf_b}"
