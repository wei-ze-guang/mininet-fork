"""Helpers for replay annotation payloads."""


def empty_annotations():
    """Return the base annotation map for one run."""
    return {
        "nodes": {},
        "interfaces": {},
        "links": {},
        "flows": {},
    }
