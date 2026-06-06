import argparse
import json
from pathlib import Path


def lane_score(lane):
    score = (
        lane["standingAccounts"] * 0.55
        + lane["staleSafes"] * 4.5
        + lane["unmanagedSessions"] * 2.2
        + lane["rotationSlaBreaches"] * 3.8
        + lane["breakGlassAccounts"] * 5.5
        + max(0, lane["lastReviewedDays"] - 21) * 0.65
    )
    return max(0, min(100, round(score)))


def severity(score):
    if score >= 80:
        return "critical"
    if score >= 65:
        return "high"
    if score >= 45:
        return "moderate"
    return "low"


def build_pack(path):
    data = json.loads(Path(path).read_text(encoding="utf-8"))
    lanes = []
    for lane in data["lanes"]:
        scored = dict(lane)
        scored["driftScore"] = lane_score(lane)
        scored["severity"] = severity(scored["driftScore"])
        lanes.append(scored)
    lanes.sort(key=lambda item: item["driftScore"], reverse=True)
    estate_score = round(sum(item["driftScore"] for item in lanes) / len(lanes))
    return {"portfolio": data["portfolio"], "estateScore": estate_score, "lanes": lanes}


def render_markdown(pack):
    lines = [
        f"# {pack['portfolio']}",
        "",
        f"Estate score: **{pack['estateScore']}**",
        "",
        "| Lane | Severity | Drift score | Owner |",
        "| --- | --- | ---: | --- |",
    ]
    for lane in pack["lanes"]:
        lines.append(f"| {lane['name']} | {lane['severity']} | {lane['driftScore']} | {lane['owner']} |")
    return "\n".join(lines) + "\n"


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("fixture")
    parser.add_argument("--format", choices=["json", "markdown"], default="json")
    args = parser.parse_args()
    pack = build_pack(args.fixture)
    if args.format == "markdown":
        print(render_markdown(pack))
    else:
        print(json.dumps(pack, indent=2))


if __name__ == "__main__":
    main()

