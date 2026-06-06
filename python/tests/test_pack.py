import unittest
from pathlib import Path
import sys

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from cyberark_privilege_drift.pack import build_pack, render_markdown


class PackTest(unittest.TestCase):
    def test_build_pack_scores_lanes(self):
        pack = build_pack("fixtures/cyberark-privilege-sample.json")
        self.assertEqual(pack["lanes"][0]["name"], "Domain admin safes")
        self.assertGreater(pack["estateScore"], 50)

    def test_render_markdown(self):
        pack = build_pack("fixtures/cyberark-privilege-sample.json")
        markdown = render_markdown(pack)
        self.assertIn("CyberArk privilege drift review", markdown)
        self.assertIn("Drift score", markdown)


if __name__ == "__main__":
    unittest.main()
