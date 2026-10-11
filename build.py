#!/usr/bin/env python3
"""Inline web/ + data/stories.json into one offline file: dist/family-story-vault.html."""
import json
import os

HERE = os.path.dirname(os.path.abspath(__file__))


def rd(rel):
    with open(os.path.join(HERE, rel), encoding="utf-8") as f:
        return f.read()


def main():
    stories_path = os.path.join(HERE, "data", "stories.json")
    with open(stories_path, encoding="utf-8") as f:
        stories = json.load(f)
    stories_js = json.dumps(stories, ensure_ascii=False)
    n = len(stories.get("stories", []))
    html = rd("web/index.html")
    html = html.replace("/*__CSS__*/", rd("web/app.css"))
    html = html.replace("/*__STORIES__*/ null /*__/STORIES__*/", stories_js)
    app = rd("web/app.js").replace("</script", "<\\/script")
    html = html.replace("/*__APP__*/", app)
    os.makedirs(os.path.join(HERE, "dist"), exist_ok=True)
    out = os.path.join(HERE, "dist", "family-story-vault.html")
    with open(out, "w", encoding="utf-8") as f:
        f.write(html)
    print(f"built {out} ({os.path.getsize(out):,} bytes) · stories={n}")


if __name__ == "__main__":
    main()
