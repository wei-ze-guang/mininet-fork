"""Filesystem writer for replay run artifacts."""

import json
from pathlib import Path


class RunStore:
    """Write collector output into one run directory."""

    def __init__(self, root):
        self.root = Path(root)
        self.root.mkdir(parents=True, exist_ok=True)

    def write_json(self, name, payload):
        path = self.root / name
        path.write_text(
            json.dumps(payload, indent=2, sort_keys=True) + "\n",
            encoding="utf-8",
        )
        return path

    def append_ndjson(self, name, payload):
        path = self.root / name
        with path.open("a", encoding="utf-8") as handle:
            handle.write(json.dumps(payload, sort_keys=True) + "\n")
        return path

    def write_meta(self, meta):
        return self.write_json("meta.json", meta.to_dict())

    def write_topology(self, payload):
        return self.write_json("topology.json", payload)

    def write_annotations(self, payload):
        return self.write_json("annotations.json", payload)

    def append_snapshot(self, record):
        return self.append_ndjson("snapshots.ndjson", record.to_dict())

    def append_event(self, record):
        return self.append_ndjson("events.ndjson", record.to_dict())

    def append_trace(self, record):
        return self.append_ndjson("traces.ndjson", record.to_dict())

    def append_replay_frame(self, record):
        return self.append_ndjson("replay_frames.ndjson", record.to_dict())

    def write_session(self, payload):
        return self.write_json("session.json", payload)

    def write_timeline(self, payload):
        return self.write_json("timeline.json", payload)

    def write_snapshot_index(self, payload):
        return self.write_json("snapshot_index.json", payload)
