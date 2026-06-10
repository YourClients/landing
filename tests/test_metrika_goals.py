from pathlib import Path
import unittest


ROOT = Path(__file__).resolve().parents[1]


class MetrikaGoalTests(unittest.TestCase):
    def test_main_script_uses_cache_busting_version(self):
        html = (ROOT / "index.html").read_text(encoding="utf-8")

        self.assertIn('src="js/main.js?v=', html)

    def test_metrika_goal_handlers_are_declared(self):
        script = (ROOT / "js" / "main.js").read_text(encoding="utf-8")

        self.assertIn("cta_to_form", script)
        self.assertIn("telegram_click", script)
        self.assertIn("lead_form_submit", script)
        self.assertIn("'call'", script)


if __name__ == "__main__":
    unittest.main()
